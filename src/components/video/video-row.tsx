import { VideoCard } from '@/components/video/video-card';
import type { Video } from '@/lib/data';

type VideoRowProps = {
    videos: Video[];
};

export function VideoRow({ videos }: VideoRowProps) {
    if (videos.length === 0) {
        return <p>Tidak ada video untuk ditampilkan.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map(video => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
