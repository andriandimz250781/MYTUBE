import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/app/lib/data';

type CompactVideoCardProps = {
  video: Video;
};

export function CompactVideoCard({ video }: CompactVideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="flex gap-3 group">
      <div className="relative h-fit w-40 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          width={160}
          height={90}
          className="aspect-video h-full w-full object-cover"
        />
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
