"use client";

import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/lib/youtube";
import { AutoText } from "../Layout";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface VideoCardProps {
  video: Video;
  layout?: 'grid' | 'horizontal';
}

export default function VideoCard({ video, layout = 'grid' }: VideoCardProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(`/watch/${video.id}`);
  };

  if (layout === 'horizontal') {
    return (
      <Link
        href={`/watch/${video.id}`}
        className="group flex gap-3 w-full cursor-pointer"
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative w-32 sm:w-40 shrink-0 overflow-hidden rounded-lg bg-muted aspect-video">
           <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
           <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
            {video.duration}
          </span>
        </div>
        <div className="flex flex-col py-1">
          <h2 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground group-hover:text-primary">
            {video.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{video.channelName}</p>
          <p className="text-xs text-muted-foreground">
            {video.views} &bull; {video.uploadedAt}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/watch/${video.id}`}
      className="group block w-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative w-full overflow-hidden rounded-xl bg-muted aspect-video">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-2 py-0.5 text-xs text-white">
          {video.duration}
        </span>
      </div>

      <div className="mt-3 flex gap-3 p-1 md:p-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          {video.channelName?.charAt(0) || 'U'}
        </div>

        <div className="flex flex-col">
          <h2 className="line-clamp-2 text-sm md:text-base font-semibold leading-tight text-foreground group-hover:text-primary">
            {video.title}
          </h2>
          <AutoText>
            <p className="text-xs md:text-sm text-muted-foreground">{video.channelName}</p>
          </AutoText>
          <AutoText>
            <p className="text-xs md:text-sm text-muted-foreground">
              {video.views} views &bull; {video.uploadedAt}
            </p>
          </AutoText>
        </div>
      </div>
    </Link>
  );
}
