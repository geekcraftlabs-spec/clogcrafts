/* eslint-disable no-undef */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const generateShortCode = async () => {
  const result = await sql`SELECT COUNT(*) FROM orders WHERE project = 'clogcrafts'`;
  const count = parseInt(result[0].count) + 1;
  return `CLOG-${String(count).padStart(3, '0')}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    mode,
    customerName,
    color,
    mainPatches,
    addons,
    letterPatches,
    initials,
    fontStyle,
    whatsapp,
    screenshotUrl,
    productId,
  } = req.body;

  if (!screenshotUrl && mode === 'custom') {
    return res.status(400).json({ error: 'Screenshot URL is required for custom orders' });
  }

  const shortCode = await generateShortCode();

  try {
    await sql`
      INSERT INTO orders (
        short_code,
        mode,
        customer_name,
        color,
        main_patches,
        addons,
        letter_patches,
        initials,
        font_style,
        whatsapp,
        screenshot_url,
        product_id,
        status,
        created_at,
        project
      )
      VALUES (
        ${shortCode},
        ${mode},
        ${customerName || null},
        ${color},
        ${mainPatches || []},
        ${addons || []},
        ${letterPatches || []},
        ${initials || 'None'},
        ${fontStyle || 'normal'},
        ${whatsapp},
        ${screenshotUrl || null},
        ${productId || null},
        'pending',
        NOW(),
        'clogcrafts'
      )
    `;
    return res.status(200).json({ success: true, shortCode });
  } catch (err) {
    console.error('DB insert error:', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }
}