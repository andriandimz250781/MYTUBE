import { formatDistanceToNow } from 'date-fns';

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  channelName: string;
  views: string;
  uploadedAt: string;
}

// This variable will keep track of the current key index.
let currentApiKeyIndex = 0;

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

function formatViews(viewCount: string): string {
  const count = Number(viewCount);
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

async function fetchFromYouTubeAPI(
  endpoint: string,
  params: Record<string, string>
) {
  // IMPORTANT: We now read the keys inside the function to ensure they are available.
  const API_KEYS = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_1,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_3,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_4,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_5,
  ].filter(Boolean) as string[];

  if (API_KEYS.length === 0) {
    console.error(
      'No YouTube API keys found. Please check your .env file.'
    );
    return null;
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[currentApiKeyIndex];
    const queryString = new URLSearchParams({ ...params, key: apiKey }).toString();
    const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryString}`;

    try {
      console.log(`Trying YouTube API with key index: ${currentApiKeyIndex}`);
      const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

      if (response.status === 403) {
        console.warn(
          `API key at index ${currentApiKeyIndex} failed (quota likely exceeded). Trying next key.`
        );
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        continue; // Try the next key
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`YouTube API error with key index ${currentApiKeyIndex}:`, errorData.error.message);
        // Don't switch key on other errors, might be a different issue
        throw new Error(`YouTube API error: ${errorData.error.message}`);
      }
      
      console.log(`Successfully fetched data with key index: ${currentApiKeyIndex}`);
      return await response.json();

    } catch (error) {
      console.error(`Error fetching from YouTube with key index ${currentApiKeyIndex}:`, error);
      // Move to the next key on any fetch error
      currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
    }
  }

  console.error(
    'All YouTube API keys have failed. Please check their status, quota, and validity in the Google Cloud Console.'
  );
  return null;
}

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
      thumbnailUrl:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default.url,
      duration: formatDuration(item.contentDetails.duration),
      channelName: item.snippet.channelTitle,
      views: formatViews(item.statistics.viewCount),
      uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), {
        addSuffix: true,
      }),
    })
  );
}
