import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/admin/users
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    // Fetch users with their subscription and usage info
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.created_at,
        u.last_login_at,
        p.name as plan,
        p.display_name as plan_display_name,
        s.status as subscription_status,
        COUNT(DISTINCT d.id) as download_count,
        COALESCE(SUM(dp.amount), 0) as total_download_revenue
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      LEFT JOIN plans p ON s.plan_id = p.id
      LEFT JOIN downloads d ON u.id = d.user_id
      LEFT JOIN download_payments dp ON d.id = dp.download_id AND dp.status = 'completed'
      GROUP BY u.id, p.name, p.display_name, s.status
      ORDER BY u.created_at DESC
      LIMIT 100
    `);

    const users = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      name: row.name,
      plan: row.plan || 'none',
      planDisplayName: row.plan_display_name || 'No Plan',
      subscriptionStatus: row.subscription_status || 'none',
      downloadCount: parseInt(row.download_count) || 0,
      totalDownloadRevenue: parseFloat(row.total_download_revenue) || 0,
      lastActive: row.last_login_at || row.created_at,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Update user
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json();
    const { id, plan, status } = body;

    // Get user
    const userResult = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get plan_id if plan is provided
    let planId = null;
    if (plan) {
      const planResult = await query(
        'SELECT id FROM plans WHERE name = $1',
        [plan]
      );
      if (planResult.rows.length > 0) {
        planId = planResult.rows[0].id;
      }
    }

    // Update or create subscription
    if (planId && status) {
      // Check if subscription exists
      const subResult = await query(
        'SELECT id FROM subscriptions WHERE user_id = $1',
        [id]
      );

      if (subResult.rows.length > 0) {
        // Update existing subscription
        await query(
          `UPDATE subscriptions 
           SET plan_id = $1, status = $2, updated_at = NOW()
           WHERE user_id = $3`,
          [planId, status, id]
        );
      } else {
        // Create new subscription
        await query(
          `INSERT INTO subscriptions (user_id, plan_id, status, billing_cycle, current_period_start)
           VALUES ($1, $2, $3, 'monthly', NOW())`,
          [id, planId, status]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `User ${id} updated`,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
