/**
 * سوقك أونلاين - Premium Design Agency Logic
 */

const CONFIG = {
  // رقم الواتساب الخاص بك (مفتاح الدولة الجزائر +213 متبوعاً بالرقم دون الصفر الأول)
  whatsappNumber: '213669070092',
  consultationMessage: 'مرحباً سوقك أونلاين، أود الحصول على استشارة مجانية بخصوص تصميم متجر إلكتروني لمشروعي.',
  generalContactMessage: 'مرحباً سوقك أونلاين، أود الاستفسار عن خدمات تصميم المتاجر الإلكترونية والصفحات الفاخرة.',
  metaPixelId: ''
};

// تهيئة فيسبوك بيكسل ديناميكياً إذا تم إدخال المعرف
if (CONFIG.metaPixelId && CONFIG.metaPixelId.trim() !== '') {
  (function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js'));
  
  fbq('init', CONFIG.metaPixelId);
  fbq('track', 'PageView');
}

// دالة لتتبع الأحداث في البيكسل
function trackMarketingEvent(eventName, eventData = {}) {
  if (typeof fbq === 'function') {
    fbq('track', eventName, eventData);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // 1. PRELOADER PERCENTAGE COUNTER (OPTIMIZED ULTRA FAST)
  const preloader = document.getElementById('preloader');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  
  if (preloader && progressPercent && progressBar) {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 25) + 15;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        preloader.classList.add('loaded');
        initScrollAnimations();
      }
      progressPercent.textContent = count;
      progressBar.style.width = count + '%';
    }, 12);
  } else {
    initScrollAnimations();
  }

  // 2. CUSTOM CURSOR WITH LERP INTERPOLATION
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  
  let mouse = { x: -100, y: -100 };
  let dotPos = { x: -100, y: -100 };
  let ringPos = { x: -100, y: -100 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Lerp logic for smooth tracking
  function animateCursor() {
    // Immediate dot positioning
    dotPos.x += (mouse.x - dotPos.x);
    dotPos.y += (mouse.y - dotPos.y);
    if (cursorDot) {
      cursorDot.style.left = dotPos.x + 'px';
      cursorDot.style.top = dotPos.y + 'px';
    }

    // Smooth lerp ring positioning
    ringPos.x += (mouse.x - ringPos.x) * 0.14;
    ringPos.y += (mouse.y - ringPos.y) * 0.14;
    if (cursorRing) {
      cursorRing.style.left = ringPos.x + 'px';
      cursorRing.style.top = ringPos.y + 'px';
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover detection for interactive elements
  const hoverSelectors = 'a, button, .p-card, .pricing-card, .faq-card, .close-case-study, .whatsapp-btn';
  
  function updateCursorHoverEvents() {
    document.querySelectorAll(hoverSelectors).forEach(el => {
      // Avoid duplicate event registration
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        body.classList.add('cursor-hover');
        if (el.classList.contains('p-card') || el.classList.contains('device-container')) {
          body.classList.add('cursor-badge-view');
        }
      });

      el.addEventListener('mouseleave', () => {
        body.classList.remove('cursor-hover');
        body.classList.remove('cursor-badge-view');
      });
    });
  }
  updateCursorHoverEvents();

  // 3. 3D INTERACTIVE TILT FOR DEVICE MOCKUPS
  function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.macbook-mockup, .iphone-mockup');
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        // Prevent tilt when typing or clicking inside the interactive store forms/options
        if (e.target.closest('input, select, button, .sim-chip')) {
          el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          return;
        }
        
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Dynamic degrees based on position (max 12 deg)
        const rotX = -(y / (rect.height / 2)) * 12;
        const rotY = (x / (rect.width / 2)) * 12;
        
        el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        // Parallax image scrolling inside screen content
        const screenContent = el.querySelector('.macbook-screen-content, .iphone-screen-content');
        if (screenContent) {
          // Calculate hover ratio
          const hoverYRatio = (e.clientY - rect.top) / rect.height;
          // Smooth scroll background position inside the screenshot frame
          screenContent.style.backgroundPosition = `center ${hoverYRatio * 100}%`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        const screenContent = el.querySelector('.macbook-screen-content, .iphone-screen-content');
        if (screenContent) {
          screenContent.style.backgroundPosition = 'center top';
        }
      });
    });
  }
  initTiltEffect();

  // Scroll tilt mockup reaction
  window.addEventListener('scroll', () => {
    const heroMockup = document.querySelector('.hero .macbook-mockup');
    if (heroMockup) {
      const scrollRatio = window.scrollY / window.innerHeight;
      if (scrollRatio <= 1) {
        // Rotate mockup slightly on scroll down
        const rot = scrollRatio * 15;
        heroMockup.style.transform = `perspective(1000px) rotateX(${rot}deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    }
  });

  // 4. INTERSECTION OBSERVER FOR FADE-IN
  function initScrollAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealEls.forEach(el => io.observe(el));
  }

  // 5. SPA CASE STUDY ROUTER & OVERLAY MANAGER
  const curtain = document.getElementById('curtain');
  const caseOverlays = document.querySelectorAll('.case-study-overlay');
  const closeBtns = document.querySelectorAll('.close-case-study');
  
  // Open Case Study function
  function openCaseStudy(caseId) {
    const targetCase = document.getElementById(caseId);
    if (!targetCase) return;

    trackMarketingEvent('ViewContent', { content_name: caseId, content_category: 'Case Study' });

    // 1. Swipe curtain in
    curtain.classList.add('swipe');
    body.classList.add('cursor-hover');

    // 2. Middle of swipe transition (when screen is fully covered by curtain)
    setTimeout(() => {
      // Reset scroll in case study
      targetCase.scrollTop = 0;
      // Activate overlay
      targetCase.classList.add('active');
      body.style.overflow = 'hidden'; // Stop parent scrolling
    }, 800);

    // 3. Remove curtain animation when complete
    setTimeout(() => {
      curtain.classList.remove('swipe');
      body.classList.remove('cursor-hover');
      initTiltEffect(); // Re-init 3d tilt for newly loaded device mockups
      updateCursorHoverEvents(); // Bind cursor events for new close/cta buttons
    }, 1600);
  }

  // Close Case Study function
  function closeCaseStudy() {
    const activeCase = document.querySelector('.case-study-overlay.active');
    if (!activeCase) return;

    curtain.classList.add('swipe');
    body.classList.add('cursor-hover');

    setTimeout(() => {
      activeCase.classList.remove('active');
      body.style.overflow = ''; // Restore parent scrolling
    }, 800);

    setTimeout(() => {
      curtain.classList.remove('swipe');
      body.classList.remove('cursor-hover');
    }, 1600);
  }

  // Bind portfolio card clicks (and any element with data-open-case)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-case]');
    if (trigger) {
      e.preventDefault();
      const caseId = trigger.getAttribute('data-open-case');
      openCaseStudy(caseId);
    }
  });

  // Bind close buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCaseStudy();
    });
  });

  // Next Project CTA inside case study details
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.next-case-trigger');
    if (nextBtn) {
      e.preventDefault();
      const nextCaseId = nextBtn.getAttribute('data-next-case');
      
      // Close active case study and open next one in a single swipe!
      curtain.classList.add('swipe');
      body.classList.add('cursor-hover');

      setTimeout(() => {
        const activeCase = document.querySelector('.case-study-overlay.active');
        if (activeCase) activeCase.classList.remove('active');
        
        const nextCase = document.getElementById(nextCaseId);
        if (nextCase) {
          nextCase.scrollTop = 0;
          nextCase.classList.add('active');
        }
      }, 800);

      setTimeout(() => {
        curtain.classList.remove('swipe');
        body.classList.remove('cursor-hover');
        initTiltEffect();
        updateCursorHoverEvents();
      }, 1600);
    }
  });

  // 6. WHATSAPP CTA DYNAMIC SETUP
  const whatsappNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  
  // Pricing cards WhatsApp redirection
  document.querySelectorAll('.pricing-card a').forEach(link => {
    const packageName = link.closest('.pricing-card')?.querySelector('.pricing-title')?.textContent || 'استفسار';
    const customMsg = `مرحباً سوقك أونلاين، أود الاستفسار بخصوص باقة: (${packageName}) والمتابعة معكم لتصميم مشروعي.`;
    const encodedMsg = encodeURIComponent(customMsg);
    
    link.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
    link.setAttribute('target', '_blank');
    
    link.addEventListener('click', () => {
      trackMarketingEvent('Lead', { content_name: packageName });
    });
  });

  // Direct WhatsApp general buttons (including floating widget)
  document.querySelectorAll('.whatsapp-btn').forEach(btn => {
    const encodedMsg = encodeURIComponent(CONFIG.generalContactMessage);
    btn.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
    btn.setAttribute('target', '_blank');
    
    btn.addEventListener('click', () => {
      trackMarketingEvent('Contact', { method: 'WhatsApp' });
    });
  });

  // Contact section Free Consultation button
  const contactPrimaryCta = document.getElementById('contactPrimaryCta');
  if (contactPrimaryCta) {
    const encodedMsg = encodeURIComponent(CONFIG.consultationMessage);
    contactPrimaryCta.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
    contactPrimaryCta.setAttribute('target', '_blank');
    
    contactPrimaryCta.addEventListener('click', () => {
      trackMarketingEvent('Lead', { content_name: 'Free Consultation' });
    });
  }

  // Header CTA Button
  const headerCtaBtn = document.getElementById('headerCtaBtn');
  if (headerCtaBtn) {
    const encodedMsg = encodeURIComponent(CONFIG.generalContactMessage);
    headerCtaBtn.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
    headerCtaBtn.setAttribute('target', '_blank');
    
    headerCtaBtn.addEventListener('click', () => {
      trackMarketingEvent('Contact', { method: 'Header CTA' });
    });
  }

  // Hero Primary CTA Button
  const heroPrimaryCta = document.getElementById('heroPrimaryCta');
  if (heroPrimaryCta) {
    const encodedMsg = encodeURIComponent(CONFIG.consultationMessage);
    heroPrimaryCta.setAttribute('href', `https://wa.me/${whatsappNumber}?text=${encodedMsg}`);
    heroPrimaryCta.setAttribute('target', '_blank');
    
    heroPrimaryCta.addEventListener('click', () => {
      trackMarketingEvent('Lead', { content_name: 'Hero Consultation' });
    });
  }

  // 7. HEADER BG CHANGE ON SCROLL
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 8. PROGRESS BAR IN HEADER SCROLL INDICATOR
  const headerProgressBar = document.getElementById('headerProgressBar');
  if (headerProgressBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      headerProgressBar.style.width = scrolled + '%';
    });
  }

  // 9. ANIMATED STATS NUMBERS (COUNT UP)
  const counters = document.querySelectorAll('.stat-card .num, .float-chip b');
  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const targetValue = parseInt(el.dataset.target, 10);
        if (isNaN(targetValue)) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        function tick(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Easing: easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * targetValue);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = targetValue; // Snap to absolute target
          }
        }
        requestAnimationFrame(tick);
        countersObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  

  // ===== INTERACTIVE STORE SIMULATOR LOGIC =====

  // 1. Skincare Store (iPhone mockup)
  const skincareVariantContainer = document.getElementById('sim-skincare-variant');
  const skincareScroll = document.getElementById('sim-skincare-scroll');
  const skincareBuyBtn = document.getElementById('sim-skincare-buy-btn');
  const skincareCheckout = document.getElementById('sim-skincare-checkout');
  const skincareCartCount = document.getElementById('sim-skincare-cart-count');
  const skincareForm = document.getElementById('sim-skincare-form');
  const skincareSuccess = document.getElementById('sim-skincare-success');
  const skincareCloseSuccess = document.getElementById('sim-skincare-close-success');

  if (skincareVariantContainer) {
    skincareVariantContainer.querySelectorAll('.sim-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        skincareVariantContainer.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  }

  if (skincareBuyBtn && skincareScroll && skincareCheckout && skincareCartCount) {
    skincareBuyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      skincareCartCount.textContent = '1';
      // Animate cart count pop
      skincareCartCount.style.transform = 'scale(1.3)';
      setTimeout(() => skincareCartCount.style.transform = 'scale(1)', 300);
      
      // Scroll to checkout form
      const topOffset = skincareCheckout.offsetTop;
      skincareScroll.scrollTo({ top: topOffset, behavior: 'smooth' });
    });
  }

  if (skincareForm && skincareSuccess && skincareScroll) {
    skincareForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Scroll back to top so success overlay is centered
      skincareScroll.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        skincareSuccess.classList.add('show');
      }, 400);
    });
  }

  if (skincareCloseSuccess && skincareSuccess && skincareForm && skincareCartCount) {
    skincareCloseSuccess.addEventListener('click', (e) => {
      e.preventDefault();
      skincareSuccess.classList.remove('show');
      skincareForm.reset();
      skincareCartCount.textContent = '0';
      // Reset active chip
      if (skincareVariantContainer) {
        skincareVariantContainer.querySelectorAll('.sim-chip').forEach(c => c.classList.remove('active'));
        skincareVariantContainer.querySelector('.sim-chip')?.classList.add('active');
      }
    });
  }


  // 2. Fashion Store (MacBook mockup)
  const fashionScroll = document.getElementById('sim-fashion-scroll');
  const fashionCartCount = document.getElementById('sim-fashion-cart-count');
  const fashionCheckout = document.getElementById('sim-fashion-checkout');
  const fashionSelectedItem = document.getElementById('sim-fashion-selected-item');
  const fashionSelectedPrice = document.getElementById('sim-fashion-selected-price');
  const fashionForm = document.getElementById('sim-fashion-form');
  const fashionSuccess = document.getElementById('sim-fashion-success');
  const fashionCloseSuccess = document.getElementById('sim-fashion-close-success');

  document.querySelectorAll('.sim-grid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-item');
      const itemPrice = btn.getAttribute('data-price');
      
      if (fashionSelectedItem && fashionSelectedPrice && fashionCheckout && fashionScroll && fashionCartCount) {
        fashionSelectedItem.textContent = itemName;
        fashionSelectedPrice.textContent = parseInt(itemPrice).toLocaleString() + ' دج';
        fashionCheckout.style.display = 'block';
        fashionCartCount.textContent = '1';
        
        // Scroll to form
        setTimeout(() => {
          const topOffset = fashionCheckout.offsetTop;
          fashionScroll.scrollTo({ top: topOffset, behavior: 'smooth' });
        }, 100);
      }
    });
  });

  if (fashionForm && fashionSuccess && fashionScroll) {
    fashionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Scroll back to top so success overlay is visible
      fashionScroll.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        fashionSuccess.classList.add('show');
      }, 400);
    });
  }

  if (fashionCloseSuccess && fashionSuccess && fashionForm && fashionCheckout && fashionCartCount) {
    fashionCloseSuccess.addEventListener('click', (e) => {
      e.preventDefault();
      fashionSuccess.classList.remove('show');
      fashionCheckout.style.display = 'none';
      fashionForm.reset();
      fashionCartCount.textContent = '0';
    });
  }

  // 3. Aurelia Shopify Store Simulator
  const aureliaBtns = document.querySelectorAll('.sim-aurelia-grid-btn');
  const aureliaCheckout = document.getElementById('sim-aurelia-checkout');
  const aureliaSelectedItem = document.getElementById('sim-aurelia-selected-item');
  const aureliaSelectedPrice = document.getElementById('sim-aurelia-selected-price');
  const aureliaCartCount = document.getElementById('sim-aurelia-cart-count');
  const aureliaScroll = document.getElementById('sim-aurelia-scroll');
  const aureliaForm = document.getElementById('sim-aurelia-form');
  const aureliaSuccess = document.getElementById('sim-aurelia-success');
  const aureliaCloseSuccess = document.getElementById('sim-aurelia-close-success');

  if (aureliaBtns.length > 0 && aureliaCheckout && aureliaSelectedItem && aureliaSelectedPrice && aureliaCartCount && aureliaScroll) {
    aureliaBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.getAttribute('data-item');
        const price = btn.getAttribute('data-price');

        aureliaSelectedItem.textContent = item;
        aureliaSelectedPrice.textContent = parseInt(price, 10).toLocaleString('ar-DZ') + ' دج';
        aureliaCartCount.textContent = '1';

        aureliaCheckout.style.display = 'block';

        // Smooth scroll to checkout inside mockup
        setTimeout(() => {
          aureliaScroll.scrollTo({
            top: aureliaCheckout.offsetTop - 20,
            behavior: 'smooth'
          });
        }, 100);
      });
    });
  }

  if (aureliaForm && aureliaSuccess && aureliaScroll) {
    aureliaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      aureliaScroll.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        aureliaSuccess.classList.add('show');
      }, 400);
    });
  }

  if (aureliaCloseSuccess && aureliaSuccess && aureliaForm && aureliaCheckout && aureliaCartCount) {
    aureliaCloseSuccess.addEventListener('click', (e) => {
      e.preventDefault();
      aureliaSuccess.classList.remove('show');
      aureliaCheckout.style.display = 'none';
      aureliaForm.reset();
      aureliaCartCount.textContent = '0';
    });
  }

  // 3. Zaphera Coftan Pro Store Simulator
  const zapheraBtns = document.querySelectorAll('.sim-zaphera-grid-btn');
  const zapheraCheckout = document.getElementById('sim-zaphera-checkout');
  const zapheraSelectedItem = document.getElementById('sim-zaphera-selected-item');
  const zapheraSelectedPrice = document.getElementById('sim-zaphera-selected-price');
  const zapheraCartCount = document.getElementById('sim-zaphera-cart-count');
  const zapheraScroll = document.getElementById('sim-zaphera-scroll');
  const zapheraForm = document.getElementById('sim-zaphera-form');
  const zapheraSuccess = document.getElementById('sim-zaphera-success');
  const zapheraCloseSuccess = document.getElementById('sim-zaphera-close-success');

  if (zapheraBtns.length > 0 && zapheraCheckout && zapheraSelectedItem && zapheraSelectedPrice && zapheraCartCount && zapheraScroll) {
    zapheraBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const item = btn.getAttribute('data-item');
        const price = btn.getAttribute('data-price');

        zapheraSelectedItem.textContent = item;
        zapheraSelectedPrice.textContent = parseInt(price, 10).toLocaleString('ar-DZ') + ' دج';
        zapheraCartCount.textContent = '1';

        zapheraCheckout.style.display = 'block';

        setTimeout(() => {
          zapheraScroll.scrollTo({
            top: zapheraCheckout.offsetTop - 20,
            behavior: 'smooth'
          });
        }, 100);
      });
    });
  }

  if (zapheraForm && zapheraSuccess && zapheraScroll) {
    zapheraForm.addEventListener('submit', (e) => {
      e.preventDefault();
      zapheraScroll.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        zapheraSuccess.classList.add('show');
      }, 400);
    });
  }

  if (zapheraCloseSuccess && zapheraSuccess && zapheraForm && zapheraCheckout && zapheraCartCount) {
    zapheraCloseSuccess.addEventListener('click', (e) => {
      e.preventDefault();
      zapheraSuccess.classList.remove('show');
      zapheraCheckout.style.display = 'none';
      zapheraForm.reset();
      zapheraCartCount.textContent = '0';
    });
  }

  // 4. BEHANCE CATEGORY FILTER TABS LOGIC
  const behanceTabs = document.querySelectorAll('.behance-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-grid .p-card');
  
  if (behanceTabs.length > 0 && portfolioCards.length > 0) {
    behanceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        behanceTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  counters.forEach(c => countersObserver.observe(c));
});



// ====================================================
// PROJECTS DATA ARRAY (BEHANCE EDITORIAL SHOWCASE)
// ====================================================
const PROJECTS_DATA = [
  {
    id: "case-zaphera",
    category: "fashion",
    title: "زاڤيرا | ZAPHERA — دار الأزياء والقفطان الفاخر",
    tagline: "تجربة أزياء فاخرة رقمية: قفطان، كراكو، فساتين سهرة وزفاف بلمسة جزائرية أصيلة مع فورم طلب سريع محلي يدعم 58 ولاية بـ 0% عمولة.",
    categoryLabel: "DTC Haute Couture · أزياء وتطريز فاخر",
    gridClass: "grid-featured-wide",
    coverImage: "assets/images/portfolio/aurelia.png",
    fullImage: "assets/images/portfolio/aurelia.png",
    liveUrl: "https://pipounostra1.github.io/zaphera-coftan-pro/",
    badgeMetric: "📈 +410% مبيعات",
    metrics: [
      { val: "+410%", lbl: "ارتفاع المبيعات عبر الموبايل" },
      { val: "0.8s", lbl: "سرعة التحميل على شبكة 4G" },
      { val: "0%", lbl: "عمولات مقتطعة للمنصات" }
    ],
    tags: ["Custom Architecture", "E-commerce UX", "Algerian Haute Couture", "58 Wilayas COD"],
    facts: [
      { lbl: "العميل", val: "ZAPHERA Haute Couture Algeria" },
      { lbl: "النطاق والخدمات", val: "DTC Store Architecture, UI/UX Design, 58 Wilayas COD" },
      { lbl: "رابط المتجر الحي", val: "pipounostra1.github.io/zaphera-coftan-pro ↗" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "السرد البصري للقفطان الجزائري", desc: "إبراز تفاصيل التطريز، الشداد، والمخمل الملكي في صور عالية الدقة تركز على الجودة والأصالة." },
      { num: "02", title: "نظام التفصيل والمقاسات الذكي", desc: "خيار اختيار المقاس القياسي أو إدخال قياسات مخصصة تضمن الدقة الكاملة وتزيل تردّد المشتري." },
      { num: "03", title: "التوصيل السريع والدفع عند الاستلام", desc: "فورم طلب مدمج ومبسط يحسب سعر الشحن تلقائياً لـ 58 ولاية بدون أي اشتراكات أو عمولات." }
    ],
    swatches: [
      { name: "Ivory", hex: "#FAF6EE", color: "#1A1208" },
      { name: "Antique Gold", hex: "#C49A3C", color: "#1A1208" },
      { name: "Deep Walnut", hex: "#1A1208", color: "#FAF6EE" },
      { name: "Royal Velvet", hex: "#800020", color: "#FAF6EE" }
    ]
  },
  {
    id: "case-skincare",
    category: "cosmetics",
    title: "صفحة هبوط مستحضرات التجميل الفاخرة (Premium Skincare)",
    tagline: "صفحة مبيعات مصممة خصيصاً لإبراز مكونات وجودة المنتج مع محاكي طلب سريع يرفع ثقة المشتري الجزائري.",
    categoryLabel: "DTC Cosmetics · تجميل وعناية بالبشرة",
    gridClass: "grid-featured-big",
    coverImage: "assets/images/portfolio/perfume.png",
    fullImage: "assets/images/portfolio/perfume.png",
    badgeMetric: "🚀 +190% مبيعات",
    metrics: [
      { val: "+190%", lbl: "ارتفاع نسبة تحويل الزوار" },
      { val: "0.6s", lbl: "سرعة التحميل على 4G" },
      { val: "58 ولاية", lbl: "ربط للشحن التلقائي" }
    ],
    tags: ["DTC Sales Funnel", "High Conversion UX", "Cosmetic Branding"],
    facts: [
      { lbl: "العميل", val: "LUMIÈRE Skincare & Beauty" },
      { lbl: "النطاق", val: "DTC Landing Page, Conversion Optimization" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "السرد البصري للمكونات", desc: "عرض تفاعلي لأمبولات السيروم والزيوت الطبيعية مع شارات الاعتماد الصحي." },
      { num: "02", title: "محدد نوع البشرة", desc: "اختبار سريع يحدد السيروم المناسب لكل زائرة قبل الطلب لزيادة الاقناع." },
      { num: "03", title: "طلب بصفحة واحدة", desc: "نموذج شراء سريع محلي يحسب تكلفة الشحن لـ 58 ولاية فورا." }
    ],
    swatches: [
      { name: "Rose Gold", hex: "#E8C5C8", color: "#1c1b19" },
      { name: "Pure Silk", hex: "#FFF8F6", color: "#1c1b19" },
      { name: "Obsidian", hex: "#120F13", color: "#ffffff" }
    ]
  },
  {
    id: "case-aurelia",
    category: "fashion",
    title: "متجر أوريليا للأزياء النسائية الفاخرة (AURELIA Shopify Storefront)",
    tagline: "دراسة حالة شاملة بأسلوب Behance التحريري لمتجر أزياء مبني على Shopify Online Store 2.0 مع نظام اختيار المقاسات والكتلوج المباشر.",
    categoryLabel: "Shopify 2.0 · أزياء وموديلات فاخرة",
    gridClass: "grid-featured-wide",
    coverImage: "assets/images/portfolio/aurelia.png",
    fullImage: "assets/images/portfolio/aurelia.png",
    badgeMetric: "📈 +38% تحويل",
    metrics: [
      { val: "+38%", lbl: "ارتفاع نسبة التحويل (CR)" },
      { val: "-22%", lbl: "انخفاض مرتجعات المقاسات" },
      { val: "1.4s", lbl: "سرعة التحميل على الموبايل" }
    ],
    tags: ["Shopify 2.0", "E-commerce UX", "Art Direction", "Metafields"],
    facts: [
      { lbl: "العميل", val: "Aurelia Womenswear Paris" },
      { lbl: "النطاق والخدمات", val: "UX/UI Design, Shopify 2.0, Art Direction" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "كتلوج بصري تفاعلي", desc: "عرض التشكيلات الجديدة والموديلات بأسلوب شبكي عريض يبرز تفاصيل القماش." },
      { num: "02", title: "نظام المقاسات الذكي", desc: "إدماج دليل مقاسات مخصص يقلل من مرتجعات المبيعات ويمنح المشتري ثقة كاملة." },
      { num: "03", title: "سرعة تحميل خرافية", desc: "إطلاق المتجر على Shopify 2.0 القائم على Metafields ونظام تصفح سريع." }
    ],
    swatches: [
      { name: "Ink", hex: "#1C1B19", color: "#fff" },
      { name: "Paper", hex: "#EDEAE4", color: "#1C1B19" },
      { name: "Thread", hex: "#A63A32", color: "#fff" },
      { name: "Brass", hex: "#C9A227", color: "#1C1B19" }
    ]
  },
  {
    id: "case-fashion",
    category: "fashion",
    title: "متجر الملابس والأزياء العصرية (Summer Outfitters)",
    tagline: "متجر ملابس إلكتروني متكامل بتجربة تصفح انسيابية ترفع المبيعات على الموبايل وتقلل خطوات سلة التسوق.",
    categoryLabel: "DTC Fashion · ملابس وأزياء صيفية",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/fashion.png",
    fullImage: "assets/images/portfolio/fashion.png",
    badgeMetric: "📈 +310% تحويل",
    metrics: [
      { val: "+310%", lbl: "زيادة تحويل طلبات الموبايل" },
      { val: "0%", lbl: "عمولات مقتطعة للمنصات" },
      { val: "1.1s", lbl: "زمن استجابة الواجهة" }
    ],
    tags: ["Fashion Retail", "Mobile Shopping", "Cart Optimization"],
    facts: [
      { lbl: "العميل", val: "Summer Outfitters DZ" },
      { lbl: "النطاق", val: "Full DTC Storefront, Checkout System" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "تصفح فوري للمنتجات", desc: "عرض سريع للمقاسات والألوان المتوفرة بدون الحاجة لإعادة تحميل الصفحة." },
      { num: "02", title: "سلة تسوق ذكية", desc: "حفظ المنتجات تلقائياً وتنبيه الزائر بالعروض الترويجية المتاحة." }
    ],
    swatches: [
      { name: "Ocean Navy", hex: "#1D2A44", color: "#fff" },
      { name: "Sand Beige", hex: "#F3EBE1", color: "#1D2A44" }
    ]
  },
  {
    id: "case-electronics",
    category: "electronics",
    title: "متجر الإلكترونيات والأجهزة المنزلية (Electro DZ)",
    tagline: "تصميم مخصص يسهل مقارنة الخصائص التقنية والقطع وتوفير تجربة تصفح منظمة تزيد من قيمة متوسط السلة.",
    categoryLabel: "DTC Electronics · إلكترونيات وأجهزة",
    gridClass: "grid-featured-tall",
    coverImage: "assets/images/portfolio/electronics.png",
    fullImage: "assets/images/portfolio/electronics.png",
    badgeMetric: "🔌 مقارنة مواصفات",
    metrics: [
      { val: "+240%", lbl: "زيادة مبيعات الأجهزة" },
      { val: "0.5s", lbl: "سرعة مقارنة الخصائص" },
      { val: "100%", lbl: "دعم الضمان المحلي" }
    ],
    tags: ["Tech Comparison", "Electronics Store", "Specs Engine"],
    facts: [
      { lbl: "العميل", val: "Electro DZ Appliances" },
      { lbl: "النطاق", val: "Multi-category Electronics Storefront" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "جدول مقارنة المواصفات", desc: "أداة تفاعلية تتيح للمشتري مقارنة التقنيات والأسعار والضمان بلمسة واحدة." },
      { num: "02", title: "فورم حجز وتوصيل الأجهزة", desc: "تنسيق خاص للتوصيل الثقيل وضمان سلامة المنتج عند الاستلام." }
    ],
    swatches: [
      { name: "Cyber Neon", hex: "#00F0FF", color: "#0a0a14" },
      { name: "Dark Carbon", hex: "#12131A", color: "#00F0FF" }
    ]
  },
  {
    id: "case-lusion",
    category: "luxury",
    title: "موقع تفاعلي لعرض الخدمات الرقمية (Lusion Realtime)",
    tagline: "تطوير واجهة ويب تفاعلية ثلاثية الأبعاد بالكامل تزيد من تفاعل الزوار وبناء هيبة البراند وجذب كبار العملاء.",
    categoryLabel: "Interactive 3D · تجارب ويب ثلاثية الأبعاد",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/creative_portfolio.png",
    fullImage: "assets/images/portfolio/creative_portfolio.png",
    badgeMetric: "🔮 3D Realtime",
    metrics: [
      { val: "60FPS", lbl: "معدل الإطارات الانسيابي" },
      { val: "+450%", lbl: "زيادة وقت البقاء بالموقع" },
      { val: "WebGL", lbl: "تقنية العرض الثلاثي" }
    ],
    tags: ["WebGL 3D", "Realtime Shaders", "Luxury Experience"],
    facts: [
      { lbl: "العميل", val: "Lusion Creative Agency" },
      { lbl: "النطاق", val: "3D Realtime WebGL Experience" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "مؤثرات بصرية ثلاثية الأبعاد", desc: "نماذج تفاعلية تستجيب لحركة الماوس واللمس بأداء خفيف للغاية." },
      { num: "02", title: "هيبة رقمية استثنائية", desc: "بناء انطباع مبهر يرسخ فخامة العلامة التجارية لدى الشركات الكبرى." }
    ],
    swatches: [
      { name: "Deep Violet", hex: "#2D1B4E", color: "#fff" },
      { name: "Neon Violet", hex: "#A855F7", color: "#fff" }
    ]
  },
  {
    id: "case-cartier",
    category: "luxury",
    title: "موقع السرد القصصي لعلامة الساعات (Cartier Showcase)",
    tagline: "تصميم بمظهر داكن وتأثيرات بصرية راقية لعرض تاريخ الساعات وتفاصيلها النادرة بأسلوب سرد سينمائي فاخر.",
    categoryLabel: "Luxury Showcase · السرد الفاخر لعلامات الساعات",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/cartier.png",
    fullImage: "assets/images/portfolio/cartier.png",
    badgeMetric: "👑 فخامة سينمائية",
    metrics: [
      { val: "👑 100%", lbl: "درجة الفخامة والرقي" },
      { val: "+280%", lbl: "ارتفاع طلبات المعاينة" },
      { val: "4K", lbl: "دقة المواد البصرية" }
    ],
    tags: ["Luxury Horology", "Cinematic Storytelling", "Dark Elegance"],
    facts: [
      { lbl: "العميل", val: "Cartier Prestige Showcase" },
      { lbl: "النطاق", val: "Interactive Editorial Brand Canvas" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "سرد سينمائي فاخر", desc: "عرض تفاصيل العقارب والقطع الميكانيكية بأسلوب تحريري فاخر." }
    ],
    swatches: [
      { name: "Bordeaux Gold", hex: "#C59B27", color: "#140a0c" },
      { name: "Deep Crimson", hex: "#3B080F", color: "#C59B27" }
    ]
  },
  {
    id: "case-grocery",
    category: "electronics",
    title: "منصة تسوق الأغذية العضوية الطازجة (Fresh Market)",
    tagline: "تصميم سريع وواجهات واضحة لتسهيل عملية الشراء لجميع الفئات السنية وتأكيد فوري لطلبات التوصيل للمنازل.",
    categoryLabel: "DTC Grocery · أغذية وتوصيل طازج",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/grocery.png",
    fullImage: "assets/images/portfolio/grocery.png",
    badgeMetric: "🥑 طلب سريع",
    metrics: [
      { val: "0.5s", lbl: "سرعة تحميل الكتلوج" },
      { val: "+340%", lbl: "زيادة الطلبات اليومية" },
      { val: "100%", lbl: "دعم التوصيل السريع" }
    ],
    tags: ["Grocery Delivery", "Fast Checkout", "Fresh Food"],
    facts: [
      { lbl: "العميل", val: "Fresh Organic Market" },
      { lbl: "النطاق", val: "DTC Grocery Platform & Delivery Funnel" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "تصفح السلال والمنتجات", desc: "واجهة واضحة لجميع الفئات الفئات العمرية تضمن إتمام الطلب بسرعة." }
    ],
    swatches: [
      { name: "Fresh Green", hex: "#22C55E", color: "#0f172a" },
      { name: "Organic Cream", hex: "#F8FAFC", color: "#1e293b" }
    ]
  },
  {
    id: "case-furniture",
    category: "luxury",
    title: "معرض الأثاث والديكور المنزلي الفاخر (Modern Living)",
    tagline: "واجهات مريحة تركز على عرض تفاصيل القطع والأبعاد ومساعدة المشتري على تخيل المنتجات في منزله.",
    categoryLabel: "DTC Furniture · أثاث وديكور منزلي",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/furniture.png",
    fullImage: "assets/images/portfolio/furniture.png",
    badgeMetric: "🛋️ ديكور 3D",
    metrics: [
      { val: "+210%", lbl: "ارتفاع طلبات غرف النوم" },
      { val: "3D", lbl: "معاينة أبعاد الأثاث" },
      { val: "58 ولاية", lbl: "توصيل آمن للمنزل" }
    ],
    tags: ["Furniture Showcase", "Interior Design", "3D Room View"],
    facts: [
      { lbl: "العميل", val: "Modern Living Furniture" },
      { lbl: "النطاق", val: "High-End Furniture E-Store" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "معاينة أبعاد الأثاث", desc: "عرض تفاصيل خشب الزان والقطع والأبعاد بدقة عالية قبل الطلب." }
    ],
    swatches: [
      { name: "Warm Walnut", hex: "#5C4033", color: "#fff" },
      { name: "Nordic Linen", hex: "#EBE5DF", color: "#332219" }
    ]
  },
  {
    id: "case-baby",
    category: "cosmetics",
    title: "متجر ألعاب ومنتجات الأطفال الصحية (Little Angels)",
    tagline: "تصميم يبرز درجات الأمان والسلامة للمواد مع إشعارات ذكية لبناء ثقة الأمهات والآباء وزيادة المبيعات.",
    categoryLabel: "DTC Baby · منتجات ومستلزمات أطفال",
    gridClass: "grid-standard",
    coverImage: "assets/images/portfolio/baby.png",
    fullImage: "assets/images/portfolio/baby.png",
    badgeMetric: "👶 ثقة الأمهات",
    metrics: [
      { val: "+380%", lbl: "زيادة الثقة والتحويل" },
      { val: "0.4s", lbl: "سرعة تحميل الصفحة" },
      { val: "100%", lbl: "خالي من المواد الضارة" }
    ],
    tags: ["Baby Care", "Health Safety", "High Conversion"],
    facts: [
      { lbl: "العميل", val: "Little Angels DZ" },
      { lbl: "النطاق", val: "Baby Care E-commerce Storefront" },
      { lbl: "سنة الإطلاق", val: "2026" }
    ],
    strategySteps: [
      { num: "01", title: "شهادات الأمان والسلامة", desc: "عرض واضح لمعايير الجودة لمنح الأمهات اطمئنانا كاملا عند الطلب." }
    ],
    swatches: [
      { name: "Soft Pastel Blue", hex: "#7DD3FC", color: "#0c4a6e" },
      { name: "Pure White", hex: "#FFFFFF", color: "#0c4a6e" }
    ]
  }
];

function renderAsymmetricGrid(filter) {
  if (!filter) filter = 'all';
  const container = document.getElementById('behance-grid-container');
  if (!container) return;

  const filteredProjects = PROJECTS_DATA.filter(p => filter === 'all' || p.category === filter);
  
  let htmlStr = '';
  filteredProjects.forEach(p => {
    htmlStr += '<div class="behance-grid-item ' + p.gridClass + '" data-project-id="' + p.id + '" tabindex="0" role="button" aria-label="استعراض دراسة حالة ' + p.title + '">';
    htmlStr += '  <img src="' + p.coverImage + '" alt="' + p.title + '" class="behance-grid-cover" loading="lazy">';
    htmlStr += '  <div class="behance-grid-overlay">';
    htmlStr += '    <div class="behance-grid-top">';
    htmlStr += '      <span class="behance-grid-badge">BEHANCE FEATURED</span>';
    htmlStr += '      <span class="behance-grid-metric-chip">' + p.badgeMetric + '</span>';
    htmlStr += '    </div>';
    htmlStr += '    <div class="behance-grid-bottom">';
    htmlStr += '      <span class="behance-grid-category">' + p.categoryLabel + '</span>';
    htmlStr += '      <h3 class="behance-grid-title">' + p.title + '</h3>';
    htmlStr += '      <span class="behance-grid-link-action">استعراض دراسة الحالة ↗</span>';
    htmlStr += '    </div>';
    htmlStr += '  </div>';
    htmlStr += '</div>';
  });
  
  container.innerHTML = htmlStr;

  const items = container.querySelectorAll('.behance-grid-item');
  items.forEach(item => {
    const pId = item.getAttribute('data-project-id');
    item.addEventListener('click', () => openCaseStudyView(pId));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCaseStudyView(pId);
      }
    });
  });
}


function openCaseStudyView(projectId) {
  const p = PROJECTS_DATA.find(item => item.id === projectId);
  if (!p) return;

  const fullscreenView = document.getElementById('fullscreen-case-view');
  const viewBody = document.getElementById('case-view-body');
  const barTitle = document.getElementById('case-view-bar-title');

  if (!fullscreenView || !viewBody) return;

  const currentIndex = PROJECTS_DATA.findIndex(item => item.id === projectId);
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

  barTitle.textContent = p.categoryLabel.toUpperCase();

  const factsHtml = p.facts ? `
    <div class="case-content-section" style="margin-top:60px;">
      <div class="case-section-grid">
        <div class="case-section-title">00 · النظرة العامة والبيانات</div>
        <div class="case-section-desc">
          <div class="aurelia-facts-grid">
            ${p.facts.map(f => `
              <div class="fact-card">
                <div class="fact-lbl">${f.lbl}</div>
                <div class="fact-val">${f.val}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  ` : '';

  const stepsHtml = p.strategySteps ? `
    <div class="case-content-section" style="margin-top:60px;">
      <div class="case-section-grid">
        <div class="case-section-title">10 · استراتيجية التصميم والأداء</div>
        <div class="case-section-desc">
          تطوير تجربة الواجهة بعناية فائقة لضمان سرعة فائقة وأعلى معدل تحويل مبيعات:
          <div class="aurelia-steps-grid" style="margin-top:20px;">
            ${p.strategySteps.map(s => `
              <div class="step-card">
                <div class="step-num">${s.num}</div>
                <h4>${s.title}</h4>
                <p>${s.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  ` : '';

  const swatchesHtml = p.swatches ? `
    <div class="case-content-section" style="margin-top:60px;">
      <div class="case-section-grid">
        <div class="case-section-title">20 · الهوية والألوان (Palette)</div>
        <div class="case-section-desc">
          <div class="aurelia-swatches-row">
            ${p.swatches.map(sw => `
              <div class="aurelia-swatch" style="background:${sw.hex}; color:${sw.color};">
                ${sw.name} <span>${sw.hex}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  ` : '';

  viewBody.innerHTML = `
    <div class="case-hero-full-bleed" style="background-image: url('${p.fullImage}');">
      <div class="case-hero-content-inner">
        <div class="case-meta" style="margin-bottom:12px; font-family:'IBM Plex Mono', monospace; color:var(--accent-light); font-weight:700;">
          <span>${p.categoryLabel}</span> · <span>2026</span>
        </div>
        <h1 class="case-giant-title">${p.title}</h1>
        <p class="case-giant-tagline">${p.tagline}</p>

        ${p.liveUrl ? `
          <div style="margin-top:24px;">
            <a href="${p.liveUrl}" target="_blank" class="btn-primary" style="display:inline-flex; align-items:center; gap:10px; padding:14px 28px; border-radius:30px; font-weight:800; background:var(--accent-light); color:#000; text-decoration:none;">
              <span>🌐 زيارة المتجر الحي المباشر ↗</span>
            </a>
          </div>
        ` : ''}

        <div class="aurelia-tags-list" style="margin-top:20px;">
          ${p.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="wrap" style="padding-top: 40px;">
      <div class="case-metrics-hero-row">
        ${p.metrics.map(m => `
          <div class="big-metric-card">
            <div class="big-metric-num">${m.val}</div>
            <div class="big-metric-lbl">${m.lbl}</div>
          </div>
        `).join('')}
      </div>

      ${factsHtml}
      ${stepsHtml}
      ${swatchesHtml}

      <div class="behance-fullbleed-showcase">
        <div class="behance-fullpage-head" style="margin-bottom:20px;">
          <span class="behance-badge">✦ FULL-LENGTH LANDING PAGE CANVAS</span>
          <h3>العرض الكامل لصفحة الهبوط (Full Design Canvas)</h3>
          <p>استعراض شامل بالطول لجميع عناصر الواجهة من الهيدر حتى الفوتر. مرر الماوس للتصفح التلقائي على الديسكتوب، أو استخدم التمرير اللمسي المباشر على الموبايل:</p>
        </div>
        <div class="behance-fullbleed-frame">
          <div class="behance-fullbleed-scroll" style="background-image: url('${p.fullImage}');"></div>
        </div>
      </div>

      <div class="next-case-trigger" style="margin-top:80px; cursor:pointer;" id="trigger-next-project" data-next-id="${nextProject.id}">
        <span class="lbl">دراسة الحالة التالية ↗</span>
        <h3 style="margin-top:8px;">${nextProject.title}</h3>
        <button class="next-btn" style="margin-top:16px;">استعراض المشروع التالي ←</button>
      </div>
    </div>
  `;

  fullscreenView.classList.add('active');
  fullscreenView.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  fullscreenView.scrollTop = 0;

  const nextBtn = document.getElementById('trigger-next-project');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextId = nextBtn.getAttribute('data-next-id');
      openCaseStudyView(nextId);
    });
  }
}


function closeCaseStudyView() {
  const fullscreenView = document.getElementById('fullscreen-case-view');
  if (!fullscreenView) return;

  fullscreenView.classList.remove('active');
  fullscreenView.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderAsymmetricGrid('all');

  const backBtn = document.getElementById('case-view-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', closeCaseStudyView);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudyView();
    }
  });

  const filterTabs = document.querySelectorAll('.behance-filter-bar .behance-tab');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        renderAsymmetricGrid(filter);
      });
    });
  }
});
