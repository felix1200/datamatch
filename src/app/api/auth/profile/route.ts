import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

// GET /api/auth/profile - Get user profile
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const userId = (request as any).userId;

    // Get user info
    const userResult = await query(
      'SELECT id, email, name, created_at, last_login_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Get subscription info
    const subscriptionResult = await query(
      `SELECT p.name as plan, p.display_name as plan_display_name, s.status, s.billing_cycle, s.current_period_end
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       LIMIT 1`,
      [userId]
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      },
      subscription: subscriptionResult.rows.length > 0 ? {
        plan: subscriptionResult.rows[0].plan,
        planDisplayName: subscriptionResult.rows[0].plan_display_name,
        status: subscriptionResult.rows[0].status,
        billingCycle: subscriptionResult.rows[0].billing_cycle,
        currentPeriodEnd: subscriptionResult.rows[0].current_period_end,
      } : null,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
});

// PUT /api/auth/profile - Update user profile
export const PUT = withAuth(async (request: NextRequest) => {
  try {
    const userId = (request as any).userId;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name',
      [name, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
});
