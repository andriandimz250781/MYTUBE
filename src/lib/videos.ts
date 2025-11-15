
import {
  getVideoById as getYouTubeVideoById,
  getRelatedVideos,
  type Video as YouTubeVideo,
} from "./youtube";

// This file acts as an abstraction layer over the YouTube API.
// It adapts the data for our custom video player components.
export interface Video extends YouTubeVideo {
  src: string; // For our custom player, this will be the YouTube embed URL.
}

const MOCK_DB: Video[] = [
  // This mock data is now only a fallback.
  {
    id: "a",
    title: "LoFi Chill Beats",
    channelName: "Chillhop",
    src: "https://www.youtube.com/embed/5qap5aO4i9A",
    thumbnail: "https://picsum.photos/seed/a/480/270",
    duration: "10:33",
    views: "120K",
    uploadedAt: "2 weeks ago",
    publishedAt: "2024-05-01T12:00:00Z",
    description: "Chill beats to relax/study to."
  },
  {
    id: "b",
    title: "Top Hits 2025",
    channelName: "DJ Mix",
    src: "https://www.youtube.com/embed/3tmd-ClpJxA",
    thumbnail: "https://picsum.photos/seed/b/480/270",
    duration: "10:53",
    views: "98K",
    uploadedAt: "1 month ago",
    publishedAt: "2024-04-15T12:00:00Z",
    description: "The best hits of 2025."
  },
  {
    id: "c",
    title: "Deep House Live Set",
    channelName: "Club Sounds",
    src: "https://www.youtube.com/embed/3tmd-ClpJxA",
    thumbnail: "https://picsum.photos/seed/c/480/270",
    duration: "1:02:11",
    views: "540K",
    uploadedAt: "3 days ago",
    publishedAt: "2024-05-12T12:00:00Z",
    description: "Live from Ibiza."
  },
];


function adaptYouTubeVideo(video: YouTubeVideo): Video {
  return {
    ...video,
    // Construct the embed URL needed for the iframe player
    src: `https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0`,
  };
}

export async function getVideoById(id: string): Promise<Video | null> {
  const youtubeVideo = await getYouTubeVideoById(id);
  if (!youtubeVideo) {
     // Fallback to mock data if API fails
    const mockVideo = MOCK_DB.find((v) => v.id === id) ?? MOCK_DB[0];
    return mockVideo;
  }
  return adaptYouTubeVideo(youtubeVideo);
}

export async function getRecommendations(seed: Video): Promise<Video[]> {
  const relatedVideos = await getRelatedVideos(seed.id);
  if (!relatedVideos || relatedVideos.length === 0) {
    // Naive fallback: return other mock videos for now
    return MOCK_DB.filter(v => v.id !== seed.id).slice(0, 10);
  }
  return relatedVideos.map(adaptYouTubeVideo);
}

export async function prefetchNext(currentId: string) {
  const recommendations = await getRecommendations({ id: currentId } as Video);
  if (!recommendations || recommendations.length === 0) return null;

  const next = recommendations[0];

  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = next.thumbnail;
    document.head.appendChild(link);
  }

  return next;
}

export async function markPlayed(id: string): Promise<void> {
  // Hook to analytics / increment view count
  // In a real app, you'd call an API here.
  console.log(`Marked video as played: ${id}`);
  await Promise.resolve();
}
