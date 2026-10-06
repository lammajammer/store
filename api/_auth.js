import crypto from 'crypto';

const COOKIE_NAME = 'lj_admin';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(){
  return String(process.env.ADMIN_SESSION_SECRET || '').trim();
}

function sign(value){
  const s = secret();
  if(!s) throw new Error('ADMIN_SESSION_SECRET is missing in Vercel.');
  return crypto.createHmac('sha256', s).update(value).digest('hex');
}

function parseCookies(req){
  const header = String(req.headers.cookie || '');
  const out = {};
  for(const part of header.split(';')){
    const i = part.indexOf('=');
    if(i < 0) continue;
    const k = part.slice(0,i).trim();
    const v = part.slice(i+1).trim();
    if(k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export function makeSessionCookie(){
  const issued = String(Date.now());
  const token = `${issued}.${sign(issued)}`;
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie(){
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}

export async function verifyAdmin(req){
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];

  if(!token) throw new Error('Unauthorized');

  const [issued, sig] = token.split('.');
  if(!issued || !sig) throw new Error('Unauthorized');

  const expected = sign(issued);

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);

  if(a.length !== b.length || !crypto.timingSafeEqual(a,b)){
    throw new Error('Unauthorized');
  }

  const ageMs = Date.now() - Number(issued);
  if(!Number.isFinite(ageMs) || ageMs < 0 || ageMs > MAX_AGE * 1000){
    throw new Error('Session expired');
  }

  return { ok: true };
}
