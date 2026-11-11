const {chromium}=require('playwright');
(async()=>{const page=process.env.PAGE||'v12/brand/index.html';const b=await chromium.launch();
const out=[];
for(const theme of ['dark','light']) for(const [w,h,name] of [[1280,760,'desk'],[390,844,'phone']]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2,colorScheme:theme});
  await p.addInitScript(t=>{try{localStorage.setItem('stafly_sat','0');localStorage.setItem('stafly_theme',t);}catch(e){}},theme);
  await p.goto('http://localhost:8000/'+page,{waitUntil:'domcontentloaded'});await p.waitForTimeout(6000);
  await p.evaluate(()=>{try{document.body.classList.remove('m-pgon');}catch(e){}});
  for(const z of [15.6,16.8]){await p.evaluate(z=>{try{map.jumpTo({zoom:z});}catch(e){}},z);await p.waitForTimeout(5000);
    const f=`shots/${name}-${theme}-z${z}.png`;await p.screenshot({path:f});out.push(f);}
  await p.close();}
console.log(out.join('\n'));await b.close();})();
