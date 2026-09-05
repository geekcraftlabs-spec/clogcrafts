/* global process */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, owner_price, status } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    await sql`
      UPDATE orders
      SET
        owner_price = ${owner_price || null},
        status = ${status || 'pending'}
      WHERE id = ${id}
    `;
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Update order error:', err);
    return res.status(500).json({ error: 'Failed to update order' });
  }
} 