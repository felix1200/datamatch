import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/downloads - Check if a file has been downloaded by a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const fileHash = searchParams.get('fileHash');

    if (!userId || !fileHash) {
      return NextResponse.json(
        { error: 'userId and fileHash are required' },
        { status: 400 }
      );
    }

    // Check if the file has been downloaded by this user
    const result = await query(
      `SELECT id, file_name, file_size, row_count, created_at 
       FROM downloads 
       WHERE user_id = $1 AND file_hash = $2`,
      [userId, fileHash]
    );

    if (result.rows.length > 0) {
      // File has been downloaded before - free download
      return NextResponse.json({
        downloaded: true,
        download: result.rows[0],
        needsPayment: false,
      });
    }

    // File has not been downloaded - check user's subscription
    const subscriptionResult = await query(
      `SELECT s.id, p.name as plan_name, p.downloads_included
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [userId]
    );

    if (subscriptionResult.rows.length > 0) {
      const subscription = subscriptionResult.rows[0];
      if (subscription.downloads_included) {
        // Pro/Business user - downloads included
        return NextResponse.json({
          downloaded: false,
          needsPayment: false,
          subscription: {
            plan: subscription.plan_name,
            downloadsIncluded: true,
          },
        });
      }
    }

    // Free user - needs to pay
    return NextResponse.json({
      downloaded: false,
      needsPayment: true,
      price: 2.00, // $2 per download
      currency: 'USD',
    });
  } catch (error) {
    console.error('Error checking download status:', error);
    return NextResponse.json(
      { error: 'Failed to check download status' },
      { status: 500 }
    );
  }
}

// POST /api/downloads - Record a download (after payment or for subscription users)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fileHash, fileName, fileSize, rowCount, paymentId } = body;

    if (!userId || !fileHash || !fileName) {
      return NextResponse.json(
        { error: 'userId, fileHash, and fileName are required' },
        { status: 400 }
      );
    }

    // Insert download record
    const result = await query(
      `INSERT INTO downloads (user_id, file_hash, file_name, file_size, row_count)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, file_hash) DO UPDATE 
       SET file_name = EXCLUDED.file_name,
           file_size = EXCLUDED.file_size,
           row_count = EXCLUDED.row_count
       RETURNING id, created_at`,
      [userId, fileHash, fileName, fileSize || 0, rowCount || 0]
    );

    // If there's a payment, link it to the download
    if (paymentId) {
      await query(
        `UPDATE download_payments 
         SET download_id = $1, status = 'completed'
         WHERE id = $2`,
        [result.rows[0].id, paymentId]
      );
    }

    return NextResponse.json({
      success: true,
      download: result.rows[0],
    });
  } catch (error) {
    console.error('Error recording download:', error);
    return NextResponse.json(
      { error: 'Failed to record download' },
      { status: 500 }
    );
  }
}
