// This tells the browser to remember your last scroll position
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto';
}

const YOUR_EMAIL = "bevelcreatives@gmail.com";
const YOUR_DISCORD = "@bevelededge";

// Prevent scroll jump on refresh (some browsers restore last scroll and can land at bottom).
// We still allow deep-linking to sections when a hash is present.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
});
// ====== Cursor aura follow ======
const aura = document.getElementById("aura");
let mx = -9999, my = -9999;
let ax = -9999, ay = -9999;

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function lerp(a, b, t) { return a + (b - a) * t; }

function tick() {
  ax = lerp(ax, mx - 260, 0.12);
  ay = lerp(ay, my - 260, 0.12);
  aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
  requestAnimationFrame(tick);
}
tick();

// ====== Reveal on scroll ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("on");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ====== Mobile menu ======
const hamburger = document.getElementById("hamburger");
const mobilePanel = document.getElementById("mobilePanel");
let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  mobilePanel.style.display = open ? "block" : "none";
  hamburger.textContent = open ? "✕" : "☰";
}
hamburger?.addEventListener("click", () => setMenu(!menuOpen));
mobilePanel?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

// ====== Footer year ======
document.getElementById("year").textContent = new Date().getFullYear();

// ====== Populate contact chip text ======
document.getElementById("emailText").textContent = YOUR_EMAIL;
document.getElementById("discordText").textContent = YOUR_DISCORD;

// ====== Copy helpers ======
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

document.getElementById("copyEmail")?.addEventListener("click", async () => {
  const ok = await copyText(YOUR_EMAIL);
  alert(ok ? "Email copied!" : "Could not copy email.");
});

document.getElementById("copyDiscord")?.addEventListener("click", async () => {
  const ok = await copyText(YOUR_DISCORD);
  alert(ok ? "Discord copied!" : "Could not copy Discord.");
});

// ====== Contact form -> mailto ======
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Project inquiry — ${name}`);
  const body = encodeURIComponent(
`Hi Bibidh,

My name: ${name}
My email: ${email}

Project details:
${msg}

— Sent from your portfolio site`
  );

  // Opens user's default mail client; replace with Gmail URL if you want web-Gmail specifically
  window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
});

// Split EXPENSIVE. into animated RGB letters (wave + pulse)
(function makeRgbLetters() {
  const el = document.getElementById("rgbExpensive");
  if (!el) return;

  const text = el.textContent;
  el.textContent = "";

  const letters = [...text];
  const waveStep = 0.08; // delay between letters (controls "wave speed")

  letters.forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "rgb-letter";
    span.textContent = ch === " " ? "\u00A0" : ch;

    // Stagger BOTH animations so it looks like RGB light waves flowing
    span.style.animationDelay = `${i * waveStep}s, ${i * waveStep}s`;

    el.appendChild(span);
  });
})();

// 1. FORCE TOP ON LOAD
window.scrollTo(0, 0);
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 2. BACKGROUND MUSIC (Local MP3)
window.addEventListener('load', () => {
  const audio = document.getElementById('bgm-audio');
  if (audio) {
    // Play on first user interaction to bypass browser autoplay restrictions
    document.body.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }, { once: true });
  }
});

/* ── GLOBE v2 (stable, land-outline orthographic globe) ── */
(function(){
  const cv=document.getElementById('globe-canvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');

  const LAND=[
    [[70,-140],[60,-137],[55,-130],[50,-126],[48,-124],[43,-124],[38,-122],
     [32,-117],[30,-110],[22,-105],[18,-103],[15,-90],[16,-89],[17,-91],
     [21,-87],[21,-90],[23,-90],[23,-87],[22,-80],[25,-80],[31,-81],
     [35,-75],[39,-74],[42,-70],[44,-66],[47,-53],[50,-56],[53,-55],
     [57,-62],[62,-63],[63,-68],[66,-62],[68,-53],[70,-25],[73,-23],
     [78,-18],[83,-25],[83,-100],[80,-145],[74,-160],[71,-156],[70,-140]],
    [[83,-60],[80,-73],[76,-75],[73,-55],[72,-27],[75,-18],[78,-17],[82,-24],[83,-60]],
    [[12,-72],[10,-62],[8,-60],[4,-52],[2,-51],[0,-50],[-5,-35],
     [-10,-37],[-20,-40],[-23,-43],[-33,-53],[-38,-57],[-46,-65],
     [-52,-68],[-55,-65],[-52,-75],[-46,-75],[-38,-73],[-33,-71],
     [-22,-70],[-18,-70],[-14,-75],[-8,-78],[-4,-80],[0,-80],[4,-77],[8,-77],[12,-72]],
    [[71,28],[69,30],[65,25],[60,25],[58,22],[56,15],[56,8],[56,3],
     [52,-2],[50,-5],[44,-2],[44,8],[43,16],[41,13],[38,15],
     [42,18],[44,20],[46,15],[48,18],[50,18],[54,18],[55,21],
     [59,24],[60,25],[63,22],[68,20],[70,25],[71,28]],
    [[58,-3],[57,-6],[55,-6],[53,-5],[51,-5],[51,1],[52,2],[54,0],[56,0],[58,-3]],
    [[37,10],[33,10],[30,32],[22,37],[12,44],[11,43],[8,40],[4,35],
     [2,42],[0,42],[-5,40],[-10,40],[-16,36],[-22,35],[-28,32],
     [-34,26],[-34,18],[-28,15],[-22,14],[-10,14],[-5,10],[-2,9],
     [4,2],[5,-1],[5,-8],[10,-16],[15,-17],[15,-15],[20,-17],
     [25,-15],[30,-10],[35,-8],[37,-3],[37,10]],
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
    [[41,140],[38,141],[34,131],[34,129],[37,136],[38,139],[41,140]],
    [[18,122],[16,120],[10,124],[8,123],[10,126],[14,124],[18,122]],
    [[-16,136],[-12,130],[-14,126],[-16,122],[-22,114],
     [-26,113],[-32,116],[-35,117],[-38,140],[-38,148],
     [-33,152],[-28,154],[-22,150],[-16,145],[-12,137],[-16,136]],
  ];

  const DOTS=[
    {lat:40.7,lng:-74,r:3.5},{lat:34,lng:-118,r:3},{lat:37.8,lng:-122.4,r:2.5},
    {lat:41.9,lng:-87.6,r:2.5},{lat:29.8,lng:-95.4,r:2},{lat:47.6,lng:-122.3,r:2},
    {lat:25.8,lng:-80.2,r:2},{lat:33.4,lng:-112,r:1.8},{lat:39.7,lng:-104.9,r:1.8},
    {lat:51.5,lng:-0.1,r:3.5},{lat:48.9,lng:2.4,r:3},{lat:52.5,lng:13.4,r:3},
    {lat:55.8,lng:37.6,r:2.5},{lat:41.9,lng:12.5,r:2.5},{lat:40.4,lng:-3.7,r:2},
    {lat:52.4,lng:4.9,r:2},{lat:59.3,lng:18.1,r:2},{lat:48.2,lng:16.4,r:2},
    {lat:50.1,lng:8.7,r:2},{lat:60.2,lng:25,r:1.8},{lat:55.7,lng:12.6,r:1.8},
    {lat:47.4,lng:19.1,r:1.8},{lat:52.2,lng:21,r:1.8},{lat:50.1,lng:14.4,r:1.8},
    {lat:1.3,lng:103.8,r:3.5},{lat:35.7,lng:139.7,r:3.5},{lat:37.6,lng:127,r:3},
    {lat:31.2,lng:121.5,r:3},{lat:22.3,lng:114.2,r:3},{lat:39.9,lng:116.4,r:3},
    {lat:13.8,lng:100.5,r:2.5},{lat:10.8,lng:106.7,r:2.5},{lat:3.1,lng:101.7,r:2.5},
    {lat:-6.2,lng:106.8,r:2.5},{lat:14.6,lng:121,r:2},{lat:23.1,lng:113.3,r:2},
    {lat:25.1,lng:121.6,r:2},{lat:34.7,lng:135.5,r:2},{lat:43.1,lng:141.3,r:1.8},
    {lat:28.6,lng:77,r:2.5},{lat:19.1,lng:72.9,r:2.5},{lat:28,lng:84,r:1.5},
    {lat:25.2,lng:55.3,r:2},{lat:24.7,lng:46.7,r:1.8},{lat:33.3,lng:44.4,r:1.8},
    {lat:-33.9,lng:151.2,r:2.5},{lat:-37.8,lng:145,r:1.8},
    {lat:-23.5,lng:-46.6,r:2},{lat:-34,lng:-58.4,r:2},{lat:19.4,lng:-99.1,r:2},
    {lat:30,lng:31.2,r:2},{lat:6.5,lng:3.4,r:1.5},{lat:-26,lng:28,r:1.5},
  ];

  let rotY=20,velX=0,drag=false,lastX=0;
  let W,H,R,gCX,gCY;

  function setSize(){
    W=cv.offsetWidth||120; H=cv.offsetHeight||120;
    cv.width=W; cv.height=H;
    R=Math.min(W,H)*0.42; gCX=W/2; gCY=H/2;
  }
  setSize();
  let rsTO; window.addEventListener('resize',()=>{clearTimeout(rsTO);rsTO=setTimeout(setSize,120);});

  function proj(lat,lng){
    const phi=lat*Math.PI/180,lam=(lng+rotY)*Math.PI/180;
    return{x:Math.cos(phi)*Math.sin(lam),y:Math.sin(phi),z:Math.cos(phi)*Math.cos(lam)};
  }
  function sx(p){return gCX+p.x*R;}
  function sy(p){return gCY-p.y*R;}

  function drawPoly(ring){
    const pts=ring.map(([la,lo])=>proj(la,lo));
    const n=pts.length;
    ctx.beginPath();
    let penDown=false;
    for(let i=0;i<n;i++){
      const A=pts[i],B=pts[(i+1)%n];
      if(A.z>=0){
        if(!penDown){ctx.moveTo(sx(A),sy(A));penDown=true;}
        else ctx.lineTo(sx(A),sy(A));
        if(B.z<0){
          const t=A.z/(A.z-B.z);
          const C={x:A.x+t*(B.x-A.x),y:A.y+t*(B.y-A.y)};
          ctx.lineTo(sx(C),sy(C));penDown=false;
        }
      } else if(B.z>=0){
        const t=A.z/(A.z-B.z);
        const C={x:A.x+t*(B.x-A.x),y:A.y+t*(B.y-A.y)};
        ctx.moveTo(sx(C),sy(C));penDown=true;
      }
    }
    ctx.closePath();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const sph=ctx.createRadialGradient(gCX-R*0.3,gCY-R*0.3,R*0.05,gCX,gCY,R);
    sph.addColorStop(0,'#011e30');sph.addColorStop(1,'#00060e');
    ctx.beginPath();ctx.arc(gCX,gCY,R,0,Math.PI*2);
    ctx.fillStyle=sph;ctx.fill();
    ctx.save();
    ctx.beginPath();ctx.arc(gCX,gCY,R-0.5,0,Math.PI*2);ctx.clip();
    ctx.strokeStyle='rgba(0,245,255,0.045)';ctx.lineWidth=0.5;
    for(let la=-60;la<=60;la+=30){
      ctx.beginPath();let f=true;
      for(let lo=0;lo<=360;lo+=2){
        const p=proj(la,lo);
        if(p.z>0){f?(ctx.moveTo(sx(p),sy(p)),f=false):ctx.lineTo(sx(p),sy(p));}else f=true;
      }ctx.stroke();
    }
    for(let lo=0;lo<360;lo+=30){
      ctx.beginPath();let f=true;
      for(let la=-80;la<=80;la+=2){
        const p=proj(la,lo);
        if(p.z>0){f?(ctx.moveTo(sx(p),sy(p)),f=false):ctx.lineTo(sx(p),sy(p));}else f=true;
      }ctx.stroke();
    }
    LAND.forEach(ring=>{
      drawPoly(ring);
      ctx.fillStyle='rgba(0,245,255,0.10)';ctx.fill();
      ctx.strokeStyle='rgba(0,245,255,0.55)';ctx.lineWidth=0.8;ctx.stroke();
    });
    const now=Date.now();
    DOTS.forEach((d,i)=>{
      const p=proj(d.lat,d.lng);
      if(p.z<0.05)return;
      const fade=Math.min(1,(p.z-0.05)/0.25);
      const px=sx(p),py=sy(p);
      const pulse=0.45+0.55*Math.sin(now*0.0014+i*1.3);
      const gr=d.r*(0.8+0.5*pulse);
      const g=ctx.createRadialGradient(px,py,0,px,py,gr*5);
      g.addColorStop(0,`rgba(0,245,255,${0.5*pulse*fade})`);
      g.addColorStop(1,'rgba(0,245,255,0)');
      ctx.beginPath();ctx.arc(px,py,gr*5,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(px,py,gr*0.65,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,245,255,${0.92*fade})`;ctx.fill();
    });
    ctx.restore();
    ctx.beginPath();ctx.arc(gCX,gCY,R,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,245,255,0.28)';ctx.lineWidth=1.5;ctx.stroke();
    if(!drag){rotY+=velX*0.04;velX*=0.90;if(Math.abs(velX)<0.15){velX=0;rotY+=0.10;}}
    requestAnimationFrame(draw);
  }
  draw();

  cv.addEventListener('mousedown',e=>{drag=true;lastX=e.clientX;velX=0;});
  window.addEventListener('mouseup',()=>drag=false);
  window.addEventListener('mousemove',e=>{if(!drag)return;velX=e.clientX-lastX;rotY+=velX*0.5;lastX=e.clientX;});
  cv.addEventListener('touchstart',e=>{drag=true;lastX=e.touches[0].clientX;velX=0;},{passive:true});
  window.addEventListener('touchend',()=>drag=false);
  window.addEventListener('touchmove',e=>{if(!drag)return;velX=e.touches[0].clientX-lastX;rotY+=velX*0.5;lastX=e.touches[0].clientX;},{passive:true});
})();