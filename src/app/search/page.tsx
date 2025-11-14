'use client';

import { VideoCard } from '@/components/video/video-card';
import { getTrendingVideos, searchVideosByQuery, type Video } from '@/app/lib/data';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function SearchResults({ query, duration }: { query: string; duration?: 'long' | 'any' }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      const { videos: newVideos, nextPageToken: token } = await searchVideosByQuery(query, duration);
      setVideos(newVideos);
      setNextPageToken(token);
      setLoading(false);
    }
    initialLoad();
  }, [query, duration]);

  const handleLoadMore = async () => {
    if (!nextPageToken) return;
    setLoadingMore(true);
    const { videos: newVideos, nextPageToken: token } = await searchVideosByQuery(query, duration, nextPageToken);
    setVideos(prevVideos => [...prevVideos, ...newVideos]);
    setNextPageToken(token);
    setLoadingMore(false);
  };
  
  if (loading) {
    return <div>Memuat hasil pencarian...</div>;
  }

  if (videos.length === 0) {
      return <p>Video tidak ditemukan.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
       {nextPageToken && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function Recommendations() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      try {
        const history: { channelName: string; tags: string[] }[] = JSON.parse(
          localStorage.getItem('watchHistory') || '[]'
        );

        if (history.length > 0) {
          const tagFrequency: { [key: string]: number } = history
            .flatMap(item => item.tags)
            .filter(tag => tag) // Filter out undefined/null tags
            .reduce((acc, tag) => {
              const lowerTag = tag.toLowerCase();
              if (lowerTag.includes('official') || lowerTag.includes('video') || lowerTag.length < 3) {
                return acc;
              }
              acc[tag] = (acc[tag] || 0) + 1;
              return acc;
            }, {} as { [key: string]: number });

          const mostFrequentTag = Object.keys(tagFrequency).reduce(
            (a, b) => (tagFrequency[a] > tagFrequency[b] ? a : b),
            null as string | null
          );

          if (mostFrequentTag) {
            const { videos: recommendedVideos } = await searchVideosByQuery(
              `${mostFrequentTag} music`
            );
            setVideos(recommendedVideos.slice(0, 8));
          } else {
            const { videos: newVideos } = await getTrendingVideos();
            setVideos(newVideos.filter(v => v.tags.some(t => t.toLowerCase().includes('music'))).slice(0, 4));
          }

        } else {
          const { videos: newVideos } = await getTrendingVideos();
          setVideos(newVideos.filter(v => v.tags.some(t => t.toLowerCase().includes('music'))).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        const { videos: newVideos } = await getTrendingVideos();
        setVideos(newVideos.filter(v => v.tags.some(t => t.toLowerCase().includes('music'))).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);


  if (loading) {
    return <p>Memuat rekomendasi musik...</p>;
  }

  if (videos.length === 0) {
      return <p>Tidak ada rekomendasi musik untuk ditampilkan.</p>;
  }

  return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
  );
}


function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const upperCaseQuery = query.toUpperCase();

  // Tampilan khusus untuk kategori MUSIK
  if (upperCaseQuery === 'MUSIK') {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">Dunia Musik</h1>
        <Tabs defaultValue="rekomendasi" className="w-full">
          <TabsList>
            <TabsTrigger value="rekomendasi">Rekomendasi</TabsTrigger>
            <TabsTrigger value="trending">Lagi Tren</TabsTrigger>
            <TabsTrigger value="indonesia">Indonesia</TabsTrigger>
            <TabsTrigger value="mancanegara">Mancanegara</TabsTrigger>
          </TabsList>
          <TabsContent value="rekomendasi" className="mt-6">
            <Suspense fallback={<div>Memuat rekomendasi musik...</div>}>
              <Recommendations />
            </Suspense>
          </TabsContent>
          <TabsContent value="trending" className="mt-6">
            <Suspense fallback={<div>Memuat musik trending...</div>}>
              <SearchResults query="trending music" />
            </Suspense>
          </TabsContent>
          <TabsContent value="indonesia" className="mt-6">
            <Suspense fallback={<div>Memuat musik Indonesia...</div>}>
              <SearchResults query="musik indonesia terbaru" />
            </Suspense>
          </TabsContent>
          <TabsContent value="mancanegara" className="mt-6">
            <Suspense fallback={<div>Memuat musik mancanegara...</div>}>
              <SearchResults query="international music hits" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

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
              <SearchResults query="live streaming tv indonesia" />
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
              <SearchResults query="film indonesia" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="malaysia" className="mt-6">
            <Suspense fallback={<div>Memuat film Malaysia...</div>}>
              <SearchResults query="film malaysia" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="thailand" className="mt-6">
            <Suspense fallback={<div>Memuat film Thailand...</div>}>
              <SearchResults query="film thailand" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="vietnam" className="mt-6">
            <Suspense fallback={<div>Memuat film Vietnam...</div>}>
              <SearchResults query="film vietnam" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="barat" className="mt-6">
            <Suspense fallback={<div>Memuat film Barat...</div>}>
              <SearchResults query="film barat" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="india" className="mt-6">
            <Suspense fallback={<div>Memuat film India...</div>}>
              <SearchResults query="film india" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="kartun" className="mt-6">
            <Suspense fallback={<div>Memuat film Kartun...</div>}>
              <SearchResults query="film kartun" duration="long" />
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
              <SearchResults query="film horor indonesia" duration="long"/>
            </Suspense>
          </TabsContent>
          <TabsContent value="internasional" className="mt-6">
            <Suspense fallback={<div>Memuat film horor internasional...</div>}>
              <SearchResults query="film horor internasional" duration="long"/>
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
              <SearchResults query="live streaming tv indonesia" />
            </Suspense>
          </TabsContent>
          <TabsContent value="mancanegara" className="mt-6">
            <Suspense fallback={<div>Memuat siaran langsung internasional...</div>}>
              <SearchResults query="live streaming tv international" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Penanganan khusus untuk HOBBY, KOMEDI, KARTUN (video panjang)
  if (upperCaseQuery === 'HOBBY' || upperCaseQuery === 'KOMEDI' || upperCaseQuery === 'KARTUN') {
     return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-6">
          Hasil untuk: <span className="text-primary">{query}</span>
        </h1>
        <Suspense fallback={<div>Memuat hasil pencarian...</div>}>
          <SearchResults query={query} duration="long" />
        </Suspense>
      </div>
    );
  }

  // Untuk kategori lain seperti KARAOKE, dll.
  // Kata kunci pencarian diambil langsung dari nama kategori.
  const searchQuery = upperCaseQuery === 'KARAOKE' ? `${query} karaoke` : query;

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">
        Hasil untuk: <span className="text-primary">{query || '...'}</span>
      </h1>
      <Suspense fallback={<div>Memuat hasil pencarian...</div>}>
        <SearchResults query={searchQuery} />
      </Suspense>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Memuat halaman pencarian...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
