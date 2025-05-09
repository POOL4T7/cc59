import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response to clear the token cookie
    const response = NextResponse.json({
      message: 'Logged out successfully',
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set to past date to delete
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: 'Logout failed',
      },
      { status: 500 }
    );
  }
}
