import { getVideoById } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import { PageContainer, Card, AutoText, SectionTitle } from '@/components/Layout';

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const videoId = params.id;
  const video = await getVideoById(videoId);

  if (!video) {
    notFound();
  }

  return (
    <PageContainer>
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
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{video.title}</h1>
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
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{video.description}</p>
            </AutoText>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
