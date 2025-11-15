import { NextResponse } from 'next/server';
import { getTrendingVideos, searchVideos } from '@/lib/youtube';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    // If a query is provided and it's not empty, search for videos.
    // Otherwise, fetch trending videos.
    if (query && query.trim()) {
      const videos = await searchVideos(query);
      if (!videos) {
        return NextResponse.json(
          { error: 'Failed to fetch search results.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ videos });
    } else {
      const videos = await getTrendingVideos();
       if (!videos) {
        return NextResponse.json(
          { error: 'Failed to fetch trending videos.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ videos });
    }
  } catch (error) {
    console.error('[YOUTUBE_API_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
