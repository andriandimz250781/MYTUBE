import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  // TODO: Implement search logic using the YouTube API
  console.log(`Searching for: ${query}`);

  // Placeholder response
  return NextResponse.json({ videos: [] });
}
