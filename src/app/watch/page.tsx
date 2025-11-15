'use server';

import { getVideoById } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import {
  PageContainer,
  Card,
  AutoText,
  SectionTitle,
} from '@/components/Layout';
import { Suspense } from 'react';

interface WatchPageProps {
  searchParams: {
    v?: string;
  };
}

function PlayerSkeleton() {
  return (
    <div className="relative w-full aspect-video bg-muted rounded-xl animate-pulse" />
  );
}

function VideoDetailsSkeleton() {
  return (
    <Card>
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
    </Card>
  );
}

async function VideoPlayer({ videoId }: { videoId: string }) {
  const video = await getVideoById(videoId);

  if (!video) {
    notFound();
  }

  return (
    <>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          className="absolute top-0 left-0 h-full w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>

      <Card>
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
      </Card>
    </>
  );
}

export default function WatchPage({ searchParams }: WatchPageProps) {
  const videoId = searchParams.v;

  if (!videoId) {
    notFound();
  }

  return (
    <PageContainer>
      <Suspense fallback={<><PlayerSkeleton /><VideoDetailsSkeleton /></>}>
        <VideoPlayer videoId={videoId} />
      </Suspense>
    </PageContainer>
  );
}
