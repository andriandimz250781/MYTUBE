import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.';

export const videos: Video[] = [
  {
    id: '1',
    title: 'Ultimate Tech Gadgets of 2024',
    thumbnailId: 'video-thumb-1',
    duration: '12:34',
    channelName: 'TechFlow',
    channelId: 'techflow',
    channelAvatarId: 'channel-avatar-1',
    views: '1.2M',
    uploadedAt: '2 weeks ago',
    description: LOREM_IPSUM,
    tags: ['tech', 'gadgets', '2024'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    title: 'Exploring the Swiss Alps',
    thumbnailId: 'video-thumb-2',
    duration: '24:10',
    channelName: 'Wanderlust',
    channelId: 'wanderlust',
    channelAvatarId: 'channel-avatar-2',
    views: '876K',
    uploadedAt: '1 month ago',
    description: LOREM_IPSUM,
    tags: ['travel', 'switzerland', 'alps'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    title: 'The Perfect Sourdough Bread',
    thumbnailId: 'video-thumb-3',
    duration: '8:52',
    channelName: 'KitchenCraft',
    channelId: 'kitchencraft',
    channelAvatarId: 'channel-avatar-3',
    views: '2.5M',
    uploadedAt: '3 days ago',
    description: LOREM_IPSUM,
    tags: ['cooking', 'baking', 'sourdough'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: '4',
    title: 'Cyberpunk 2077 Full Playthrough',
    thumbnailId: 'video-thumb-4',
    duration: '3:45:11',
    channelName: 'GamerX',
    channelId: 'gamerx',
    channelAvatarId: 'channel-avatar-1',
    views: '5M',
    uploadedAt: '1 year ago',
    description: LOREM_IPSUM,
    tags: ['gaming', 'cyberpunk', 'playthrough'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: '5',
    title: 'DIY Smart Mirror with Raspberry Pi',
    thumbnailId: 'video-thumb-5',
    duration: '15:05',
    channelName: 'MakeIt',
    channelId: 'makeit',
    channelAvatarId: 'channel-avatar-2',
    views: '980K',
    uploadedAt: '5 months ago',
    description: LOREM_IPSUM,
    tags: ['diy', 'raspberry pi', 'smart home'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: '6',
    title: 'Acoustic Cover of a Pop Hit',
    thumbnailId: 'video-thumb-6',
    duration: '3:21',
    channelName: 'MusicVibes',
    channelId: 'musicvibes',
    channelAvatarId: 'channel-avatar-3',
    views: '12M',
    uploadedAt: '6 months ago',
    description: LOREM_IPSUM,
    tags: ['music', 'cover', 'acoustic'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: '7',
    title: '30-Minute Full Body Workout',
    thumbnailId: 'video-thumb-7',
    duration: '30:00',
    channelName: 'FitLife',
    channelId: 'fitlife',
    channelAvatarId: 'channel-avatar-1',
    views: '4.1M',
    uploadedAt: '10 days ago',
    description: LOREM_IPSUM,
    tags: ['fitness', 'workout', 'health'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    id: '8',
    title: 'The History of Ancient Rome',
    thumbnailId: 'video-thumb-8',
    duration: '45:19',
    channelName: 'HistoryUncovered',
    channelId: 'historyuncovered',
    channelAvatarId: 'channel-avatar-2',
    views: '2.2M',
    uploadedAt: '3 months ago',
    description: LOREM_IPSUM,
    tags: ['history', 'rome', 'documentary'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    id: '9',
    title: 'Awkward Office Moments (Comedy)',
    thumbnailId: 'video-thumb-9',
    duration: '5:43',
    channelName: 'LaughTrack',
    channelId: 'laughtrack',
    channelAvatarId: 'channel-avatar-3',
    views: '7.8M',
    uploadedAt: '4 weeks ago',
    description: LOREM_IPSUM,
    tags: ['comedy', 'sketch', 'office humor'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
  {
    id: '10',
    title: 'Secrets of the Amazon Rainforest',
    thumbnailId: 'video-thumb-10',
    duration: '55:01',
    channelName: 'WildWorld',
    channelId: 'wildworld',
    channelAvatarId: 'channel-avatar-1',
    views: '3.9M',
    uploadedAt: '2 months ago',
    description: LOREM_IPSUM,
    tags: ['nature', 'documentary', 'amazon'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    id: '11',
    title: 'Inception: Explained',
    thumbnailId: 'video-thumb-11',
    duration: '18:22',
    channelName: 'Cinephile',
    channelId: 'cinephile',
    channelAvatarId: 'channel-avatar-2',
    views: '6.1M',
    uploadedAt: '1 year ago',
    description: LOREM_IPSUM,
    tags: ['movies', 'film analysis', 'inception'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAnAdventure.mp4',
  },
  {
    id: '12',
    title: 'The Little Knight - Animated Short',
    thumbnailId: 'video-thumb-12',
    duration: '4:15',
    channelName: 'PixelPlay',
    channelId: 'pixelplay',
    channelAvatarId: 'channel-avatar-3',
    views: '21M',
    uploadedAt: '2 years ago',
    description: LOREM_IPSUM,
    tags: ['animation', 'short film', '3d'],
    videoUrl:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
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

export const getImage = (id: string | undefined) =>
  PlaceHolderImages.find(img => img.id === id);
export const getVideo = (id: string | undefined) =>
  videos.find(vid => vid.id === id);
export const getChannel = (id: string | undefined) =>
  channels.find(ch => ch.id === id);
