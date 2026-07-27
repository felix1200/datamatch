import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login time
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Get user's subscription info
    const subscriptionResult = await query(
      `SELECT p.name as plan_name, s.status, s.billing_cycle
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [user.id]
    );

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.email === 'admin@datamatch.com', // Simple admin check
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      subscription: subscriptionResult.rows.length > 0 ? {
        plan: subscriptionResult.rows[0].plan_name,
        status: subscriptionResult.rows[0].status,
        billingCycle: subscriptionResult.rows[0].billing_cycle,
      } : null,
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
