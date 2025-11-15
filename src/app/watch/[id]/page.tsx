"use client";
import { PageContainer } from "@/components/Layout";
import VideoPage from "@/components/video/VideoPage";

export default function WatchPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer>
        <VideoPage videoId={params.id} />
    </PageContainer>
  );
}
