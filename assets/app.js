
const CFG = {
  productsUrl: '/data/products.json',
  checkoutEndpoint: '/api/create-checkout',
  adminPublishEndpoint: '/api/publish-product',
  adminListEndpoint: '/api/admin-products',
  allowedAdminEmail: window.LAMAJAMMER_ADMIN_EMAIL || ''
};
let PRODUCTS=[];
async function loadProducts(){
  try{
    const r=await fetch(CFG.productsUrl+'?v='+Date.now(),{cache:'no-store'});
    PRODUCTS=await r.json();
    return PRODUCTS;
  }catch(e){console.error(e);return []}
}
function money(v){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v||0))}
function safe(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function card(p){
  const img=p.images?.[0]?`<img loading="lazy" src="${safe(p.images[0])}" alt="${safe(p.title)}">`:`<div class="placeholder">LC</div>`;
  return `<article class="card" data-category="${safe(p.category)}" data-league="${safe(p.league)}">
    <a href="/product/?id=${encodeURIComponent(p.id)}"><div class="cardImg">${img}<span class="badge">${safe(p.league||p.category)}</span></div></a>
    <div class="cardBody"><div class="meta">${safe(p.team||p.category)}</div><h3>${safe(p.title)}</h3>
    <div class="row"><span class="price">${money(p.price)}</span><a class="textlink" href="/product/?id=${encodeURIComponent(p.id)}">View →</a></div></div>
  </article>`
}
async function renderFeatured(){
  const el=document.querySelector('[data-featured]'); if(!el)return;
  const ps=(await loadProducts()).filter(p=>p.status==='live'&&p.featured&&p.category!=='Miscellaneous');
  el.innerHTML=ps.map(card).join('')||'<p class="small">Products will appear here when published.</p>';
}
async function renderShop(){
  const el=document.querySelector('[data-shop-grid]'); if(!el)return;
  const ps=(await loadProducts()).filter(p=>p.status==='live'&&p.category!=='Miscellaneous');
  el.innerHTML=ps.map(card).join('');
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const f=b.dataset.filter;
    [...el.children].forEach(c=>c.classList.toggle('hidden',f!=='All'&&c.dataset.category!==f&&c.dataset.league!==f));
  }));
}
async function renderProduct(){
  const root=document.querySelector('[data-product-root]'); if(!root)return;
  const id=new URLSearchParams(location.search).get('id');
  const ps=await loadProducts(); const p=ps.find(x=>x.id===id);
  if(!p){root.innerHTML='<div class="panel"><h1>Product not found</h1><p class="small">This item may have sold or been archived.</p></div>';return}
  document.title=p.title+' | Lamajammer Collectibles';
  const imgs=(p.images?.length?p.images:['']).map((src,i)=>src?`<button data-src="${safe(src)}"><img src="${safe(src)}" alt="${safe(p.title)} photo ${i+1}"></button>`:'').join('');
  const main=p.images?.[0]?`<img id="mainImg" src="${safe(p.images[0])}" alt="${safe(p.title)}">`:`<div class="placeholder">LC</div>`;
  root.innerHTML=`<div><div class="galleryMain">${main}</div><div class="thumbs">${imgs}</div></div>
  <div class="productInfo"><div class="eyebrow">${safe(p.league||p.category)} · ${safe(p.team||'Collectible')}</div>
  <h1>${safe(p.title)}</h1><div class="price" style="font-size:24px">${money(p.price)}</div>
  <p class="desc">${safe(p.description)}</p><div class="divider"></div>
  <label class="label">Quantity</label><input class="input qty" id="qty" type="number" min="1" max="${Number(p.quantity||1)}" value="1">
  <div class="actions"><button class="btn" id="buyBtn" ${p.quantity<1?'disabled':''}>${p.quantity<1?'Sold out':'Secure checkout'}</button></div>
  <p class="small">Final shipping cost and taxes are shown at checkout. Product facts should match the physical item exactly.</p></div>`;
  document.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>{const m=document.getElementById('mainImg');if(m)m.src=b.dataset.src});
  const buy=document.getElementById('buyBtn'); if(buy)buy.onclick=async()=>{
    buy.disabled=true;buy.textContent='Opening checkout…';
    try{
      const r=await fetch(CFG.checkoutEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:p.id,quantity:Number(document.getElementById('qty').value||1)})});
      const j=await r.json(); if(!r.ok)throw new Error(j.error||'Checkout failed'); location.href=j.url;
    }catch(e){alert(e.message);buy.disabled=false;buy.textContent='Secure checkout'}
  }
}
renderFeatured();renderShop();renderProduct();
