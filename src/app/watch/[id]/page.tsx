
import { getVideoById } from '@/lib/youtube';
import type { Video } from '@/lib/youtube';
import { notFound } from 'next/navigation';

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const videoId = params.id;
  const video = await getVideoById(videoId);

  if (!video) {
    notFound();
  }

  return (
    <div className="py-6 space-y-6">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          className="absolute top-0 left-0 h-full w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            {video.channelName?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold">{video.channelName}</p>
            <p className="text-sm text-muted-foreground">
              {video.views} views &bull; {video.uploadedAt}
            </p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-accent text-accent-foreground">
            <p className="text-sm whitespace-pre-wrap">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
