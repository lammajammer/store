
import Stripe from 'stripe';
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
export const config={api:{bodyParser:false}};
async function getRawBody(req){const chunks=[];for await(const c of req)chunks.push(typeof c==='string'?Buffer.from(c):c);return Buffer.concat(chunks)}
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const raw=await getRawBody(req);
  const event=stripe.webhooks.constructEvent(raw,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);
  if(event.type==='checkout.session.completed'){
    const s=event.data.object;
    await fetch(process.env.GOOGLE_BACKEND_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      secret:process.env.GOOGLE_BACKEND_SECRET,action:'stripeSale',stripeSessionId:s.id,paymentIntent:s.payment_intent,
      productId:s.metadata?.product_id,quantity:Number(s.metadata?.quantity||1),amount:Number(s.amount_total||0)/100,
      customerEmail:s.customer_details?.email||'',customerName:s.customer_details?.name||'',shipping:s.shipping_details||null
    })});
    if(process.env.MAKE_SALE_WEBHOOK_URL) await fetch(process.env.MAKE_SALE_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'sale',session:s})});
  }
  res.status(200).json({received:true});
 }catch(e){res.status(400).send('Webhook error: '+e.message)}
}
