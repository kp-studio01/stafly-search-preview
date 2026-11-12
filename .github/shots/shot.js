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
  try{await p.evaluate(()=>m2Nav({t:'explore',dir:V.find(v=>v.ll).id}));await p.waitForTimeout(4000);await p.screenshot({path:`shots/${name}-${theme}-dir.png`});await p.click('#mDir .dir-go');await p.waitForTimeout(4500);await p.keyboard.down('ArrowUp');await p.waitForTimeout(1800);await p.keyboard.up('ArrowUp');await p.waitForTimeout(3500);
    const f=`shots/${name}-${theme}-walk.png`;await p.screenshot({path:f});out.push(f);await p.evaluate(()=>staflyWalk.stop());await p.waitForTimeout(1500);await p.evaluate(()=>history.back());await p.waitForTimeout(800);}catch(e){console.log('walkerr',e.message);}
  try{await p.evaluate(([c,t])=>{window.__m220h=t==='dark'?21:18;m220Day(true);map.jumpTo({center:c,zoom:16.6,pitch:50,bearing:-20});},[C,theme]);await p.waitForTimeout(5000);
    await p.screenshot({path:`shots/${name}-${theme}-time.png`});
    const pt=await p.evaluate(()=>{const W=innerWidth,H=innerHeight;for(let y=H*.35;y<H*.75;y+=12)for(let x=W*.45;x<W*.9;x+=12){const f=map.queryRenderedFeatures([x,y],{layers:['lmk','bld'].filter(i=>map.getLayer(i))});if(f.length)return [x,y];}return null;});
    console.log('ids',await p.evaluate(()=>map.queryRenderedFeatures({layers:['bld']}).slice(0,5).map(f=>f.id).join(',')));if(pt){await p.mouse.click(pt[0],pt[1]);await p.waitForTimeout(900);console.log('card',name,theme,await p.evaluate(()=>document.getElementById('m220c').className+' '+document.getElementById('m220c').textContent));await p.screenshot({path:`shots/${name}-${theme}-tap.png`});}}catch(e){console.log('timeerr',e.message);}
  if(name==='desk'&&theme==='dark')console.log('trees',await p.evaluate(()=>{try{return map.getSource('m217t')._data.features.length}catch(e){return e.message}}),'layers',await p.evaluate(()=>map.getStyle().layers.map(l=>l.id).join(',')));
  await p.close();}
console.log(out.join('\n'));await b.close();})();
