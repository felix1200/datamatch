import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/subscriptions
export async function GET(request: NextRequest) {
  // TODO: Add authentication check
  // TODO: Fetch from database

  // Mock data
  const subscriptions = [
    {
      id: '1',
      email: 'user1@example.com',
      plan: 'pro',
      status: 'active',
      createdAt: '2024-01-15',
      expiresAt: '2025-01-15',
      monthlyRevenue: 9,
    },
    {
      id: '2',
      email: 'user2@example.com',
      plan: 'business',
      status: 'active',
      createdAt: '2024-02-01',
      expiresAt: '2025-02-01',
      monthlyRevenue: 29,
    },
    {
      id: '3',
      email: 'user3@example.com',
      plan: 'free',
      status: 'active',
      createdAt: '2024-03-10',
      expiresAt: null,
      monthlyRevenue: 0,
    },
  ];

  return NextResponse.json({ subscriptions });
}

// POST /api/admin/subscriptions - Update subscription
export async function POST(request: NextRequest) {
  // TODO: Add authentication check
  // TODO: Update subscription in database

  const body = await request.json();
  const { id, plan, status } = body;

  // Mock update
  return NextResponse.json({
    success: true,
    message: `Subscription ${id} updated to ${plan} plan with status ${status}`,
  });
}
