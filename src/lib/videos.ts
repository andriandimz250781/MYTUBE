
import type { Video as YouTubeVideo } from "./youtube";

// This is a placeholder file for video-related library functions.
// simple in-memory mock and helpers for prefetch + recommendations
export interface Video extends YouTubeVideo {
  src: string;
}

const MOCK_DB: Video[] = [
  // example records — replace with real data fetch from Firestore or YouTube API
  {
    id: "a",
    title: "LoFi Chill Beats",
    channelName: "Chillhop",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://picsum.photos/seed/c/480/270",
    duration: "1:02:11",
    views: "540K",
    uploadedAt: "3 days ago",
    publishedAt: "2024-05-12T12:00:00Z",
    description: "Live from Ibiza."
  },
];

export async function getVideoById(id: string): Promise<Video | null> {
  // integrate with Firestore or YouTube API here
  const found = MOCK_DB.find((v) => v.id === id) ?? MOCK_DB[0];
  // simulate network
  await new Promise((r) => setTimeout(r, 120));
  return found;
}

export async function getRecommendations(seed: Video): Promise<Video[]> {
    if (!seed) {
        return MOCK_DB.slice(0, 10);
    }
  // naive scoring: just return other videos for now
  const recs = MOCK_DB.filter(v => v.id !== seed.id);
  
  // simulate network
  await new Promise((r) => setTimeout(r, 80));
  return recs.slice(0, 10);
}

export async function prefetchNext(currentId: string) {
  // attempt to fetch next metadata & thumbnail to cache
  // here, just find next by index
  const idx = MOCK_DB.findIndex((m) => m.id === currentId);
  const next = MOCK_DB[(idx + 1) % MOCK_DB.length];
  
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = next.thumbnail;
    document.head.appendChild(link);
  }

  // simulate prefetch caching
  await new Promise((r) => setTimeout(r, 60));
  return next;
}

export async function markPlayed(id: string) {
  // hook to analytics / increment view count
  console.log(`Marked video as played: ${id}`);
  await Promise.resolve();
}
