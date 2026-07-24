import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/admin/subscriptions
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    // Fetch subscriptions with user and plan info
    const result = await query(`
      SELECT 
        s.id,
        u.email,
        p.name as plan,
        p.display_name as plan_display_name,
        s.status,
        s.billing_cycle,
        s.current_period_start,
        s.current_period_end,
        s.created_at,
        CASE 
          WHEN s.billing_cycle = 'monthly' THEN p.price_monthly
          ELSE p.price_yearly
        END as revenue
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN plans p ON s.plan_id = p.id
      ORDER BY s.created_at DESC
      LIMIT 100
    `);

    const subscriptions = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      plan: row.plan,
      planDisplayName: row.plan_display_name,
      status: row.status,
      billingCycle: row.billing_cycle,
      createdAt: row.current_period_start,
      expiresAt: row.current_period_end,
      revenue: parseFloat(row.revenue) || 0,
    }));

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/subscriptions - Update subscription
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json();
    const { id, plan, status } = body;

    // Get plan_id from plan name
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

    // Update subscription
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (planId) {
      updates.push(`plan_id = $${paramCount++}`);
      values.push(planId);
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const updateQuery = `
      UPDATE subscriptions 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, status, updated_at
    `;

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
