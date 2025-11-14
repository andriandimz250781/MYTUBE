import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- Tipe Data Baru (sesuai dengan YouTube API) ---
export type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  channelName: string;
  channelId: string;
  channelAvatarUrl?: string;
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
let currentApiIndex = 0;

// --- Fungsi Helper untuk YouTube API ---
async function fetchFromYouTubeAPI(endpoint: string, params: Record<string, string>) {
  const API_KEYS = [
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_1,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_2,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_3,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_4,
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_5,
  ];

  if (API_KEYS.every(key => !key)) {
    console.warn("Tidak ada kunci API YouTube yang ditemukan atau dikonfigurasi di file .env. Menampilkan data kosong.");
    return null;
  }

  // Coba setiap kunci API secara bergiliran
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[currentApiIndex];
    
    // Pindah ke kunci berikutnya untuk percobaan selanjutnya
    currentApiIndex = (currentApiIndex + 1) % API_KEYS.length;

    // Lewati jika kunci API ini kosong atau tidak terdefinisi
    if (!apiKey) {
      continue;
    }

    const urlParams = new URLSearchParams({
      ...params,
      key: apiKey,
    });
    const url = `${YOUTUBE_API_URL}/${endpoint}?${urlParams}`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      if (response.ok) {
        return data; // Jika berhasil, kembalikan data
      }

      // Jika error karena kuota atau masalah kunci lainnya, loop akan berlanjut ke kunci berikutnya.
      console.warn(`Kunci API gagal: ${data.error.message}. Mencoba kunci berikutnya...`);
      
    } catch (error) {
      console.error(`Error saat mencoba fetch dengan kunci API:`, error);
      // Loop akan berlanjut ke kunci berikutnya
    }
  }

  // Jika semua kunci gagal
  console.error("Semua kunci API YouTube telah gagal. Periksa status, kuota, dan validitas kunci di Google Cloud Console.");
  return null;
}

function formatViews(viewCount: string): string {
    if (!viewCount) return '0';
    const num = parseInt(viewCount, 10);
    if (isNaN(num)) return '0';
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
}

function formatDuration(isoDuration: string): string {
  if (!isoDuration) return "0:00";
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

function timeAgo(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
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

  // Ambil detail channel untuk setiap video secara bersamaan
  const channelIds = data.items.map((item: any) => item.snippet.channelId).join(',');
  const channelsData = await fetchFromYouTubeAPI('channels', {
    part: 'snippet',
    id: channelIds,
  });

  const channelAvatars = new Map<string, string>();
  if (channelsData?.items) {
    channelsData.items.forEach((channel: any) => {
      channelAvatars.set(channel.id, channel.snippet.thumbnails.default.url);
    });
  }

  return data.items.map((item: any): Video => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    duration: formatDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    channelAvatarUrl: channelAvatars.get(item.snippet.channelId),
    views: formatViews(item.statistics.viewCount),
    uploadedAt: timeAgo(item.snippet.publishedAt),
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
  
  // Ambil detail channel untuk setiap video secara bersamaan
  const channelIds = videoDetailsData.items.map((item: any) => item.snippet.channelId).join(',');
  const channelsData = await fetchFromYouTubeAPI('channels', {
    part: 'snippet',
    id: channelIds,
  });

  const channelAvatars = new Map<string, string>();
  if (channelsData?.items) {
    channelsData.items.forEach((channel: any) => {
      channelAvatars.set(channel.id, channel.snippet.thumbnails.default.url);
    });
  }

  return videoDetailsData.items.map((item: any): Video => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
    duration: formatDuration(item.contentDetails.duration),
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    channelAvatarUrl: channelAvatars.get(item.snippet.channelId),
    views: formatViews(item.statistics.viewCount),
    uploadedAt: timeAgo(item.snippet.publishedAt),
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
    
    // Ambil detail channel untuk mendapatkan avatar
    const channelData = await getChannel(item.snippet.channelId);

    return {
        id: item.id,
        title: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        duration: formatDuration(item.contentDetails.duration),
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        channelAvatarUrl: channelData?.avatarUrl,
        views: formatViews(item.statistics.viewCount),
        uploadedAt: timeAgo(item.snippet.publishedAt),
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