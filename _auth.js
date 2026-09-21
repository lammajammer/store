import crypto from 'crypto';

const COOKIE_NAME = 'lj_admin';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sign(value) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('hex');
}

export function makeSessionCookie() {
  const payload = String(Date.now());
  const token = `${payload}.${sign(payload)}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function verifyAdmin(req) {
  if (!process.env.ADMIN_SESSION_SECRET) throw new Error('Admin session secret missing');
  const cookie = req.headers.cookie || '';
  const pair = cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE_NAME+'='));
  if (!pair) throw new Error('Unauthorized');

  const token = pair.slice((COOKIE_NAME+'=').length);
  const [payload, sig] = token.split('.');
  if (!payload || !sig) throw new Error('Unauthorized');

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Unauthorized');

  const issued = Number(payload);
  if (!Number.isFinite(issued) || Date.now() - issued > MAX_AGE * 1000) throw new Error('Session expired');
  return true;
}
