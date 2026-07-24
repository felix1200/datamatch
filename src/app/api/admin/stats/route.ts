import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    // Get total users
    const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count) || 0;

    // Get active subscriptions count
    const activeSubsResult = await query(
      "SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'"
    );
    const activeSubscriptions = parseInt(activeSubsResult.rows[0].count) || 0;

    // Get user counts by plan
    const planCountsResult = await query(`
      SELECT 
        p.name as plan_name,
        COUNT(DISTINCT u.id) as user_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      LEFT JOIN plans p ON s.plan_id = p.id
      GROUP BY p.name
    `);

    let freeUsers = 0;
    let proUsers = 0;
    let businessUsers = 0;

    for (const row of planCountsResult.rows) {
      const count = parseInt(row.user_count) || 0;
      switch (row.plan_name) {
        case 'free':
          freeUsers = count;
          break;
        case 'pro':
          proUsers = count;
          break;
        case 'business':
          businessUsers = count;
          break;
      }
    }

    // Calculate revenue from active subscriptions
    const revenueResult = await query(`
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN s.billing_cycle = 'monthly' THEN p.price_monthly
            ELSE p.price_yearly / 12.0
          END
        ), 0) as monthly_revenue
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.status = 'active'
    `);
    const monthlyRevenue = parseFloat(revenueResult.rows[0].monthly_revenue) || 0;
    const yearlyRevenue = monthlyRevenue * 12;

    // Get download payment revenue
    const downloadRevenueResult = await query(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM download_payments
      WHERE status = 'completed'
    `);
    const downloadRevenue = parseFloat(downloadRevenueResult.rows[0].total) || 0;

    const stats = {
      totalUsers,
      activeSubscriptions,
      monthlyRevenue: Math.round((monthlyRevenue + downloadRevenue / 12) * 100) / 100,
      yearlyRevenue: Math.round((yearlyRevenue + downloadRevenue) * 100) / 100,
      freeUsers,
      proUsers,
      businessUsers,
      downloadRevenue: Math.round(downloadRevenue * 100) / 100,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
