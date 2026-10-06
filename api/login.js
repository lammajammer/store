import { makeSessionCookie } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const configuredPassword = String(process.env.ADMIN_PASSWORD || '').trim();
  const sessionSecret = String(process.env.ADMIN_SESSION_SECRET || '').trim();
  const submittedPassword = String((req.body || {}).password || '').trim();

  if (!configuredPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is missing in Vercel.' });
  }

  if (!sessionSecret) {
    return res.status(500).json({ error: 'ADMIN_SESSION_SECRET is missing in Vercel.' });
  }

  if (submittedPassword !== configuredPassword) {
    return res.status(401).json({ error: 'Wrong password.' });
  }

  res.setHeader('Set-Cookie', makeSessionCookie());
  return res.status(200).json({ ok: true });
}
