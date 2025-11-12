import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/app/lib/data';
import { getImage } from '@/app/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type VideoCardProps = {
  video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
  const thumbnail = getImage(video.thumbnailId);
  const channelAvatar = getImage(video.channelAvatarId);

  return (
    <Card className="w-full max-w-sm transform-gpu overflow-hidden rounded-lg border-none shadow-none transition-transform duration-300 ease-in-out hover:-translate-y-1">
      <Link href={`/watch/${video.id}`} className="block">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            {thumbnail ? (
              <Image
                src={thumbnail.imageUrl}
                alt={thumbnail.description}
                fill
                className="rounded-t-lg object-cover"
                data-ai-hint={thumbnail.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full rounded-t-lg bg-muted"></div>
            )}
            <div className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-xs text-white">
              {video.duration}
            </div>
          </div>
        </CardContent>
      </Link>
      <div className="p-3">
        <div className="flex items-start gap-3">
          <Link href={`/channel/${video.channelId}`}>
            <Avatar className="h-9 w-9">
              {channelAvatar && (
                <AvatarImage src={channelAvatar.imageUrl} alt={video.channelName} />
              )}
              <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link href={`/watch/${video.id}`}>
              <h3 className="font-headline text-sm font-semibold line-clamp-2">
                {video.title}
              </h3>
            </Link>
            <Link
              href={`/channel/${video.channelId}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {video.channelName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {video.views} views &bull; {video.uploadedAt}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">More options</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add to queue</DropdownMenuItem>
              <DropdownMenuItem>Save to Watch later</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
