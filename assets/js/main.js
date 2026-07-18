const BACKEND_URL = window.location.hostname === 'zaphera-coftan-pro-1.onrender.com' 
  ? 'https://zaphera-coftan-pro-1-m.onrender.com' 
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
    ? 'http://localhost:5000' 
    : '';
const API_URL = BACKEND_URL + '/api';

// Unique event ID generated on page load for browser-to-server deduplication
const pageEventId = 'LB-EV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();

// Extract UTM parameters from query string
function getUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  const utms = [];
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    if (params.get(key)) {
      utms.push(`${key}=${params.get(key)}`);
    }
  });
  return utms.join('&');
}

// Determine customer acquisition source
function getOrderSource() {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'Direct');
}

// Unified client-side pixel event tracking (Meta, TikTok, Snapchat, GA4)
function trackBrowserEvent(eventName, eventData = {}) {
  const eventId = eventData.event_id || pageEventId;
  const value = eventData.value || 0;

  console.log(`📡 [Browser Pixel] Event: ${eventName} (ID: ${eventId})`, eventData);

  // 1. Meta Pixel
  if (typeof fbq === 'function') {
    fbq('track', eventName, {
      value: value,
      currency: 'DZD',
      ...eventData
    }, { eventID: eventId });
  }

  // 2. TikTok Pixel
  if (typeof ttq === 'function') {
    ttq.track(eventName, {
      value: value,
      currency: 'DZD',
      ...eventData
    }, { event_id: eventId });
  }

  // 3. Snapchat Pixel
  if (typeof snaptr === 'function') {
    let snapEvent = eventName;
    if (eventName === 'Purchase') snapEvent = 'PURCHASE';
    if (eventName === 'PageView') snapEvent = 'PAGE_VIEW';
    if (eventName === 'AddToCart') snapEvent = 'ADD_CART';
    if (eventName === 'InitiateCheckout') snapEvent = 'START_CHECKOUT';

    snaptr('track', snapEvent, {
      price: value,
      currency: 'DZD',
      ...eventData,
      uuid_c1: eventId
    });
  }

  // 4. GA4 (Google Analytics)
  if (typeof gtag === 'function') {
    gtag('event', eventName, {
      value: value,
      currency: 'DZD',
      event_id: eventId,
      ...eventData
    });
  }
}

async function initDynamicPixels() {
  try {
    const res = await fetch(API_URL + '/settings');
    if (!res.ok) {
      trackBrowserEvent('PageView');
      return;
    }
    const settings = await res.json();
    
    // 1. Meta Pixel
    if (settings.metaPixelId) {
      console.log('Initializing Meta Pixel:', settings.metaPixelId);
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      fbq('init', settings.metaPixelId);
    }
    
    // 2. TikTok Pixel
    if (settings.tiktokPixelId) {
      console.log('Initializing TikTok Pixel:', settings.tiktokPixelId);
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var e=0;e<ttq.methods.length;e++)ttq.setAndDefer(ttq,ttq.methods[e]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.mixpool;w[t]._i=w[t]._i||{},w[t]._i[e]=[],w[t]._i[e]._u=r,w[t]._t=w[t]._t||+new Date,w[t]._o=w[t]._o||{},w[t]._o[e]=n||{};var a=d.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var i=d.getElementsByTagName("script")[0];i.parentNode.insertBefore(a,i)};
        ttq.load(settings.tiktokPixelId);
        ttq.page();
      }(window, document, 'ttq');
    }
    
    // 3. Snapchat Pixel
    if (settings.snapPixelId) {
      console.log('Initializing Snapchat Pixel:', settings.snapPixelId);
      (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
      {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
      a.queue=[];var s=t.createElement(n);s.async=!0;
      s.src="https://sc-static.net/scevent.min.js";
      var r=t.getElementsByTagName(n)[0];r.parentNode.insertBefore(s,r)}
      )(window,document,"script");
      
      snaptr('init', settings.snapPixelId);
    }
    
    trackBrowserEvent('PageView');
  } catch (err) {
    console.error('Error initializing dynamic pixels:', err);
    trackBrowserEvent('PageView');
  }
}

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   RUNWAY — real video, scroll-scrubbed.
   ========================================================= */
(function(){
  const wrap    = document.getElementById('runwayWrap');
  const video   = document.getElementById('modelVideo');
  const fill    = document.getElementById('runwayFill');
  const label   = document.getElementById('runwayLabel');
  const eyebrow = document.getElementById('rwEyebrow');
  const rwProg  = document.getElementById('rwProgress');
  if(!wrap || !video) return;

  const stepLabels = [
    'âœ¦ ØªØ±ÙƒÙŠØ¨Ø§Øª Ù…Ø³ØªÙˆØ­Ø§Ø© Ù…Ù† Ø§Ù„Ø·Ø¨ÙŠØ¹Ø© Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±ÙŠØ© Ø§Ù„Ø®Ù„Ø§Ø¨Ø©',
    'âœ¦ Ø²ÙŠÙˆØª Ø¹Ø¶ÙˆÙŠØ© Ù†Ù‚ÙŠØ© Ù…Ø¹ØµÙˆØ±Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø§Ø±Ø¯',
    'âœ¦ Ø£Ù‚ØµÙ‰ Ø¯Ø±Ø¬Ø§Øª Ø§Ù„ØªØ±Ø·ÙŠØ¨ ÙˆØ§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø¹Ù…ÙŠÙ‚Ø©',
    'âœ¦ ØªØµÙ†ÙŠØ¹ Ø¢Ù…Ù† ÙˆÙ…Ø®ØªØ¨Ø± Ø³Ø±ÙŠØ±ÙŠØ§Ù‹ Ù„Ø¨Ø´Ø±ØªÙƒÙ',
    'âœ¦ Ù„Ù…Ø³Ø© Ø¨ÙŠÙˆØªÙŠ ØªØ¨Ø±Ø² Ø¥Ø´Ø±Ø§Ù‚Ø© Ø¬Ù…Ø§Ù„ÙƒÙ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ'
  ];

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  /* ── Force muted & loop ── */
  video.muted = true;
  video.setAttribute('muted','');
  video.loop = true;
  video.setAttribute('loop','');
  video.load();

  if (isMobile) {
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => video.play().catch(()=>{}),
      onEnterBack: () => video.play().catch(()=>{}),
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause()
    });
  }

  /* ── Unlock once: play then pause so currentTime becomes writable ── */
  let unlocked = false;
  function unlock(){
    if(unlocked) return;
    unlocked = true;
    video.play().then(()=>{ video.pause(); video.currentTime = 0; }).catch(()=>{});
  }
  unlock();
  setTimeout(unlock, 300);
  window.addEventListener('scroll',     unlock, {once:true, passive:true});
  window.addEventListener('click',      unlock, {once:true});
  window.addEventListener('touchstart', unlock, {once:true, passive:true});
  video.addEventListener('canplay',     ()=>{ unlock(); }, {once:true});

  /* ─── One-time entry animation via GSAP ─── */
  if(eyebrow) gsap.fromTo(eyebrow,
    { opacity:0, y:30 },
    { opacity:1, y:0, duration:1.2, ease:'power3.out',
      scrollTrigger:{ trigger:wrap, start:'top 75%', once:true } }
  );
  if(rwProg) gsap.to(rwProg,
    { opacity:1, duration:0.8, delay:0.5,
      scrollTrigger:{ trigger:wrap, start:'top 75%', once:true } }
  );
  if(label) gsap.to(label,
    { opacity:1, duration:0.8, delay:0.5,
      scrollTrigger:{ trigger:wrap, start:'top 75%', once:true } }
  );

  /* ─── Scroll progress 0→1 ─── */
  function computeProgress(){
    const rect  = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - window.innerHeight;
    if(total <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / total));
  }

  /* ─── Apply all scroll-driven changes ─── */
  function applyProgress(p){

    /* 1 ── VIDEO SEEK — only seek if time change is meaningful (desktop only) */
    if (!isMobile) {
      const dur = video.duration;
      if(dur > 0){
        const targetTime = p * dur;
        if(Math.abs(video.currentTime - targetTime) > 0.04) {
          try{ video.currentTime = targetTime; }catch(e){}
        }
      }
    }

    /* 2 ── PROGRESS BAR */
    if(fill) fill.style.width = (p * 100).toFixed(1) + '%';

    /* 3 ── STEP LABEL */
    if(label){
      const idx = Math.min(stepLabels.length-1, Math.floor(p * stepLabels.length));
      label.textContent = stepLabels[idx];
    }

    /* 4 ── STEP TITLES cross-fade */
    const STEPS  = 5;
    const active = Math.min(STEPS-1, Math.floor(p * STEPS));
    const frac   = (p * STEPS) - active;

    for(let i = 0; i < STEPS; i++){
      const el = document.getElementById('rwStep' + i);
      if(!el) continue;
      if(i === active){
        const op  = frac < 0.15 ? frac/0.15 : frac > 0.85 ? (1-frac)/0.15 : 1;
        const yPx = frac < 0.15 ? 28*(1-frac/0.15) : frac > 0.85 ? -20*((frac-0.85)/0.15) : 0;
        const sc  = 0.88 + 0.12 * Math.min(op, 1);
        el.style.opacity   = op.toFixed(3);
        el.style.transform = 'translateY('+yPx.toFixed(1)+'px) scale('+sc.toFixed(3)+')';
      } else {
        el.style.opacity   = '0';
        el.style.transform = i < active ? 'translateY(-28px) scale(0.9)' : 'translateY(28px) scale(0.9)';
      }
    }

    /* 5 ── VIDEO zoom + sharpen */
    if (isMobile) {
      const scale  = (0.75 + p*0.25).toFixed(3);
      const tf     = 'scale('+scale+')';
      video.style.transform = tf;
      video.style.filter    = '';
    } else {
      const scale  = (0.62 + p*0.38).toFixed(3);
      const blur   = Math.max(0, 6 - p*6).toFixed(2);
      const bright = (0.55 + p*0.33).toFixed(3);
      const sat    = (0.80 + p*0.20).toFixed(3);
      const yPct   = (6   - p*6).toFixed(2);
      const tf     = 'scale('+scale+') translateY('+yPct+'%)';
      const fi     = 'blur('+blur+'px) brightness('+bright+') saturate('+sat+')';
      video.style.transform = tf;
      video.style.filter    = fi;
      const img = wrap.querySelector('.runway-figure img');
      if(img){ img.style.transform = tf; img.style.filter = fi; }
    }
  }

  /* ─── RAF loop ─── */
  let latest = 0, smooth = 0;
  window.addEventListener('scroll', ()=>{ latest = computeProgress(); }, {passive:true});
  window.addEventListener('resize', ()=>{ latest = computeProgress(); });
  latest = computeProgress();

  (function tick(){
    smooth += (latest - smooth) * 0.18;
    if(Math.abs(smooth - latest) < 0.0005) smooth = latest;
    applyProgress(smooth);
    requestAnimationFrame(tick);
  })();

})();





/* ---------------- Progress bar ---------------- */
const progress = document.getElementById('progress');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.transform = `scaleX(${pct})`;
});

/* ---------------- Nav on scroll ---------------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{ nav.classList.toggle('scrolled', window.scrollY > 60); });

/* ---------------- Particle "fog" canvas (lightweight, no deps) ---------------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w,h,particles=[];
function resize(){ w=canvas.width=canvas.offsetWidth; h=canvas.height=canvas.offsetHeight; }
window.addEventListener('resize', resize);
resize();
for(let i=0;i<70;i++){
  particles.push({
    x:Math.random()*w, y:Math.random()*h,
    r:Math.random()*1.8+0.4,
    vy:-(Math.random()*0.25+0.05),
    vx:(Math.random()-0.5)*0.1,
    a:Math.random()*0.5+0.1
  });
}
function drawParticles(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    p.y += p.vy; p.x += p.vx;
    if(p.y < -10) { p.y = h+10; p.x = Math.random()*w; }
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(201,162,75,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---------------- Hero entrance ---------------- */
const heroTl = gsap.timeline({defaults:{ease:'power3.out'}});
heroTl
  .to('#silhouette',{opacity:1,duration:1.6},0.1)
  .to('.eyebrow',{opacity:1,y:0,duration:.9},0.3)
  .from('.eyebrow',{y:20},0.3)
  .to('.hero h1',{opacity:1,duration:1.1},0.5)
  .from('.hero h1',{y:40},0.5)
  .to('.hero-sub',{opacity:1,duration:1},0.8)
  .from('.hero-sub',{y:20},0.8)
  .to('.hero-cta',{opacity:1,duration:1},1.0)
  .from('.hero-cta',{y:20},1.0)
  .to('.scroll-hint',{opacity:1,duration:1},1.3);

/* Walking woman: silhouette advances & camera-zoom feel while scrolling hero */
gsap.to('#silhouette',{
  scale:1.15, y:-20,
  scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }
});
gsap.to('.hero-fog',{
  opacity:0.4,
  scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:1 }
});

/* ---------------- Reveal-on-scroll (IntersectionObserver — works on file://) ---------------- */
let _revealObserver = null;
function initReveal() {
  if (!_revealObserver) {
    _revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          _revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }

  // Only observe elements not yet revealed
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    _revealObserver.observe(el);
  });
}
initReveal();

/* ---------------- Chapter rail dots ---------------- */
const chapters = document.querySelectorAll('.chapter, .final-cta');
const rail = document.getElementById('rail');
chapters.forEach((sec,i)=>{
  const dot = document.createElement('div');
  dot.className='rail-dot';
  dot.addEventListener('click',()=>sec.scrollIntoView({behavior:'smooth'}));
  rail.appendChild(dot);
  ScrollTrigger.create({
    trigger:sec, start:'top center', end:'bottom center',
    onToggle:self=>{ if(self.isActive){ document.querySelectorAll('.rail-dot').forEach(d=>d.classList.remove('active')); dot.classList.add('active'); } }
  });
});

/* ---------------- 3D tilt on product cards ---------------- */
function attachTilt(card){
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    gsap.to(card,{rotateY:x*10, rotateX:-y*10, duration:.4, ease:'power2.out'});
  });
  card.addEventListener('mouseleave', ()=>{ gsap.to(card,{rotateY:0,rotateX:0,duration:.6,ease:'power3.out'}); });
}

/* ---------------- Translation & Localization Data ---------------- */
const translations = {
  ar: {
    nav_collection: "Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø©",
    nav_caftan: "Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©",
    nav_karakou: "Ø§Ù„Ù…ÙƒÙŠØ§Ø¬",
    nav_wedding: "Ø§Ù„Ø¹Ø·ÙˆØ±",
    nav_reviews: "Ø¢Ø±Ø§Ø¡ Ø§Ù„Ø¹Ù…ÙŠÙ„Ø§Øª",
    eyebrow_sub: "Ø¯Ø§Ø± Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ ÙˆØ§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© â€” Ø¬Ù…Ø§Ù„ Ø·Ø¨ÙŠØ¹ÙŠ Ø¨Ù„Ù…Ø³Ø© Ø¬Ø²Ø§Ø¦Ø±ÙŠØ©",
    hero_title: "Ø¬Ù…Ø§Ù„ÙƒÙ <em>ÙŠØ³ØªØ­Ù‚</em><br>Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø©",
    hero_sub: "Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ø°Ù‡Ø¨ Â· ÙƒØ±ÙŠÙ…Ø§Øª Ø§Ù„Ù†Ø¶Ø§Ø±Ø© Â· Ø¹Ø·ÙˆØ± ÙØ§Ø®Ø±Ø© â€” Ù‚ÙØ·Ø¹ Ø¬Ù…Ø§Ù„ÙŠØ© Ù…ØµÙ†ÙˆØ¹Ø© Ø¨Ø­Ø¨ ÙˆÙ…ÙˆØ§Ø¯ Ø·Ø¨ÙŠØ¹ÙŠØ©",
    hero_cta: "Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø© â†™",
    scroll_hint: "Ù…Ø±Ù‘Ø±ÙŠ Ù„Ù„Ø£Ø³ÙÙ„",
    runway_eyebrow: "Ø³Ø­Ø± Ø§Ù„ØªØ¬Ø±Ø¨Ø©",
    runway_title: "Ù†Ø¹ØªÙ†ÙŠ Ø¨Ø¬Ù…Ø§Ù„ÙƒÙ <em>Ø¨Ø£Ø±Ù‚Ù‰ Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ©</em>",
    runway_label_1: "Ù…Ø³ØªØ®Ù„ØµØ§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© 100% Ù„Ø¨Ø´Ø±Ø© Ù†Ø¶Ø±Ø©",
    runway_label_2: "Ø¹Ù†Ø§ÙŠØ© Ù…ØªÙƒØ§Ù…Ù„Ø© Ù„Ø¬Ù…ÙŠØ¹ Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø©",
    runway_label_3: "Ø²ÙŠÙˆØª Ù†Ù‚ÙŠØ© ÙˆÙ…Ø³ØªØ®Ù„ØµØ§Øª Ø¹Ø´Ø¨ÙŠØ©",
    runway_label_4: "ØªØ£Ø«ÙŠØ± Ù„ØªØ±Ø·ÙŠØ¨ ÙˆÙ†Ø¹ÙˆÙ…Ø© ÙÙˆØ±ÙŠØ©",
    runway_label_5: "Ø¥Ø¥Ø·Ù„Ø§Ù„Ø© Ù…Ø´Ø±Ù‚Ø© ØªØ¨Ø±Ø² Ø¬Ù…Ø§Ù„ÙƒÙ Ø§Ù„ÙŠÙˆÙ…ÙŠ",
    chapter_1_num: "Ù¡",
    chapter_1_title: "Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª <em>Ø·Ø¨ÙŠØ¹ÙŠØ©</em> Ø¨Ù„Ù…Ø³Ø© Ø§Ø­ØªØ±Ø§ÙÙŠØ©",
    chapter_1_desc: "ÙƒÙ„ Ù…Ø³ØªØ­Ø¶Ø± ÙÙŠ Ù„Ù…Ø³Ø© Ø¨ÙŠÙˆØªÙŠ ÙŠÙØµÙ†Ø¹ Ø¨ØªØ±ÙƒÙŠØ¨Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© Ø¢Ù…Ù†Ø© ÙˆÙØ¹Ø§Ù„Ø©ØŒ Ø¨Ø£ÙŠØ¯ÙŠ Ø®Ø¨Ø±Ø§Ø¡ ÙÙŠ Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ØŒ Ù„ÙŠÙƒÙˆÙ† Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„Ø£Ù…Ø«Ù„ Ù„Ø¬Ù…Ø§Ù„ÙƒÙ Ø§Ù„ÙŠÙˆÙ…ÙŠ Ø¨Ù„Ù…Ø³Ø© Ø¬Ø²Ø§Ø¦Ø±ÙŠØ© ÙØ§Ø®Ø±Ø©.",
    stat_experience: "Ø³Ù†ÙˆØ§Øª Ø®Ø¨Ø±Ø©",
    stat_clients: "Ø¹Ù…ÙŠÙ„Ø© Ø³Ø¹ÙŠØ¯Ø©",
    stat_handmade: "Ù…Ù†ØªØ¬Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ©",
    chapter_2_title: "Ù…Ø¬Ù…ÙˆØ¹Ø© <em>Ø§Ù„Ø¹Ù†Ø§ÙŠØ©</em> Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
    chapter_2_desc: "Ø£Ø­Ø¯Ø« ØªØ±ÙƒÙŠØ¨Ø§Øª Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ§Ù„Ù…ÙƒÙŠØ§Ø¬ Ø§Ù„Ù…Ø³ØªØ®Ù„ØµØ© Ù…Ù† Ù…ÙƒÙˆÙ†Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© 100%.",
    chapter_3_title: "Ø±ÙˆØªÙŠÙ† <em>Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©</em>",
    chapter_3_desc: "ÙƒØ±ÙŠÙ…Ø§Øª Ù„ÙŠÙ„ÙŠØ© ÙˆØ³ÙŠØ±ÙˆÙ… Ù†Ø¶Ø§Ø±Ø© Ù„ØªØºØ°ÙŠØ© Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØªØ¬Ø¯ÙŠØ¯ Ø®Ù„Ø§ÙŠØ§Ù‡Ø§ Ø¨Ø¹Ù…Ù‚.",
    chapter_4_title: "Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª <em>Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆØ§Ù„ØªØ¬Ù…ÙŠÙ„</em>",
    chapter_4_desc: "Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡ Ù…Ø®Ù…Ù„ÙŠØŒ Ø¸Ù„Ø§Ù„ Ø¹ÙŠÙˆÙ†ØŒ ÙˆØ¹Ù„Ø¨ Ù…ÙƒÙŠØ§Ø¬ Ù…ØªÙƒØ§Ù…Ù„Ø© Ù„Ø¥Ø·Ù„Ø§Ù„Ø© Ø³Ø§Ø­Ø±Ø©.",
    chapter_5_title: "Ø§Ù„Ø¹Ø·ÙˆØ± <em>Ø§Ù„ÙØ§Ø®Ø±Ø©</em>",
    chapter_5_desc: "Ø¹Ø·ÙˆØ± Ø±Ø§Ù‚ÙŠØ© ØªØ¯ÙˆÙ… Ø·ÙˆÙŠÙ„Ø§Ù‹ Ø¨ØªØ±ÙƒÙŠØ¨Ø© Ù…Ø±ÙƒØ²Ø© ÙˆÙ†ØºÙ…Ø§Øª Ø³Ø§Ø­Ø±Ø© ØªÙ„ÙŠÙ‚ Ø¨Ø­Ø¶ÙˆØ±Ùƒ.",
    chapter_6_title: "Ø§Ù„Ø£ÙƒØ«Ø± <em>Ø·Ù„Ø¨Ø§Ù‹</em>",
    chapter_6_desc: "Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ ÙˆØ§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ø£ÙƒØ«Ø± Ø´Ø¹Ø¨ÙŠØ© Ø¨ÙŠÙ† Ø¹Ù…ÙŠÙ„Ø§ØªÙ†Ø§ Ù‡Ø°Ø§ Ø§Ù„Ù…ÙˆØ³Ù….",
    chapter_7_title: "Ø±Ø­Ù„Ø© <em>Ø§Ù„ØµÙ†Ø¹ ÙˆØ§Ù„Ø¬ÙˆØ¯Ø©</em>",
    chapter_7_step1_title: "01 â€” Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª",
    chapter_7_step1_desc: "Ù†Ø®ØªØ§Ø± Ø£Ø¬ÙˆØ¯ Ø§Ù„Ø²ÙŠÙˆØª Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© ÙˆØ§Ù„Ù…Ø³ØªØ®Ù„ØµØ§Øª Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠØ© Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ù…Ù† Ù…ØµØ§Ø¯Ø± Ù…ÙˆØ«ÙˆÙ‚Ø© Ù„Ø¶Ù…Ø§Ù† Ø£Ù…Ø§Ù† ÙˆÙØ¹Ø§Ù„ÙŠØ© Ø§Ù„Ù…Ù†ØªØ¬.",
    chapter_7_step2_title: "02 â€” Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø© ÙˆØ§Ù„Ø§Ø®ØªØ¨Ø§Ø±",
    chapter_7_step2_desc: "ÙŠØªÙ… ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª ÙˆØ§Ø®ØªØ¨Ø§Ø±Ù‡Ø§ Ù…Ø®Ø¨Ø±ÙŠØ§Ù‹ Ù„Ø¶Ù…Ø§Ù† Ù…Ù„Ø§Ø¡Ù…ØªÙ‡Ø§ Ù„Ù…Ø®ØªÙ„Ù Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØ®Ù„ÙˆÙ‡Ø§ Ù…Ù† Ø§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„Ø¶Ø§Ø±Ø©.",
    chapter_7_step3_title: "03 â€” Ø§Ù„ØµÙ†Ø¹ ÙˆØ§Ù„ØªØ¹Ø¨Ø¦Ø©",
    chapter_7_step3_desc: "ÙŠØªÙ… ØªØ­Ø¶ÙŠØ± Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ÙÙŠ Ø¸Ø±ÙˆÙ Ù…Ø¹Ù‚Ù…Ø© ØªÙ…Ø§Ù…Ø§Ù‹ ÙˆØªØ¹Ø¨Ø¦ØªÙ‡Ø§ ÙÙŠ Ø¹Ø¨ÙˆØ§Øª ØªØ­Ø§ÙØ¸ Ø¹Ù„Ù‰ Ø¬ÙˆØ¯Ø© ÙˆÙØ¹Ø§Ù„ÙŠØ© Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø©.",
    chapter_7_step4_title: "04 â€” Ø§Ù„ØªØµÙ…ÙŠÙ… ÙˆØ§Ù„ØªØºÙ„ÙŠÙ",
    chapter_7_step4_desc: "Ù†ØµÙ…Ù… Ø¹Ø¨ÙˆØ§Øª Ø£Ù†ÙŠÙ‚Ø© ÙˆØªØºÙ„ÙŠÙØ§Ù‹ ÙØ§Ø®Ø±Ø§Ù‹ ÙŠØ­Ù…ÙŠ Ø§Ù„Ù…Ù†ØªØ¬ ÙˆÙŠØ¹ÙƒØ³ Ø±Ù‚ÙŠ Ø§Ù„Ø¹Ù„Ø§Ù…Ø© ÙƒÙ‡Ø¯ÙŠØ© Ù…Ù…ÙŠØ²Ø© Ù„ÙƒÙ.",
    chapter_7_step5_title: "05 â€” Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„",
    chapter_7_step5_desc: "ÙŠØªÙ… Ø´Ø­Ù† Ø·Ù„Ø¨ÙŠØªÙƒÙ Ù…ØºÙ„ÙØ© Ø¨Ø¹Ù†Ø§ÙŠØ© ØªØ§Ù…Ø© Ù„ØªØµÙ„ÙƒÙ ÙÙŠ Ø£ÙØ¶Ù„ Ø­Ø§Ù„Ø© Ø£ÙŠÙ†Ù…Ø§ ÙƒÙ†ØªÙ ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø±.",
    chapter_8_title: "Ù‚Ø§Ù„Øª <em>Ø¹Ù…ÙŠÙ„Ø§ØªÙ†Ø§</em>",
    final_cta_eyebrow: "Ø¬Ù…Ø§Ù„ÙƒÙ ÙŠØ³ØªØ­Ù‚ Ø±Ø¹Ø§ÙŠØ© Ø§Ø³ØªØ«Ù†Ø§Ø¦ÙŠØ©",
    final_cta_title: "ØªØ³ÙˆÙ‘Ù‚ÙŠ Ù…Ø¬Ù…ÙˆØ¹ØªÙƒÙ <em>Ø§Ù„ÙØ§Ø®Ø±Ø©</em> Ø§Ù„ÙŠÙˆÙ…",
    final_cta_desc: "ØªÙˆØµÙŠÙ„ Ù„Ø¬Ù…ÙŠØ¹ Ø§Ù„ÙˆÙ„Ø§ÙŠØ§Øª Â· Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Â· Ø¥Ø±Ø¬Ø§Ø¹ Ø³Ù‡Ù„ ÙˆØ³Ø±ÙŠØ¹",
    final_cta_btn: "ØªØ³ÙˆÙ‘Ù‚ÙŠ Ø§Ù„Ø¢Ù†",
    footer_desc: "Ø¯Ø§Ø± Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ ÙˆØ§Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„ÙØ§Ø®Ø±Ø© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©ØŒ Ù†Ù‚Ø¯Ù… Ù…Ù†ØªØ¬Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© 100% Ø¨ØªØ±ÙƒÙŠØ¨Ø§Øª Ø¢Ù…Ù†Ø© ÙˆÙØ¹Ø§Ù„Ø© ØµÙ†Ø¹Øª Ø¨Ø­Ø¨.",
    footer_store: "Ø§Ù„Ù…ØªØ¬Ø±",
    footer_care: "Ø®Ø¯Ù…Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡",
    footer_guide: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…",
    footer_shipping: "Ø§Ù„Ø´Ø­Ù† ÙˆØ§Ù„ØªÙˆØµÙŠÙ„",
    footer_returns: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹ ÙˆØ§Ù„Ø§Ø³ØªØ¨Ø¯Ø§Ù„",
    footer_contact: "ØªÙˆØ§ØµÙ„ÙŠ Ù…Ø¹Ù†Ø§",
    footer_follow: "ØªØ§Ø¨Ø¹ÙŠÙ†Ø§",
    footer_rights: "Â© 2026 LAMSA BEAUTY â€” Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©",
    quick_view: "Ø¹Ø±Ø¶ Ø³Ø±ÙŠØ¹",
    add_to_cart: "Ø£Ø¶ÙŠÙÙŠ Ù„Ù„Ø³Ù„Ø©",
    cart_title: "Ø³Ù„Ø© Ø§Ù„Ù…Ø´ØªØ±ÙŠØ§Øª",
    cart_empty: "Ø³Ù„ØªÙƒÙ ÙØ§Ø±ØºØ© Ø­Ø§Ù„ÙŠØ§Ù‹. ØªØµÙØ­ÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ÙˆØ£Ø¶ÙŠÙÙŠ Ù…Ø§ ÙŠØ¹Ø¬Ø¨ÙƒÙ.",
    checkout_title: "Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø·Ù„Ø¨ (Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù…)",
    client_name: "Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„ *",
    client_phone: "Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ *",
    client_wilaya: "Ø§Ù„ÙˆÙ„Ø§ÙŠØ© *",
    client_commune: "Ø§Ù„Ø¨Ù„Ø¯ÙŠØ© *",
    client_address: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„ÙƒØ§Ù…Ù„ *",
    desk_delivery: "ØªÙˆØµÙŠÙ„ Ù„Ù„Ù…ÙƒØªØ¨ (Stop Desk) - ØªÙƒÙ„ÙØ© Ø´Ø­Ù† Ø£Ù‚Ù„",
    subtotal: "Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„ÙØ±Ø¹ÙŠ:",
    shipping: "ØªÙƒÙ„ÙØ© Ø§Ù„Ø´Ø­Ù†:",
    total: "Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹ Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ:",
    confirm_order: "ØªØ£ÙƒÙŠØ¯ Ø·Ù„Ø¨ÙƒÙ Ø§Ù„Ø¢Ù† â†™",
    wishlist_title: "Ø§Ù„Ù…ÙØ¶Ù„Ø©",
    wishlist_empty: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ÙØ¶Ù„Ø© ÙØ§Ø±ØºØ© Ø­Ø§Ù„ÙŠØ§Ù‹.",
    size_label: "Ø§Ù„Ù†ÙˆØ¹:",
    custom_size_btn: "Ø·Ù„Ø¨ Ø¹Ø¨ÙˆØ© Ù…Ø®ØµØµØ© ðŸ“",
    custom_fitting_title: "Ø§Ù„Ø±ØºØ¨Ø§Øª Ø§Ù„Ø®Ø§ØµØ© Ø£Ùˆ Ù†ÙˆØ¹ Ø§Ù„Ø¨Ø´Ø±Ø© (Ø§Ø®ØªÙŠØ§Ø±ÙŠ):",
    lbl_chest: "Ù†ÙˆØ¹ Ø§Ù„Ø¨Ø´Ø±Ø©",
    lbl_waist: "Ø§Ù„Ù…Ø´Ø§ÙƒÙ„ Ø§Ù„Ù…Ø³ØªÙ‡Ø¯ÙØ©",
    lbl_hips: "Ø§Ù„Ø¹Ù…Ø± Ø§Ù„ØªÙ‚Ø¯ÙŠØ±ÙŠ",
    lbl_shoulders: "Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø¥Ø¶Ø§ÙÙŠØ©",
    lbl_height: "Ø­Ø¬Ù… Ø§Ù„Ø¹Ø¨ÙˆØ© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©",
    custom_fitting_note: "* Ø³ÙŠØªÙ… ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù…Ø³ØªØ­Ø¶Ø± ÙˆØªØ®ØµÙŠØµÙ‡ Ù„ÙŠØªÙ†Ø§Ø³Ø¨ Ù…Ø¹ Ø§Ø­ØªÙŠØ§Ø¬Ø§ØªÙƒÙ ÙˆØ¨Ø´Ø±ØªÙƒÙ Ø¨Ø´ÙƒÙ„ ÙØ±ÙŠØ¯.",
    txt_custom_fitting_note: "* Ø³ÙŠØªÙ… ØªØ±ÙƒÙŠØ¨ Ø§Ù„Ù…Ø³ØªØ­Ø¶Ø± ÙˆØªØ®ØµÙŠØµÙ‡ Ù„ÙŠØªÙ†Ø§Ø³Ø¨ Ù…Ø¹ Ø§Ø­ØªÙŠØ§Ø¬Ø§ØªÙƒÙ ÙˆØ¨Ø´Ø±ØªÙƒÙ Ø¨Ø´ÙƒÙ„ ÙØ±ÙŠØ¯.",
    search_placeholder: "Ø§Ø¨Ø­Ø«ÙŠ Ø¹Ù† ÙƒØ±ÙŠÙ…ØŒ Ø³ÙŠØ±ÙˆÙ…ØŒ Ø¹Ø·Ø±...",
    toast_added_cart: "ØªÙ… Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬ Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø© Ø¨Ù†Ø¬Ø§Ø­.",
    toast_added_wishlist: "ØªÙ… Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬ Ø¥Ù„Ù‰ Ø§Ù„Ù…ÙØ¶Ù„Ø©.",
    toast_removed_wishlist: "ØªÙ… Ø¥Ø²Ø§Ù„Ø© Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„Ù…ÙØ¶Ù„Ø©.",
    toast_view_cart: "Ø¹Ø±Ø¶ Ø§Ù„Ø³Ù„Ø©",
    toast_order_success: "ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø·Ù„Ø¨ÙƒÙ Ø¨Ù†Ø¬Ø§Ø­! Ø³Ù†ØªØµÙ„ Ø¨ÙƒÙ Ù„ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø´Ø­Ù† Ù‚Ø±ÙŠØ¨Ø§Ù‹.",
    success_title: "Ø´ÙƒØ±Ø§Ù‹ Ù„Ø·Ù„Ø¨ÙƒÙ Ø§Ù„Ø£Ù†ÙŠÙ‚!",
    success_desc: "ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨ÙƒÙ Ø¨Ù†Ø¬Ø§Ø­ ØªØ­Øª Ø§Ù„Ø±Ù‚Ù…: ",
    success_note: "Ø³ÙŠØªØµÙ„ Ø¨ÙƒÙ ÙØ±ÙŠÙ‚ Ù…Ø¨ÙŠØ¹Ø§Øª Ù„Ù…Ø³Ø© Ø¨ÙŠÙˆØªÙŠ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø© Ù„ØªØ£ÙƒÙŠØ¯ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø­Ù† ÙˆØ¨Ø¯Ø¡ Ø§Ù„ØªØ­Ø¶ÙŠØ±.",
    success_close: "Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙ‚",
    invoice_title: "ÙØ§ØªÙˆØ±Ø© Ø§Ù„Ø·Ù„Ø¨ Ø§Ù„ØªÙ‚Ø¯ÙŠØ±ÙŠØ©",
    invoice_client: "Ø§Ù„Ø¹Ù…ÙŠÙ„Ø©:",
    invoice_phone: "Ø§Ù„Ù‡Ø§ØªÙ:",
    invoice_wilaya: "Ø§Ù„ÙˆÙ„Ø§ÙŠØ©:",
    invoice_address: "Ø§Ù„Ø¹Ù†ÙˆØ§Ù†:",
    invoice_delivery: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„ØªÙˆØµÙŠÙ„:",
    invoice_home: "ØªÙˆØµÙŠÙ„ Ù„Ù„Ù…Ù†Ø²Ù„",
    invoice_desk: "ØªÙˆØµÙŠÙ„ Ù„Ù„Ù…ÙƒØªØ¨ (Stop Desk)",
    validation_wilaya: "ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙˆÙ„Ø§ÙŠØ© Ø£ÙˆÙ„Ø§Ù‹ Ù„ØªØ­Ø¯ÙŠØ¯ ØªÙƒÙ„ÙØ© Ø§Ù„ØªÙˆØµÙŠÙ„.",
    validation_measurements: "ÙŠØ±Ø¬Ù‰ ÙƒØªØ§Ø¨Ø© Ø±ØºØ¨Ø§ØªÙƒ ÙˆØªÙØ§ØµÙŠÙ„ Ø¨Ø´Ø±ØªÙƒ Ù„ØªÙØµÙŠÙ„ Ø§Ù„ØªØ±ÙƒÙŠØ¨Ø© Ø§Ù„Ù…Ø®ØµØµØ©.",
    validation_phone: "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù‚Ù… Ù‡Ø§ØªÙ ØµØ­ÙŠØ­ ÙÙŠ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± (Ù…Ø«Ù„: 05/06/07).",
    custom_size_badge: "ØªØ±ÙƒÙŠØ¨Ø© Ø®Ø§ØµØ©",
    add_cart_wishlist: "Ø£Ø¶ÙŠÙÙŠ Ù„Ù„Ø³Ù„Ø©",
    quick_view_wishlist: "Ø¹Ø±Ø¶ Ø³Ø±ÙŠØ¹"
  },
  fr: {
    nav_collection: "Collection",
    nav_caftan: "Soin Peau",
    nav_karakou: "Maquillage",
    nav_wedding: "Parfums",
    nav_reviews: "Avis",
    eyebrow_sub: "Maison de soins et cosmÃ©tiques de luxe â€” BeautÃ© naturelle, touche algÃ©rienne",
    hero_title: "Votre beautÃ© <em>mÃ©rite</em><br>les soins les plus fins",
    hero_sub: "SÃ©rum d'or Â· CrÃ¨mes Ã©clat Â· Parfums exclusifs â€” Soins prÃ©parÃ©s avec amour et ingrÃ©dients naturels",
    hero_cta: "DÃ©couvrir la Collection â†™",
    scroll_hint: "DÃ©filer vers le bas",
    runway_eyebrow: "Le secret de l'Ã©clat",
    runway_title: "Sublimer votre beautÃ© <em>avec nos soins 100% naturels</em>",
    runway_label_1: "Extraits botaniques purs pour une peau rayonnante",
    runway_label_2: "Routine complÃ¨te pour un Ã©clat Ã©ternel",
    runway_label_3: "Huiles bio pures sans additifs chimiques",
    runway_label_4: "Effet lissant immÃ©diat et toucher veloutÃ©",
    runway_label_5: "BeautÃ© naturelle rÃ©vÃ©lant votre prÃ©sence unique",
    chapter_1_num: "I",
    chapter_1_title: "CosmÃ©tiques <em>naturels</em> et professionnels",
    chapter_1_desc: "Chaque formule chez Lamsa Beauty est Ã©laborÃ©e avec des ingrÃ©dients botaniques sains et efficaces, par des experts de la peau, pour Ãªtre l'alliÃ©e idÃ©ale de votre beautÃ© au quotidien avec une signature de luxe algÃ©rienne.",
    stat_experience: "ans d'expertise",
    stat_clients: "clientes heureuses",
    stat_handmade: "produits naturels",
    chapter_2_title: "Nouvelle Collection <em>Ã‰clat</em>",
    chapter_2_desc: "Les derniÃ¨res innovations de soins et maquillage conÃ§ues avec des extraits 100% bio.",
    chapter_3_title: "Routine <em>Soin & Peau</em>",
    chapter_3_desc: "CrÃ¨mes de nuit rÃ©gÃ©nÃ©rantes et sÃ©rums revitalisants pour une hydratation intense.",
    chapter_4_title: "Gamme <em>Maquillage & BeautÃ©</em>",
    chapter_4_desc: "Rouges Ã  lÃ¨vres veloutÃ©s, palettes et coffrets complets pour un look radieux.",
    chapter_5_title: "Les Parfums <em>Exclusifs</em>",
    chapter_5_desc: "Des fragrances de prestige concentrÃ©es avec des notes ensorcelantes longue durÃ©e.",
    chapter_6_title: "Les Plus <em>DemandÃ©s</em>",
    chapter_6_desc: "Nos produits de soins et maquillage phares plÃ©biscitÃ©s par nos clientes ce mois-ci.",
    chapter_7_title: "Voyage de <em>Confection</em>",
    chapter_7_step1_title: "01 â€” IngrÃ©dients Bio",
    chapter_7_step1_desc: "SÃ©lection d'huiles essentielles et extraits botaniques organiques certifiÃ©s pour votre sÃ©curitÃ©.",
    chapter_7_step2_title: "02 â€” Formulation & Tests",
    chapter_7_step2_desc: "DÃ©veloppement en laboratoire et tests d'efficacitÃ© pour convenir Ã  tous les types de peaux.",
    chapter_7_step3_title: "03 â€” Fabrication StÃ©rile",
    chapter_7_step3_desc: "PrÃ©paration et mise en flacon dans des conditions d'hygiÃ¨ne rigoureuses pour prÃ©server les actifs.",
    chapter_7_step4_title: "04 â€” Packaging de Luxe",
    chapter_7_step4_desc: "Flacons raffinÃ©s et coffrets soignÃ©s pour un rangement Ã©lÃ©gant ou un cadeau parfait.",
    chapter_7_step5_title: "05 â€” ExpÃ©dition Rapide",
    chapter_7_step5_desc: "Livraison de votre commande emballÃ©e avec prÃ©caution partout en AlgÃ©rie.",
    chapter_8_title: "Ce qu'elles <em>en pensent</em>",
    final_cta_eyebrow: "Votre beautÃ© mÃ©rite l'excellence absolue",
    final_cta_title: "Achetez votre coffret <em>de luxe</em> aujourd'hui",
    final_cta_desc: "Livraison 58 wilayas Â· Paiement cash Ã  la livraison Â· Retours faciles",
    final_cta_btn: "Commander maintenant",
    footer_desc: "Maison de cosmÃ©tiques et soins de luxe, offrant des produits naturels aux formules sÃ»res et performantes.",
    footer_store: "Boutique",
    footer_care: "Service Client",
    footer_guide: "Conseils d'utilisation",
    footer_shipping: "Livraison",
    footer_returns: "Retours & Ã‰changes",
    footer_contact: "Contactez-nous",
    footer_follow: "Suivez-nous",
    footer_rights: "Â© 2026 LAMSA BEAUTY â€” Tous droits rÃ©servÃ©s",
    quick_view: "AperÃ§u rapide",
    add_to_cart: "Ajouter au Panier",
    cart_title: "Votre Panier",
    cart_empty: "Votre panier est vide. DÃ©couvrez nos produits et ajoutez vos coups de cÅ“ur.",
    checkout_title: "Finaliser la commande (COD)",
    client_name: "Nom complet *",
    client_phone: "TÃ©lÃ©phone *",
    client_wilaya: "Wilaya *",
    client_commune: "Commune *",
    client_address: "Adresse complÃ¨te *",
    desk_delivery: "Livraison au bureau (Stop Desk) - Tarif rÃ©duit",
    subtotal: "Sous-total :",
    shipping: "Frais d'envoi :",
    total: "Total :",
    confirm_order: "Confirmer ma commande â†™",
    wishlist_title: "Favoris",
    wishlist_empty: "Votre liste de favoris est vide.",
    size_label: "Taille :",
    custom_size_btn: "Sur Mesure ðŸ“",
    custom_fitting_title: "SpÃ©cifications de peau (Optionnel) :",
    lbl_chest: "Type de peau",
    lbl_waist: "ProblÃ¨mes ciblÃ©s",
    lbl_hips: "Ã‚ge approximatif",
    lbl_shoulders: "Notes spÃ©ciales",
    lbl_height: "Taille du flacon",
    custom_fitting_note: "* La formule sera enrichie et adaptÃ©e spÃ©cialement aux besoins de votre Ã©piderme.",
    txt_custom_fitting_note: "* La formule sera enrichie et adaptÃ©e spÃ©cialement aux besoins de votre Ã©piderme.",
    search_placeholder: "Rechercher crÃ¨me, sÃ©rum, parfum...",
    toast_added_cart: "Produit ajoutÃ© au panier.",
    toast_added_wishlist: "Produit ajoutÃ© aux favoris.",
    toast_removed_wishlist: "Produit retirÃ© des favoris.",
    toast_view_cart: "Voir Panier",
    toast_order_success: "Votre commande a Ã©tÃ© enregistrÃ©e ! Nous vous appellerons bientÃ´t.",
    success_title: "Merci pour votre commande !",
    success_desc: "Commande reÃ§ue sous le numÃ©ro : ",
    success_note: "Notre Ã©quipe vous appellera sous 24h pour confirmer l'expÃ©dition et l'adresse.",
    success_close: "Continuer mes achats",
    invoice_title: "Facture Proforma",
    invoice_client: "Cliente :",
    invoice_phone: "TÃ©lÃ©phone :",
    invoice_wilaya: "Wilaya :",
    invoice_address: "Adresse :",
    invoice_delivery: "Livraison :",
    invoice_home: "Livraison Ã  domicile",
    invoice_desk: "Point Relais (Stop Desk)",
    validation_wilaya: "Veuillez choisir une wilaya pour le calcul des frais d'envoi.",
    validation_measurements: "Veuillez spÃ©cifier vos besoins pour la formule sur-mesure.",
    validation_phone: "Veuillez entrer un numÃ©ro de tÃ©lÃ©phone valide en AlgÃ©rie.",
    custom_size_badge: "Formule personnalisÃ©e",
    add_cart_wishlist: "Ajouter au panier",
    quick_view_wishlist: "DÃ©tails"
  }
};

/* ---------------- Product Database ---------------- */
let productsData = [
  {
    id: 'cream-premium',
    name: 'ÙƒØ±ÙŠÙ… Ø§Ù„Ù†Ø¶Ø§Ø±Ø© Ø§Ù„Ù„ÙŠÙ„ÙŠ Ø§Ù„ÙØ§Ø®Ø±',
    name_fr: 'CrÃ¨me de Nuit Ã‰clat Premium',
    price: 4200,
    oldPrice: 5500,
    tag: 'Ø¬Ø¯ÙŠØ¯',
    tag_fr: 'Nouveau',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-caftan', 'grid-best'],
    desc: 'ÙƒØ±ÙŠÙ… Ù„ÙŠÙ„ÙŠ ØºÙ†ÙŠ ÙˆÙ…ØºØ°ÙŠ Ø¨Ù…Ø³ØªØ®Ù„ØµØ§Øª Ø²Ù‡Ø±Ø© Ø§Ù„Ø£ÙˆØ±ÙƒÙŠØ¯ Ø§Ù„Ø¨Ø±ÙŠØ© ÙˆØ²Ø¨Ø¯Ø© Ø§Ù„Ø´ÙŠØ§ Ø§Ù„Ø¹Ø¶ÙˆÙŠØ©ØŒ ÙŠØ¹Ù…Ù„ Ø¹Ù„Ù‰ ØªØ±Ø·ÙŠØ¨ Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ø¹Ù…Ù‚ ÙˆØªØ¬Ø¯ÙŠØ¯ Ø®Ù„Ø§ÙŠØ§Ù‡Ø§ Ø·ÙˆØ§Ù„ Ø§Ù„Ù„ÙŠÙ„ Ù„ØªØ³ØªÙŠÙ‚Ø¸ÙŠ Ø¨Ø¨Ø´Ø±Ø© Ù…Ø´Ø±Ù‚Ø©ØŒ Ù…Ø´Ø¯ÙˆØ¯Ø© ÙˆÙ†Ø§Ø¹Ù…Ø© ÙƒØ§Ù„Ø­Ø±ÙŠØ±.',
    desc_fr: 'Soin de nuit rÃ©gÃ©nÃ©rant enrichi en extraits d\'orchidÃ©e sauvage et beurre de karitÃ© bio. Hydrate intensÃ©ment, lisse les ridules et unifie le teint durant votre sommeil.'
  },
  {
    id: 'serum-gold',
    name: 'Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ø°Ù‡Ø¨ Ù„Ù„Ø¹Ù†Ø§ÙŠØ© Ø§Ù„Ù…Ø±ÙƒØ²Ø©',
    name_fr: 'SÃ©rum d\'Or Anti-Ã‚ge',
    price: 5800,
    oldPrice: 7200,
    tag: 'Ø§Ù„Ø£ÙƒØ«Ø± Ø±ÙˆØ§Ø¬Ø§Ù‹',
    tag_fr: 'Populaire',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-caftan', 'grid-best'],
    desc: 'Ø³ÙŠØ±ÙˆÙ… Ù…Ø¶Ø§Ø¯ Ù„Ù„Ø£ÙƒØ³Ø¯Ø© Ø¨ØªØ±ÙƒÙŠØ¨Ø© ØºÙ†ÙŠØ© Ø¨Ø¬Ø²ÙŠØ¦Ø§Øª Ø§Ù„Ø°Ù‡Ø¨ Ø¹ÙŠØ§Ø± 24 ÙˆØ­Ù…Ø¶ Ø§Ù„Ù‡ÙŠØ§Ù„ÙˆØ±ÙˆÙ†ÙŠÙƒØŒ ÙŠØ³Ø§Ø¹Ø¯ ÙÙŠ ØªØ­ÙÙŠØ² Ø§Ù„ÙƒÙˆÙ„Ø§Ø¬ÙŠÙ† Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ Ù„Ù„Ø¨Ø´Ø±Ø© ÙˆØ´Ø¯ Ø§Ù„Ø¬Ù„Ø¯ ÙˆØ§Ù„ØªÙ‚Ù„ÙŠÙ„ Ù…Ù† Ø¹Ù„Ø§Ù…Ø§Øª Ø§Ù„Ø´ÙŠØ®ÙˆØ®Ø© ÙˆØ§Ù„ØªØ±Ù‡Ù„ Ø¨Ø´ÙƒÙ„ ÙÙˆØ±ÙŠ.',
    desc_fr: 'Ã‰lixir anti-Ã¢ge concentrÃ© aux micro-particules d\'or 24 carats et acide hyaluronique. Booste la production de collagÃ¨ne, raffermit l\'Ã©piderme et redonne un Ã©clat instantanÃ©.'
  },
  {
    id: 'lipstick-matte',
    name: 'Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡ "Ù„Ù…Ø³Ø© Ù…Ø®Ù…Ù„ÙŠØ©"',
    name_fr: 'Rouge Ã  LÃ¨vres VeloutÃ©',
    price: 2400,
    oldPrice: null,
    tag: 'Ø¬Ø¯ÙŠØ¯',
    tag_fr: 'Nouveau',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-karakou', 'grid-best'],
    desc: 'Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡ ÙƒØ±ÙŠÙ…ÙŠ Ù…Ø·ÙØ£ (Matte) ÙŠÙ…Ù†Ø­ Ø´ÙØªÙŠÙƒÙ ØªØºØ·ÙŠØ© ÙƒØ§Ù…Ù„Ø© ÙˆÙ„ÙˆÙ†Ø§Ù‹ ØºÙ†ÙŠØ§Ù‹ Ø«Ø§Ø¨ØªØ§Ù‹ ÙŠØ¯ÙˆÙ… Ù„Ù€ 12 Ø³Ø§Ø¹Ø©ØŒ Ù…Ø¹ ØªØ±ÙƒÙŠØ¨Ø© ØºÙ†ÙŠØ© Ø¨ÙÙŠØªØ§Ù…ÙŠÙ† E Ù„Ù…Ù†Ø¹ Ø¬ÙØ§Ù Ø£Ùˆ ØªØ´Ù‚Ù‚ Ø§Ù„Ø´ÙØ§Ù‡.',
    desc_fr: 'Rouge Ã  lÃ¨vres liquide fini mat velours longue tenue 12h. Formule hautement pigmentÃ©e et enrichie en vitamine E pour des lÃ¨vres hydratÃ©es et sublimÃ©es.'
  },
  {
    id: 'perfume-asala',
    name: 'Ø¹Ø·Ø± Ø§Ù„Ø£ØµØ§Ù„Ø© Ø§Ù„Ù…Ù„ÙƒÙŠ',
    name_fr: 'Parfum L\'Original Royal',
    price: 7500,
    oldPrice: null,
    tag: 'Ø­ØµØ±ÙŠ',
    tag_fr: 'Exclusif',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-new', 'grid-wedding', 'grid-best'],
    desc: 'ØªØ±ÙƒÙŠØ¨Ø© Ø¹Ø·Ø±ÙŠØ© Ø³Ø§Ø­Ø±Ø© ØªÙ…Ø²Ø¬ Ø¨ÙŠÙ† Ù†ÙØ­Ø§Øª Ø§Ù„Ø¹ÙˆØ¯ Ø§Ù„ÙØ§Ø®Ø±ØŒ Ø®Ø´Ø¨ Ø§Ù„ØµÙ†Ø¯Ù„ Ø§Ù„Ø¯Ø§ÙØ¦ ÙˆØ§Ù„ÙŠØ§Ø³Ù…ÙŠÙ† Ø§Ù„Ø¨Ø±ÙŠ. Ø¹Ø·Ø± Ø´Ø±Ù‚ÙŠ ØºÙ†ÙŠ ÙˆÙ…Ù…ÙŠØ² ÙŠØ¹ÙƒØ³ Ø­Ø¶ÙˆØ±Ùƒ Ø§Ù„Ù‚ÙˆÙŠ ÙˆØ§Ù„Ø±Ø§Ù‚ÙŠ ÙÙŠ ÙƒÙ„ Ù…ÙƒØ§Ù†.',
    desc_fr: 'Fragrance mystique mÃªlant des notes de oud prÃ©cieux, de bois de santal chaleureux et de jasmin sauvage. Un sillage puissant et raffinÃ© pour vos grandes occasions.'
  },
  {
    id: 'oil-argan',
    name: 'Ø²ÙŠØª Ø§Ù„Ø£Ø±ØºØ§Ù† Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ Ø§Ù„Ù†Ù‚ÙŠ',
    name_fr: 'Huile d\'Argan Pure Bio',
    price: 3200,
    oldPrice: 4000,
    tag: 'Ø·Ø¨ÙŠØ¹ÙŠ',
    tag_fr: 'Bio',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'Ø²ÙŠØª Ø£Ø±ØºØ§Ù† Ù†ÙˆÙŠ 100% Ù…Ø¹ØµÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø§Ø±Ø¯ØŒ Ù…ØºØ°Ù‘Ù ØºÙ†ÙŠ Ø¨Ø§Ù„Ø£Ø­Ù…Ø§Ø¶ Ø§Ù„Ø¯Ù‡Ù†ÙŠØ© ÙˆÙÙŠØªØ§Ù…ÙŠÙ† EØŒ Ø±Ø§Ø¦Ø¹ Ù„ØªØ±Ø·ÙŠØ¨ Ø§Ù„Ø¨Ø´Ø±Ø© ÙˆØªÙ†Ø¹ÙŠÙ… Ø§Ù„Ø´Ø¹Ø± Ø§Ù„Ø¬Ø§Ù ÙˆØ§Ù„ØªØ§Ù„Ù ÙˆØ¥Ø¹Ø·Ø§Ø¦Ù‡ Ù„Ù…Ø¹Ø§Ù†Ø§Ù‹ Ø·Ø¨ÙŠØ¹ÙŠØ§Ù‹.',
    desc_fr: 'Huile d\'argan pure 100% extraite Ã  froid. Riche en acides gras essentiels et vitamine E, elle nourrit intensÃ©ment les cheveux et hydrate le corps.'
  },
  {
    id: 'makeup-set',
    name: 'Ù…Ø¬Ù…ÙˆØ¹Ø© Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ "Ø¨ÙŠÙˆØªÙŠ Ø¨ÙˆÙƒØ³"',
    name_fr: 'Beauty Box Coffret',
    price: 9500,
    oldPrice: 12000,
    tag: 'Ø¹Ø±Ø¶ Ø®Ø§Øµ',
    tag_fr: 'Offre',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-karakou'],
    desc: 'Ø­Ù‚ÙŠØ¨Ø© Ù…ØªÙƒØ§Ù…Ù„Ø© ØªØ¶Ù… Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ©: ÙƒØ±ÙŠÙ… Ø£Ø³Ø§Ø³ Ù…Ø±Ø·Ø¨ØŒ Ø¸Ù„Ø§Ù„ Ø¹ÙŠÙˆÙ† Ø¨Ø£Ù„ÙˆØ§Ù† ØªØ±Ø§Ø¨ÙŠØ© Ù†Ø§Ø¹Ù…Ø©ØŒ Ù…Ø³ÙƒØ±Ø© ØªØ·ÙˆÙŠÙ„ Ø§Ù„Ø±Ù…ÙˆØ´ØŒ ÙˆØ£Ø­Ù…Ø± Ø´ÙØ§Ù‡ Ù…Ø®Ù…Ù„ÙŠ Ù…Ù…ÙŠØ².',
    desc_fr: 'Coffret complet rÃ©unissant nos essentiels maquillage : fond de teint Ã©clat, palette nude, mascara volume intense et rouge Ã  lÃ¨vres mat.'
  },
  {
    id: 'rose-water',
    name: 'Ù…Ø§Ø¡ Ø§Ù„ÙˆØ±Ø¯ Ø§Ù„Ù…Ù‚Ø·Ø± Ø§Ù„Ø¹Ø¶ÙˆÙŠ',
    name_fr: 'Eau de Rose DistillÃ©e',
    price: 1800,
    oldPrice: null,
    tag: 'Ø·Ø¨ÙŠØ¹ÙŠ',
    tag_fr: 'Naturel',
    image: 'https://images.unsplash.com/photo-1614859324967-bdf461fcf7f4?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614859324967-bdf461fcf7f4?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'ØªÙˆÙ†Ø± Ø·Ø¨ÙŠØ¹ÙŠ Ù…Ù‡Ø¯Ø¦ Ù„Ù„Ø¨Ø´Ø±Ø© Ù…Ù‚Ø·Ø± Ù…Ù† Ø£ÙˆØ±Ø§Ù‚ Ø§Ù„ÙˆØ±Ø¯ Ø§Ù„Ø¬ÙˆØ±ÙŠ Ø§Ù„Ø·Ø§Ø²Ø¬Ø©ØŒ ÙŠØ³Ø§Ø¹Ø¯ ÙÙŠ Ù‚Ø¨Ø¶ Ø§Ù„Ù…Ø³Ø§Ù… ÙˆØªÙ„Ø·ÙŠÙ Ø§Ù„ØªÙ‡ÙŠØ¬ ÙˆØªÙ†Ø´ÙŠØ· Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ø¯Ù…ÙˆÙŠØ© Ù„Ù„ÙˆØ¬Ù‡ Ø¨Ø¶ØºØ·Ø© ÙˆØ§Ø­Ø¯Ø©.',
    desc_fr: 'Tonique apaisant naturel distillÃ© Ã  partir de pÃ©tales de roses fraÃ®ches. Resserre les pores, rafraÃ®chit le teint et calme les irritations.'
  },
  {
    id: 'scrub-coffee',
    name: 'Ù…Ù‚Ø´Ø± Ø§Ù„Ù‚Ù‡ÙˆØ© Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ Ø§Ù„Ù…Ù†Ø¹Ù…',
    name_fr: 'Gommage au CafÃ© Doux',
    price: 2200,
    oldPrice: 2800,
    tag: null,
    tag_fr: null,
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=600&auto=format&fit=crop'
    ],
    grids: ['grid-caftan'],
    desc: 'Ù…Ù‚Ø´Ø± Ù„Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„Ø¬Ø³Ù… Ù…ØµÙ†ÙˆØ¹ Ù…Ù† Ø­Ø¨ÙŠØ¨Ø§Øª Ø§Ù„Ù‚Ù‡ÙˆØ© Ø§Ù„Ø¹Ø¶ÙˆÙŠØ© Ø§Ù„Ù…Ø·Ø­ÙˆÙ†Ø© ÙˆØ²ÙŠØª Ø¬ÙˆØ² Ø§Ù„Ù‡Ù†Ø¯ØŒ ÙŠØ²ÙŠÙ„ Ø§Ù„Ø®Ù„Ø§ÙŠØ§ Ø§Ù„Ù…ÙŠØªØ© Ø¨Ù„Ø·Ù ÙˆÙŠÙ†Ø´Ø· Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ø¯Ù…ÙˆÙŠØ© Ù„ÙŠØªØ±Ùƒ Ø¨Ø´Ø±ØªÙƒ Ù†Ø§Ø¹Ù…Ø© ÙˆØ±Ø·Ø¨Ø©.',
    desc_fr: 'Gommage exfoliant corporel et visage aux grains de cafÃ© robusta et huile de coco. Ã‰limine les cellules mortes et attÃ©nue la cellulite.'
  }
];

/* ---------------- Algerian Wilayas Shipping Fees ---------------- */
const wilayas = [
  { code: '01', name: 'أدرار', name_fr: 'Adrar', homeFee: 1000, deskFee: 700 },
  { code: '02', name: 'الشلف', name_fr: 'Chlef', homeFee: 650, deskFee: 450 },
  { code: '03', name: 'الأغواط', name_fr: 'Laghouat', homeFee: 700, deskFee: 500 },
  { code: '04', name: 'أم البواقي', name_fr: 'Oum El Bouaghi', homeFee: 650, deskFee: 450 },
  { code: '05', name: 'باتنة', name_fr: 'Batna', homeFee: 650, deskFee: 450 },
  { code: '06', name: 'بجاية', name_fr: 'Bejaia', homeFee: 650, deskFee: 450 },
  { code: '07', name: 'بسكرة', name_fr: 'Biskra', homeFee: 700, deskFee: 500 },
  { code: '08', name: 'بشار', name_fr: 'Bechar', homeFee: 1000, deskFee: 700 },
  { code: '09', name: 'البليدة', name_fr: 'Blida', homeFee: 500, deskFee: 350 },
  { code: '10', name: 'البويرة', name_fr: 'Bouira', homeFee: 600, deskFee: 400 },
  { code: '11', name: 'تمنراست', name_fr: 'Tamanrasset', homeFee: 1100, deskFee: 800 },
  { code: '12', name: 'تبسة', name_fr: 'Tebessa', homeFee: 650, deskFee: 450 },
  { code: '13', name: 'تلمسان', name_fr: 'Tlemcen', homeFee: 650, deskFee: 450 },
  { code: '14', name: 'تيارت', name_fr: 'Tiaret', homeFee: 650, deskFee: 450 },
  { code: '15', name: 'تيزي وزو', name_fr: 'Tizi Ouzou', homeFee: 600, deskFee: 400 },
  { code: '16', name: 'الجزائر العاصمة', name_fr: 'Alger', homeFee: 400, deskFee: 250 },
  { code: '17', name: 'الجلفة', name_fr: 'Djelfa', homeFee: 650, deskFee: 450 },
  { code: '18', name: 'جيجل', name_fr: 'Jijel', homeFee: 650, deskFee: 450 },
  { code: '19', name: 'سطيف', name_fr: 'Setif', homeFee: 600, deskFee: 400 },
  { code: '20', name: 'سعيدة', name_fr: 'Saida', homeFee: 650, deskFee: 450 },
  { code: '21', name: 'سكيكدة', name_fr: 'Skikda', homeFee: 650, deskFee: 450 },
  { code: '22', name: 'سيدي بلعباس', name_fr: 'Sidi Bel Abbes', homeFee: 650, deskFee: 450 },
  { code: '23', name: 'عنابة', name_fr: 'Annaba', homeFee: 600, deskFee: 400 },
  { code: '24', name: 'قالمة', name_fr: 'Guelma', homeFee: 650, deskFee: 450 },
  { code: '25', name: 'قسنطينة', name_fr: 'Constantine', homeFee: 600, deskFee: 400 },
  { code: '26', name: 'المدية', name_fr: 'Medea', homeFee: 600, deskFee: 400 },
  { code: '27', name: 'مستغانم', name_fr: 'Mostaganem', homeFee: 650, deskFee: 450 },
  { code: '28', name: 'المسيلة', name_fr: 'M\'sila', homeFee: 650, deskFee: 450 },
  { code: '29', name: 'معسكر', name_fr: 'Mascara', homeFee: 650, deskFee: 450 },
  { code: '30', name: 'ورقلة', name_fr: 'Ouargla', homeFee: 900, deskFee: 600 },
  { code: '31', name: 'وهران', name_fr: 'Oran', homeFee: 600, deskFee: 400 },
  { code: '32', name: 'البيض', name_fr: 'El Bayadh', homeFee: 750, deskFee: 500 },
  { code: '33', name: 'إليزي', name_fr: 'Illizi', homeFee: 1200, deskFee: 900 },
  { code: '34', name: 'برج بوعريريج', name_fr: 'Bordj Bou Arreridj', homeFee: 600, deskFee: 400 },
  { code: '35', name: 'بومرداس', name_fr: 'Boumerdes', homeFee: 500, deskFee: 350 },
  { code: '36', name: 'الطارف', name_fr: 'El Tarf', homeFee: 650, deskFee: 450 },
  { code: '37', name: 'تندوف', name_fr: 'Tindouf', homeFee: 1200, deskFee: 900 },
  { code: '38', name: 'تيسمسيلت', name_fr: 'Tissemsilt', homeFee: 650, deskFee: 450 },
  { code: '39', name: 'الوادي', name_fr: 'El Oued', homeFee: 750, deskFee: 500 },
  { code: '40', name: 'خنشلة', name_fr: 'Khenchela', homeFee: 650, deskFee: 450 },
  { code: '41', name: 'سوق أهراس', name_fr: 'Souk Ahras', homeFee: 650, deskFee: 450 },
  { code: '42', name: 'تيبازة', name_fr: 'Tipaza', homeFee: 500, deskFee: 350 },
  { code: '43', name: 'ميلة', name_fr: 'Mila', homeFee: 650, deskFee: 450 },
  { code: '44', name: 'عين الدفلى', name_fr: 'Ain Defla', homeFee: 600, deskFee: 400 },
  { code: '45', name: 'النعامة', name_fr: 'Naama', homeFee: 750, deskFee: 550 },
  { code: '46', name: 'عين تموشنت', name_fr: 'Ain Temouchent', homeFee: 650, deskFee: 450 },
  { code: '47', name: 'غرداية', name_fr: 'Ghardaia', homeFee: 800, deskFee: 550 },
  { code: '48', name: 'غليزان', name_fr: 'Relizane', homeFee: 650, deskFee: 450 },
  { code: '49', name: 'تيميمون', name_fr: 'Timimoun', homeFee: 1000, deskFee: 700 },
  { code: '50', name: 'برج باجي مختار', name_fr: 'Bordj Badji Mokhtar', homeFee: 1300, deskFee: 1000 },
  { code: '51', name: 'أولاد جلال', name_fr: 'Ouled Djellal', homeFee: 750, deskFee: 500 },
  { code: '52', name: 'بني عباس', name_fr: 'Béni Abbès', homeFee: 1000, deskFee: 700 },
  { code: '53', name: 'عين صالح', name_fr: 'In Salah', homeFee: 1100, deskFee: 800 },
  { code: '54', name: 'عين قزام', name_fr: 'In Guezzam', homeFee: 1200, deskFee: 900 },
  { code: '55', name: 'تقرت', name_fr: 'Touggourt', homeFee: 900, deskFee: 600 },
  { code: '56', name: 'جانت', name_fr: 'Djanet', homeFee: 1200, deskFee: 900 },
  { code: '57', name: 'المغير', name_fr: 'El M\'Ghair', homeFee: 800, deskFee: 550 },
  { code: '58', name: 'المنيعة', name_fr: 'El Meniaa', homeFee: 800, deskFee: 550 }
];

/* ---------------- App State ---------------- */
let cart = JSON.parse(localStorage.getItem('zf_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('zf_wishlist') || '[]');
let currentLang = localStorage.getItem('zf_lang') || 'ar';
let selectedSize = '38';
let activeProductId = '';

/* ---------------- Format Currency Helper ---------------- */
function formatPrice(amount) {
  if (currentLang === 'ar') {
    return amount.toLocaleString('ar-DZ') + ' دج';
  } else {
    return amount.toLocaleString('fr-DZ') + ' DA';
  }
}

/* ---------------- Render Products to Grids ---------------- */
function renderProducts() {
  const grids = ['grid-new', 'grid-caftan', 'grid-karakou', 'grid-wedding', 'grid-best'];
  
  grids.forEach(gridId => {
    const container = document.getElementById(gridId);
    if (!container) return;
    container.innerHTML = '';
    
    productsData.forEach(p => {
      // Filter if product belongs to this grid
      if (p.grids.includes(gridId)) {
        const isWishlisted = wishlist.includes(p.id);
        const card = document.createElement('div');
        card.className = 'card reveal';
        
        const displayName = currentLang === 'ar' ? p.name : p.name_fr;
        const displayTag = currentLang === 'ar' ? p.tag : p.tag_fr;
        const displayPrice = formatPrice(p.price);
        const displayOldPrice = p.oldPrice ? formatPrice(p.oldPrice) : '';
        const quickViewText = translations[currentLang].quick_view;
        const addCartText = translations[currentLang].add_to_cart;
        
        card.innerHTML = `
          <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="${translations[currentLang].wishlist_title}">
            ${isWishlisted ? '♥' : '♡'}
          </button>
          <div class="card-img pp-trigger" data-id="${p.id}" style="background-image: url('${p.image}'); cursor: pointer;">
            <div class="glow"></div>
            <div class="fabric"></div>
            ${displayTag ? `<span class="tag">${displayTag}</span>` : ''}
          </div>
          <div class="card-body pp-trigger" data-id="${p.id}" style="cursor: pointer;">
            <h3>${displayName}</h3>
            <div class="price">${displayPrice} ${p.oldPrice ? `<s>${displayOldPrice}</s>` : ''}</div>
          </div>
          <div class="card-actions">
            <button class="qv-btn" data-id="${p.id}">${quickViewText}</button>
            <button class="card-buynow-btn pp-open-btn" data-id="${p.id}">🛍️ اطلبي الآن</button>
          </div>
        `;
        
        container.appendChild(card);
        attachTilt(card);
      }
    });
  });
  
  // Attach Event Listeners to rendered buttons
  document.querySelectorAll('.qv-btn').forEach(btn => {
    btn.addEventListener('click', () => openQuickView(btn.getAttribute('data-id')));
  });
  
  document.querySelectorAll('.pp-open-btn, .pp-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      openProductPage(btn.getAttribute('data-id'));
    });
  });
  
  document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn.getAttribute('data-id'));
    });
  });

  // Re-observe newly rendered .reveal elements
  if (typeof initReveal === 'function') initReveal();
}

/* ---------------- Render Reviews ---------------- */
const reviews = {
  ar: [
    ['Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ø°Ù‡Ø¨ ØºÙŠØ± Ø¨Ø´Ø±ØªÙŠ ØªÙ…Ø§Ù…Ø§Ù‹! Ø£ØµØ¨Ø­Øª Ù†Ø¶Ø±Ø© ÙˆÙ…Ø´Ø¯ÙˆØ¯Ø© ÙˆØ§Ù„Ø®Ø·ÙˆØ· Ø®ÙØª Ø¨Ø´ÙƒÙ„ Ù…Ù„Ø­ÙˆØ¸.', 'Ø³Ø§Ø±Ø©ØŒ Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©'],
    ['ÙƒØ±ÙŠÙ… Ø§Ù„Ù„ÙŠÙ„ Ø§Ù„ÙØ§Ø®Ø± Ù…Ø±Ø·Ø¨ Ø±Ù‡ÙŠØ¨ ÙˆØ±ÙŠØ­ØªÙ‡ ØªØ§Ø®Ø° Ø§Ù„Ø¹Ù‚Ù„ØŒ Ø§Ù„ØªØ¹Ø¨Ø¦Ø© ÙØ®Ù…Ø© Ø¬Ø¯Ø§Ù‹.', 'Ù„ÙŠÙ„Ù‰ØŒ ÙˆÙ‡Ø±Ø§Ù†'],
    ['Ø£Ø­Ù…Ø± Ø§Ù„Ø´ÙØ§Ù‡ Ø«Ø§Ø¨Øª Ø·ÙˆÙ„ Ø§Ù„ÙŠÙˆÙ… ÙˆÙ…Ø§ ÙŠØ¬ÙÙ Ø§Ù„Ø´ÙØ§ÙŠÙ Ø£Ø¨Ø¯Ø§Ù‹ØŒ Ø£Ù†ØµØ­ Ø¨Ù‡ Ø¨Ø´Ø¯Ø©.', 'Ø¢Ù…Ø§Ù„ØŒ Ù‚Ø³Ù†Ø·ÙŠÙ†Ø©'],
    ['Ø§Ù„Ø¹Ø·ÙˆØ± Ø¹Ù†Ø¯Ù‡Ù… Ø«Ø¨Ø§ØªÙ‡Ø§ Ø±Ø§Ø¦Ø¹ ÙˆØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ ÙÙŠ ÙŠÙˆÙ…ÙŠÙ† ÙÙ‚Ø·.', 'Ù†ÙˆØ± Ø§Ù„Ù‡Ø¯Ù‰ØŒ Ø¹Ù†Ø§Ø¨Ø©'],
  ],
  fr: [
    ['Le sÃ©rum d\'or a transformÃ© ma peau ! Elle est plus ferme et lumineuse.', 'Sarah, Alger'],
    ['La crÃ¨me de nuit est incroyablement hydratante, parfum trÃ¨s subtil.', 'Lila, Oran'],
    ['Le rouge Ã  lÃ¨vres mat tient toute la journÃ©e sans dessÃ©cher, j\'adore.', 'Amel, Constantine'],
    ['Leurs parfums ont une tenue exceptionnelle, livraison rapide.', 'Nour El Houda, Annaba'],
  ]
};

function renderReviews() {
  const track = document.getElementById('reviewTrack');
  if (!track) return;
  track.innerHTML = '';
  
  const list = reviews[currentLang];
  list.forEach(([txt, who]) => {
    const el = document.createElement('div');
    el.className = 'review';
    el.innerHTML = `<div class="stars">★★★★★</div><p>"${txt}"</p><div class="who">— ${who}</div>`;
    track.appendChild(el);
  });
}

/* ---------------- Render Instagram ---------------- */
function renderInstagram() {
  const instaGrid = document.getElementById('instaGrid');
  if (!instaGrid) return;
  instaGrid.innerHTML = '';
  
  const instaImages = [
    'assets/caftan-zahia.png',
    'assets/karakou-velvet.png',
    'assets/dress-star.png',
    'assets/caftan-alhambra.png',
    'assets/wedding-princess.png',
    'assets/intro-visual.png'
  ];
  
  const positions = ['top center', 'center center', 'bottom center', 'center left', 'center right', 'bottom right'];
  const transforms = ['scale(1)', 'scale(1.05) rotate(1deg)', 'scale(1.02) rotate(-1deg)', 'scale(1.07)', 'scale(1.01)', 'scale(1.04)'];
  
  for (let i = 0; i < 12; i++) {
    const d = document.createElement('div');
    d.className = 'insta-item';
    const img = instaImages[i % instaImages.length];
    d.style.backgroundImage = `url('${img}')`;
    d.style.backgroundPosition = positions[i % positions.length];
    d.style.transform = transforms[i % transforms.length];
    d.style.cursor = 'pointer';
    d.onclick = () => window.open('https://www.instagram.com/lamsa_beauty_dz/', '_blank');
    instaGrid.appendChild(d);
  }
}

/* ---------------- Toast Notification System ---------------- */
function showToast(message, actionText = '', actionCallback = null) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  toast.innerHTML = `
    <span>${message}</span>
    <div style="display:flex; gap:10px; align-items:center;">
      ${actionText ? `<button class="toast-action">${actionText}</button>` : ''}
      <button class="toast-close">&times;</button>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Setup dismiss timers
  const timer = setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
  
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    toast.remove();
  });
  
  if (actionText && actionCallback) {
    toast.querySelector('.toast-action').addEventListener('click', () => {
      clearTimeout(timer);
      toast.remove();
      actionCallback();
    });
  }
}

/* ---------------- Wishlist Management ---------------- */
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const isAdding = index === -1;
  
  if (isAdding) {
    wishlist.push(productId);
    showToast(translations[currentLang].toast_added_wishlist);
  } else {
    wishlist.splice(index, 1);
    showToast(translations[currentLang].toast_removed_wishlist);
  }
  
  localStorage.setItem('zf_wishlist', JSON.stringify(wishlist));
  
  // Re-sync UI hearts
  document.querySelectorAll(`.card-wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', isAdding);
    btn.innerHTML = isAdding ? '♥' : '♡';
  });
  
  updateHeaderBadges();
  renderWishlist();
}

function renderWishlist() {
  const listContainer = document.getElementById('wishlistItemsList');
  const emptyMsg = document.getElementById('wishlistEmptyMsg');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  if (wishlist.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }
  
  if (emptyMsg) emptyMsg.style.display = 'none';
  
  wishlist.forEach(pid => {
    const p = productsData.find(item => item.id === pid);
    if (!p) return;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'wishlist-item';
    
    const displayName = currentLang === 'ar' ? p.name : p.name_fr;
    const displayPrice = formatPrice(p.price);
    
    itemEl.innerHTML = `
      <img src="${p.image}" alt="${displayName}">
      <div class="wishlist-item-info">
        <h4 class="wishlist-item-title">${displayName}</h4>
        <div class="wishlist-item-price">${displayPrice}</div>
        <div class="wishlist-actions">
          <button class="add-cart" onclick="moveToCartFromWishlist('${p.id}')">${translations[currentLang].add_cart_wishlist}</button>
          <button onclick="toggleWishlist('${p.id}')">${translations[currentLang].quick_view_wishlist}</button>
        </div>
      </div>
    `;
    
    listContainer.appendChild(itemEl);
  });
}

function moveToCartFromWishlist(productId) {
  addToCart(productId, '38', 1, null);
  toggleWishlist(productId); // Remove from wishlist
}

/* ---------------- Cart Management ---------------- */
function addToCart(productId, size, quantity, measurements = null) {
  // Check if same item with same size and measurements already exists
  const existingIndex = cart.findIndex(item => 
    item.id === productId && 
    item.size === size && 
    JSON.stringify(item.measurements) === JSON.stringify(measurements)
  );
  
  const p = productsData.find(pd => pd.id === productId);
  if (p) {
    trackBrowserEvent('AddToCart', { content_name: p.name, value: p.price * quantity });
  }
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ id: productId, size, quantity, measurements });
  }
  
  localStorage.setItem('zf_cart', JSON.stringify(cart));
  updateHeaderBadges();
  renderCart();
  
  // Show toast with option to view cart drawer
  showToast(
    translations[currentLang].toast_added_cart,
    translations[currentLang].toast_view_cart,
    () => openDrawer('cartDrawer')
  );
}

function updateCartQty(index, newQty) {
  if (newQty < 1) {
    removeFromCart(index);
    return;
  }
  cart[index].quantity = newQty;
  localStorage.setItem('zf_cart', JSON.stringify(cart));
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('zf_cart', JSON.stringify(cart));
  updateHeaderBadges();
  renderCart();
}

function populateWilayasDropdown() {
  const select = document.getElementById('clientWilaya');
  if (!select) return;
  
  // Keep first option
  const firstOption = select.options[0];
  select.innerHTML = '';
  select.appendChild(firstOption);
  
  wilayas.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.code;
    opt.textContent = `${w.code} - ${currentLang === 'ar' ? w.name : w.name_fr}`;
    select.appendChild(opt);
  });
}

function calculateShippingCost() {
  const select = document.getElementById('clientWilaya');
  const deskCheck = document.getElementById('deskDelivery');
  if (!select || !select.value) return 0;
  
  const w = wilayas.find(item => item.code === select.value);
  if (!w) return 0;
  
  let cost = w.homeFee;
  if (deskCheck && deskCheck.checked) {
    cost = w.deskFee; // lower rate for desk stop delivery
  }
  return cost;
}

function renderCart() {
  const listContainer = document.getElementById('cartItemsList');
  const emptyMsg = document.getElementById('cartEmptyMsg');
  const footer = document.getElementById('cartFooter');
  const checkoutSec = document.getElementById('checkoutSection');
  
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (footer) footer.style.display = 'none';
    if (checkoutSec) checkoutSec.style.display = 'none';
    return;
  }
  
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (footer) footer.style.display = 'block';
  if (checkoutSec) checkoutSec.style.display = 'block';
  
  let subtotal = 0;
  
  cart.forEach((item, index) => {
    const p = productsData.find(pd => pd.id === item.id);
    if (!p) return;
    
    const displayName = currentLang === 'ar' ? p.name : p.name_fr;
    const itemTotal = p.price * item.quantity;
    subtotal += itemTotal;
    
    const sizeLabel = item.size === 'custom' ? translations[currentLang].custom_size_badge : `FR ${item.size}`;
    
    let measHTML = '';
    if (item.measurements) {
      const { chest, waist, hips, shoulders, height } = item.measurements;
      measHTML = `
        <div class="cart-item-measurements">
          C:${chest} W:${waist} H:${hips} S:${shoulders} L:${height}
        </div>
      `;
    }
    
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${p.image}" alt="${displayName}">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${displayName}</h4>
        <div class="cart-item-size">${translations[currentLang].size_label} ${sizeLabel}</div>
        ${measHTML}
        <div class="cart-item-row">
          <div class="cart-item-qty">
            <button onclick="updateCartQty(${index}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQty(${index}, ${item.quantity + 1})">+</button>
          </div>
          <span class="cart-item-price">${formatPrice(itemTotal)}</span>
        </div>
        <div style="text-align:left; margin-top:6px;">
          <button class="cart-item-remove" onclick="removeFromCart(${index})">${currentLang === 'ar' ? 'حذف' : 'Retirer'}</button>
        </div>
      </div>
    `;
    listContainer.appendChild(itemEl);
  });
  
  // Calculate pricing
  const shippingCost = calculateShippingCost();
  const totalCost = subtotal + shippingCost;
  
  document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('cartShipping').textContent = shippingCost > 0 ? formatPrice(shippingCost) : '—';
  document.getElementById('cartTotal').textContent = formatPrice(totalCost);

  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = translations[currentLang].confirm_order;
  }
}

function updateHeaderBadges() {
  const cartCountEl = document.getElementById('cartCount');
  const wishlistCountEl = document.getElementById('wishlistCount');
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCountEl) cartCountEl.textContent = totalCartItems;
  if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
}

/* ---------------- Drawer & Modal Open/Close Controls ---------------- */
function openDrawer(drawerId) {
  const d = document.getElementById(drawerId);
  if (!d) return;
  d.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  if (drawerId === 'cartDrawer') {
    renderCart();
  } else if (drawerId === 'wishlistDrawer') {
    renderWishlist();
  }
}

function closeDrawer(drawerId) {
  const d = document.getElementById(drawerId);
  if (!d) return;
  d.classList.remove('open');
  document.body.style.overflow = '';
}

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------------- Quick View Operations ---------------- */
function openQuickView(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;
  
  trackBrowserEvent('ViewContent', { content_name: p.name, value: p.price });
  
  activeProductId = productId;
  selectedSize = '38';
  document.getElementById('qvQty').textContent = '1';
  
  // Populate
  const qvImage = document.getElementById('qvImage');
  const qvTitle = document.getElementById('qvTitle');
  const qvTag = document.getElementById('qvTag');
  const qvPrice = document.getElementById('qvPrice');
  const qvOldPrice = document.getElementById('qvOldPrice');
  const qvDesc = document.getElementById('qvDescription');
  
  qvImage.src = p.image;
  qvTitle.textContent = currentLang === 'ar' ? p.name : p.name_fr;
  qvDesc.textContent = currentLang === 'ar' ? p.desc : p.desc_fr;
  
  qvPrice.textContent = formatPrice(p.price);
  if (p.oldPrice) {
    qvOldPrice.textContent = formatPrice(p.oldPrice);
    qvOldPrice.style.display = 'inline';
  } else {
    qvOldPrice.style.display = 'none';
  }
  
  const tagText = currentLang === 'ar' ? p.tag : p.tag_fr;
  if (tagText) {
    qvTag.textContent = tagText;
    qvTag.style.display = 'inline-block';
  } else {
    qvTag.style.display = 'none';
  }
  
  // Reset sizes buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-size') === '38');
  });
  
  document.getElementById('customMeasurementsSection').style.display = 'none';
  
  // Clear inputs
  document.getElementById('mChest').value = '';
  document.getElementById('mWaist').value = '';
  document.getElementById('mHips').value = '';
  document.getElementById('mShoulders').value = '';
  document.getElementById('mHeight').value = '';
  
  openModal('quickViewModal');
}

/* ---------------- COD Checkout Submit ---------------- */
function handleOrderSubmit(e) {
  // [معزول بالكامل] الطلبات لا ترسل إلى لوحة التحكم لحماية الخصوصية ومطابقة إعدادات المتجر الساكن
  e.preventDefault();
  
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const wilayaCode = document.getElementById('clientWilaya').value;
  const address = document.getElementById('clientAddress').value.trim();
  
  if (!wilayaCode) {
    alert(translations[currentLang].validation_wilaya);
    return;
  }
  
  if (!name || name.length < 2) {
    alert(currentLang === 'ar' ? '⚠️ يرجى إدخال الاسم الكامل' : '⚠️ Veuillez entrer votre nom complet');
    return;
  }

  if (!address) {
    alert(currentLang === 'ar' ? '⚠️ يرجى إدخال العنوان الكامل' : '⚠️ Veuillez entrer votre adresse complète');
    return;
  }
  
  // Phone regex check (Algeria numbers: 05, 06, 07 followed by 8 digits)
  const phoneRegex = /^(05|06|07)[0-9]{8}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
    alert(translations[currentLang].validation_phone);
    return;
  }

  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? '⏳ جاري إرسال الطلب...' : '⏳ Envoi de la commande...';
  }
  
  const selectedWilaya = wilayas.find(w => w.code === wilayaCode);
  const wilayaName = currentLang === 'ar' ? selectedWilaya.name : selectedWilaya.name_fr;
  
  // Compile Invoice HTML
  const orderId = '#LB-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('successOrderId').textContent = orderId;
  
  let subtotal = 0;
  let itemsHTML = '';
  const orderProducts = [];
  
  cart.forEach(item => {
    const p = productsData.find(pd => pd.id === item.id);
    if (!p) return;
    const nameText = currentLang === 'ar' ? p.name : p.name_fr;
    const itemTotal = p.price * item.quantity;
    subtotal += itemTotal;
    
    orderProducts.push(`${nameText} (x${item.quantity})`);
    itemsHTML += `
      <div class="invoice-row" style="font-size: 0.85rem; color: var(--grey);">
        <span>${nameText} (x${item.quantity})</span>
        <span>${formatPrice(itemTotal)}</span>
      </div>
    `;
  });
  
  const shippingCost = calculateShippingCost();
  const finalTotal = subtotal + shippingCost;
  
  const invoiceBox = document.getElementById('invoiceBox');
  invoiceBox.innerHTML = `
    <h5>${translations[currentLang].invoice_title} (${orderId})</h5>
    <div class="invoice-row"><strong>${translations[currentLang].invoice_client}</strong> <span>${name}</span></div>
    <div class="invoice-row"><strong>${translations[currentLang].invoice_phone}</strong> <span>${phone}</span></div>
    <div class="invoice-row"><strong>${translations[currentLang].invoice_wilaya}</strong> <span>${wilayaCode} - ${wilayaName}</span></div>
    <div class="invoice-row"><strong>${translations[currentLang].invoice_address}</strong> <span>${address}</span></div>
    
    <div style="border-top:1px dashed var(--line); padding-top:10px; margin-top:10px;"></div>
    ${itemsHTML}
    
    <div class="invoice-row" style="margin-top:8px;"><span>${translations[currentLang].subtotal}</span> <span>${formatPrice(subtotal)}</span></div>
    <div class="invoice-row"><span>${translations[currentLang].shipping}</span> <span>${formatPrice(shippingCost)}</span></div>
    <div class="invoice-row total"><span>${translations[currentLang].total}</span> <span>${formatPrice(finalTotal)}</span></div>
  `;
  
  const purchaseEventId = 'LB-EV-' + orderId.replace('#', '');
  trackBrowserEvent('Purchase', { value: finalTotal, event_id: purchaseEventId });

  const newOrder = {
    id: orderId.replace('#', ''),
    name: name,
    phone: phone,
    wilaya: selectedWilaya ? selectedWilaya.name : wilayaCode,
    commune: '',
    address: address,
    product: orderProducts.join(' + '),
    amount: finalTotal,
    status: 'pending',
    date: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    pixelEventId: purchaseEventId
  };
  
  // Save order to server with localStorage fallback
  (async function() {
    try {
      const response = await fetch(BACKEND_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(newOrder)
      });
      if (response.ok) {
        console.log('Order persisted on server');
        return;
      }
    } catch (err) {
      console.warn('Backend server unreachable, falling back to local storage', err);
    }
    // Fallback to localStorage
    const savedOrders = JSON.parse(localStorage.getItem('zf_orders') || '[]');
    savedOrders.unshift(newOrder);
    localStorage.setItem('zf_orders', JSON.stringify(savedOrders));
  })();

  // Check if there is any digital product in the checkout
  let digitalItem = null;
  for (let item of cart) {
    const prod = productsData.find(p => p.id === item.productId);
    if (prod && prod.isDigital && prod.digitalCode) {
      digitalItem = prod;
      break;
    }
  }

  // Clear cart
  cart = [];
  localStorage.setItem('zf_cart', JSON.stringify(cart));
  updateHeaderBadges();
  
  // Close Cart, open Success Modal
  closeDrawer('cartDrawer');
  
  const digBox = document.getElementById('successDigitalDelivery');
  const digCode = document.getElementById('successDigitalCode');
  if (digBox && digCode) {
    if (digitalItem) {
      digCode.textContent = digitalItem.digitalCode;
      digBox.style.display = 'block';
    } else {
      digBox.style.display = 'none';
    }
  }
  
  openModal('successModal');
  
  // Clear form
  document.getElementById('checkoutForm').reset();
  document.getElementById('clientWilaya').selectedIndex = 0;
  
  showToast(translations[currentLang].toast_order_success);
}

/* ---------------- Live Search Overlay ---------------- */
function handleSearch(e) {
  const val = e.target.value.toLowerCase().trim();
  const grid = document.getElementById('searchResultsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  if (!val) return;
  
  const filtered = productsData.filter(p => {
    const titleMatch = p.name.toLowerCase().includes(val) || p.name_fr.toLowerCase().includes(val);
    const descMatch = p.desc.toLowerCase().includes(val) || p.desc_fr.toLowerCase().includes(val);
    return titleMatch || descMatch;
  });
  
  filtered.forEach(p => {
    const item = document.createElement('div');
    item.className = 'card';
    const displayName = currentLang === 'ar' ? p.name : p.name_fr;
    const priceText = formatPrice(p.price);
    
    item.innerHTML = `
      <div class="card-img search-trigger" data-id="${p.id}" style="background-image: url('${p.image}'); aspect-ratio:4/5; cursor:pointer;"></div>
      <div class="card-body search-trigger" data-id="${p.id}" style="cursor:pointer;">
        <h3>${displayName}</h3>
        <div class="price">${priceText}</div>
      </div>
      <div class="card-actions">
        <button class="search-qv-btn" data-id="${p.id}">${translations[currentLang].quick_view}</button>
        <button class="card-buynow-btn search-pp-btn" data-id="${p.id}">🛍️ اطلبي الآن</button>
      </div>
    `;
    grid.appendChild(item);
  });
  
  document.querySelectorAll('.search-qv-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('searchOverlay');
      openQuickView(btn.getAttribute('data-id'));
    });
  });
  
  document.querySelectorAll('.search-pp-btn, .search-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('searchOverlay');
      openProductPage(btn.getAttribute('data-id'));
    });
  });
  

}

/* ---------------- Multi-Language Translator ---------------- */
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('zf_lang', lang);
  
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  
  const btn = document.querySelector('.lang-switch');
  if (btn) btn.textContent = lang === 'ar' ? 'FR' : 'AR';
  
  // Translate UI texts
  const t = translations[lang];
  
  // Navigation Links
  const links = document.querySelectorAll('.navlinks a');
  if (links.length >= 5) {
    links[0].textContent = t.nav_collection;
    links[0].href = "#collection";
    links[1].textContent = t.nav_caftan;
    links[1].href = "#caftan";
    links[2].textContent = t.nav_karakou;
    links[2].href = "#karakou";
    links[3].textContent = t.nav_wedding;
    links[3].href = "#wedding";
    links[4].textContent = t.nav_reviews;
    links[4].href = "#reviews";
  }
  
  // Hero
  const heroEyebrow = document.querySelector('.hero .eyebrow');
  if (heroEyebrow) heroEyebrow.textContent = t.eyebrow_sub;
  
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) heroTitle.innerHTML = t.hero_title;
  
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) heroSub.textContent = t.hero_sub;
  
  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) heroCta.textContent = t.hero_cta;
  
  const scrollHint = document.querySelector('.scroll-hint span');
  if (scrollHint) scrollHint.textContent = t.scroll_hint;
  
  // Runway
  const runwayEyebrow = document.querySelector('.runway-caption .eyebrow');
  if (runwayEyebrow) runwayEyebrow.textContent = t.runway_eyebrow;
  
  const runwayTitle = document.querySelector('.runway-caption h2');
  if (runwayTitle) runwayTitle.innerHTML = t.runway_title;
  
  // Chapter 1 Intro
  const ch1Num = document.querySelector('#intro .chapter-num');
  if (ch1Num) ch1Num.textContent = t.chapter_1_num;
  
  const ch1Title = document.querySelector('#intro .chapter-title');
  if (ch1Title) ch1Title.innerHTML = t.chapter_1_title;
  
  const ch1Desc = document.querySelector('#intro .chapter-desc');
  if (ch1Desc) ch1Desc.textContent = t.chapter_1_desc;
  
  const ch1Stats = document.querySelectorAll('#intro .stat');
  if (ch1Stats.length >= 3) {
    ch1Stats[0].querySelector('span').textContent = t.stat_experience;
    ch1Stats[1].querySelector('span').textContent = t.stat_clients;
    ch1Stats[2].querySelector('span').textContent = t.stat_handmade;
  }
  
  // Chapter 2-6 Titles
  const ch2Title = document.querySelector('#collection .chapter-title');
  if (ch2Title) ch2Title.innerHTML = t.chapter_2_title;
  const ch2Desc = document.querySelector('#collection .chapter-desc');
  if (ch2Desc) ch2Desc.textContent = t.chapter_2_desc;
  
  const ch3Title = document.querySelector('#caftan .chapter-title');
  if (ch3Title) ch3Title.innerHTML = t.chapter_3_title;
  const ch3Desc = document.querySelector('#caftan .chapter-desc');
  if (ch3Desc) ch3Desc.textContent = t.chapter_3_desc;
  
  const ch4Title = document.querySelector('#karakou .chapter-title');
  if (ch4Title) ch4Title.innerHTML = t.chapter_4_title;
  const ch4Desc = document.querySelector('#karakou .chapter-desc');
  if (ch4Desc) ch4Desc.textContent = t.chapter_4_desc;
  
  const ch5Title = document.querySelector('#wedding .chapter-title');
  if (ch5Title) ch5Title.innerHTML = t.chapter_5_title;
  const ch5Desc = document.querySelector('#wedding .chapter-desc');
  if (ch5Desc) ch5Desc.textContent = t.chapter_5_desc;
  
  const ch6Title = document.querySelector('#bestsellers .chapter-title');
  if (ch6Title) ch6Title.innerHTML = t.chapter_6_title;
  const ch6Desc = document.querySelector('#bestsellers .chapter-desc');
  if (ch6Desc) ch6Desc.textContent = t.chapter_6_desc;
  
  // Chapter 7 Craftsmanship
  const ch7Title = document.querySelector('#craft .chapter-title');
  if (ch7Title) ch7Title.innerHTML = t.chapter_7_title;
  
  const tsteps = document.querySelectorAll('#craft .tstep');
  if (tsteps.length >= 5) {
    tsteps[0].querySelector('h4').textContent = t.chapter_7_step1_title;
    tsteps[0].querySelector('p').textContent = t.chapter_7_step1_desc;
    
    tsteps[1].querySelector('h4').textContent = t.chapter_7_step2_title;
    tsteps[1].querySelector('p').textContent = t.chapter_7_step2_desc;
    
    tsteps[2].querySelector('h4').textContent = t.chapter_7_step3_title;
    tsteps[2].querySelector('p').textContent = t.chapter_7_step3_desc;
    
    tsteps[3].querySelector('h4').textContent = t.chapter_7_step4_title;
    tsteps[3].querySelector('p').textContent = t.chapter_7_step4_desc;
    
    tsteps[4].querySelector('h4').textContent = t.chapter_7_step5_title;
    tsteps[4].querySelector('p').textContent = t.chapter_7_step5_desc;
  }
  
  // Chapter 8 Reviews Title
  const ch8Title = document.querySelector('#reviews .chapter-title');
  if (ch8Title) ch8Title.innerHTML = t.chapter_8_title;
  
  // Final CTA
  const finalEyebrow = document.querySelector('#final .eyebrow');
  if (finalEyebrow) finalEyebrow.textContent = t.final_cta_eyebrow;
  
  const finalTitle = document.querySelector('#final h2');
  if (finalTitle) finalTitle.innerHTML = t.final_cta_title;
  
  const finalDesc = document.querySelector('#final p');
  if (finalDesc) finalDesc.textContent = t.final_cta_desc;
  
  const finalBtn = document.querySelector('#final a');
  if (finalBtn) finalBtn.textContent = t.final_cta_btn;
  
  // Footer
  const footerDesc = document.querySelector('footer p');
  if (footerDesc) footerDesc.textContent = t.footer_desc;
  
  const footerHeaders = document.querySelectorAll('footer h4');
  if (footerHeaders.length >= 3) {
    footerHeaders[0].textContent = t.footer_store;
    footerHeaders[1].textContent = t.footer_care;
    footerHeaders[2].textContent = t.footer_follow;
  }
  
  const footerLinks = document.querySelectorAll('footer ul a');
  if (footerLinks.length >= 7) {
    // Store links
    footerLinks[0].textContent = t.chapter_2_title.replace('<em>', '').replace('</em>', '');
    footerLinks[1].textContent = t.nav_caftan;
    footerLinks[2].textContent = t.nav_karakou;
    footerLinks[3].textContent = t.nav_wedding;
    
    // Care links
    footerLinks[4].textContent = t.footer_guide;
    footerLinks[5].textContent = t.footer_shipping;
    footerLinks[6].textContent = t.footer_returns;
  }
  
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) footerBottom.textContent = t.footer_rights;
  
  // E-commerce forms & panels translation
  const txtCartTitle = document.getElementById('txtCartTitle');
  if (txtCartTitle) txtCartTitle.innerHTML = `${t.cart_title} (<span id="cartCount">${cart.length}</span>)`;
  
  const cartEmptyMsg = document.getElementById('cartEmptyMsg');
  if (cartEmptyMsg) cartEmptyMsg.textContent = t.cart_empty;
  
  const txtCheckoutTitle = document.getElementById('txtCheckoutTitle');
  if (txtCheckoutTitle) txtCheckoutTitle.textContent = t.checkout_title;
  
  const lblClientName = document.getElementById('lblClientName');
  if (lblClientName) lblClientName.textContent = t.client_name;
  
  const lblClientPhone = document.getElementById('lblClientPhone');
  if (lblClientPhone) lblClientPhone.textContent = t.client_phone;
  
  const lblClientWilaya = document.getElementById('lblClientWilaya');
  if (lblClientWilaya) lblClientWilaya.textContent = t.client_wilaya;
  
  const lblClientAddress = document.getElementById('lblClientAddress');
  if (lblClientAddress) lblClientAddress.textContent = t.client_address;
  
  const txtSubtotal = document.getElementById('txtSubtotal');
  if (txtSubtotal) txtSubtotal.textContent = t.subtotal;
  
  const txtShipping = document.getElementById('txtShipping');
  if (txtShipping) txtShipping.textContent = t.shipping;
  
  const txtTotal = document.getElementById('txtTotal');
  if (txtTotal) txtTotal.textContent = t.total;
  
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  if (submitOrderBtn) submitOrderBtn.textContent = t.confirm_order;
  
  const txtWishlistTitle = document.getElementById('txtWishlistTitle');
  if (txtWishlistTitle) txtWishlistTitle.innerHTML = `${t.wishlist_title} (<span id="wishlistCount">${wishlist.length}</span>)`;
  
  const wishlistEmptyMsg = document.getElementById('wishlistEmptyMsg');
  if (wishlistEmptyMsg) wishlistEmptyMsg.textContent = t.wishlist_empty;
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t.search_placeholder;
  
  const txtSuccessTitle = document.getElementById('txtSuccessTitle');
  if (txtSuccessTitle) txtSuccessTitle.textContent = t.success_title;
  
  const txtSuccessDesc = document.getElementById('txtSuccessDesc');
  if (txtSuccessDesc) txtSuccessDesc.innerHTML = `${t.success_desc} <strong id="successOrderId"></strong>`;
  
  const txtSuccessNote = document.getElementById('txtSuccessNote');
  if (txtSuccessNote) txtSuccessNote.textContent = t.success_note;
  
  const successCloseBtn = document.getElementById('successCloseBtn');
  if (successCloseBtn) successCloseBtn.textContent = t.success_close;
  
  const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');
  if (qvAddToCartBtn) qvAddToCartBtn.textContent = t.add_to_cart;
  
  const customSizeBtn = document.getElementById('customSizeBtn');
  if (customSizeBtn) customSizeBtn.textContent = t.custom_size_btn;
  
  const txtCustomFittingTitle = document.getElementById('txtCustomFittingTitle');
  if (txtCustomFittingTitle) txtCustomFittingTitle.textContent = t.custom_fitting_title;
  
  const lblChest = document.getElementById('lblChest');
  if (lblChest) lblChest.textContent = t.lbl_chest;
  
  const lblWaist = document.getElementById('lblWaist');
  if (lblWaist) lblWaist.textContent = t.lbl_waist;
  
  const lblHips = document.getElementById('lblHips');
  if (lblHips) lblHips.textContent = t.lbl_hips;
  
  const lblShoulders = document.getElementById('lblShoulders');
  if (lblShoulders) lblShoulders.textContent = t.lbl_shoulders;
  
  const lblHeight = document.getElementById('lblHeight');
  if (lblHeight) lblHeight.textContent = t.lbl_height;
  
  const txtCustomFittingNote = document.getElementById('txtCustomFittingNote');
  if (txtCustomFittingNote) txtCustomFittingNote.textContent = t.txt_custom_fitting_note;
  
  const lblSize = document.getElementById('lblSize');
  if (lblSize) lblSize.textContent = t.size_label;
  
  // Re-run dynamic rendering
  renderProducts();
  renderReviews();
  renderCart();
  renderWishlist();
  populateWilayasDropdown();
}

/* ---------------- Setup Event Listeners and Initializers ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const navLinksList = document.getElementById('navLinksList');
  if (menuToggleBtn && navLinksList) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksList.classList.toggle('open');
      menuToggleBtn.textContent = navLinksList.classList.contains('open') ? '✕' : '☰';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinksList.classList.contains('open') && !navLinksList.contains(e.target) && e.target !== menuToggleBtn) {
        navLinksList.classList.remove('open');
        menuToggleBtn.textContent = '☰';
      }
    });

    // Close menu when a link is clicked
    navLinksList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        menuToggleBtn.textContent = '☰';
      });
    });
  }

  // Initialize dynamic pixels on page load
  initDynamicPixels();

  // Load products from API
  fetch(API_URL + '/products')
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('API products load failed');
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        productsData = data;
        renderProducts();
        renderCart();
        
        // Dynamic product routing & landing page toggle
        const params = new URLSearchParams(window.location.search);
        const prodParam = params.get('product') || params.get('p');
        if (prodParam) {
          const matched = productsData.find(p => p.id === prodParam || p.slug === prodParam);
          if (matched) {
            openProductPage(matched.id);
          }
        } else {
          const lp = productsData.find(p => p.isLandingPage);
          if (lp) {
            openProductPage(lp.id);
            const backBtn = document.getElementById('ppBackBtn');
            if (backBtn) backBtn.style.display = 'none';
          }
        }
      }
    })
    .catch(err => console.warn('Using local fallback products:', err));

  // Record visit traffic on server
  fetch(API_URL + '/visit', { method: 'POST' }).catch(err => console.warn('Failed to track visit on server', err));
  // Lang switch button
  const langBtn = document.querySelector('.lang-switch');
  if (langBtn) {
    langBtn.style.cursor = 'pointer';
    langBtn.addEventListener('click', () => {
      const target = currentLang === 'ar' ? 'fr' : 'ar';
      switchLanguage(target);
    });
  }
  
  // Search Overlay Triggers
  const searchBtn = document.querySelector('.navicons button[title="بحث"], .navicons button:nth-child(2)');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      openModal('searchOverlay');
      document.getElementById('searchInput').focus();
    });
  }
  document.getElementById('searchCloseBtn').addEventListener('click', () => closeModal('searchOverlay'));
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  
  // Cart Drawer Triggers
  const cartBtn = document.querySelector('.navicons button[title="السلة"], .navicons button:nth-child(4)');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => openDrawer('cartDrawer'));
  }
  document.getElementById('cartCloseBtn').addEventListener('click', () => closeDrawer('cartDrawer'));
  document.getElementById('cartOverlay').addEventListener('click', () => closeDrawer('cartDrawer'));
  
  // Wishlist Drawer Triggers
  const wishlistBtn = document.querySelector('.navicons button[title="المفضلة"], .navicons button:nth-child(3)');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => openDrawer('wishlistDrawer'));
  }
  document.getElementById('wishlistCloseBtn').addEventListener('click', () => closeDrawer('wishlistDrawer'));
  document.getElementById('wishlistOverlay').addEventListener('click', () => closeDrawer('wishlistDrawer'));
  
  // Modal Close buttons
  document.getElementById('qvCloseBtn').addEventListener('click', () => closeModal('quickViewModal'));
  document.getElementById('qvOverlay').addEventListener('click', () => closeModal('quickViewModal'));
  
  document.getElementById('successCloseBtn').addEventListener('click', () => closeModal('successModal'));
  document.getElementById('successOverlay').addEventListener('click', () => closeModal('successModal'));
  
  // Size selection toggles
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.getAttribute('data-size');
      
      const customSec = document.getElementById('customMeasurementsSection');
      if (selectedSize === 'custom') {
        customSec.style.display = 'block';
        customSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        customSec.style.display = 'none';
      }
    });
  });
  
  // Modal Qty changers
  document.getElementById('qtyDec').addEventListener('click', () => {
    const span = document.getElementById('qvQty');
    let q = parseInt(span.textContent);
    if (q > 1) span.textContent = q - 1;
  });
  
  document.getElementById('qtyInc').addEventListener('click', () => {
    const span = document.getElementById('qvQty');
    let q = parseInt(span.textContent);
    span.textContent = q + 1;
  });
  
  // Modal Add to Cart Action
  document.getElementById('qvAddToCartBtn').addEventListener('click', () => {
    const qty = parseInt(document.getElementById('qvQty').textContent);
    let measurements = null;
    
    if (selectedSize === 'custom') {
      const chest = document.getElementById('mChest').value.trim();
      const waist = document.getElementById('mWaist').value.trim();
      const hips = document.getElementById('mHips').value.trim();
      const shoulders = document.getElementById('mShoulders').value.trim();
      const height = document.getElementById('mHeight').value.trim();
      
      if (!chest || !waist || !hips || !shoulders || !height) {
        alert(translations[currentLang].validation_measurements);
        return;
      }
      measurements = { chest, waist, hips, shoulders, height };
    }
    
    addToCart(activeProductId, selectedSize, qty, measurements);
    closeModal('quickViewModal');
  });
  
  document.getElementById('clientWilaya').addEventListener('change', (e) => {
    renderCart();
  });
  
  // Checkout Form Submission
  document.getElementById('submitOrderBtn').addEventListener('click', (e) => {
    const form = document.getElementById('checkoutForm');
    if (form.reportValidity()) {
      trackBrowserEvent('InitiateCheckout');
      handleOrderSubmit(e);
    }
  });
  
  // Initialize Rendering
  switchLanguage(currentLang);
  renderInstagram();
  updateHeaderBadges();
});

/* Duplicate chapter dots update removed to prevent chapters redeclaration error */

/* ---------------- Runway Video Labels Translate ---------------- */
(function() {
  const video = document.getElementById('modelVideo');
  const label = document.getElementById('runwayLabel');
  if (!video || !label) return;
  
  const stepLabelsAR = [
    'تظهر من بعيد بين الأقواس المغربية',
    'القفطان الأسود يتقدّم بثقة',
    'خيوط الذهب تتلألأ مع كل خطوة',
    'التطريز يتّضح تفصيلاً بتفصيل',
    'وجهًا لوجه معكِ'
  ];
  
  const stepLabelsFR = [
    'Apparition au loin sous les arches mauresques',
    'Le Caftan Noir avance avec assurance',
    'Les fils d\'or scintillent à chaque pas',
    'Les broderies se révèlent détail par détail',
    'Face à face avec vous'
  ];
  
  video.addEventListener('timeupdate', () => {
    const p = video.currentTime / video.duration;
    const list = currentLang === 'ar' ? stepLabelsAR : stepLabelsFR;
    const i = Math.min(list.length - 1, Math.floor(p * list.length));
    label.textContent = list[i];
  });
})();

/* ================================================================
   PRODUCT PAGE — Full-screen high-conversion order page logic
   ================================================================ */

/* ---------- Algerian Communes per Wilaya (representative) ---------- */
const communesData = {
  '01': ['أدرار','تيميمون','رقان','أولف','بودة','تسابيت','فنوغيل','أقبلي','عين صالح'],
  '02': ['الشلف','أم الدروع','بني حواء','تاجنة','بوقادير','هرازة','الكريمة','العبادية','تنس'],
  '03': ['الأغواط','عين مهدي','قصر الحيران','آفلو','تاجموت','سيدي مخلوف','برج بن غسي','حاسي الرمل'],
  '04': ['أم البواقي','عين البيضاء','عين فكرون','سيقوس','الضلعة','عين القرماز','مسكيانة'],
  '05': ['باتنة','عين التوتة','تيمقاد','بريكة','مروانة','أريس','سريانة','لمبيس','نقاوس'],
  '06': ['بجاية','أقبو','خرطة','أميزور','سيدي عيش','الكمان','تيشي','إيغيل علي','ببريون'],
  '07': ['بسكرة','أولاد جلال','طولقة','سيدي عقبة','زريبة الوادي','ليشانة','مشونش','القنطرة'],
  '08': ['بشار','أبادلة','تاغيت','بني عباس','القنادسة','بني ونيف','الصفيصيفة'],
  '09': ['البليدة','الأربعاء','بوفاريك','لربعاء','مفتاح','بني تامو','شريعة','عزازقة','الأخضرية'],
  '10': ['البويرة','عين بسام','المحمدية','عين لحجر','سور الغزلان','لخضرية','بكيرة','حيزر'],
  '11': ['تمنراست','عين قزام','عين صالح','إدلس'],
  '12': ['تبسة','العوينات','الماء الأبيض','الشريعة','بكاريا','شريعة','أولاد رحمون'],
  '13': ['تلمسان','بني مستار','نداموا','أولاد ميمون','حمام بوغرارة','سبدو','المسيرة','باب العسة'],
  '14': ['تيارت','فرندة','مهدية','قصر الشلالة','وادي ليلي','تيسة','سيدي بختي'],
  '15': ['تيزي وزو','عزازقة','درع الميزان','إيفيغا','أزفون','آث يني','واضية','أيت محمد'],
  '16': ['الجزائر العاصمة','باب الوادي','المدنية','حيدرة','القبة','الدار البيضاء','برج الكيفان','المرادية','الحراش','دالي إبراهيم','بن عكنون','بابا حسن','العاشور','بن طلحة'],
  '17': ['الجلفة','عين وسارة','مسعد','حاسي بحبح','سلمانة','البيرينة','زكار','فيض البطمة'],
  '18': ['جيجل','الطاهير','زيامة منصورية','القنار','سيدي معروف','تكسانة','الميلية','الشقفة'],
  '19': ['سطيف','عين أرنات','بني عزيز','بوعنداس','العلمة','معاوية','بوقاعة','عين البشر'],
  '20': ['سعيدة','يوب','أولاد ابراهيم','أيون','سيدي أحمد','سيدي بوبكر'],
  '21': ['سكيكدة','عزابة','فيلفيلة','الحدائق','زردازة','القل','رمضان جمال','كركرة'],
  '22': ['سيدي بلعباس','مرحوم','تنيرة','سفيزف','محمد بن علي','مراسم'],
  '23': ['عنابة','البوني','عين البيضاء','سرايدي','بن مهيدي','الشرفة'],
  '24': ['قالمة','بوشقوف','حمام دباغ','عين مخلوف','المحر','بلخير'],
  '25': ['قسنطينة','الخروب','إبن زياد','أولاد رحمون','بني حميدان','مسقم','عين أبيد','زيغود يوسف'],
  '26': ['المدية','بجاعة','الحمدانية','القلب الكبير','عزيزة','أولاد دايد','سگار'],
  '27': ['مستغانم','سيدي علي','عين تادلس','صيادة','مزغران','خير الدين','أشعاشعة'],
  '28': ['المسيلة','بوسعادة','مجدل','سيدي عيسى','مطارفة','أولاد ماضي'],
  '29': ['معسكر','بوهران','تغنيف','ماوسة','سيق','الغمري'],
  '30': ['ورقلة','تقرت','عين البيضاء','حاسي مسعود','النزلة','سيدي خويلد','المقارين'],
  '31': ['وهران','أرزيو','مرسى الكبير','عين تركي','سيدي الشحمي','بئر الجير','وادي تليلات'],
  '32': ['البيض','بوقطب','الأبيض سيدي الشيخ','تيوت','العبادلة'],
  '33': ['إليزي','برج عمر إدريس','جانت'],
  '34': ['برج بوعريريج','بوعريريج','رأس الوادي','الحمامة','المنصورة','بئر قاصد علي'],
  '35': ['بومرداس','ثنية الأحد','برج منايل','الخميس','نسيغة','نادر','أفسوس'],
  '36': ['الطارف','الحجار','بوثلجة','شعبة لحنة','رمادنية','القالة'],
  '37': ['تندوف','عمار'],
  '38': ['تيسمسيلت','ثنية الحد','المعاصم','لبديء','كمال'],
  '39': ['الوادي','الرباح','حمرية','دبيلة','الطالب العربي','ورماس'],
  '40': ['خنشلة','بابار','أولاد رشاش','بغاي','الرميلة'],
  '41': ['سوق أهراس','سدراتة','عين زانة','راس الكنتور','مداوروش'],
  '42': ['تيبازة','الشرفة','أقبو','بوهارون','العصافير','سيدي غيلاس'],
  '43': ['ميلة','شلغوم العيد','سيدي مروان','عين تيني','أحمد راشدي','راشد'],
  '44': ['عين الدفلى','حمدان','الخميس','أبو الحسن','رواينة','جمعة أولاد شعيب'],
  '45': ['النعامة','مشرية','تيوت','الصفيصيفة','بلبال','أسلا'],
  '46': ['عين تموشنت','حمام بوحجر','بن عزوز','سيدي الطيب','واد الصباح'],
  '47': ['غرداية','متليلي الشعانبة','بريان','القرارة','زلفانة','سبسب'],
  '48': ['غليزان','جديوية','بلهامد','عميرة أرواو','وادي رهيو'],
  '49': ['تيميمون','أولاد سعيد','بودة','شروين'],
  '50': ['برج باجي مختار','تيمياوين'],
  '51': ['أولاد جلال','سيدي خالد','المدائن'],
  '52': ['بني عباس','بشار'],
  '53': ['عين صالح','فقارة الزوى'],
  '54': ['عين قزام','تيمياوين'],
  '55': ['تقرت','الزاوية العابدية','العالية','تماسين'],
  '56': ['جانت','إيليزي'],
  '57': ['المغير','أولاد الرابح'],
  '58': ['المنيعة','حاسي فحل']
};

/* Product-specific reviews */
const productReviews = {
  'cream-premium': [
    { text: 'ÙƒØ±ÙŠÙ… Ø§Ù„Ù„ÙŠÙ„ Ù‡Ø°Ø§ Ø±Ø§Ø¦Ø¹ Ø¬Ø¯Ø§Ù‹ØŒ ÙŠØ±Ø·Ø¨ Ø§Ù„Ø¨Ø´Ø±Ø© Ø¨Ø¹Ù…Ù‚ ÙˆÙŠØªØ±ÙƒÙ‡Ø§ Ù†Ø§Ø¹Ù…Ø© ÙƒØ§Ù„Ø­Ø±ÙŠØ± ÙÙŠ Ø§Ù„ØµØ¨Ø§Ø­.', who: 'Ø³Ø§Ø±Ø© Ù….', wilaya: 'Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©', rating: 5 },
    { text: 'Ø£ÙØ¶Ù„ ÙƒØ±ÙŠÙ… Ù„ÙŠÙ„ÙŠ Ø¬Ø±Ø¨ØªÙ‡ Ø¹Ù„Ù‰ Ø§Ù„Ø¥Ø·Ù„Ø§Ù‚. Ø±ÙŠØ­ØªÙ‡ Ø®ÙÙŠÙØ© ÙˆÙŠÙ‡Ø¯Ø¦ Ø§Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ù…ØªÙ‡ÙŠØ¬Ø©.', who: 'Ù†ÙˆØ± Ù‡Ù€.', wilaya: 'ÙˆÙ‡Ø±Ø§Ù†', rating: 5 }
  ],
  'serum-gold': [
    { text: 'Ø³ÙŠØ±ÙˆÙ… Ø§Ù„Ø°Ù‡Ø¨ Ù…Ù…ØªØ§Ø² Ù„Ø´Ø¯ Ø§Ù„ØªØ¬Ø§Ø¹ÙŠØ¯ ÙˆØ¥Ø¹Ø·Ø§Ø¡ Ù†Ø¶Ø§Ø±Ø© ÙÙˆØ±ÙŠØ© Ù„Ù„Ø¨Ø´Ø±Ø© Ù‚Ø¨Ù„ Ø§Ù„Ù…ÙƒÙŠØ§Ø¬.', who: 'Ù„ÙŠÙ„Ù‰ Ø³.', wilaya: 'Ø¹Ù†Ø§Ø¨Ø©', rating: 5 },
    { text: 'Ø¨Ø´Ø±ØªÙŠ Ø£ØµØ¨Ø­Øª Ù…Ø´Ø¯ÙˆØ¯Ø© ÙˆØ£ÙƒØ«Ø± Ø¥Ø´Ø±Ø§Ù‚Ø§Ù‹ Ø¨Ø¹Ø¯ Ø£Ø³Ø¨ÙˆØ¹ÙŠÙ† ÙÙ‚Ø· Ù…Ù† Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ÙŠÙˆÙ…ÙŠ.', who: 'Ù…Ù†Ø§Ù„ Ùƒ.', wilaya: 'Ø³Ø·ÙŠÙ', rating: 5 }
  ],
  'lipstick-matte': [
    { text: 'Ø§Ù„Ù„ÙˆÙ† Ø«Ø§Ø¨Øª Ø¬Ø¯Ø§Ù‹ ÙˆÙ…Ø·ÙØ£ Ø¨Ø´ÙƒÙ„ Ø£Ù†ÙŠÙ‚ Ø¯ÙˆÙ† Ø£Ù† ÙŠØªØ´Ù‚Ù‚ Ø¹Ù„Ù‰ Ø§Ù„Ø´ÙØ§Ù‡.', who: 'Ø±Ø§Ù†ÙŠØ§ Ù.', wilaya: 'Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©', rating: 5 },
    { text: 'Ø£Ø­Ù…Ø± Ø´ÙØ§Ù‡ Ø±Ø§Ø¦Ø¹ ÙˆÙ…Ø±ÙŠØ­ Ù„Ù„Ø§Ø±ØªØ¯Ø§Ø¡ Ø§Ù„ÙŠÙˆÙ…ÙŠØŒ Ø£Ù†ØµØ­ Ø¨ÙƒÙ„ Ø§Ù„Ø£Ù„ÙˆØ§Ù†.', who: 'Ø³Ù„Ù…Ù‰ ÙŠ.', wilaya: 'ØªÙ„Ù…Ø³Ø§Ù†', rating: 5 }
  ],
  'perfume-asala': [
    { text: 'Ø±Ø§Ø¦Ø­Ø© Ø§Ù„Ø¹ÙˆØ¯ Ø§Ù„ÙØ§Ø®Ø± ÙˆØ§Ù„ÙŠØ§Ø³Ù…ÙŠÙ† Ù…Ù…ÙŠØ²Ø© ÙˆØªØ¯ÙˆÙ… Ø·ÙˆÙŠÙ„Ø§Ù‹ØŒ Ø¹Ø·Ø± ÙŠØ³ØªØ­Ù‚ Ø§Ù„Ø§Ù‚ØªÙ†Ø§Ø¡.', who: 'ÙØ§Ø·Ù…Ø© Ø².', wilaya: 'ØªÙ„Ù…Ø³Ø§Ù†', rating: 5 },
    { text: 'Ø¹Ø·Ø± Ù…Ù„ÙƒÙŠ Ø¨ÙƒÙ„ Ø§Ù„Ù…Ù‚Ø§ÙŠÙŠØ³ØŒ Ø§Ù„Ø«Ø¨Ø§Øª ÙˆØ§Ù„ÙÙˆØ­Ø§Ù† Ø±Ø§Ø¦Ø¹ÙŠÙ† Ø¬Ø¯Ø§Ù‹.', who: 'Ø­Ù†Ø§Ù† Ù….', wilaya: 'ÙˆÙ‡Ø±Ø§Ù†', rating: 5 }
  ]
};

/* Default reviews for products without specific reviews */
const defaultReviews = [
  { text: 'Ù…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø°Ø§Øª Ø¬ÙˆØ¯Ø© Ø¹Ø§Ù„ÙŠØ© ÙˆØªØ±ÙƒÙŠØ¨Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© Ø¢Ù…Ù†Ø© Ù„Ù„Ø¨Ø´Ø±Ø©. Ø§Ù„ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ ÙˆØ§Ù„ØªØºÙ„ÙŠÙ ÙØ®Ù… Ø¬Ø¯Ø§Ù‹.', who: 'ÙØ§Ø·Ù…Ø© Ø±.', wilaya: 'Ø§Ù„Ø¬Ø²Ø§Ø¦Ø± Ø§Ù„Ø¹Ø§ØµÙ…Ø©', rating: 5 },
  { text: 'Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø£ØµÙ„ÙŠØ© ÙˆØ§Ù„ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ Ø¬Ø¯Ø§Ù‹. Ø§Ù„ØªØºÙ„ÙŠÙ ÙŠÙØªØ­ Ø§Ù„Ù†ÙØ³ ÙƒÙ‡Ø¯ÙŠØ©.', who: 'Ù†Ø§Ø¯ÙŠØ© Ù„.', wilaya: 'Ù‚Ø³Ù†Ø·ÙŠÙ†Ø©', rating: 5 },
  { text: 'Ø§Ù„Ø¯ÙØ¹ Ø¹Ù†Ø¯ Ø§Ù„Ø§Ø³ØªÙ„Ø§Ù… Ù…Ø±ÙŠØ­ Ø¬Ø¯Ø§Ù‹ ÙˆØ§Ù„Ù…Ù†ØªØ¬ Ø±Ø§Ø¦Ø¹ ÙƒÙ…Ø§ ÙÙŠ Ø§Ù„ÙˆØµÙ ØªÙ…Ø§Ù…Ø§Ù‹.', who: 'Ù…Ø±ÙŠÙ… Ø­.', wilaya: 'ÙˆÙ‡Ø±Ø§Ù†', rating: 5 }
];

/* Category mapping */
const categoryMap = {
  'cream-premium': 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©',
  'serum-gold': 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©',
  'oil-argan': 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©',
  'rose-water': 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©',
  'scrub-coffee': 'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©',
  'lipstick-matte': 'Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„',
  'makeup-set': 'Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„',
  'perfume-asala': 'Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„ÙØ§Ø®Ø±Ø©'
};

/* Feature bullets per category */
const categoryFeatures = {
  'Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø¨Ø´Ø±Ø©': ['ØªØ±ÙƒÙŠØ¨Ø§Øª Ø·Ø¨ÙŠØ¹ÙŠØ© ÙˆØ¹Ø¶ÙˆÙŠØ© 100%','Ø®Ø§Ù„Ù Ù…Ù† Ø§Ù„Ø¨Ø§Ø±Ø§Ø¨ÙŠÙ† ÙˆØ§Ù„Ù…ÙˆØ§Ø¯ Ø§Ù„ÙƒÙŠÙ…ÙŠØ§Ø¦ÙŠØ© Ø§Ù„Ø¶Ø§Ø±Ø©','Ù…Ø®ØªØ¨Ø± Ø³Ø±ÙŠØ±ÙŠØ§Ù‹ ÙˆÙ…Ù†Ø§Ø³Ø¨ Ù„Ù„Ø¨Ø´Ø±Ø© Ø§Ù„Ø­Ø³Ø§Ø³Ø©','ØªØ£Ø«ÙŠØ± Ù…ØºØ°Ù‘Ù ÙˆÙ…Ø±Ø·Ø¨ Ø·ÙˆÙŠÙ„ Ø§Ù„Ø£Ù…Ø¯'],
  'Ø§Ù„Ù…ÙƒÙŠØ§Ø¬ ÙˆÙ…Ø³ØªØ­Ø¶Ø±Ø§Øª Ø§Ù„ØªØ¬Ù…ÙŠÙ„': ['ØªØºØ·ÙŠØ© ÙƒØ§Ù…Ù„Ø© ÙˆÙ…Ø¸Ù‡Ø± Ù…Ø®Ù…Ù„ÙŠ Ù…Ø·ÙØ£','Ù…ÙƒÙˆÙ†Ø§Øª Ù…Ø±Ø·Ø¨Ø© ØªÙ…Ù†Ø¹ Ø¬ÙØ§Ù Ø§Ù„Ø´ÙØ§Ù‡ ÙˆØ§Ù„Ø¬Ù„Ø¯','Ø«Ø¨Ø§Øª ÙŠØ¯ÙˆÙ… Ø·ÙˆÙŠÙ„Ø§Ù‹ Ù„Ù€ 12 Ø³Ø§Ø¹Ø© Ù…ØªÙˆØ§ØµÙ„Ø©','Ø£Ù„ÙˆØ§Ù† ØºÙ†ÙŠØ© ÙˆØ±Ø§Ù‚ÙŠØ© ØªÙ†Ø§Ø³Ø¨ ÙƒÙ„ Ø§Ù„Ø¥Ø·Ù„Ø§Ù„Ø§Øª'],
  'Ø§Ù„Ø¹Ø·ÙˆØ± Ø§Ù„ÙØ§Ø®Ø±Ø©': ['Ù…Ø²ÙŠØ¬ Ø³Ø§Ø­Ø± Ù…Ù† Ø§Ù„Ù†ØºÙ…Ø§Øª Ø§Ù„Ø´Ø±Ù‚ÙŠØ© ÙˆØ§Ù„ÙØ±Ù†Ø³ÙŠØ©','ØªØ±ÙƒÙŠØ² Ø¹Ø§Ù„ÙŠ ÙˆØ«Ø¨Ø§Øª ÙŠØ¯ÙˆÙ… Ù„Ø£ÙƒØ«Ø± Ù…Ù† 24 Ø³Ø§Ø¹Ø©','Ø²Ø¬Ø§Ø¬Ø© ÙØ§Ø®Ø±Ø© ÙˆØªØµÙ…ÙŠÙ… Ù…Ù„ÙƒÙŠ Ø£Ù†ÙŠÙ‚','Ù…Ø«Ø§Ù„ÙŠ Ù„Ù„Ø¥Ù‡Ø¯Ø§Ø¡ ÙˆØ§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª Ø§Ù„Ø®Ø§ØµØ©']
};

/* -------------------- Product Page State -------------------- */
let ppCurrentProduct = null;
let ppDeliveryType = 'home'; // 'home' or 'desk'
let ppCountdownEnd = null;
let ppCountdownInterval = null;
let ppViewerInterval = null;

/* -------------------- Open Product Page -------------------- */
function initProductCustomPixel(p) {
  if (!p || !p.pixelType || !p.pixelId || p.pixelType === 'none') return;
  console.log(`📡 Initializing custom product pixel [${p.pixelType}]: ${p.pixelId}`);
  if (p.pixelType === 'facebook' && typeof fbq === 'function') {
    try { fbq('init', p.pixelId); } catch(e){}
  } else if (p.pixelType === 'tiktok' && typeof ttq === 'function') {
    try { ttq.load(p.pixelId); } catch(e){}
  } else if (p.pixelType === 'snapchat' && typeof snaptr === 'function') {
    try { snaptr('init', p.pixelId); } catch(e){}
  }
}

function openProductPage(productId) {
  const p = productsData.find(item => item.id === productId);
  if (!p) return;
  
  initProductCustomPixel(p);
  trackBrowserEvent('ViewContent', { content_name: p.name, value: p.price });
  
  const backBtn = document.getElementById('ppBackBtn');
  if (backBtn) {
    backBtn.style.display = p.isLandingPage ? 'none' : 'flex';
  }
  
  ppCurrentProduct = p;
  const page = document.getElementById('productPage');
  if (!page) return;
  
  // Populate Image
  const galleryImg = document.getElementById('ppGalleryImg');
  if (galleryImg) {
    galleryImg.style.backgroundImage = `url('${p.image}')`;
    galleryImg.style.backgroundSize = 'cover';
    galleryImg.style.backgroundPosition = 'center top';
  }
  
  // Populate Gallery Images & Thumbnails
  const thumbsContainer = document.getElementById('ppGalleryThumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    const imgList = p.images || [p.image];
    
    if (imgList.length > 1) {
      thumbsContainer.style.display = 'flex';
      imgList.forEach((imgUrl, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `pp-gallery-thumb${idx === 0 ? ' active' : ''}`;
        thumb.style.backgroundImage = `url('${imgUrl}')`;
        thumb.addEventListener('click', () => {
          // Update main image
          if (galleryImg) {
            galleryImg.style.backgroundImage = `url('${imgUrl}')`;
          }
          // Update active thumb
          thumbsContainer.querySelectorAll('.pp-gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumbsContainer.appendChild(thumb);
      });
    } else {
      thumbsContainer.style.display = 'none';
    }
  }
  
  // Badge
  const badge = document.getElementById('ppGalleryBadge');
  const tagText = currentLang === 'ar' ? p.tag : p.tag_fr;
  if (badge) {
    if (tagText) {
      badge.textContent = tagText;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
  
  // Category
  const catEl = document.getElementById('ppCategory');
  if (catEl) catEl.textContent = categoryMap[productId] || 'منتجات';
  
  // Title
  const titleEl = document.getElementById('ppTitle');
  if (titleEl) titleEl.textContent = currentLang === 'ar' ? p.name : p.name_fr;
  
  // Subtitle / tagline
  const subEl = document.getElementById('ppSubtitle');
  if (subEl) subEl.textContent = 'صناعة يدوية · حرفة جزائرية أصيلة · تغليف فاخر';
  
  // Random review count (social proof)
  const rvCount = document.getElementById('ppReviewCount');
  if (rvCount) rvCount.textContent = p.fakeOrders || Math.floor(140 + Math.random() * 300);
  
  // Price
  const priceEl = document.getElementById('ppPrice');
  if (priceEl) priceEl.textContent = formatPrice(p.price);
  
  const oldPriceEl = document.getElementById('ppOldPrice');
  const discBadge = document.getElementById('ppDiscountBadge');
  if (p.oldPrice) {
    if (oldPriceEl) { oldPriceEl.textContent = formatPrice(p.oldPrice); oldPriceEl.style.display = 'inline'; }
    if (discBadge) {
      const pct = Math.round((1 - p.price / p.oldPrice) * 100);
      discBadge.textContent = `-${pct}%`;
      discBadge.style.display = 'inline';
    }
  } else {
    if (oldPriceEl) oldPriceEl.style.display = 'none';
    if (discBadge) discBadge.style.display = 'none';
  }
  
  // Description
  const descEl = document.getElementById('ppDesc');
  if (descEl) descEl.textContent = currentLang === 'ar' ? p.desc : p.desc_fr;
  
  // Features
  const featuresEl = document.getElementById('ppFeatures');
  if (featuresEl) {
    const cat = categoryMap[productId] || 'القفطان الفاخر';
    const feats = categoryFeatures[cat] || categoryFeatures['القفطان الفاخر'];
    const icons = ['🧵','🪡','✂️','📦','⭐','💎'];
    featuresEl.innerHTML = feats.map((f, i) => `
      <div class="pp-feature">
        <div class="pp-feature-icon">${icons[i % icons.length]}</div>
        <span>${f}</span>
      </div>
    `).join('');
  }
  
  // Order summary - product name
  const sumProd = document.getElementById('ppSumProduct');
  if (sumProd) sumProd.textContent = currentLang === 'ar' ? p.name : p.name_fr;
  const sumPrice = document.getElementById('ppSumPrice');
  if (sumPrice) sumPrice.textContent = formatPrice(p.price);
  
  // Populate wilayas dropdown
  ppPopulateWilayas();
  
  // Reset form
  const form = document.getElementById('ppOrderForm');
  if (form) form.reset();
  document.getElementById('ppWilaya').value = '';
  document.getElementById('ppSumShipping').textContent = 'اختاري الولاية';
  document.getElementById('ppSumTotal').textContent = '—';
  
  // Reset delivery type
  ppDeliveryType = 'home';
  const homeBtn = document.getElementById('ppDeliveryHome');
  const deskBtn = document.getElementById('ppDeliveryDesk');
  if (homeBtn) homeBtn.classList.add('active');
  if (deskBtn) deskBtn.classList.remove('active');
  
  // Render reviews
  ppRenderReviews(productId);
  
  // Start countdown (random 1-3 hours)
  ppStartCountdown();
  
  // Start viewer simulation
  ppStartViewerSim();
  
  // Show page
  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

/* -------------------- Close Product Page -------------------- */
function closeProductPage() {
  const page = document.getElementById('productPage');
  if (!page) return;
  page.classList.remove('open');
  document.body.style.overflow = '';
  
  // Stop intervals
  if (ppCountdownInterval) clearInterval(ppCountdownInterval);
  if (ppViewerInterval) clearInterval(ppViewerInterval);
}

/* -------------------- Populate Wilayas -------------------- */
function ppPopulateWilayas() {
  const sel = document.getElementById('ppWilaya');
  if (!sel) return;
  sel.innerHTML = '<option value="" disabled selected>اختاري الولاية...</option>';
  wilayas.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.code;
    opt.textContent = `${w.code} - ${w.name}`;
    sel.appendChild(opt);
  });
}

/* -------------------- Populate Communes -------------------- */
function ppPopulateCommunes(wilayaCode) {
  const sel = document.getElementById('ppCommune');
  if (!sel) return;
  
  const communes = communesData[wilayaCode] || [];
  if (communes.length === 0) {
    sel.innerHTML = '<option value="" disabled selected>لا تتوفر بلديات محددة</option>';
    sel.disabled = true;
    return;
  }
  
  sel.innerHTML = '<option value="" disabled selected>اختاري البلدية...</option>';
  communes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
  sel.disabled = false;
}

/* -------------------- Update Shipping Info -------------------- */
function ppUpdateShipping() {
  if (!ppCurrentProduct) return;
  
  const wilayaCode = document.getElementById('ppWilaya').value;
  if (!wilayaCode) return;
  
  const w = wilayas.find(item => item.code === wilayaCode);
  if (!w) return;
  
  const homeFee = w.homeFee;
  
  // Current shipping (always home delivery now)
  const shipping = homeFee;
  const total = ppCurrentProduct.price + shipping;
  
  document.getElementById('ppSumShipping').textContent = formatPrice(shipping);
  document.getElementById('ppSumTotal').textContent = formatPrice(total);
}

/* -------------------- Render PP Reviews -------------------- */
function ppRenderReviews(productId) {
  const grid = document.getElementById('ppReviewsGrid');
  if (!grid) return;
  
  const reviews = productReviews[productId] || defaultReviews;
  grid.innerHTML = reviews.map(r => `
    <div class="pp-review">
      <div class="stars">${'★'.repeat(r.rating)}</div>
      <p>"${r.text}"</p>
      <div class="who">${r.who}</div>
      <div class="wilaya">📍 ${r.wilaya}</div>
    </div>
  `).join('');
}

/* -------------------- Countdown Timer -------------------- */
function ppStartCountdown() {
  if (ppCountdownInterval) clearInterval(ppCountdownInterval);
  
  // Random 1-3 hours remaining
  const mins = 60 + Math.floor(Math.random() * 120);
  const secs = Math.floor(Math.random() * 60);
  let totalSeconds = mins * 60 + secs;
  
  function updateDisplay() {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    
    const cdH = document.getElementById('ppCdHours');
    const cdM = document.getElementById('ppCdMinutes');
    const cdS = document.getElementById('ppCdSeconds');
    const inline = document.getElementById('ppTimerInline');
    
    if (cdH) cdH.textContent = hh;
    if (cdM) cdM.textContent = mm;
    if (cdS) cdS.textContent = ss;
    if (inline) inline.textContent = `${hh}:${mm}:${ss}`;
    
    if (totalSeconds > 0) totalSeconds--;
  }
  
  updateDisplay();
  ppCountdownInterval = setInterval(updateDisplay, 1000);
}

/* -------------------- Viewer Simulation -------------------- */
function ppStartViewerSim() {
  if (ppViewerInterval) clearInterval(ppViewerInterval);
  
  const baseViewers = (ppCurrentProduct && ppCurrentProduct.fakeViewers) ? Number(ppCurrentProduct.fakeViewers) : 12;
  let viewers = Math.max(5, baseViewers + Math.floor(Math.random() * 5) - 2);
  const el = document.getElementById('ppViewerCount');
  if (el) el.textContent = viewers;
  
  ppViewerInterval = setInterval(() => {
    const delta = Math.floor(Math.random() * 5) - 2;
    viewers = Math.max(5, Math.min(baseViewers + 10, viewers + delta));
    const el = document.getElementById('ppViewerCount');
    if (el) el.textContent = viewers;
  }, 4000 + Math.random() * 4000);
}

/* -------------------- PP Order Form Submit -------------------- */
function ppHandleOrderSubmit(e) {
  // [معزول بالكامل] الطلبات لا ترسل إلى لوحة التحكم لحماية الخصوصية ومطابقة إعدادات المتجر الساكن
  e.preventDefault();
  
  const name = document.getElementById('ppName').value.trim();
  const phone = document.getElementById('ppPhone').value.trim().replace(/\s+/g, '');
  const wilayaCode = document.getElementById('ppWilaya').value;
  const address = document.getElementById('ppAddress').value.trim();
  
  // Validate
  if (!name) {
    ppHighlightField('ppName', false);
    ppShakeBtn();
    return;
  }
  ppHighlightField('ppName', true);
  
  const phoneRegex = /^(05|06|07)[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    ppHighlightField('ppPhone', false);
    showToast('⚠️ يرجى إدخال رقم هاتف صحيح (مثال: 0550123456)', '', null);
    ppShakeBtn();
    return;
  }
  ppHighlightField('ppPhone', true);
  
  if (!wilayaCode) {
    document.getElementById('ppWilaya').style.borderColor = '#e53935';
    showToast('⚠️ يرجى اختيار الولاية', '', null);
    ppShakeBtn();
    return;
  }
  document.getElementById('ppWilaya').style.borderColor = '#4caf50';
  
  if (!address) {
    ppHighlightField('ppAddress', false);
    ppShakeBtn();
    return;
  }
  ppHighlightField('ppAddress', true);
  
  // Loading state
  const btn = document.getElementById('ppSubmitBtn');
  const btnText = btn.querySelector('.btn-text');
  const spinner = document.getElementById('ppSpinner');
  
  btn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (spinner) spinner.style.display = 'block';
  
  // Simulate API call (1.5s delay)
  setTimeout(() => {
    btn.disabled = false;
    if (btnText) btnText.style.display = 'block';
    if (spinner) spinner.style.display = 'none';
    
    // Build success
    const p = ppCurrentProduct;
    if (!p) return;
    
    const selectedWilaya = wilayas.find(w => w.code === wilayaCode);
    const wilayaName = selectedWilaya ? selectedWilaya.name : wilayaCode;
    const shipping = selectedWilaya ? selectedWilaya.homeFee : 0;
    const total = p.price + shipping;
    const orderId = '#LB-' + Math.floor(1000 + Math.random() * 9000);
    const productName = currentLang === 'ar' ? p.name : p.name_fr;
    
    // Fill success overlay
    document.getElementById('ppSuccessOrderId').textContent = orderId;
    
    const invoiceEl = document.getElementById('ppSuccessInvoice');
    if (invoiceEl) {
      invoiceEl.innerHTML = `
        <div style="margin-bottom:6px;"><strong>العميلة:</strong> ${name}</div>
        <div style="margin-bottom:6px;"><strong>الهاتف:</strong> ${phone}</div>
        <div style="margin-bottom:6px;"><strong>الولاية:</strong> ${wilayaCode} - ${wilayaName}</div>
        <div style="margin-bottom:6px;"><strong>العنوان:</strong> ${address}</div>
        <div style="border-top:1px dashed rgba(184,134,58,0.3);margin:10px 0;padding-top:10px;">
          <div style="margin-bottom:4px;"><strong>المنتج:</strong> ${productName} — ${formatPrice(p.price)}</div>
          <div style="margin-bottom:4px;"><strong>الشحن:</strong> ${formatPrice(shipping)}</div>
          <div style="font-weight:700;color:var(--gold);font-size:1rem;"><strong>الإجمالي:</strong> ${formatPrice(total)}</div>
        </div>
      `;
    }
    
    const purchaseEventId = 'LB-EV-' + orderId.replace('#', '');
    trackBrowserEvent('Purchase', { value: total, event_id: purchaseEventId });

    const newOrder = {
      id: orderId.replace('#', ''),
      name: name,
      phone: phone,
      wilaya: wilayaName,
      commune: '',
      address: address,
      product: productName,
      amount: total,
      status: 'pending',
      date: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      pixelEventId: purchaseEventId
    };
    
    // Save order to server with localStorage fallback
    (async function() {
      try {
        const response = await fetch(BACKEND_URL + '/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(newOrder)
        });
        if (response.ok) {
          console.log('Order persisted on server');
          return;
        }
      } catch (err) {
        console.warn('Backend server unreachable, falling back to local storage', err);
      }
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem('zf_orders') || '[]');
      savedOrders.unshift(newOrder);
      localStorage.setItem('zf_orders', JSON.stringify(savedOrders));
    })();

    // Show success
    const ppDigBox = document.getElementById('ppSuccessDigitalDelivery');
    const ppDigCode = document.getElementById('ppSuccessDigitalCode');
    if (ppDigBox && ppDigCode) {
      if (p.isDigital && p.digitalCode) {
        ppDigCode.textContent = p.digitalCode;
        ppDigBox.style.display = 'block';
      } else {
        ppDigBox.style.display = 'none';
      }
    }

    const successEl = document.getElementById('ppSuccess');
    if (successEl) successEl.classList.add('show');
    
    // Stop countdown and viewers
    if (ppCountdownInterval) clearInterval(ppCountdownInterval);
    if (ppViewerInterval) clearInterval(ppViewerInterval);
    
  }, 1500);
}

function ppHighlightField(fieldId, isValid) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  el.classList.toggle('valid', isValid);
  el.classList.toggle('invalid', !isValid);
}

function ppShakeBtn() {
  const btn = document.getElementById('ppSubmitBtn');
  if (!btn) return;
  btn.style.animation = 'none';
  btn.style.transform = 'translateX(-5px)';
  setTimeout(() => {
    btn.style.transform = 'translateX(5px)';
    setTimeout(() => {
      btn.style.transform = '';
      btn.style.animation = 'btn-pulse 3s ease-in-out infinite';
    }, 100);
  }, 100);
}

/* -------------------- Setup PP Event Listeners -------------------- */
document.addEventListener('DOMContentLoaded', () => {
  
  // Back button
  const ppBackBtn = document.getElementById('ppBackBtn');
  if (ppBackBtn) ppBackBtn.addEventListener('click', closeProductPage);

  // Size buttons handler
  document.querySelectorAll('.pp-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pp-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const size = btn.getAttribute('data-size');
      const customSec = document.getElementById('ppCustomMeasurementsSection');
      if (customSec) {
        if (size === 'custom') {
          customSec.style.display = 'block';
          customSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          customSec.style.display = 'none';
        }
      }
    });
  });
  
  // Wilaya change
  const ppWilayaSel = document.getElementById('ppWilaya');
  if (ppWilayaSel) {
    ppWilayaSel.addEventListener('change', (e) => {
      const code = e.target.value;
      ppPopulateCommunes(code);
      ppUpdateShipping();
      e.target.style.borderColor = 'var(--gold)';
    });
  }
  
  // Commune change
  const ppCommuneSel = document.getElementById('ppCommune');
  if (ppCommuneSel) {
    ppCommuneSel.addEventListener('change', (e) => {
      e.target.style.borderColor = 'var(--gold)';
    });
  }
  
  // Delivery toggle
  const homeBtn = document.getElementById('ppDeliveryHome');
  const deskBtn = document.getElementById('ppDeliveryDesk');
  
  if (homeBtn) homeBtn.addEventListener('click', () => {
    ppDeliveryType = 'home';
    homeBtn.classList.add('active');
    deskBtn.classList.remove('active');
    ppUpdateShipping();
  });
  
  if (deskBtn) deskBtn.addEventListener('click', () => {
    ppDeliveryType = 'desk';
    deskBtn.classList.add('active');
    homeBtn.classList.remove('active');
    ppUpdateShipping();
  });
  
  // Order form submit
  const ppForm = document.getElementById('ppOrderForm');
  if (ppForm) ppForm.addEventListener('submit', ppHandleOrderSubmit);
  
  // Success close
  const ppSuccessClose = document.getElementById('ppSuccessCloseBtn');
  if (ppSuccessClose) {
    ppSuccessClose.addEventListener('click', () => {
      document.getElementById('ppSuccess').classList.remove('show');
      closeProductPage();
    });
  }
  
  // Keyboard close (Escape)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const page = document.getElementById('productPage');
      if (page && page.classList.contains('open')) {
        closeProductPage();
      }
    }
  });
  
  // Input real-time validation
  ['ppName', 'ppPhone', 'ppAddress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (el.value.trim().length > 2) {
          el.classList.add('valid');
          el.classList.remove('invalid');
        }
      });
    }
  });
  
  // Phone-specific validation
  const ppPhone = document.getElementById('ppPhone');
  if (ppPhone) {
    ppPhone.addEventListener('blur', () => {
      const v = ppPhone.value.trim().replace(/\s+/g, '');
      const phoneRegex = /^(05|06|07)[0-9]{8}$/;
      if (v && !phoneRegex.test(v)) {
        ppPhone.classList.add('invalid');
        ppPhone.classList.remove('valid');
      } else if (v) {
        ppPhone.classList.add('valid');
        ppPhone.classList.remove('invalid');
      }
    });
  }

  // Start live purchase notification alerts
  startLiveSocialProofAlerts();
});

/* -------------------- Live Social Proof Alerts (القناع الوحشي) -------------------- */
function startLiveSocialProofAlerts() {
  const names = ['سارة', 'فاطمة', 'أمينة', 'مريم', 'ليلى', 'سميرة', 'ياسمين', 'إيمان', 'خديجة', 'نور الهدى', 'نهال', 'هدى', 'أسماء', 'أحلام', 'آمال'];
  const wilayasList = ['الجزائر العاصمة', 'وهران', 'قسنطينة', 'تلمسان', 'عنابة', 'سطيف', 'البليدة', 'بجاية', 'باتنة', 'جيجل', 'تيبازة', 'بسكرة', 'بومرداس', 'شلف'];
  const times = ['قبل دقيقة', 'قبل دقيقتين', 'قبل 3 دقائق', 'قبل 5 دقائق', 'منذ دقيقة', 'منذ 4 دقائق'];
  const timesFR = ['il y a 1 min', 'il y a 2 min', 'il y a 3 min', 'il y a 5 min', 'à l\'instant'];
  
  const popup = document.getElementById('liveAlertPopup');
  const alertText = document.getElementById('liveAlertText');
  const alertTime = document.getElementById('liveAlertTime');
  if (!popup || !alertText || !alertTime) return;
  
  function triggerAlert() {
    // Pick random product
    const p = productsData[Math.floor(Math.random() * productsData.length)];
    if (!p) return;
    
    const name = names[Math.floor(Math.random() * names.length)];
    const wilaya = wilayasList[Math.floor(Math.random() * wilayasList.length)];
    const time = currentLang === 'ar' 
      ? times[Math.floor(Math.random() * times.length)]
      : timesFR[Math.floor(Math.random() * timesFR.length)];
      
    const prodName = currentLang === 'ar' ? p.name : p.name_fr;
    
    if (currentLang === 'ar') {
      alertText.innerHTML = `قامت العضوة <strong>${name}</strong> من <strong>${wilaya}</strong> بطلب 🛍️ <strong>${prodName}</strong>`;
      alertTime.textContent = time;
    } else {
      alertText.innerHTML = `<strong>${name}</strong> de <strong>${wilaya}</strong> a commandé 🛍️ <strong>${prodName}</strong>`;
      alertTime.textContent = time;
    }
    
    // Show popup
    popup.classList.add('show');
    
    // Hide popup after 5 seconds
    setTimeout(() => {
      popup.classList.remove('show');
    }, 5000);
  }
  
  // First trigger after 8 seconds
  setTimeout(() => {
    triggerAlert();
    // Then repeat every 20 to 28 seconds
    setInterval(triggerAlert, 20000 + Math.random() * 8000);
  }, 6000);
}


/* ======= HERO SLIDER ======= */
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const prev   = document.getElementById('heroPrev');
  const next   = document.getElementById('heroNext');
  let current  = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if(prev) prev.addEventListener('click', () => { goTo(current - 1); autoPlay(); });
  if(next) next.addEventListener('click', () => { goTo(current + 1); autoPlay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); autoPlay(); }));
  autoPlay();

  /* Animate hero text in on load */
  function animateHero() {
    ['heroBrandSub','heroBrand','heroDivider','heroTagline','heroCtaWrap'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if(el) setTimeout(() => el.classList.add('visible'), idx * 180);
    });
  }
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateHero);
  } else {
    animateHero();
  }
})();

