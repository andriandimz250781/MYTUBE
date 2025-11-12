import { PlaceHolderImages } from '@/lib/placeholder-images';
import { YOUTUBE_API_KEYS } from '@/config/apiKeys';

// --- Tipe Data ---
export type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string; // Akan kita kosongkan sementara
  channelName: string;
  channelId: string;
  channelAvatarId: string; // Akan kita gunakan data statis sementara
  views: string; // Akan kita kosongkan sementara
  uploadedAt: string;
  description: string;
  tags: string[];
  videoUrl: string;
};

export type Channel = {
  id: string;
  name: string;
  avatarId: string;
  bannerId?: string;
  subscribers: string;
  description: string;
};

export type VideoResponse = {
  videos: Video[];
  nextPageToken: string | null;
}

// --- Variabel & Konfigurasi API ---
let currentApiKeyIndex = 0;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// --- Data Statis (untuk fallback & data channel) ---
const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.';

export const channels: Channel[] = [
    {
    id: 'techflow',
    name: 'TechFlow',
    avatarId: 'channel-avatar-1',
    bannerId: 'channel-banner-1',
    subscribers: '2.3M',
    description: 'Your daily dose of tech news, reviews, and tutorials.',
  },
  {
    id: 'wanderlust',
    name: 'Wanderlust',
    avatarId: 'channel-avatar-2',
    subscribers: '1.1M',
    description: 'Traveling the world and sharing the adventure with you.',
  },
  {
    id: 'kitchencraft',
    name: 'KitchenCraft',
    avatarId: 'channel-avatar-3',
    subscribers: '4.8M',
    description: 'Simple recipes for delicious home-cooked meals.',
  },
];


// --- Fungsi Helper ---

export const getImage = (id: string | undefined) =>
  PlaceHolderImages.find(img => img.id === id);

export const getVideo = (id: string | undefined) =>
  fetchVideoDetails(id);

export const getChannel = (id: string | undefined) =>
  channels.find(ch => ch.id === id);


// --- Fungsi Pengambilan Data dari YouTube API ---

/**
 * Mengambil data dari YouTube API dengan rotasi kunci otomatis.
 */
async function fetchFromYouTubeAPI(endpoint: string, params: Record<string, string>) {
  let apiKey = YOUTUBE_API_KEYS[currentApiKeyIndex];
  const query = new URLSearchParams({ ...params, key: apiKey }).toString();
  let url = `${YOUTUBE_API_URL}/${endpoint}?${query}`;

  try {
    let response = await fetch(url, { next: { revalidate: 3600 } }); // Cache selama 1 jam

    // Jika kuota habis (403), coba kunci berikutnya
    if (response.status === 403 && currentApiKeyIndex < YOUTUBE_API_KEYS.length - 1) {
      console.warn(`API key ${currentApiKeyIndex + 1} limit reached. Trying next key.`);
      currentApiKeyIndex++;
      apiKey = YOUTUBE_API_KEYS[currentApiKeyIndex];
      const newQuery = new URLSearchParams({ ...params, key: apiKey }).toString();
      url = `${YOUTUBE_API_URL}/${endpoint}?${newQuery}`;
      response = await fetch(url, { next: { revalidate: 3600 } });
    }

    if (!response.ok) {
      let errorData = `Status: ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        errorData = JSON.stringify(errorJson);
      } catch (e) {
        // Abaikan jika body bukan JSON, gunakan statusText saja.
        errorData = await response.text();
      }
      console.error('YouTube API Error:', errorData);
      throw new Error(`YouTube API request failed with details: ${errorData}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Failed to fetch from YouTube API:", error);
    return null; // Mengembalikan null jika ada error
  }
}

async function fetchVideoDetailsByIds(videoIds: string[]): Promise<Video[]> {
  if (videoIds.length === 0) return [];
  const data = await fetchFromYouTubeAPI('videos', {
      part: 'snippet,contentDetails,statistics',
      id: videoIds.join(','),
  });

  if (!data || !data.items) return [];

  return data.items.map((item: any): Video => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      duration: formatDuration(item.contentDetails.duration),
      channelName: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      channelAvatarId: 'channel-avatar-1', // Placeholder
      views: formatViews(item.statistics.viewCount),
      uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: item.snippet.description || LOREM_IPSUM,
      tags: item.snippet.tags || [],
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
  }));
}

/**
 * Mencari video berdasarkan query.
 */
export async function searchVideosByQuery(query: string, duration?: 'long' | 'any', pageToken?: string): Promise<VideoResponse> {
    const searchParams: Record<string, string> = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: '20',
    };

    if (duration && duration !== 'any') {
      searchParams.videoDuration = duration;
    }

    if (pageToken) {
      searchParams.pageToken = pageToken;
    }

    const searchData = await fetchFromYouTubeAPI('search', searchParams);

    if (!searchData || !searchData.items) return { videos: [], nextPageToken: null };

    const videoIds = searchData.items.map((item: any) => item.id.videoId).filter(Boolean);
    const videos = await fetchVideoDetailsByIds(videoIds);
    return {
      videos,
      nextPageToken: searchData.nextPageToken || null
    }
}


/**
 * Mengambil daftar video trending dari YouTube.
 */
export async function getTrendingVideos(pageToken?: string): Promise<VideoResponse> {
    const params: Record<string, string> = {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'ID',
        maxResults: '20',
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const data = await fetchFromYouTubeAPI('videos', params);

    if (!data || !data.items) {
        return { videos: [], nextPageToken: null };
    }
    
    const videos = data.items.map((item: any): Video => ({
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        duration: formatDuration(item.contentDetails.duration),
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        channelAvatarId: 'channel-avatar-1', // Placeholder
        views: formatViews(item.statistics.viewCount),
        uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        description: item.snippet.description || LOREM_IPSUM,
        tags: item.snippet.tags || [],
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    }));

    return {
      videos,
      nextPageToken: data.nextPageToken || null,
    };
}

/**
 * Mengambil detail satu video dari YouTube.
 */
async function fetchVideoDetails(videoId: string | undefined): Promise<Video | null> {
  if (!videoId) return null;

  const data = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoId,
  });

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const item = data.items[0];
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high.url,
    duration: formatDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    channelAvatarId: 'channel-avatar-1', // Placeholder
    views: formatViews(item.statistics.viewCount),
    uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    description: item.snippet.description || LOREM_IPSUM,
    tags: item.snippet.tags || [],
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
  };
}


// --- Fungsi Utilitas Tambahan ---

function formatDuration(isoDuration: string): string {
    // Format "PT12M34S"
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatViews(viewCount: string): string {
    const num = parseInt(viewCount);
    if (isNaN(num)) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}Rb`;
    return String(num);
}
