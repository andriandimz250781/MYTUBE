import { NextResponse } from 'next/server';
import { getTrendingVideos, searchVideos } from '@/lib/youtube';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // kalau ada q = pencarian

    // 🔍 Jika ada query → pencarian YouTube
    if (query && query.trim().length > 0) {
      const results = await searchVideos(query);
      if (!results) {
        return NextResponse.json(
          { error: 'Failed to fetch search results from YouTube.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ videos: results });
    }

    // 🔥 Jika tidak ada query → trending
    const trending = await getTrendingVideos();
    if (!trending) {
      return NextResponse.json(
        { error: 'Failed to fetch trending videos from YouTube.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ videos: trending });

  } catch (error) {
    console.error('[YOUTUBE_API_ROUTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
