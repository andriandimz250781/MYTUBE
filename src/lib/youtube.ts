
import { formatDistanceToNow } from 'date-fns';
// import { db } from "../firebase"; // Assuming you have firebase initialized
// import { collection, doc, getDoc, getDocs, query, where, limit } from "firebase/firestore";

// --- Simple In-Memory Cache ---
const appCache = {
  store: new Map<string, any>(),
  get(key: string) {
    // console.log(`[CACHE] GET: ${key}`, this.store.has(key) ? 'HIT' : 'MISS');
    return this.store.get(key);
  },
  set(key: string, value: any) {
    // console.log(`[CACHE] SET: ${key}`);
    this.store.set(key, value);
  },
};

// --- Rate Limiter ---
let lastCall = 0;
const MIN_DELAY = 500; // 0.5s per call

async function rateLimit() {
  const now = Date.now();
  const diff = now - lastCall;
  if (diff < MIN_DELAY) {
    await new Promise((res) => setTimeout(res, MIN_DELAY - diff));
  }
  lastCall = Date.now();
}

// --- Service Worker Communication ---
export function prefetchToSW(urls: string[]) {
  if (typeof window !== 'undefined' && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "PREFETCH_VIDEO",
      urls,
    });
  }
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelName: string;
  views: string;
  uploadedAt: string;
  publishedAt: string;
  description?: string;
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

async function fetchFromYouTubeAPI(
  endpoint: string,
  params: Record<string, string>
) {
  await rateLimit(); // Apply rate limiting before every call

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
      const response = await fetch(url, { next: { revalidate: 3600 } });

      if (response.status === 403) {
        console.warn(`Key index ${currentApiKeyIndex} quota exceeded. Switching...`);
        currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
        continue;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'YouTube API error');
      }
      
      // console.log(`Success using key index: ${currentApiKeyIndex}`);
      return await response.json();

    } catch (error) {
      console.error(`Fetch error with key index ${currentApiKeyIndex}:`, error);
      currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length; // Rotate key on any error
    }
  }

  console.error('All YouTube API keys failed.');
  return null;
}

const mapYouTubeItemToVideo = (item: any): Video => ({
    id: typeof item.id === 'object' ? item.id.videoId : item.id,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails.maxres?.url ??
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.default.url,
    duration: item.contentDetails ? formatDuration(item.contentDetails.duration) : '0:00',
    channelName: item.snippet.channelTitle,
    views: item.statistics ? formatViews(item.statistics.viewCount) : '0',
    uploadedAt: formatDistanceToNow(new Date(item.snippet.publishedAt), {
      addSuffix: true,
    }),
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
});


export async function getTrendingVideos(): Promise<Video[] | null> {
  const cacheKey = 'trending-videos';
  const cacheHit = appCache.get(cacheKey);
  if (cacheHit) return cacheHit;

  const data = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode: 'ID',
    maxResults: '20',
  });

  if (!data?.items) return [];

  const videos = data.items.map(mapYouTubeItemToVideo);
  appCache.set(cacheKey, videos);
  return videos;
}

export async function searchVideos(query: string): Promise<Video[] | null> {
  const cacheKey = `search-${query}`;
  const cacheHit = appCache.get(cacheKey);
  if (cacheHit) return cacheHit;
  
  const searchData = await fetchFromYouTubeAPI('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
    regionCode: 'ID',
  });

  if (!searchData?.items) return [];

  const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',');
  if (!videoIds) return [];

  const details = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds,
  });

  if (!details?.items) return [];
  
  const videos = details.items.map(mapYouTubeItemToVideo);
  appCache.set(cacheKey, videos);
  return videos;
}


export async function getVideoById(id: string): Promise<Video | null> {
    const cacheKey = `video-${id}`;
    const cacheHit = appCache.get(cacheKey);
    if (cacheHit) return cacheHit;

    // --- Firestore Logic (commented out until configured) ---
    // try {
    //   const ref = doc(db, "videos", id);
    //   const snap = await getDoc(ref);
    //   if (snap.exists()) {
    //     const data = snap.data() as Video;
    //     appCache.set(cacheKey, data);
    //     return data;
    //   }
    // } catch (e) {
    //   console.error("Firestore fetch failed:", e);
    // }
    // ---------------------------------------------------------

    const details = await fetchFromYouTubeAPI('videos', {
        part: 'snippet,contentDetails,statistics',
        id: id,
    });

    if (!details?.items || details.items.length === 0) return null;

    const video = mapYouTubeItemToVideo(details.items[0]);
    appCache.set(cacheKey, video);
    return video;
}


export async function getRelatedVideos(videoId: string): Promise<Video[] | null> {
    const cacheKey = `related-${videoId}`;
    const cacheHit = appCache.get(cacheKey);
    if (cacheHit) return cacheHit;

    // --- Firestore Logic for keyword-based recommendations (commented out) ---
    // const videoDoc = await getVideoById(videoId);
    // const keywords = videoDoc?.description?.split(' ').slice(0, 5) || [];
    // if (keywords.length > 0) {
    //   const q = query(
    //     collection(db, "videos"),
    //     where("keywords", "array-contains-any", keywords),
    //     limit(10)
    //   );
    //   const snap = await getDocs(q);
    //   const results: Video[] = [];
    //   snap.forEach((d) => {
    //     if (d.id !== videoId) results.push({ id: d.id, ...d.data() } as Video);
    //   });
    //   if (results.length > 0) {
    //       appCache.set(cacheKey, results);
    //       return results;
    //   }
    // }
    // ----------------------------------------------------------------------
    
    const searchData = await fetchFromYouTubeAPI('search', {
        part: 'snippet',
        relatedToVideoId: videoId,
        type: 'video',
        maxResults: '20',
        regionCode: 'ID',
    });

    if (!searchData?.items) return [];

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    if (!videoIds) return [];

    const details = await fetchFromYouTubeAPI('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
    });

    if (!details?.items) return [];

    const videos = details.items.map(mapYouTubeItemToVideo);
    appCache.set(cacheKey, videos);
    return videos;
}

export async function prefetchNext(currentId: string) {
  const recommendations = await getRelatedVideos(currentId);
  if (!recommendations || recommendations.length === 0) return null;

  const next = recommendations[0];

  // Prefetch thumbnail
  prefetchToSW([next.thumbnail]);
  
  // Warm up cache for next video's data
  getVideoById(next.id).catch(() => {});

  return next;
}
