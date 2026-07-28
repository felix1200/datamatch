import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';

// POST /api/auth/admin-login - Admin login with password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Generate admin JWT token
    const token = generateToken({
      userId: 'admin',
      email: 'admin@datamatch.com',
      isAdmin: true,
    });

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
