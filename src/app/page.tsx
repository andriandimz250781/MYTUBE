import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos, searchVideosByQuery } from '@/app/lib/data';
import { Suspense } from 'react';

async function VideoGrid({ category }: { category?: string }) {
  const videos = category 
    ? await searchVideosByQuery(category)
    : await getTrendingVideos();

  if (videos.length === 0) {
    return <p>Tidak ada video untuk kategori ini.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.slice(0, 10).map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

const categories = [
  'Musik',
  'Film',
  'Berita',
  'Kuliner',
  'Komedi',
  'Horor',
  'Hobby',
  'Karaoke'
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Lagi Tren</h2>
        <Suspense fallback={<p>Memuat video tren...</p>}>
          {/* @ts-expect-error Server Component */}
          <VideoGrid />
        </Suspense>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h2 className="font-headline mb-4 text-2xl font-bold">{category}</h2>
          <Suspense fallback={<p>Memuat video {category.toLowerCase()}...</p>}>
            {/* @ts-expect-error Server Component */}
            <VideoGrid category={category} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
