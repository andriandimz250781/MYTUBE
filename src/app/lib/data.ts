

import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- Tipe Data ---
export type Video = {
  id: string;
  title: string;
  thumbnailId: string;
  duration: string;
  channelName: string;
  channelId: string;
  channelAvatarId: string;
  views: string;
  uploadedAt: string;
  description: string;
};

export type Channel = {
  id: string;
  name: string;
  avatarId: string;
  bannerId?: string;
  subscribers: string;
  description: string;
};

// --- Data Statis ---
const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.';

export const videos: Video[] = [
  {
    id: '1',
    title: 'The Future of AI: A TechFlow Documentary',
    thumbnailId: 'video-thumb-1',
    duration: '12:34',
    channelName: 'TechFlow',
    channelId: 'techflow',
    channelAvatarId: 'channel-avatar-1',
    views: '1.2M',
    uploadedAt: '2 days ago',
    description: LOREM_IPSUM,
  },
  {
    id: '2',
    title: 'Alpine Adventures: Hiking the Swiss Alps',
    thumbnailId: 'video-thumb-2',
    duration: '24:15',
    channelName: 'Wanderlust',
    channelId: 'wanderlust',
    channelAvatarId: 'channel-avatar-2',
    views: '876K',
    uploadedAt: '1 week ago',
    description: LOREM_IPSUM,
  },
  {
    id: '3',
    title: 'Ultimate 30-Minute Pasta Recipe',
    thumbnailId: 'video-thumb-3',
    duration: '8:45',
    channelName: 'KitchenCraft',
    channelId: 'kitchencraft',
    channelAvatarId: 'channel-avatar-3',
    views: '3.1M',
    uploadedAt: '3 days ago',
    description: LOREM_IPSUM,
  },
  {
    id: '4',
    title: 'CyberNeon: Epic Gameplay Montage',
    thumbnailId: 'video-thumb-4',
    duration: '15:00',
    channelName: 'GamerX',
    channelId: 'techflow', // Temp
    channelAvatarId: 'channel-avatar-1',
    views: '5.6M',
    uploadedAt: '1 day ago',
    description: LOREM_IPSUM,
  },
  {
    id: '5',
    title: 'Building a Bookshelf From Scratch',
    thumbnailId: 'video-thumb-5',
    duration: '18:21',
    channelName: 'DIYMasters',
    channelId: 'techflow', // Temp
    channelAvatarId: 'channel-avatar-1',
    views: '980K',
    uploadedAt: '5 days ago',
    description: LOREM_IPSUM,
  },
  {
    id: '6',
    title: 'Live Concert: The Soundscapes',
    thumbnailId: 'video-thumb-6',
    duration: '1:23:45',
    channelName: 'MusicVibe',
    channelId: 'wanderlust', // Temp
    channelAvatarId: 'channel-avatar-2',
    views: '2.5M',
    uploadedAt: '2 weeks ago',
    description: LOREM_IPSUM,
  },
  {
    id: '7',
    title: 'Full Body Workout - No Equipment',
    thumbnailId: 'video-thumb-7',
    duration: '22:10',
    channelName: 'FitLife',
    channelId: 'kitchencraft', // Temp
    channelAvatarId: 'channel-avatar-3',
    views: '4.9M',
    uploadedAt: '1 month ago',
    description: LOREM_IPSUM,
  },
  {
    id: '8',
    title: 'The Secrets of Ancient Rome',
    thumbnailId: 'video-thumb-8',
    duration: '45:18',
    channelName: 'HistoryUncovered',
    channelId: 'techflow', // Temp
    channelAvatarId: 'channel-avatar-1',
    views: '3.2M',
    uploadedAt: '3 weeks ago',
    description: LOREM_IPSUM,
  },
  {
    id: '9',
    title: 'Try Not To Laugh Challenge #12',
    thumbnailId: 'video-thumb-9',
    duration: '9:59',
    channelName: 'Comedy Central',
    channelId: 'wanderlust', // Temp
    channelAvatarId: 'channel-avatar-2',
    views: '10M',
    uploadedAt: '4 days ago',
    description: LOREM_IPSUM,
  },
];

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
  videos.find(v => v.id === id);

export const getChannel = (id: string | undefined) =>
  channels.find(ch => ch.id === id);


// --- Fungsi Pengambilan Data ---

/**
 * Mengambil daftar video trending.
 * NOTE: Ini hanya data tiruan untuk sekarang.
 */
export async function getTrendingVideos(): Promise<Video[]> {
  // Simulasi penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 500));
  return videos;
}

/**
 * Mencari video berdasarkan query.
 * NOTE: Ini hanya data tiruan untuk sekarang.
 */
export async function searchVideos(query: string): Promise<Video[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!query) return videos;
  return videos.filter(
    video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.channelName.toLowerCase().includes(query.toLowerCase())
  );
}
