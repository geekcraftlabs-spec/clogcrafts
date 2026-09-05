/* eslint-disable no-undef */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { whatsapp } = req.body;
  if (!whatsapp) {
    return res.status(400).json({ error: 'WhatsApp number is required' });
  }

  const cleaned = whatsapp.replace(/\D/g, '');
  if (cleaned.length < 10 || cleaned.length > 15) {
    return res.status(400).json({ error: 'Invalid WhatsApp number' });
  }

  try {
    await sql`
      INSERT INTO clogcrafts.waitlist (whatsapp, project)
      VALUES (${cleaned}, 'clogcrafts')
      ON CONFLICT (whatsapp) DO NOTHING
    `;
    return res.status(200).json({ success: true, message: 'You are on the waitlist!' });
  } catch (err) {
    console.error('Waitlist insert error:', err);
    return res.status(500).json({ error: 'Failed to save' });
  }
}