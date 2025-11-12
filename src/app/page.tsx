import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos } from '@/app/lib/data';
import { Suspense } from 'react';

async function VideoGrid() {
  const videos = await getTrendingVideos();

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

// Kategori yang akan ditampilkan di halaman beranda
const categories = [
  'Musik',
  'Film',
  'Berita',
  'Kuliner',
  'Komedi',
  'Horor',
  'Hobby',
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Lagi Tren</h2>
        <Suspense fallback={<p>Memuat video...</p>}>
          {/* @ts-expect-error Server Component */}
          <VideoGrid />
        </Suspense>
      </div>

      {/* Menampilkan video untuk setiap kategori
          CATATAN: Untuk saat ini, semua kategori masih menampilkan video yang sama (trending).
          Ini akan kita ubah di langkah berikutnya agar setiap kategori menampilkan video yang sesuai.
       */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="font-headline mb-4 text-2xl font-bold">{category}</h2>
          <Suspense fallback={<p>Memuat video {category}...</p>}>
            {/* @ts-expect-error Server Component */}
            <VideoGrid />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
