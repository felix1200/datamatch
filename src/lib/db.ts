import { Pool } from 'pg';

// Database connection configuration
// Use environment variable in production, fallback to provided connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://USER:PASSWORD@HOST/DB';

// Create a connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Query helper function
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

// Get pool for direct access if needed
export function getPool() {
  return pool;
}

// Close pool (for cleanup)
export async function closePool() {
  await pool.end();
}

// Health check
export async function healthCheck() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return { success: true, timestamp: result.rows[0].now };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export default pool;
