import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define TypeScript interfaces for better type safety
interface Post {
  title: string;
  image_url?: string;
  user_id: string;
}

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[POSTS_GET] Error getting session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to get session', details: sessionError.message },
        { status: 500 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', session.user.id)
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

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[POSTS_POST] Error getting session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to get session', details: sessionError.message },
        { status: 500 }
      );
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    let body: Partial<Post>;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[POSTS_POST] JSON parse error:', error);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { title, image_url } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: title.trim(),
          image_url,
          user_id: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[POSTS_POST] Error creating post:', error);
      return NextResponse.json(
        { error: 'Failed to create post', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error('[POSTS_POST] Unexpected error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: errorMessage },
      { status: 500 }
    );
  }
}
