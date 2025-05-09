import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[POSTS_GET] Error fetching posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error('[POSTS_GET] Unexpected error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: errorMessage },
      { status: 500 }
    );
  }
}
