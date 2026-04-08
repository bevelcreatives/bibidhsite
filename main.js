/* ── AUDIO ENGINE ── */
const AC=new(window.AudioContext||window.webkitAudioContext)();
function sfx(type){
  if(AC.state==='suspended')AC.resume();
  const o=AC.createOscillator(),g=AC.createGain();
  o.connect(g);g.connect(AC.destination);
  if(type==='hover'){
    o.type='sine';o.frequency.setValueAtTime(880,AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(1100,AC.currentTime+0.06);
    g.gain.setValueAtTime(0.04,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.08);
    o.start();o.stop(AC.currentTime+0.08);
  } else if(type==='click'){
    o.type='square';o.frequency.setValueAtTime(440,AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(220,AC.currentTime+0.12);
    g.gain.setValueAtTime(0.07,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.14);
    o.start();o.stop(AC.currentTime+0.14);
  } else if(type==='open'){
    o.type='triangle';o.frequency.setValueAtTime(300,AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(600,AC.currentTime+0.18);
    g.gain.setValueAtTime(0.06,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.22);
    o.start();o.stop(AC.currentTime+0.22);
  }
}
/* attach sounds */
document.addEventListener('mouseover',e=>{
  const t=e.target.closest('button,a,[data-popup],[data-close],.snav,.hbtn,.blog-entry,.ld-play');
  if(t)sfx('hover');
},{passive:true});
document.addEventListener('click',e=>{
  const t=e.target.closest('button,a,[data-popup],[data-close],.snav,.hbtn,.blog-entry,.ld-play');
  if(t)sfx('click');
},{passive:true});

/* ── CUSTOM CURSOR ── */
const cur=document.getElementById('sci-cursor');
document.addEventListener('mousemove',e=>{
  cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';
},{passive:true});

/* ── HEX BACKGROUND (interactive beehive) ── */
(function(){
  const cv=document.getElementById('hex-bg');
  const ctx=cv.getContext('2d');
  const R=28,mouse={x:-9999,y:-9999};
  let W,H,cols,rows;
  function resize(){
    W=cv.width=innerWidth;H=cv.height=innerHeight;
    cols=Math.ceil(W/(R*1.5))+2;
    rows=Math.ceil(H/(R*Math.sqrt(3)))+2;
  }
  window.addEventListener('resize',resize);
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
  function drawHex(x,y,op,col){
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a=i*Math.PI/3;
      ctx[i?'lineTo':'moveTo'](x+R*Math.cos(a),y+R*Math.sin(a));
    }
    ctx.closePath();
    ctx.strokeStyle=col||`rgba(0,245,255,${op})`;
    ctx.lineWidth=1;ctx.stroke();
    if(op>0.12){
      ctx.fillStyle=`rgba(0,245,255,${op*0.07})`;ctx.fill();
    }
  }
  function frame(){
    ctx.clearRect(0,0,W,H);
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const x=c*R*1.5;
        const y=r*R*Math.sqrt(3)+(c%2?R*Math.sqrt(3)/2:0);
        const dist=Math.hypot(x-mouse.x,y-mouse.y);
        let op=0.04;
        let col=null;
        if(dist<120){
          const t=1-dist/120;
          op=0.04+t*0.45;
          /* color shifts from cyan to green/magenta based on distance */
          const g=Math.floor(t*255);
          col=`rgba(0,${200+g*0.2},${255-g*0.5},${op})`;
        }
        drawHex(x,y,op,col);
      }
    }
    requestAnimationFrame(frame);
  }
  resize();frame();
})();

/* ── LOADING SEQUENCE ── */
(function(){
  const SEGS=12,barOuter=document.getElementById('ld-bar-outer'),segs=[];
  for(let i=0;i<SEGS;i++){const s=document.createElement('div');s.className='ld-seg';barOuter.appendChild(s);segs.push(s);}
  const pctEl=document.getElementById('ld-pct'),statusEl=document.getElementById('ld-status'),
        ldTimeEl=document.getElementById('ld-time'),playBtn=document.getElementById('play-btn'),
        pressEl=document.getElementById('ld-press');
  const msgs=['INITIALIZING SYSTEMS','LOADING ASSETS','CALIBRATING HUD','SYNCING DATA','REVIVAL ENGINE ONLINE','SYSTEM READY'];
  let pct=0,seg=0,dotCount=0,msgIdx=0;
  function updateTime(){const n=new Date();ldTimeEl.textContent=n.getFullYear()+'.'+String(n.getMonth()+1).padStart(2,'0')+'.'+String(n.getDate()).padStart(2,'0')+' — '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');}
  updateTime();setInterval(updateTime,1000);
  const dotIv=setInterval(()=>{dotCount=(dotCount+1)%8;statusEl.textContent=(msgs[msgIdx]||msgs[msgs.length-1])+' .'.repeat(dotCount);},220);
  const iv=setInterval(()=>{
    pct+=Math.floor(Math.random()*4)+1;if(pct>100)pct=100;
    pctEl.textContent=pct+'%';
    const ns=Math.floor(pct/100*SEGS);while(seg<ns&&seg<SEGS){segs[seg].classList.add('on');seg++;}
    msgIdx=Math.floor(pct/(100/(msgs.length-1)));
    if(pct>=100){clearInterval(iv);clearInterval(dotIv);statusEl.textContent='SYSTEM READY';
      setTimeout(()=>{const fl=document.getElementById('flash');fl.classList.add('on');setTimeout(()=>fl.classList.remove('on'),120);setTimeout(()=>{playBtn.classList.add('show');pressEl.classList.add('show');},200);},400);}
  },60);
  playBtn.addEventListener('click',()=>{
    sfx('open');
    const fl=document.getElementById('flash');fl.classList.add('on');
    setTimeout(()=>fl.classList.remove('on'),100);
    setTimeout(()=>{document.getElementById('loader').classList.add('out');document.getElementById('game-screen').classList.add('active');},120);
  });
})();

/* ── HUD FRAME ── */
(function(){
  const svg=document.getElementById('hud-frame'),W=innerWidth,H=innerHeight;
  const C='rgba(0,245,255,0.32)',C2='rgba(0,245,255,0.13)',L=48;
  const paths=[`M0,${L} L0,0 L${L},0`,`M0,${L+18} L0,${L+8}`,`M${L+18},0 L${L+8},0`,
    `M${W-L},0 L${W},0 L${W},${L}`,`M${W},${L+18} L${W},${L+8}`,`M${W-L-18},0 L${W-L-8},0`,
    `M0,${H-L} L0,${H} L${L},${H}`,`M0,${H-L-18} L0,${H-L-8}`,`M${L+18},${H} L${L+8},${H}`,
    `M${W-L},${H} L${W},${H} L${W},${H-L}`,`M${W},${H-L-18} L${W},${H-L-8}`,`M${W-L-18},${H} L${W-L-8},${H}`];
  const ticks=[`M${W/2-55},0 L${W/2-55},5`,`M${W/2+55},0 L${W/2+55},5`,`M${W/2-90},0 L${W/2-90},3`,`M${W/2+90},0 L${W/2+90},3`,`M${W/2-55},${H} L${W/2-55},${H-5}`,`M${W/2+55},${H} L${W/2+55},${H-5}`];
  let d='';
  paths.forEach((p,i)=>d+=`<path d="${p}" stroke="${i%3===0?C:C2}" stroke-width="${i%3===0?2:1}" fill="none"/>`);
  ticks.forEach(p=>d+=`<path d="${p}" stroke="${C2}" stroke-width="1" fill="none"/>`);
  d+=`<circle cx="0" cy="0" r="3" fill="${C}"/><circle cx="${W}" cy="0" r="3" fill="${C}"/><circle cx="0" cy="${H}" r="3" fill="${C}"/><circle cx="${W}" cy="${H}" r="3" fill="${C}"/>`;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=d;
})();

/* ── CLOCK ── */
setInterval(()=>{const n=new Date(),c=document.getElementById('bar-clock');if(c)c.textContent=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');},1000);

/* ── POPUP SYSTEM ── */
function openPopup(id){
  document.querySelectorAll('.popup-overlay').forEach(p=>p.classList.remove('open'));
  const el=document.getElementById('popup-'+id);
  if(el){el.classList.add('open');sfx('open');}
  document.querySelectorAll('[data-popup]').forEach(a=>a.classList.toggle('active',a.dataset.popup===id));
}
function closePopup(id){const el=document.getElementById('popup-'+id);if(el)el.classList.remove('open');}
document.querySelectorAll('[data-popup]').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();openPopup(btn.dataset.popup);
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('is-open');
  });
});
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closePopup(btn.dataset.close)));
document.querySelectorAll('.popup-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.popup-overlay').forEach(p=>p.classList.remove('open'));});

/* ── HAMBURGER ── */
const ham=document.getElementById('hamburger'),mm=document.getElementById('mobile-menu');
ham.addEventListener('click',()=>{const o=mm.classList.toggle('open');ham.classList.toggle('is-open',o);});

/* ── GLOBE v2 (stable, land-outline orthographic globe) ── */
(function(){
  const cv=document.getElementById('globe-canvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');

  /* Simplified continent outlines as [lat,lng] rings */
  const LAND=[
    /* North America */
    [[70,-140],[60,-137],[55,-130],[50,-126],[48,-124],[43,-124],[38,-122],
     [32,-117],[30,-110],[22,-105],[18,-103],[15,-90],[16,-89],[17,-91],
     [21,-87],[21,-90],[23,-90],[23,-87],[22,-80],[25,-80],[31,-81],
     [35,-75],[39,-74],[42,-70],[44,-66],[47,-53],[50,-56],[53,-55],
     [57,-62],[62,-63],[63,-68],[66,-62],[68,-53],[70,-25],[73,-23],
     [78,-18],[83,-25],[83,-100],[80,-145],[74,-160],[71,-156],[70,-140]],
    /* Greenland */
    [[83,-60],[80,-73],[76,-75],[73,-55],[72,-27],[75,-18],[78,-17],[82,-24],[83,-60]],
    /* South America */
    [[12,-72],[10,-62],[8,-60],[4,-52],[2,-51],[0,-50],[-5,-35],
     [-10,-37],[-20,-40],[-23,-43],[-33,-53],[-38,-57],[-46,-65],
     [-52,-68],[-55,-65],[-52,-75],[-46,-75],[-38,-73],[-33,-71],
     [-22,-70],[-18,-70],[-14,-75],[-8,-78],[-4,-80],[0,-80],[4,-77],[8,-77],[12,-72]],
    /* Europe */
    [[71,28],[69,30],[65,25],[60,25],[58,22],[56,15],[56,8],[56,3],
     [52,-2],[50,-5],[44,-2],[44,8],[43,16],[41,13],[38,15],
     [42,18],[44,20],[46,15],[48,18],[50,18],[54,18],[55,21],
     [59,24],[60,25],[63,22],[68,20],[70,25],[71,28]],
    /* UK */
    [[58,-3],[57,-6],[55,-6],[53,-5],[51,-5],[51,1],[52,2],[54,0],[56,0],[58,-3]],
    /* Africa */
    [[37,10],[33,10],[30,32],[22,37],[12,44],[11,43],[8,40],[4,35],
     [2,42],[0,42],[-5,40],[-10,40],[-16,36],[-22,35],[-28,32],
     [-34,26],[-34,18],[-28,15],[-22,14],[-10,14],[-5,10],[-2,9],
     [4,2],[5,-1],[5,-8],[10,-16],[15,-17],[15,-15],[20,-17],
     [25,-15],[30,-10],[35,-8],[37,-3],[37,10]],
    /* Asia (Eurasia mainland) */
    [[71,28],[68,32],[65,38],[60,42],[58,52],[55,62],[55,82],
     [55,102],[50,106],[48,132],[45,136],[43,134],[40,126],
     [38,121],[35,121],[30,122],[25,121],[22,114],[20,110],
     [15,108],[10,104],[5,103],[1,103],[-5,105],[-8,116],
     [0,108],[5,100],[10,99],[13,100],[18,102],[22,100],
     [25,94],[25,90],[28,84],[30,80],[30,75],[25,68],
     [22,58],[18,55],[12,44],[22,37],[25,37],[30,32],
     [33,10],[37,10],[40,15],[44,40],[50,50],[55,60],
     [60,60],[65,62],[68,66],[70,70],[71,72],[71,102],
     [70,132],[68,141],[60,141],[55,161],[60,164],[65,171],
     [68,176],[71,28]],
    /* Japan */
    [[41,140],[38,141],[34,131],[34,129],[37,136],[38,139],[41,140]],
    /* Philippines (simplified) */
    [[18,122],[16,120],[10,124],[8,123],[10,126],[14,124],[18,122]],
    /* Australia */
    [[-16,136],[-12,130],[-14,126],[-16,122],[-22,114],
     [-26,113],[-32,116],[-35,117],[-38,140],[-38,148],
     [-33,152],[-28,154],[-22,150],[-16,145],[-12,137],[-16,136]],
  ];

  /* Glowing city dots {lat,lng,r} — dense in USA/Europe/SE Asia */
  const DOTS=[
    /* USA */
    {lat:40.7,lng:-74,r:3.5},{lat:34,lng:-118,r:3},{lat:37.8,lng:-122.4,r:2.5},
    {lat:41.9,lng:-87.6,r:2.5},{lat:29.8,lng:-95.4,r:2},{lat:47.6,lng:-122.3,r:2},
    {lat:25.8,lng:-80.2,r:2},{lat:33.4,lng:-112,r:1.8},{lat:39.7,lng:-104.9,r:1.8},
    /* Europe */
    {lat:51.5,lng:-0.1,r:3.5},{lat:48.9,lng:2.4,r:3},{lat:52.5,lng:13.4,r:3},
    {lat:55.8,lng:37.6,r:2.5},{lat:41.9,lng:12.5,r:2.5},{lat:40.4,lng:-3.7,r:2},
    {lat:52.4,lng:4.9,r:2},{lat:59.3,lng:18.1,r:2},{lat:48.2,lng:16.4,r:2},
    {lat:50.1,lng:8.7,r:2},{lat:60.2,lng:25,r:1.8},{lat:55.7,lng:12.6,r:1.8},
    {lat:47.4,lng:19.1,r:1.8},{lat:52.2,lng:21,r:1.8},{lat:50.1,lng:14.4,r:1.8},
    /* SE Asia */
    {lat:1.3,lng:103.8,r:3.5},{lat:35.7,lng:139.7,r:3.5},{lat:37.6,lng:127,r:3},
    {lat:31.2,lng:121.5,r:3},{lat:22.3,lng:114.2,r:3},{lat:39.9,lng:116.4,r:3},
    {lat:13.8,lng:100.5,r:2.5},{lat:10.8,lng:106.7,r:2.5},{lat:3.1,lng:101.7,r:2.5},
    {lat:-6.2,lng:106.8,r:2.5},{lat:14.6,lng:121,r:2},{lat:23.1,lng:113.3,r:2},
    {lat:25.1,lng:121.6,r:2},{lat:34.7,lng:135.5,r:2},{lat:43.1,lng:141.3,r:1.8},
    /* South/West Asia */
    {lat:28.6,lng:77,r:2.5},{lat:19.1,lng:72.9,r:2.5},{lat:28,lng:84,r:1.5},
    {lat:25.2,lng:55.3,r:2},{lat:24.7,lng:46.7,r:1.8},{lat:33.3,lng:44.4,r:1.8},
    /* Oceania */
    {lat:-33.9,lng:151.2,r:2.5},{lat:-37.8,lng:145,r:1.8},
    /* Americas South */
    {lat:-23.5,lng:-46.6,r:2},{lat:-34,lng:-58.4,r:2},{lat:4.7,lng:-74.1,r:1.5},
    {lat:-12,lng:-77,r:1.5},{lat:19.4,lng:-99.1,r:2},
    /* Africa */
    {lat:30,lng:31.2,r:2},{lat:6.5,lng:3.4,r:1.5},{lat:-26,lng:28,r:1.5},
    {lat:-4.3,lng:15.3,r:1.2},{lat:15.6,lng:32.5,r:1.2},
  ];

  let rotY=20,velX=0,drag=false,lastX=0;
  let W,H,R,gCX,gCY;

  function setSize(){
    const r=cv.getBoundingClientRect();
    const w=r.width||cv.offsetWidth;
    const h=r.height||cv.offsetHeight;
    if(!w||!h)return false;
    cv.width=Math.round(w); cv.height=Math.round(h);
    W=cv.width; H=cv.height;
    R=Math.min(W,H)*0.42; gCX=W/2; gCY=H/2;
    return true;
  }
  /* Retry sizing until layout is ready */
  function initSize(){if(!setSize()){setTimeout(initSize,50);}}
  initSize();
  let rsTO;
  window.addEventListener('resize',()=>{clearTimeout(rsTO);rsTO=setTimeout(setSize,120);});
  window.addEventListener('orientationchange',()=>{setTimeout(setSize,200);});

  function proj(lat,lng){
    const phi=lat*Math.PI/180, lam=(lng+rotY)*Math.PI/180;
    return{x:Math.cos(phi)*Math.sin(lam), y:Math.sin(phi), z:Math.cos(phi)*Math.cos(lam)};
  }
  function sx(p){return gCX+p.x*R;}
  function sy(p){return gCY-p.y*R;}

  function drawPoly(ring){
    const pts=ring.map(([la,lo])=>proj(la,lo));
    const n=pts.length;
    ctx.beginPath();
    let penDown=false;
    for(let i=0;i<n;i++){
      const A=pts[i], B=pts[(i+1)%n];
      if(A.z>=0){
        if(!penDown){ctx.moveTo(sx(A),sy(A));penDown=true;}
        else ctx.lineTo(sx(A),sy(A));
        if(B.z<0){
          const t=A.z/(A.z-B.z);
          const C={x:A.x+t*(B.x-A.x),y:A.y+t*(B.y-A.y)};
          ctx.lineTo(sx(C),sy(C)); penDown=false;
        }
      } else if(B.z>=0){
        const t=A.z/(A.z-B.z);
        const C={x:A.x+t*(B.x-A.x),y:A.y+t*(B.y-A.y)};
        ctx.moveTo(sx(C),sy(C)); penDown=true;
      }
    }
    ctx.closePath();
  }

  function draw(){
    if(!W||!H){if(!setSize()){requestAnimationFrame(draw);return;}}
    ctx.clearRect(0,0,W,H);

    /* Ocean sphere */
    const sph=ctx.createRadialGradient(gCX-R*0.3,gCY-R*0.3,R*0.05,gCX,gCY,R);
    sph.addColorStop(0,'#011e30'); sph.addColorStop(1,'#00060e');
    ctx.beginPath(); ctx.arc(gCX,gCY,R,0,Math.PI*2);
    ctx.fillStyle=sph; ctx.fill();

    /* Clip all drawing to sphere */
    ctx.save();
    ctx.beginPath(); ctx.arc(gCX,gCY,R-0.5,0,Math.PI*2); ctx.clip();

    /* Faint grid */
    ctx.strokeStyle='rgba(0,245,255,0.045)'; ctx.lineWidth=0.5;
    for(let la=-60;la<=60;la+=30){
      ctx.beginPath(); let f=true;
      for(let lo=0;lo<=360;lo+=2){
        const p=proj(la,lo);
        if(p.z>0){f?(ctx.moveTo(sx(p),sy(p)),f=false):ctx.lineTo(sx(p),sy(p));}else f=true;
      } ctx.stroke();
    }
    for(let lo=0;lo<360;lo+=30){
      ctx.beginPath(); let f=true;
      for(let la=-80;la<=80;la+=2){
        const p=proj(la,lo);
        if(p.z>0){f?(ctx.moveTo(sx(p),sy(p)),f=false):ctx.lineTo(sx(p),sy(p));}else f=true;
      } ctx.stroke();
    }

    /* Land polygons */
    LAND.forEach(ring=>{
      drawPoly(ring);
      ctx.fillStyle='rgba(0,245,255,0.10)'; ctx.fill();
      ctx.strokeStyle='rgba(0,245,255,0.55)'; ctx.lineWidth=0.8; ctx.stroke();
    });

    /* City glow dots */
    const now=Date.now();
    DOTS.forEach((d,i)=>{
      const p=proj(d.lat,d.lng);
      if(p.z<0.05)return;
      const fade=Math.min(1,(p.z-0.05)/0.25);
      const px=sx(p),py=sy(p);
      const pulse=0.45+0.55*Math.sin(now*0.0014+i*1.3);
      const gr=d.r*(0.8+0.5*pulse);
      /* halo */
      const g=ctx.createRadialGradient(px,py,0,px,py,gr*5);
      g.addColorStop(0,`rgba(0,245,255,${0.5*pulse*fade})`);
      g.addColorStop(1,'rgba(0,245,255,0)');
      ctx.beginPath(); ctx.arc(px,py,gr*5,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      /* core */
      ctx.beginPath(); ctx.arc(px,py,gr*0.65,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,245,255,${0.92*fade})`; ctx.fill();
    });

    ctx.restore();

    /* Outer glow ring */
    ctx.beginPath(); ctx.arc(gCX,gCY,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,245,255,0.28)'; ctx.lineWidth=1.5; ctx.stroke();

    /* Auto-spin with momentum */
    if(!drag){
      rotY+=velX*0.04; velX*=0.90;
      if(Math.abs(velX)<0.15){velX=0; rotY+=0.10;}
    }
    requestAnimationFrame(draw);
  }
  draw();

  /* Interaction */
  cv.addEventListener('mousedown',e=>{drag=true;lastX=e.clientX;velX=0;});
  window.addEventListener('mouseup',()=>drag=false);
  window.addEventListener('mousemove',e=>{if(!drag)return;velX=e.clientX-lastX;rotY+=velX*0.5;lastX=e.clientX;});
  cv.addEventListener('touchstart',e=>{drag=true;lastX=e.touches[0].clientX;velX=0;},{passive:true});
  window.addEventListener('touchend',()=>drag=false);
  window.addEventListener('touchmove',e=>{if(!drag)return;velX=e.touches[0].clientX-lastX;rotY+=velX*0.5;lastX=e.touches[0].clientX;},{passive:true});
})();

/* ── EMAIL ── */
function sendEmail(e){
  e.preventDefault();
  const inp=e.target.querySelectorAll('input,textarea');
  const sub=`Game Inquiry: ${inp[1].value}`;
  const body=`Name: ${inp[0].value}\nGame: ${inp[1].value}\n\nMessage:\n${inp[2].value}`;
  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=bevelcreatives@gmail.com&su='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body),'_blank');
}