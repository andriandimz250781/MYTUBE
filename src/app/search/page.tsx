import { VideoCard } from '@/components/video/video-card';
import { searchVideosByQuery } from '@/app/lib/data';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

async function SearchResults({ query, duration }: { query: string; duration?: 'long' | 'any' }) {
  const searchResults = await searchVideosByQuery(query, duration);

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
          </TabsList>
          <TabsContent value="nasional" className="mt-6">
            <Suspense fallback={<div>Memuat berita nasional...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="berita nasional terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="internasional" className="mt-6">
            <Suspense fallback={<div>Memuat berita internasional...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="berita internasional terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="kriminal" className="mt-6">
            <Suspense fallback={<div>Memuat berita kriminal...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="berita kriminal terkini" />
            </Suspense>
          </TabsContent>
          <TabsContent value="olahraga" className="mt-6">
            <Suspense fallback={<div>Memuat berita olahraga...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="berita olahraga terkini" />
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
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film indonesia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="malaysia" className="mt-6">
            <Suspense fallback={<div>Memuat film Malaysia...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film malaysia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="thailand" className="mt-6">
            <Suspense fallback={<div>Memuat film Thailand...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film thailand" />
            </Suspense>
          </TabsContent>
          <TabsContent value="vietnam" className="mt-6">
            <Suspense fallback={<div>Memuat film Vietnam...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film vietnam" />
            </Suspense>
          </TabsContent>
          <TabsContent value="barat" className="mt-6">
            <Suspense fallback={<div>Memuat film Barat...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film barat" />
            </Suspense>
          </TabsContent>
          <TabsContent value="india" className="mt-6">
            <Suspense fallback={<div>Memuat film India...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film india" />
            </Suspense>
          </TabsContent>
          <TabsContent value="kartun" className="mt-6">
            <Suspense fallback={<div>Memuat film Kartun...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film kartun" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Tampilan khusus untuk kategori HOROR
  if (upperCaseQuery === 'HOROR') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">Koleksi Horor</h1>
        <Tabs defaultValue="indonesia" className="w-full">
          <TabsList>
            <TabsTrigger value="indonesia">INDONESIA</TabsTrigger>
            <TabsTrigger value="internasional">INTERNASIONAL</TabsTrigger>
          </TabsList>
          <TabsContent value="indonesia" className="mt-6">
            <Suspense fallback={<div>Memuat film horor Indonesia...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film horor indonesia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="internasional" className="mt-6">
            <Suspense fallback={<div>Memuat film horor internasional...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="film horor internasional" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Tampilan khusus untuk kategori LIVE
  if (upperCaseQuery === 'LIVE') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">Siaran Langsung</h1>
        <Tabs defaultValue="lokal" className="w-full">
          <TabsList>
            <TabsTrigger value="lokal">TV Lokal</TabsTrigger>
            <TabsTrigger value="mancanegara">Mancanegara</TabsTrigger>
          </TabsList>
          <TabsContent value="lokal" className="mt-6">
            <Suspense fallback={<div>Memuat siaran langsung lokal...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="live streaming tv indonesia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="mancanegara" className="mt-6">
            <Suspense fallback={<div>Memuat siaran langsung internasional...</div>}>
              {/* @ts-expect-error Server Component */}
              <SearchResults query="live streaming tv international" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Penanganan khusus untuk HOBBY
  if (upperCaseQuery === 'HOBBY') {
     return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">
          Hasil untuk: <span className="text-primary">{query}</span>
        </h1>
        <Suspense fallback={<div>Memuat hasil pencarian...</div>}>
          {/* @ts-expect-error Server Component */}
          <SearchResults query={query} duration="long" />
        </Suspense>
      </div>
    );
  }

  // Untuk kategori lain seperti MUSIK, KARAOKE, dll.
  // Kata kunci pencarian diambil langsung dari nama kategori.
  const searchQuery = upperCaseQuery === 'KARAOKE' ? `${query} karaoke` : query;

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Hasil untuk: <span className="text-primary">{query || '...'}</span>
      </h1>
      <Suspense fallback={<div>Memuat hasil pencarian...</div>}>
        {/* @ts-expect-error Server Component */}
        <SearchResults query={searchQuery} />
      </Suspense>
    </div>
  );
}
