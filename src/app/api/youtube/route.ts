import { getTrendingVideos, Video } from '@/lib/youtube';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const videos: Video[] | null = await getTrendingVideos();
    if (!videos) {
      return NextResponse.json(
        { error: 'Failed to fetch videos from YouTube.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('[YOUTUBE_API_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
