import { verifyAdmin } from './_auth.js';

export default async function handler(req, res) {
  try {
    await verifyAdmin(req);

    // Tonight/demo mode:
    // The admin UI uses /data/products.json for the visible sample inventory.
    // If the Google backend is not connected yet, a valid session should still
    // be allowed into the dashboard.
    const backendUrl = String(process.env.GOOGLE_BACKEND_URL || '').trim();
    const backendSecret = String(process.env.GOOGLE_BACKEND_SECRET || '').trim();

    if (!backendUrl || !backendSecret) {
      return res.status(200).json({
        ok: true,
        mode: 'demo',
        products: []
      });
    }

    const url =
      backendUrl +
      '?action=adminList&secret=' +
      encodeURIComponent(backendSecret);

    const r = await fetch(url);
    const text = await r.text();

    res.status(r.ok ? 200 : 502);
    res.setHeader('Content-Type', 'application/json');

    try {
      return res.json(JSON.parse(text));
    } catch {
      return res.json({
        ok: false,
        error: 'Google backend returned a non-JSON response.'
      });
    }
  } catch (e) {
    return res.status(401).json({
      error: e?.message || 'Unauthorized'
    });
  }
}
