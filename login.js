import {makeSessionCookie} from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  const {password=''} = req.body || {};
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({error:'ADMIN_PASSWORD missing'});
  if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({error:'Wrong password'});
  res.setHeader('Set-Cookie', makeSessionCookie());
  res.status(200).json({ok:true});
}
