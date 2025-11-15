import { formatDistanceToNow } from 'date-fns';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  publishedAt: string;
}

let currentApiKeyIndex = 0;

// Format ISO duration → 10:32 / 1:02:09
function formatDuration(isoDuration: string): string {
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

// Format views → 1.4K / 1.2M / 5.2B
function formatViews(viewCount: string): string {
  const count = Number(viewCount);
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

// Universal YouTube API fetcher (with rotating API keys)
async function fetchFromYouTubeAPI(
  endpoint: string,
  params: Record<string, string>
) {
  const API_KEYS = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_1,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_3,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_4,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_5,
  ].filter(Boolean) as string[];

  if (API_KEYS.length === 0) {
    console.error('No YouTube API keys found in .env');
    return null;
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[currentApiKeyIndex];
    const queryString = new URLSearchParams({ ...params, key: apiKey }).toString();
    const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryString}`;

    try {
      console.log(`Trying YouTube API key index: ${currentApiKeyIndex}`);
      const response = await fetch(url, { next: { revalidate: 3600 } });

      if (response.status === 403) {
        console.warn(
          `Key index ${currentApiKeyIndex} quota exceeded. Switching key...`
        );
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `YouTube API error (key ${currentApiKeyIndex}):`,
          errorData.error?.message
        );
        throw new Error(errorData.error?.message || 'YouTube API error');
      }

      console.log(`Success using key index: ${currentApiKeyIndex}`);
      return await response.json();

    } catch (error) {
      console.error(
        `Fetch error using key ${currentApiKeyIndex}:`,
        error
      );
      currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
    }
  }

  console.error('All YouTube API keys failed.');
  return null;
}

// Get trending videos (ID Region)
export async function getTrendingVideos(): Promise<Video[] | null> {
  const data = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode: 'ID',
    maxResults: '20',
  });

  if (!data?.items) return [];

  return data.items.map(
    (item: any): Video => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.default.url,
      duration: formatDuration(item.contentDetails.duration),
      channelName: item.snippet.channelTitle,
      views: formatViews(item.statistics.viewCount),
      uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), {
        addSuffix: true,
      }),
      publishedAt: item.snippet.publishedAt,
    })
  );
}

export async function searchVideos(query: string): Promise<Video[] | null> {
  const searchData = await fetchFromYouTubeAPI('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
    regionCode: 'ID',
  });

  if (!searchData?.items) return [];

  const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',');

  const details = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds,
  });

  if (!details?.items) return [];

  return details.items.map(
    (item: any): Video => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default.url,
      duration: formatDuration(item.contentDetails.duration),
      channelName: item.snippet.channelTitle,
      views: formatViews(item.statistics.viewCount),
      uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), {
        addSuffix: true,
      }),
      publishedAt: item.snippet.publishedAt,
    })
  );
}
