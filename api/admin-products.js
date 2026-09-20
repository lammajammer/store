
import {verifyAdmin} from './_auth.js';
export default async function handler(req,res){
  try{
    await verifyAdmin(req);
    const r=await fetch(process.env.GOOGLE_BACKEND_URL+'?action=adminList&secret='+encodeURIComponent(process.env.GOOGLE_BACKEND_SECRET));
    const text=await r.text();res.status(r.ok?200:500).setHeader('Content-Type','application/json').send(text);
  }catch(e){res.status(401).json({error:e.message})}
}
