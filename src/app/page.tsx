import { VideoCard } from '@/components/VideoCard';
import type { Video } from '@/lib/youtube';

async function getVideos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      console.error("ERROR: NEXT_PUBLIC_BASE_URL is not set in .env.local");
      return [];
    }

    const res = await fetch(`${baseUrl}/api/youtube`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error fetching videos from API route:', errorText);
      return [];
    }

    const data = await res.json();
    return data.videos as Video[];
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return [];
  }
}

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Trending</h2>
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p>Could not load videos. Check API keys in .env.local.</p>
        )}
      </div>
    </div>
  );
}
