import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users
export async function GET(request: NextRequest) {
  // TODO: Add authentication check
  // TODO: Fetch from database

  // Mock data
  const users = [
    {
      id: '1',
      email: 'user1@example.com',
      plan: 'pro',
      usageCount: 15,
      lastActive: '2024-03-15',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      email: 'user2@example.com',
      plan: 'business',
      usageCount: 42,
      lastActive: '2024-03-14',
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      email: 'user3@example.com',
      plan: 'free',
      usageCount: 3,
      lastActive: '2024-03-10',
      createdAt: '2024-03-10',
    },
  ];

  return NextResponse.json({ users });
}

// POST /api/admin/users - Update user
export async function POST(request: NextRequest) {
  // TODO: Add authentication check
  // TODO: Update user in database

  const body = await request.json();
  const { id, plan, status } = body;

  // Mock update
  return NextResponse.json({
    success: true,
    message: `User ${id} updated`,
  });
}
