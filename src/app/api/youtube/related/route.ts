import { NextResponse } from 'next/server';
import { getRelatedVideos } from '@/lib/youtube';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    const videos = await getRelatedVideos(id);
    return NextResponse.json({ videos });

  } catch (error) {
    console.error('[RELATED_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
