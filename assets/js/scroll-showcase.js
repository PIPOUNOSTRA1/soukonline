/**
 * ScrollShowcase - Reusable Pure Vanilla JS Full-Length Landing Page Showcase Engine
 * Features: macOS Realistic Frame, Drag & Grab with Inertia, Touch Gestures, Custom Scrollbar Indicator, Auto-scroll Invitation
 */

class ScrollShowcase {
  constructor(options = {}) {
    this.targetElement = typeof options.targetElement === 'string' 
      ? document.querySelector(options.targetElement) 
      : options.targetElement;
    
    this.imageUrl = options.imageUrl || '';
    this.projectName = options.projectName || 'المتجر الحي';
    this.projectSlug = options.projectSlug || 'storefront';
    this.altText = options.altText || `عرض كامل لصفحة هبوط ${this.projectName} من الهيدر حتى الفوتر`;

    // State Physics Engine
    this.currentY = 0;
    this.targetY = 0;
    this.velocityY = 0;
    this.lastMouseY = 0;
    this.lastTime = 0;
    
    this.isDragging = false;
    this.isHovered = false;
    this.isAutoScrolling = false;
    this.hasInteracted = false;
    
    this.minY = 0; // Max negative scroll height (calculated after image load)
    this.maxY = 0;
    this.animId = null;

    // Check prefers reduced motion
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.targetElement) {
      this.init();
    }
  }

  init() {
    this.buildDOM();
    this.bindElements();
    this.attachEvents();
    this.setupObserver();
    this.startLoop();
  }

  buildDOM() {
    const html = `
      <div class="scroll-showcase-wrapper">
        <div class="showcase-browser-frame" tabindex="0" aria-label="${this.altText}">
          <!-- macOS Chrome Top Bar -->
          <div class="showcase-chrome-bar">
            <div class="showcase-window-controls">
              <span class="showcase-dot red"></span>
              <span class="showcase-dot yellow"></span>
              <span class="showcase-dot green"></span>
            </div>
            <div class="showcase-address-bar">
              <span class="lock-icon">🔒</span>
              <span class="domain">soqok-online.com/</span><span class="path">${this.projectSlug}</span>
            </div>
          </div>

          <!-- Canvas Container -->
          <div class="showcase-viewport-canvas">
            <img src="${this.imageUrl}" alt="${this.altText}" class="showcase-scroll-image is-loading" loading="lazy">
            
            <!-- Custom Progress Indicator Track -->
            <div class="showcase-progress-track">
              <div class="showcase-progress-thumb"></div>
            </div>

            <!-- Floating Interaction Hint Badge -->
            <div class="showcase-hint-badge">
              <span>اسحب للاستكشاف</span>
              <span>👆</span>
            </div>

            <!-- Auto Scroll Control Toggle -->
            <button class="showcase-autoscroll-toggle" aria-label="تشغيل/إيقاف التمرير التلقائي">
              <span class="toggle-icon">▶</span>
              <span class="toggle-text">تمرير تلقائي</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.targetElement.innerHTML = html;
  }

  bindElements() {
    this.wrapper = this.targetElement.querySelector('.scroll-showcase-wrapper');
    this.frame = this.targetElement.querySelector('.showcase-browser-frame');
    this.canvas = this.targetElement.querySelector('.showcase-viewport-canvas');
    this.image = this.targetElement.querySelector('.showcase-scroll-image');
    this.progressThumb = this.targetElement.querySelector('.showcase-progress-thumb');
    this.hintBadge = this.targetElement.querySelector('.showcase-hint-badge');
    this.autoScrollBtn = this.targetElement.querySelector('.showcase-autoscroll-toggle');

    // On Image Load, calculate scroll boundary
    this.image.addEventListener('load', () => {
      this.image.classList.remove('is-loading');
      this.recalculateBoundaries();
    });

    if (this.image.complete) {
      this.image.classList.remove('is-loading');
      this.recalculateBoundaries();
    }
  }

  recalculateBoundaries() {
    const canvasHeight = this.canvas.clientHeight;
    const imageHeight = this.image.naturalHeight ? 
      (this.image.clientWidth / this.image.naturalWidth) * this.image.naturalHeight : 
      this.image.clientHeight;

    this.minY = Math.min(0, canvasHeight - imageHeight);
    this.maxY = 0;
  }

  attachEvents() {
    // Resize Listener
    window.addEventListener('resize', () => this.recalculateBoundaries());

    // Mouse Events (Desktop Grab & Inertia)
    this.canvas.addEventListener('mousedown', (e) => this.onDragStart(e.clientY));
    window.addEventListener('mousemove', (e) => this.onDragMove(e.clientY));
    window.addEventListener('mouseup', () => this.onDragEnd());

    // Touch Events (Mobile Gestures)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onDragStart(e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.onDragMove(e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => this.onDragEnd());

    // Hover Events for Auto-Scroll Invitation
    this.canvas.addEventListener('mouseenter', () => {
      this.isHovered = true;
      if (!this.hasInteracted && !this.prefersReducedMotion) {
        this.isAutoScrolling = true;
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.isAutoScrolling = false;
    });

    // Keyboard Arrow Navigation
    this.frame.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.dismissHint();
        this.targetY = Math.max(this.minY, this.targetY - 120);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.dismissHint();
        this.targetY = Math.min(this.maxY, this.targetY + 120);
      }
    });

    // Auto-Scroll Button Toggle
    if (this.autoScrollBtn) {
      this.autoScrollBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismissHint();
        this.isAutoScrolling = !this.isAutoScrolling;
        const icon = this.autoScrollBtn.querySelector('.toggle-icon');
        icon.textContent = this.isAutoScrolling ? '❚❚' : '▶';
      });
    }
  }

  setupObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Hide hint badge automatically after 3 seconds
          setTimeout(() => {
            this.dismissHint();
          }, 3500);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.wrapper);
  }

  dismissHint() {
    if (this.hintBadge && !this.hintBadge.classList.contains('fade-out')) {
      this.hintBadge.classList.add('fade-out');
      this.hasInteracted = true;
    }
  }

  onDragStart(clientY) {
    this.dismissHint();
    this.isDragging = true;
    this.isAutoScrolling = false;
    this.lastMouseY = clientY;
    this.lastTime = performance.now();
    this.velocityY = 0;
    this.canvas.classList.add('is-dragging');
  }

  onDragMove(clientY) {
    if (!this.isDragging) return;

    const now = performance.now();
    const deltaY = clientY - this.lastMouseY;
    const deltaTime = Math.max(1, now - this.lastTime);

    this.targetY += deltaY;
    this.velocityY = deltaY / deltaTime; // Calculate velocity for inertia

    this.lastMouseY = clientY;
    this.lastTime = now;
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.canvas.classList.remove('is-dragging');
  }

  startLoop() {
    const updatePhysics = () => {
      if (this.isDragging) {
        // Direct tracking during drag
        this.currentY += (this.targetY - this.currentY) * 0.4;
      } else {
        if (this.isAutoScrolling && !this.prefersReducedMotion) {
          // Slow continuous auto-scroll invitation
          this.targetY -= 0.8;
          if (this.targetY <= this.minY) {
            this.targetY = 0; // Loop back
          }
        } else {
          // Inertia decay momentum when released
          this.targetY += this.velocityY * 12;
          this.velocityY *= 0.90; // Dampen friction
        }

        // Clamp boundaries
        if (this.targetY > this.maxY) {
          this.targetY += (this.maxY - this.targetY) * 0.2;
        } else if (this.targetY < this.minY) {
          this.targetY += (this.minY - this.targetY) * 0.2;
        }

        this.currentY += (this.targetY - this.currentY) * 0.15;
      }

      // Apply transform to image
      if (this.image) {
        this.image.style.transform = `translate3d(0, ${this.currentY.toFixed(2)}px, 0)`;
      }

      // Update progress thumb position
      if (this.progressThumb && this.minY !== 0) {
        const progressRatio = Math.min(1, Math.max(0, this.currentY / this.minY));
        const trackHeight = this.canvas.clientHeight - 60;
        const thumbY = progressRatio * trackHeight;
        this.progressThumb.style.transform = `translate3d(0, ${thumbY.toFixed(2)}px, 0)`;
      }

      this.animId = requestAnimationFrame(updatePhysics);
    };

    this.animId = requestAnimationFrame(updatePhysics);
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}

// Global helper function for single line initialization
function initScrollShowcase(selector, config = {}) {
  return new ScrollShowcase({
    targetElement: selector,
    ...config
  });
}
