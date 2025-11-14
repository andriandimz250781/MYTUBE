import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- Tipe Data Baru (sesuai dengan YouTube API) ---
export type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string; // Akan kita coba dapatkan nanti jika memungkinkan
  channelName: string;
  channelId: string;
  channelAvatarUrl?: string; // Tidak selalu tersedia di semua panggilan API
  views: string;
  uploadedAt: string;
  description: string;
};

export type Channel = {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscribers: string;
  description: string;
};

// --- Konstanta API ---
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// --- Fungsi Helper untuk YouTube API ---

async function fetchFromYouTubeAPI(endpoint: string, params: Record<string, string>) {
  if (!API_KEY || API_KEY === 'GANTI_DENGAN_KUNCI_API_YOUTUBE_ANDA') {
    console.warn("Kunci API YouTube belum diatur di file .env.local. Menampilkan data kosong.");
    return null;
  }

  const urlParams = new URLSearchParams({
    key: API_KEY,
    ...params,
  });

  const url = `${YOUTUBE_API_URL}/${endpoint}?${urlParams}`;

  try {
    const response = await fetch(url, { cache: 'no-store' }); // Nonaktifkan cache untuk development
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData.error.message);
      throw new Error(`YouTube API request failed: ${errorData.error.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from YouTube API:', error);
    return null;
  }
}

function formatViews(viewCount: string): string {
    const num = parseInt(viewCount, 10);
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}


// --- Fungsi Pengambilan Data Baru ---

/**
 * Mengambil video trending dari YouTube.
 */
export async function getTrendingVideos(): Promise<Video[]> {
  const data = await fetchFromYouTubeAPI('videos', {
    part: 'snippet,statistics,contentDetails',
    chart: 'mostPopular',
    regionCode: 'ID',
    maxResults: '20',
  });

  if (!data?.items) return [];

  return data.items.map((item: any): Video => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    duration: formatDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    views: formatViews(item.statistics.viewCount),
    uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
    description: item.snippet.description,
  }));
}

/**
 * Mencari video di YouTube berdasarkan query.
 */
export async function searchVideos(query: string): Promise<Video[]> {
  if (!query) return getTrendingVideos();

  const searchData = await fetchFromYouTubeAPI('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '20',
  });

  if (!searchData?.items) return [];

  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

  const videoDetailsData = await fetchFromYouTubeAPI('videos', {
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
  });

  if (!videoDetailsData?.items) return [];

  return videoDetailsData.items.map((item: any): Video => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    duration: formatDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    views: formatViews(item.statistics.viewCount),
    uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
    description: item.snippet.description,
  }));
}

/**
 * Mengambil detail satu video dari YouTube.
 */
export async function getVideo(id: string | undefined): Promise<Video | null> {
    if (!id) return null;
    
    const data = await fetchFromYouTubeAPI('videos', {
        part: 'snippet,statistics,contentDetails',
        id: id,
    });

    if (!data?.items || data.items.length === 0) return null;

    const item = data.items[0];

    return {
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: formatDuration(item.contentDetails.duration),
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        views: formatViews(item.statistics.viewCount),
        uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        description: item.snippet.description,
    };
}


/**
 * Mengambil detail channel dari YouTube.
 */
export async function getChannel(id: string | undefined): Promise<Channel | null> {
    if (!id) return null;

    const data = await fetchFromYouTubeAPI('channels', {
        part: 'snippet,statistics,brandingSettings',
        id: id,
    });

    if (!data?.items || data.items.length === 0) return null;
    
    const item = data.items[0];

    return {
        id: item.id,
        name: item.snippet.title,
        avatarUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        bannerUrl: item.brandingSettings.image?.bannerExternalUrl,
        subscribers: formatViews(item.statistics.subscriberCount),
        description: item.snippet.description,
    };
}


// Fungsi getImage tidak lagi relevan karena URL gambar didapat langsung dari API.
// Namun, kita akan tetap menyimpannya untuk komponen yang mungkin masih menggunakannya sementara.
export const getImage = (id: string | undefined) =>
  PlaceHolderImages.find(img => img.id === id);
