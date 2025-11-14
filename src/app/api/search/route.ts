import { NextResponse } from 'next/server';
import { searchVideos } from '@/lib/youtube';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q.trim()) {
      return NextResponse.json(
        { error: 'Query cannot be empty.' },
        { status: 400 }
      );
    }

    const videos = await searchVideos(q);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('[SEARCH_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
