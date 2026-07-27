import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware';

// GET /api/user/history - Get user's download history
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const userId = (request as any).userId;

    // Get download history
    const result = await query(
      `SELECT d.id, d.file_name, d.file_size, d.row_count, d.created_at,
              dp.amount, dp.status as payment_status
       FROM downloads d
       LEFT JOIN download_payments dp ON d.id = dp.download_id
       WHERE d.user_id = $1
       ORDER BY d.created_at DESC
       LIMIT 50`,
      [userId]
    );

    const history = result.rows.map(row => ({
      id: row.id,
      fileName: row.file_name,
      fileSize: parseInt(row.file_size) || 0,
      rowCount: parseInt(row.row_count) || 0,
      createdAt: row.created_at,
      amount: parseFloat(row.amount) || 0,
      paymentStatus: row.payment_status || 'free',
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
});
