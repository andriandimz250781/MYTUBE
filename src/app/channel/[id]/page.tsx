import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getChannel, getImage, getTrendingVideos } from '@/app/lib/data';
import { VideoCard } from '@/components/video/video-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ChannelPage({ params }: { params: { id: string } }) {
  // Hard-coding to 'my-channel' as we don't have real dynamic channels
  const channel = getChannel('techflow');
  if (!channel) {
    notFound();
  }

  const channelBanner = getImage(channel.bannerId);
  const channelAvatar = getImage(channel.avatarId);
  const channelVideos = (await getTrendingVideos()).filter(v => v.channelId === channel.id || v.channelId !== 'wanderlust');

  return (
    <div className="space-y-8">
      <div>
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
          {channelBanner && (
            <Image
              src={channelBanner.imageUrl}
              alt={`${channel.name} banner`}
              fill
              className="object-cover"
              data-ai-hint={channelBanner.imageHint}
            />
          )}
        </div>
        <div className="relative z-10 -mt-12 flex flex-col items-center gap-4 px-4 sm:-mt-16 sm:flex-row sm:items-end">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-background sm:h-32 sm:w-32">
            {channelAvatar && (
              <Image
                src={channelAvatar.imageUrl}
                alt={`${channel.name} avatar`}
                width={128}
                height={128}
                className="object-cover"
                data-ai-hint={channelAvatar.imageHint}
              />
            )}
          </div>
          <div className="flex-1 py-2 text-center sm:text-left">
            <h1 className="font-headline text-3xl font-bold">{channel.name}</h1>
            <p className="text-sm text-muted-foreground">
              @{channel.id} &bull; {channel.subscribers} subscribers
            </p>
          </div>
          <Button
            variant="default"
            className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          >
            Subscribe
          </Button>
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {channelVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-6">
          <div className="max-w-2xl rounded-lg bg-secondary/30 p-6">
            <h3 className="mb-2 text-xl font-semibold">Description</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {channel.description}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
