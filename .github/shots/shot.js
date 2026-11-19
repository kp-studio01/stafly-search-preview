// Real-tile screenshots of the satellite map with several grades, for design review.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const page=process.env.PAGE||'v12/brand/index.html';const b=await chromium.launch();
const V=JSON.parse(fs.readFileSync(__dirname+'/variants.json','utf8'));const out=[];
for(const theme of ['dark','light']) for(const [w,h,d,name] of [[390,844,2,'phone'],[1280,760,1,'desk']]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:d,colorScheme:theme});
  p.on('pageerror',e=>console.log('PAGEERR',e.message));
  await p.addInitScript(t=>{try{localStorage.setItem('stafly_sat','1');localStorage.setItem('stafly_theme',t);}catch(e){}},theme);
  await p.goto('http://localhost:8000/'+page,{waitUntil:'domcontentloaded'});await p.waitForTimeout(9000);
  console.log(name,theme,'ready',await p.evaluate(()=>{try{return ready+' sat'+SAT+' '+JSON.stringify(window.SATG&&SATG[document.body.classList.contains('m-light')?'light':'dark'])}catch(e){return e.message}}));
  for(const v of V[theme]){ if(name==='desk'&&!v.desk)continue;
    await p.evaluate(([t,g])=>{try{if(window.SATG)Object.assign(SATG[t],g);setSat(true);}catch(e){console.log(e.message)}},[theme,v.g||{}]);
    for(const z of (v.zooms||[16])){await p.evaluate(z=>{try{map.jumpTo({center:[4.5262,7.5185],zoom:z,pitch:42,bearing:-18});}catch(e){}},z);await p.waitForTimeout(z===16?5000:7000);
      const f=`shots/${name}-${theme}-${v.id}-z${z}.jpg`;await p.screenshot({path:f,type:'jpeg',quality:88});out.push(f);}}
  await p.close();}
console.log(out.join('\n'));await b.close();})();
