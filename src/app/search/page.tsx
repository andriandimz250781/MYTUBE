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
  const upperCaseQuery = query.toUpperCase();

  // Tampilan khusus untuk kategori BERITA
  if (upperCaseQuery === 'BERITA') {
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

  // Tampilan khusus untuk kategori FILM
  if (upperCaseQuery === 'FILM') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">Koleksi Film</h1>
        <Tabs defaultValue="indonesia" className="w-full">
          <TabsList>
            <TabsTrigger value="indonesia">INDONESIA</TabsTrigger>
            <TabsTrigger value="malaysia">MALAYSIA</TabsTrigger>
            <TabsTrigger value="thailand">THAILAND</TabsTrigger>
            <TabsTrigger value="vietnam">VIETNAM</TabsTrigger>
            <TabsTrigger value="barat">BARAT</TabsTrigger>
            <TabsTrigger value="india">INDIA</TabsTrigger>
            <TabsTrigger value="kartun">KARTUN</TabsTrigger>
          </TabsList>
          <TabsContent value="indonesia" className="mt-6">
            <Suspense fallback={<div>Memuat film Indonesia...</div>}>
              <SearchResults query="film indonesia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="malaysia" className="mt-6">
            <Suspense fallback={<div>Memuat film Malaysia...</div>}>
              <SearchResults query="film malaysia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="thailand" className="mt-6">
            <Suspense fallback={<div>Memuat film Thailand...</div>}>
              <SearchResults query="film thailand" />
            </Suspense>
          </TabsContent>
          <TabsContent value="vietnam" className="mt-6">
            <Suspense fallback={<div>Memuat film Vietnam...</div>}>
              <SearchResults query="film vietnam" />
            </Suspense>
          </TabsContent>
          <TabsContent value="barat" className="mt-6">
            <Suspense fallback={<div>Memuat film Barat...</div>}>
              <SearchResults query="film barat" />
            </Suspense>
          </TabsContent>
          <TabsContent value="india" className="mt-6">
            <Suspense fallback={<div>Memuat film India...</div>}>
              <SearchResults query="film india" />
            </Suspense>
          </TabsContent>
          <TabsContent value="kartun" className="mt-6">
            <Suspense fallback={<div>Memuat film Kartun...</div>}>
              <SearchResults query="film kartun" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Tambahkan kata "karaoke" secara eksplisit jika kategori yang dipilih adalah KARAOKE
  const searchQuery = upperCaseQuery === 'KARAOKE' ? query + ' karaoke' : query;

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
