import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { token } = await request.json();

    // Validate token
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Create a response and set the cookie
    const response = NextResponse.json({ 
      message: 'Cookie set successfully' 
    });

    // Set the cookie with appropriate options
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Cookie setting error:', error);
    return NextResponse.json({ 
      error: 'Failed to set cookie' 
    }, { status: 500 });
  }
}
