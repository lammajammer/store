
import Stripe from 'stripe';
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  try{
    const {productId,quantity=1}=req.body||{};
    const r=await fetch(process.env.GOOGLE_BACKEND_URL+'?action=getProduct&id='+encodeURIComponent(productId)+'&secret='+encodeURIComponent(process.env.GOOGLE_BACKEND_SECRET));
    const p=await r.json();
    if(!p||p.error||p.status!=='live')return res.status(404).json({error:'Product unavailable'});
    const q=Math.max(1,Math.min(Number(quantity),Number(p.quantity)));
    if(!q||Number(p.quantity)<q)return res.status(409).json({error:'Not enough inventory'});
    const base=(process.env.PUBLIC_BASE_URL||('https://'+req.headers.host)).replace(/\/$/,'');
    const session=await stripe.checkout.sessions.create({
      mode:'payment',
      line_items:[{quantity:q,price_data:{currency:'usd',unit_amount:Math.round(Number(p.price)*100),product_data:{name:p.title,images:(p.images||[]).slice(0,1)}}}],
      shipping_address_collection:{allowed_countries:['US']},
      customer_creation:'always',
      success_url:base+'/success/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url:base+'/cancel/',
      metadata:{product_id:p.id,quantity:String(q)}
    });
    res.status(200).json({url:session.url});
  }catch(e){res.status(500).json({error:e.message})}
}
