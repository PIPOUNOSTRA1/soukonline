/**
 * سوقك أونلاين - إعدادات التسويق والاتصال والمؤثرات البصرية
 */
const CONFIG = {
  // رقم الواتساب الخاص بك (مفتاح الدولة الجزائر +213 متبوعاً بالرقم دون الصفر الأول)
  // مثال: 213550000000
  whatsappNumber: '213550000000',
  
  // الرسالة التلقائية عند طلب الاستشارة المجانية
  consultationMessage: 'مرحباً سوقك أونلاين، أود الحصول على استشارة مجانية بخصوص تصميم متجر إلكتروني لمحلي.',
  
  // الرسالة التلقائية عند التواصل العام عبر واتساب
  generalContactMessage: 'مرحباً سوقك أونلاين، أود الاستفسار عن خدمات تصميم المتاجر الإلكترونية.',
  
  // معرف فيسبوك بيكسل (Meta Pixel ID)
  // اتركه فارغاً '' إذا لم تكن تستخدمه بعد، أو استبدله بمعرف البيكسل الخاص بك
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
    console.log(`[Meta Pixel] Event tracked: ${eventName}`, eventData);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. ربط وتفعيل روابط الواتساب ديناميكياً
  const whatsappNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  
  // زر الواتساب في قسم الاتصال (الفئة .whatsapp-btn)
  const whatsappBtns = document.querySelectorAll('.whatsapp-btn');
  whatsappBtns.forEach(btn => {
    const encodedMsg = encodeURIComponent(CONFIG.generalContactMessage);
    btn.href = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    
    // تتبع النقرة كحدث اتصال
    btn.addEventListener('click', () => {
      trackMarketingEvent('Contact', { method: 'WhatsApp' });
    });
  });

  // أزرار طلب الاستشارة المجانية (أزرار .btn-primary التي كانت تشير إلى "#" أو ليس لها رابط محدد)
  // زر الاستشارة في قسم الاتصال
  const ctaBtnFinal = document.querySelector('#contact .btn-primary');
  if (ctaBtnFinal) {
    const encodedMsg = encodeURIComponent(CONFIG.consultationMessage);
    ctaBtnFinal.href = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    
    ctaBtnFinal.addEventListener('click', () => {
      trackMarketingEvent('Lead', { content_name: 'Free Consultation' });
    });
  }

  // 2. تفعيل تأثيرات الظهور التدريجي (Reveal On Scroll)
  const els = document.querySelectorAll('.reveal, .step');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));

  // 3. شريط تقدم القراءة (Scroll Progress Bar)
  const bar = document.getElementById('progressBar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    });
  }

  // 4. عداد الإحصائيات المتحرك (Animated Numbers)
  const counters = document.querySelectorAll('.count');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
});
