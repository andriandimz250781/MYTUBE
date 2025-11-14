import Image from 'next/image';
import type { Video } from '@/lib/youtube';

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="group">
      <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
           <div className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-xs text-white">
              {video.duration}
            </div>
        </div>
      </a>
      <div className="mt-2">
          <h3 className="text-sm font-semibold line-clamp-2">
             <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {video.title}
             </a>
          </h3>
          <p className="text-xs text-muted-foreground">{video.channelName}</p>
          <p className="text-xs text-muted-foreground">
            {video.views} views &bull; {video.uploadedAt}
          </p>
      </div>
    </div>
  );
}
