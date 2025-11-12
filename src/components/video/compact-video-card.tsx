import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/app/lib/data';
import { getImage } from '@/app/lib/data';

type CompactVideoCardProps = {
  video: Video;
};

export function CompactVideoCard({ video }: CompactVideoCardProps) {
  const thumbnail = getImage(video.thumbnailId);

  return (
    <Link href={`/watch/${video.id}`} className="flex gap-3 group">
      <div className="relative h-fit w-40 shrink-0 overflow-hidden rounded-lg">
        {thumbnail ? (
          <Image
            src={thumbnail.imageUrl}
            alt={thumbnail.description}
            width={160}
            height={90}
            className="aspect-video h-full w-full object-cover"
            data-ai-hint={thumbnail.imageHint}
          />
        ) : (
          <div className="aspect-video w-full bg-muted"></div>
        )}
        <div className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-xs text-white">
          {video.duration}
        </div>
      </div>
      <div>
        <h3 className="font-headline text-sm font-semibold line-clamp-2 group-hover:text-primary">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground">{video.channelName}</p>
        <p className="text-xs text-muted-foreground">
          {video.views} views &bull; {video.uploadedAt}
        </p>
      </div>
    </Link>
  );
}
