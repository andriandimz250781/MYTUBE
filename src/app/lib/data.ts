
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const availableApiKeys = (process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS || '').split(',').filter(Boolean);
  
  if (availableApiKeys.length === 0 || (availableApiKeys.length === 1 && availableApiKeys[0].startsWith('GANTI_DENGAN'))) {
    console.warn("Tidak ada kunci API YouTube yang valid dikonfigurasi di .env atau .env.local (NEXT_PUBLIC_YOUTUBE_API_KEYS).");
    return null;
  }
  
  const maxRetries = availableApiKeys.length;
  for (let i = 0; i < maxRetries; i++) {
    const apiKey = availableApiKeys[currentApiKeyIndex];
    
    // Pengecekan awal untuk kunci placeholder atau tidak valid
    if (!apiKey || apiKey.startsWith('GANTI_DENGAN')) {
      console.error(`Kunci API #${currentApiKeyIndex + 1} tidak valid (placeholder). Mencoba kunci berikutnya.`);
      currentApiKeyIndex = (currentApiKeyIndex + 1) % availableApiKeys.length;
      continue;
    }
    
    const url = `${YOUTUBE_API_URL}/${endpoint}?${new URLSearchParams({ ...params, key: apiKey }).toString()}`;

    try {
      const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache selama 1 jam

      if (response.status === 400) {
         console.warn(`YouTube API Error: Kunci API #${currentApiKeyIndex + 1} tidak valid. Pastikan kunci sudah benar.`);
         // Langsung coba kunci berikutnya karena kunci ini pasti salah
         currentApiKeyIndex = (currentApiKeyIndex + 1) % availableApiKeys.length;
         continue;
      }
      
      if (response.status === 403) {
        console.warn(`Kunci API #${currentApiKeyIndex + 1} telah mencapai batas kuota. Mencoba kunci berikutnya.`);
        currentApiKeyIndex = (currentApiKeyIndex + 1) % availableApiKeys.length;
        continue;
      }

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = await response.text();
        }
        // Lempar error untuk di-catch oleh blok catch di bawah
        throw new Error(`YouTube API request failed with details: ${JSON.stringify(errorData)}`);
      }

      // Jika sukses, kembalikan data
      return await response.json();

    } catch (error) {
      console.error("Gagal mengambil data dari YouTube API:", error);
      // Jika terjadi error (selain rotasi kunci), kita hentikan percobaan untuk request ini
      // Namun, tetap rotasi kunci untuk permintaan berikutnya
      currentApiKeyIndex = (currentApiKeyIndex + 1) % availableApiKeys.length;
      return null;
    }
  }

  // Jika semua kunci gagal (baik karena kuota, tidak valid, atau error lainnya)
  console.warn("Semua kunci API YouTube telah gagal. Periksa status, kuota, dan validitas kunci di Google Cloud Console.");
  return null;
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
        relevanceLanguage: 'id',
        regionCode: 'ID'
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
  const highResThumbnail = item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url;
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: highResThumbnail,
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
    if (!isoDuration) return "0:00";
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
    if (!viewCount) return "0";
    const num = parseInt(viewCount);
    if (isNaN(num)) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}Jt`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}Rb`;
    return String(num);
}
