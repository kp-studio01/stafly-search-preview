const {chromium}=require('playwright');
(async()=>{const page=process.env.PAGE||'v12/brand/index.html';const b=await chromium.launch();
const C=(process.env.CENTER||'4.5228,7.5192').split(',').map(Number);const out=[];
for(const theme of ['dark','light']) for(const [w,h,name] of [[1280,760,'desk'],[390,844,'phone']]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,colorScheme:theme});
  p.on('pageerror',e=>console.log('PAGEERR',e.message));
  await p.addInitScript(t=>{try{localStorage.setItem('stafly_sat','0');localStorage.setItem('stafly_theme',t);}catch(e){}},theme);
  await p.goto('http://localhost:8000/'+page,{waitUntil:'domcontentloaded'});await p.waitForTimeout(6000);
  for(const z of [16.2,17.3]){await p.evaluate(([c,z])=>{try{map.jumpTo({center:c,zoom:z,pitch:50,bearing:-20});}catch(e){}},[C,z]);await p.waitForTimeout(6000);
    const f=`shots/${name}-${theme}-z${z}.png`;await p.screenshot({path:f});out.push(f);}
  if(name==='desk'&&theme==='dark')console.log('layers',await p.evaluate(()=>map.getStyle().layers.map(l=>l.id).join(',')));
  await p.close();}
console.log(out.join('\n'));await b.close();})();
