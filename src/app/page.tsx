'use client';

import { getTrendingVideos, searchVideosByQuery, type Video } from '@/app/lib/data';
import { Suspense, useEffect, useState } from 'react';
import { VideoRow } from '@/components/video/video-row';

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
          // Cari genre/tag yang paling sering ditonton
          const tagFrequency: { [key: string]: number } = history
            .flatMap(item => item.tags || []) // Safely handle items without tags
            .reduce((acc, tag) => {
              if (!tag) return acc; // Skip if tag is null or undefined
              // Abaikan tag umum atau tidak relevan
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
             // Ambil rekomendasi berdasarkan genre/tag yang paling sering ditonton
            const { videos: recommendedVideos } = await searchVideosByQuery(
              mostFrequentTag
            );
            setVideos(recommendedVideos.slice(0, 8)); // Tampilkan lebih banyak
          } else {
             // Fallback jika tidak ada tag yang relevan
            const { videos: newVideos } = await getTrendingVideos();
            setVideos(newVideos.slice(0, 4));
          }

        } else {
          // Fallback ke video trending jika history kosong
          const { videos: newVideos } = await getTrendingVideos();
          setVideos(newVideos.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        // Fallback jika terjadi error
        const { videos: newVideos } = await getTrendingVideos();
        setVideos(newVideos.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);


  if (loading) {
    return <p>Memuat rekomendasi...</p>;
  }

  return <VideoRow videos={videos} />;
}


function ForYou() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { videos: newVideos } = await getTrendingVideos();
      // Mock "For You" by taking a different slice
      setVideos(newVideos.slice(5, 9));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p>Memuat video untukmu...</p>;
  }

  return <VideoRow videos={videos} />;
}


function Trending() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initialLoad() {
            setLoading(true);
            const { videos: newVideos, nextPageToken: token } = await getTrendingVideos();
            setVideos(newVideos);
            setNextPageToken(token);
            setLoading(false);
        }
        initialLoad();
    }, []);

    if (loading) {
        return <p>Memuat video tren...</p>;
    }

    if (videos.length === 0) {
        return <p>Tidak dapat memuat video trending saat ini. Coba beberapa saat lagi.</p>;
    }

    return <VideoRow videos={videos} />
}

export default function Home() {
  return (
    <div className="space-y-10">
       <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Rekomendasi</h2>
        <Suspense fallback={<p>Memuat rekomendasi...</p>}>
          <Recommendations />
        </Suspense>
      </div>
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Untukmu</h2>
        <Suspense fallback={<p>Memuat video untukmu...</p>}>
          <ForYou />
        </Suspense>
      </div>
      <div>
        <h2 className="font-headline mb-4 text-2xl font-bold">Lagi Tren</h2>
        <Suspense fallback={<p>Memuat video tren...</p>}>
          <Trending />
        </Suspense>
      </div>
    </div>
  );
}
