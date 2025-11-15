"use client";
import { PageContainer } from "@/components/Layout";
import VideoPage from "@/components/video/VideoPage";
import { useRouter } from "next/navigation";

// This is a placeholder since we can't get direct video URLs from YouTube.
// In a real app, you'd fetch video details and the next video ID here.
export default function WatchPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleNextVideo = () => {
    // Placeholder logic for next video
    const nextId = "placeholderNextId";
    router.push(`/watch/${nextId}`);
  };

  return (
    <PageContainer>
        <VideoPage
            // We use a placeholder video URL
            url="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            nextVideo={handleNextVideo}
        />
    </PageContainer>
  );
}
