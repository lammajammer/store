
import {verifyAdmin} from './_auth.js';
export const config={api:{bodyParser:{sizeLimit:'25mb'}}};
export default async function handler(req,res){
  try{
    await verifyAdmin(req);
    if(req.method!=='POST') return res.status(405).json({error:'POST only'});
    // ONE scenario handles every product. Never create a Make scenario per product.
    const r=await fetch(process.env.MAKE_PRODUCT_WEBHOOK_URL,{
      method:'POST',headers:{'Content-Type':'application/json','X-Lamajammer-Secret':process.env.MAKE_SHARED_SECRET},
      body:JSON.stringify(req.body)
    });
    const text=await r.text();
    res.status(r.ok?200:502).setHeader('Content-Type','application/json').send(text||'{"ok":true}');
  }catch(e){res.status(401).json({error:e.message})}
}
