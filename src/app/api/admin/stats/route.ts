import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/stats
export async function GET(request: NextRequest) {
  // TODO: Add authentication check
  // TODO: Fetch from database

  // Mock data
  const stats = {
    totalUsers: 150,
    activeSubscriptions: 45,
    monthlyRevenue: 580,
    yearlyRevenue: 6960,
    freeUsers: 105,
    proUsers: 30,
    businessUsers: 15,
  };

  return NextResponse.json({ stats });
}
