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

  // 1. PRELOADER PERCENTAGE COUNTER
  const preloader = document.getElementById('preloader');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  
  if (preloader && progressPercent && progressBar) {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 2;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('loaded');
          // Trigger animations in viewport
          setTimeout(initScrollAnimations, 400);
        }, 300);
      }
      progressPercent.textContent = count;
      progressBar.style.width = count + '%';
    }, 45);
  } else {
    // If elements not found, trigger scroll animations directly
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

  counters.forEach(c => countersObserver.observe(c));
});
