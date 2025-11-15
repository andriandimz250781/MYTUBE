"use client";
import Link from "next/link";

export default function VideoCard({
  id,
  thumbnail,
  title,
  channel,
  views,
}: {
  id: string;
  thumbnail: string;
  title: string;
  channel: string;
  views?: string;
}) {
  return (
    <Link href={`/watch/${id}`} className="block">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <img src={thumbnail} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="mt-2">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-neutral-400">{channel}</p>
        <p className="text-sm text-neutral-500">{views ?? "0"} views</p>
      </div>
    </Link>
  );
}
