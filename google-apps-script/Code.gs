
/*
Google Apps Script bound to Dad's Google Sheet.
Create tabs: Products, Orders, Analytics, Optimizations.
Set Script Property BACKEND_SECRET to the same value used in Vercel GOOGLE_BACKEND_SECRET.
Create Drive folder Lamajammer Product Images and set Script Property IMAGE_FOLDER_ID.
Deploy as Web App: execute as Dad, access Anyone (endpoint protected by secret).
*/
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
function secretOk_(s){return s && s===PropertiesService.getScriptProperties().getProperty('BACKEND_SECRET')}
function tab_(n){return SpreadsheetApp.getActive().getSheetByName(n)}
function rows_(sheet){
 const vals=sheet.getDataRange().getValues(); if(vals.length<2)return [];
 const h=vals[0].map(String); return vals.slice(1).filter(r=>r.some(v=>v!=="")).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))
}
function doGet(e){
 const p=e.parameter||{}; if(!secretOk_(p.secret))return json_({error:'unauthorized'});
 if(p.action==='adminList'){
   const products=rows_(tab_('Products')); const orders=rows_(tab_('Orders'));
   return json_({products:products,stats:{orders:orders.length,revenue:orders.reduce((s,o)=>s+Number(o.amount||0),0)}})
 }
 if(p.action==='getProduct'){
   const product=rows_(tab_('Products')).find(x=>String(x.id)===String(p.id));return json_(product||{error:'not found'})
 }
 return json_({error:'unknown action'})
}
function doPost(e){
 const b=JSON.parse(e.postData.contents||'{}'); if(!secretOk_(b.secret))return json_({error:'unauthorized'});
 if(b.action==='upsertProduct'){return json_(upsertProduct_(b.product))}
 if(b.action==='archive'){return json_(patchProduct_(b.productId,{status:'archived'}))}
 if(b.action==='stripeSale'){
   tab_('Orders').appendRow([b.stripeSessionId,b.paymentIntent,b.productId,b.quantity,b.amount,b.customerEmail,b.customerName,JSON.stringify(b.shipping||{}),new Date()]);
   const p=rows_(tab_('Products')).find(x=>String(x.id)===String(b.productId));
   if(p)patchProduct_(b.productId,{quantity:Math.max(0,Number(p.quantity||0)-Number(b.quantity||1)),status:(Number(p.quantity||0)-Number(b.quantity||1)<=0?'sold':'live')});
   return json_({ok:true})
 }
 return json_({error:'unknown action'})
}
function upsertProduct_(p){
 const sh=tab_('Products'); const vals=sh.getDataRange().getValues(); const h=vals[0].map(String); const idCol=h.indexOf('id'); let row=-1;
 for(let i=1;i<vals.length;i++)if(String(vals[i][idCol])===String(p.id)){row=i+1;break}
 const out=h.map(k=>Array.isArray(p[k])?JSON.stringify(p[k]):(p[k]??''));
 if(row<0)sh.appendRow(out); else sh.getRange(row,1,1,out.length).setValues([out]);
 return {ok:true,id:p.id}
}
function patchProduct_(id,patch){
 const sh=tab_('Products');const vals=sh.getDataRange().getValues();const h=vals[0].map(String);const idCol=h.indexOf('id');
 for(let i=1;i<vals.length;i++)if(String(vals[i][idCol])===String(id)){Object.entries(patch).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)sh.getRange(i+1,c+1).setValue(v)});return {ok:true}}
 return {error:'not found'}
}
