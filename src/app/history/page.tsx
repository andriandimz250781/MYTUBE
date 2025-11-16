"use client";

import VideoCard from "@/components/video/VideoCard";
import { PageContainer, SectionTitle } from "@/components/Layout";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { History } from "lucide-react";

export default function HistoryPage() {
  const { history, isLoaded } = useWatchHistory();

  return (
    <PageContainer>
      <SectionTitle title="Watch History" />
      
      {!isLoaded && (
        <p className="text-muted-foreground">Loading history...</p>
      )}

      {isLoaded && history.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground gap-4 py-16">
            <History className="w-16 h-16" />
            <h2 className="text-xl font-semibold">No watch history yet</h2>
            <p>Videos you watch will appear here.</p>
        </div>
      )}
      
      {isLoaded && history.length > 0 && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {history.map((video) => (
            <VideoCard key={video.id} video={{
                id: video.id,
                title: video.title,
                thumbnail: video.thumbnail,
                channelName: video.channelName,
                uploadedAt: video.uploadedAt,
                duration: video.duration,
                views: video.views,
            }} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
