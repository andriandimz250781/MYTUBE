import { VideoCard } from '@/components/video/video-card';
import { searchVideosByQuery } from '@/app/lib/data';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

async function SearchResults({ query }: { query: string }) {
  const searchResults = await searchVideosByQuery(query);

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {searchResults.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
      {searchResults.length === 0 && <p>Video tidak ditemukan.</p>}
    </div>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  // Tampilan khusus untuk kategori BERITA
  if (query.toUpperCase() === 'BERITA') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">Berita Terkini</h1>
        <Tabs defaultValue="nasional" className="w-full">
          <TabsList>
            <TabsTrigger value="nasional">Nasional</TabsTrigger>
            <TabsTrigger value="internasional">Internasional</TabsTrigger>
            <TabsTrigger value="kriminal">Kriminal</TabsTrigger>
            <TabsTrigger value="olahraga">Olahraga</TabsTrigger>
            <TabsTrigger value="live">Live TV</TabsTrigger>
          </TabsList>
          <TabsContent value="nasional" className="mt-6">
            <Suspense fallback={<div>Memuat berita nasional...</div>}>
              <SearchResults query="berita nasional terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="internasional" className="mt-6">
            <Suspense fallback={<div>Memuat berita internasional...</div>}>
              <SearchResults query="berita internasional terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="kriminal" className="mt-6">
            <Suspense fallback={<div>Memuat berita kriminal...</div>}>
              <SearchResults query="berita kriminal terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="olahraga" className="mt-6">
            <Suspense fallback={<div>Memuat berita olahraga...</div>}>
              <SearchResults query="berita olahraga terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="live" className="mt-6">
            <Suspense fallback={<div>Memuat siaran langsung...</div>}>
              <SearchResults query="berita live streaming tv" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Tambahkan kata "karaoke" secara eksplisit jika kategori yang dipilih adalah KARAOKE
  const searchQuery = query.toUpperCase() === 'KARAOKE' ? query + ' karaoke' : query;

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Hasil pencarian untuk: <span className="text-primary">{query || '...'}</span>
      </h1>
      <Suspense fallback={<div>Memuat hasil pencarian...</div>}>
        <SearchResults query={searchQuery} />
      </Suspense>
    </div>
  );
}
