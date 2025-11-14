// @ts-nocheck
'use server';

import { format, formatDistanceToNow } from 'date-fns';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  channelId: string;
  channelName: string;
  channelAvatarUrl: string;
  views: string;
  uploadedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  subscribers: string;
}

export interface Image {
  id: string;
  alt: string;
  imageUrl: string;
}

let currentApiKeyIndex = 0;

function formatDuration(isoDuration: string) {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  let formatted = '';
  if (hours > 0) {
    formatted += `${hours}:`;
    formatted += `${minutes.toString().padStart(2, '0')}:`;
  } else {
    formatted += `${minutes}:`;
  }
  formatted += seconds.toString().padStart(2, '0');

  return formatted;
}

function formatViews(viewCount: string) {
  const count = Number(viewCount);
  if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

async function fetchFromYouTubeAPI(endpoint: string, params: Record<string, string>) {
  const API_KEYS = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_1,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_3,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_4,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_5,
  ].filter(Boolean) as string[];

    if (API_KEYS.length === 0) {
        console.error("Tidak ada kunci API YouTube yang tersedia. Harap periksa file .env Anda.");
        return null;
    }

    for (let i = 0; i < API_KEYS.length; i++) {
        const apiKey = API_KEYS[currentApiKeyIndex];
        if (!apiKey) {
            currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
            continue;
        }

        const queryString = new URLSearchParams({ ...params, key: apiKey }).toString();
        const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryString}`;

        try {
            const response = await fetch(url, { next: { revalidate: 3600 } });
            if (response.status === 403) {
                console.warn(`Kunci API ${currentApiKeyIndex + 1} gagal (kuota terlampaui?), mencoba kunci berikutnya...`);
                currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
                continue;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`YouTube API error: ${errorData.error.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from YouTube with key ${currentApiKeyIndex + 1}:`, error);
            currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        }
    }
    
    console.error("Semua kunci API YouTube telah gagal. Periksa status, kuota, dan validitas kunci di Google Cloud Console.");
    return null;
}

async function getChannelDetails(channelIds: string[]): Promise<Map<string, any>> {
  const data = await fetchFromYouTubeAPI('channels', {
    part: 'snippet,statistics',
    id: channelIds.join(','),
  });
  const channelMap = new Map();
  if (data?.items) {
    data.items.forEach((item: any) => {
      channelMap.set(item.id, {
        channelName: item.snippet.title,
        channelAvatarUrl: item.snippet.thumbnails.default.url,
        subscribers: formatViews(item.statistics.subscriberCount),
      });
    });
  }
  return channelMap;
}

export async function getTrendingVideos(): Promise<Video[] | null> {
  const data = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode: 'ID',
    maxResults: '20',
  });

  if (!data?.items) return [];

  const channelIds = data.items.map((item: any) => item.snippet.channelId);
  const channelDetailsMap = await getChannelDetails(channelIds);

  return data.items.map((item: any): Video => {
    const channelInfo = channelDetailsMap.get(item.snippet.channelId) || {};
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      duration: formatDuration(item.contentDetails.duration),
      channelId: item.snippet.channelId,
      channelName: channelInfo.channelName || item.snippet.channelTitle,
      channelAvatarUrl: channelInfo.channelAvatarUrl || '',
      views: formatViews(item.statistics.viewCount),
      uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), { addSuffix: true }),
    };
  });
}

export async function searchVideos(query: string): Promise<Video[] | null> {
  const data = await fetchFromYouTubeAPI('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
    regionCode: 'ID'
  });

  if (!data?.items) return [];

  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  const videoDetailsData = await fetchFromYouTubeAPI('videos', {
      part: 'snippet,contentDetails,statistics',
      id: videoIds,
  });

  if (!videoDetailsData?.items) return [];

  const channelIds = videoDetailsData.items.map((item: any) => item.snippet.channelId);
  const channelDetailsMap = await getChannelDetails(channelIds);

  return videoDetailsData.items.map((item: any): Video => {
    const channelInfo = channelDetailsMap.get(item.snippet.channelId) || {};
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      duration: formatDuration(item.contentDetails.duration),
      channelId: item.snippet.channelId,
      channelName: channelInfo.channelName || item.snippet.channelTitle,
      channelAvatarUrl: channelInfo.channelAvatarUrl || '',
      views: formatViews(item.statistics.viewCount),
      uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), { addSuffix: true }),
    };
  });
}

export async function getVideo(id: string): Promise<Video | null> {
    const data = await fetchFromYouTubeAPI('videos', {
        part: 'snippet,contentDetails,statistics',
        id: id,
    });

    if (!data?.items?.[0]) return null;

    const item = data.items[0];
    const channelDetailsMap = await getChannelDetails([item.snippet.channelId]);
    const channelInfo = channelDetailsMap.get(item.snippet.channelId) || {};

    return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: formatDuration(item.contentDetails.duration),
        channelId: item.snippet.channelId,
        channelName: channelInfo.channelName || item.snippet.channelTitle,
        channelAvatarUrl: channelInfo.channelAvatarUrl || '',
        views: formatViews(item.statistics.viewCount),
        uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), { addSuffix: true }),
    };
}


export async function getChannel(id: string): Promise<Channel | null> {
    const data = await fetchFromYouTubeAPI('channels', {
        part: 'snippet,statistics,brandingSettings',
        id: id,
    });

    if (!data?.items?.[0]) return null;
    const item = data.items[0];

    return {
        id: item.id,
        name: item.snippet.title,
        description: item.snippet.description,
        avatarUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        bannerUrl: item.brandingSettings.image?.bannerExternalUrl || 'https://placehold.co/1280x320/e2e8f0/e2e8f0',
        subscribers: formatViews(item.statistics.subscriberCount),
    };
}

const staticImages = [
    {
      id: 'user-avatar-1',
      alt: 'User Avatar 1',
      imageUrl: 'https://picsum.photos/seed/user1/100/100',
    },
    {
      id: 'user-avatar-default',
      alt: 'Default User Avatar',
      imageUrl: 'https://picsum.photos/seed/user-default/128/128',
    },
  ];
  
  export async function getImage(id: string): Promise<Image | undefined> {
    return staticImages.find(img => img.id === id);
  }
