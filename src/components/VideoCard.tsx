"use client";

import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    channelName: string;
    publishedAt: string;
    duration: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={`/watch/${video.id}`}
      className="group block w-full cursor-pointer"
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

      <div className="mt-3 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          {video.channelName?.charAt(0) || 'U'}
        </div>

        <div className="flex flex-col">
          <h2 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
            {video.title}
          </h2>
          <p className="text-xs text-muted-foreground">{video.channelName}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(video.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
