/* eslint-disable no-undef */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const entries = await sql`
      SELECT * FROM waitlist
      WHERE project = 'clogcrafts'
      ORDER BY created_at DESC
    `;
    return res.status(200).json(entries);
  } catch (err) {
    console.error('Get waitlist error:', err);
    return res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
}