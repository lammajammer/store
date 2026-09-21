
export async function verifyAdmin(req){
  const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');
  if(!token) throw new Error('Unauthorized');
  const r=await fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(token));
  if(!r.ok) throw new Error('Unauthorized');
  const info=await r.json();
  if(info.aud!==process.env.GOOGLE_CLIENT_ID) throw new Error('Wrong Google client');
  if(String(info.email||'').toLowerCase()!==String(process.env.ADMIN_EMAIL||'').toLowerCase()) throw new Error('Not allowed');
  return info;
}
