import { getVideoById, getRelatedVideos } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import {
  PageContainer,
  AutoText,
  SectionTitle,
} from '@/components/Layout';
import { Suspense } from 'react';
import VideoCard from '@/components/VideoCard';
import VideoPlayer from '@/components/VideoPlayer';
import WatchHistoryLogger from '@/components/WatchHistoryLogger';
import { Card as CustomCard } from '@/components/Layout';
import AutoNext from '@/components/AutoNext';

interface WatchPageProps {
  params: {
    id?: string;
  };
}

function PlayerSkeleton() {
  return (
    <div className="relative w-full aspect-video bg-muted rounded-xl animate-pulse" />
  );
}

function VideoDetailsSkeleton() {
  return (
    <CustomCard>
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary"></div>
          <div className="flex flex-col gap-2">
            <div className="h-5 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div>
          <SectionTitle title="Description" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}

async function VideoDetails({ videoId }: { videoId: string }) {
  const video = await getVideoById(videoId);

  if (!video) {
    notFound();
  }

  return (
    <>
      <WatchHistoryLogger video={video} />
      <CustomCard>
        <div className="space-y-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            {video.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              {video.channelName?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <AutoText>
                <p className="font-semibold">{video.channelName}</p>
              </AutoText>
              <AutoText>
                <p className="text-sm text-muted-foreground">
                  {video.views} views &bull; {video.uploadedAt}
                </p>
              </AutoText>
            </div>
          </div>
          <div>
            <SectionTitle title="Description" />
            <AutoText>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {video.description}
              </p>
            </AutoText>
          </div>
        </div>
      </CustomCard>
    </>
  );
}

function RelatedVideosSkeleton() {
    return (
        <div className="space-y-4">
            <SectionTitle title="Related Videos" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-32 h-20 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

async function RelatedVideos({ videoId }: { videoId: string }) {
    const relatedVideos = await getRelatedVideos(videoId);
    const nextVideoId = relatedVideos?.[0]?.id;

    return (
        <div className="space-y-4">
            <AutoNext nextId={nextVideoId} />
            <SectionTitle title="Related Videos" />
            {relatedVideos && relatedVideos.length > 0 ? (
                relatedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} layout="horizontal" />
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No related videos found.</p>
            )}
        </div>
    );
}

export default function WatchPage({ params }: WatchPageProps) {
  const videoId = params.id;

  if (!videoId) {
    notFound();
  }

  return (
    <PageContainer>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
                <VideoPlayer videoId={videoId} />
                <Suspense fallback={<VideoDetailsSkeleton />}>
                    <VideoDetails videoId={videoId} />
                </Suspense>
            </div>
            <aside className="w-full lg:w-80 xl:w-96 shrink-0">
                <Suspense fallback={<RelatedVideosSkeleton />}>
                    <RelatedVideos videoId={videoId} />
                </Suspense>
            </aside>
        </div>
    </PageContainer>
  );
}
