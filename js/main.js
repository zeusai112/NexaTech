/**
 * NEXATECH - Interactive Motion & Application Engine
 * Features:
 * - Cityscape-Harmonized Atmosphere Canvas (twinkling stars, flashing pulses, city light bokeh, shooting stars)
 * - Scroll-triggered zoom-in/out and reveals (IntersectionObserver)
 * - Parallax background depth zoom
 * - 3D card tilt micro-interactions
 * - Interactive Upwork Screenshot Lightbox with zoom, pan, and keyboard navigation
 * - Searchable FAQ Accordion
 * - Contact email handler with clipboard copy & celebratory toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initAtmosphereCanvas();
  initScrollEffects();
  initTiltCards();
  initFaqAccordion();
  initLightbox();
  initContactForm();
  initMobileNav();
});

/* ==========================================================================
   1. Cityscape-Harmonized Atmosphere Canvas Engine
   ========================================================================== */
function initAtmosphereCanvas() {
  const canvas = document.getElementById('atmosphereCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2, active: false };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStarfield();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  document.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Star and Particle Collections
  let stars = [];
  let cityGlowOrbs = [];
  let shootingStars = [];

  // Color Palettes matching warm Singapore city lights
  const warmColors = [
    'rgba(251, 191, 36, ',  // Warm Gold
    'rgba(245, 158, 11, ',  // Amber
    'rgba(251, 113, 133, ', // Soft Rose
    'rgba(226, 125, 96, ',  // Terracotta
    'rgba(255, 248, 238, '  // Ivory Pearl
  ];

  function createStarfield() {
    stars = [];
    cityGlowOrbs = [];

    // Horizon & Upper Sky Stars (Twinkling & Flashing)
    const starCount = Math.floor((width * height) / 9000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.75), // Concentrate in upper sky and mid-level
        baseRadius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.035 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        colorPrefix: warmColors[Math.floor(Math.random() * warmColors.length)],
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1
      });
    }

    // Drifting Warm City Light Bokeh Orbs (Rising from skyline)
    const orbCount = Math.floor(width / 55);
    for (let j = 0; j < orbCount; j++) {
      cityGlowOrbs.push({
        x: Math.random() * width,
        y: height * 0.4 + Math.random() * (height * 0.6),
        radius: Math.random() * 3.5 + 1.5,
        baseAlpha: Math.random() * 0.35 + 0.1,
        vy: -(Math.random() * 0.45 + 0.2), // Gently rise upwards like heat/light
        vx: (Math.random() - 0.5) * 0.3,
        colorPrefix: warmColors[Math.floor(Math.random() * warmColors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  createStarfield();

  // Periodic Shooting Star Generator
  function triggerShootingStar() {
    if (shootingStars.length < 2 && Math.random() < 0.4) {
      const startX = Math.random() * (width * 0.8);
      const startY = Math.random() * (height * 0.35);
      const length = Math.random() * 90 + 70;
      const angle = (Math.PI / 6) + (Math.random() * Math.PI / 12); // Slanted downward trajectory
      const speed = Math.random() * 9 + 8;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: length,
        life: 1,
        decay: Math.random() * 0.02 + 0.018,
        color: warmColors[Math.floor(Math.random() * 2)] // Warm gold or amber
      });
    }
    setTimeout(triggerShootingStar, Math.random() * 5000 + 4000);
  }
  setTimeout(triggerShootingStar, 2500);

  // Animation Loop
  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(renderAtmosphere);
  });

  function renderAtmosphere() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Render & Update Twinkling Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Subtle slow drift
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height * 0.75;
      if (s.y > height * 0.75) s.y = 0;

      // Twinkle calculation
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.1, s.alpha + Math.sin(s.twinklePhase) * 0.45);
      const currentRadius = Math.max(0.4, s.baseRadius + Math.sin(s.twinklePhase) * 0.35);

      // Subtle mouse interaction
      let posX = s.x;
      let posY = s.y;
      if (mouse.active) {
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          posX -= (dx / dist) * force * 15;
          posY -= (dy / dist) * force * 15;
        }
      }

      ctx.beginPath();
      ctx.arc(posX, posY, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = s.colorPrefix + currentAlpha + ')';
      ctx.shadowBlur = currentRadius * 4;
      ctx.shadowColor = s.colorPrefix + '0.8)';
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Render & Update Drifting City Glow Bokeh Orbs
    for (let j = 0; j < cityGlowOrbs.length; j++) {
      const orb = cityGlowOrbs[j];
      orb.y += orb.vy;
      orb.x += orb.vx + Math.sin(orb.pulsePhase) * 0.2;
      orb.pulsePhase += orb.pulseSpeed;

      // Respawn at bottom if floated off screen
      if (orb.y < -20) {
        orb.y = height + 10;
        orb.x = Math.random() * width;
      }

      const orbAlpha = Math.max(0.05, orb.baseAlpha + Math.sin(orb.pulsePhase) * 0.15);

      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius * 2);
      gradient.addColorStop(0, orb.colorPrefix + orbAlpha + ')');
      gradient.addColorStop(1, orb.colorPrefix + '0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Render & Update Shooting Stars
    for (let k = shootingStars.length - 1; k >= 0; k--) {
      const ss = shootingStars[k];
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life -= ss.decay;

      if (ss.life <= 0 || ss.x > width + 100 || ss.y > height + 100) {
        shootingStars.splice(k, 1);
        continue;
      }

      const tailX = ss.x - ss.dx * (ss.length / 15);
      const tailY = ss.y - ss.dy * (ss.length / 15);

      const grad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      grad.addColorStop(0, ss.color + ss.life + ')');
      grad.addColorStop(1, ss.color + '0)');

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Sparkle head
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    requestAnimationFrame(renderAtmosphere);
  }

  requestAnimationFrame(renderAtmosphere);
}

/* ==========================================================================
   2. Scroll Effects: Parallax Zoom & Scroll-Triggered Reveals
   ========================================================================== */
function initScrollEffects() {
  const cityBgImage = document.getElementById('cityBgImage');
  const progressBar = document.getElementById('scrollProgressBar');
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-drawer .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Progress and Background Parallax Zoom
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

    // Update Progress Bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercent * 100}%`;
    }

    // Header Blur Scrolled State
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Cityscape Parallax & Zoom Depth
    if (cityBgImage) {
      // Scale from 1.0 up to 1.12 gently across page scroll
      const scaleVal = 1.0 + scrollPercent * 0.12;
      // Parallax vertical translation
      const translateY = scrollTop * 0.14;
      cityBgImage.style.transform = `scale(${scaleVal}) translateY(${translateY}px)`;
    }

    // Scroll-Spy for Navigation
    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, { passive: true });

  // Scroll-Triggered Zoom-in & Reveals using IntersectionObserver
  const zoomElements = document.querySelectorAll('.zoom-on-scroll');
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // If element is a stat card with counter, animate number
        const statCounter = entry.target.querySelector('.stat-number[data-target]');
        if (statCounter && !statCounter.dataset.counted) {
          animateCounter(statCounter);
        }
      }
    });
  }, observerOptions);

  zoomElements.forEach((el) => revealObserver.observe(el));
}

// Animate Stat Numbers
function animateCounter(el) {
  el.dataset.counted = 'true';
  const target = parseInt(el.dataset.target, 10);
  let count = 0;
  const duration = 1500;
  const stepTime = 30;
  const totalSteps = duration / stepTime;
  const increment = target / totalSteps;

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      el.textContent = `${target}+`;
      clearInterval(timer);
    } else {
      el.textContent = `${Math.floor(count)}+`;
    }
  }, stepTime);
}

/* ==========================================================================
   3. Interactive 3D Card Tilt Micro-Interactions
   ========================================================================== */
function initTiltCards() {
  // Disable 3D tilt on touch devices or reduced motion
  if (window.matchMedia('(hover: none) or (prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   4. Searchable FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearchInput');

  // Accordion Toggle
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for a clean single-open accordion experience
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

  // Open first FAQ by default for immediate preview
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstBtn = firstItem.querySelector('.faq-question');
    const firstAns = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    firstBtn.setAttribute('aria-expanded', 'true');
    firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
  }

  // Real-time FAQ Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer');
        const questionBtn = item.querySelector('.faq-question');

        if (query === '' || text.includes(query)) {
          item.style.display = 'block';
          if (query !== '') {
            // Automatically expand matching items
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        }
      });
    });
  }
}

/* ==========================================================================
   5. Interactive Lightbox Modal with Zoom & Pan for Upwork Screenshots
   ========================================================================== */
function initLightbox() {
  const screenshots = [
    {
      src: 'profile1.png',
      title: 'Upwork Profile & Track Record #1',
      badge: '★ Top Rated • 100% Job Success'
    },
    {
      src: 'profile2.png',
      title: 'Upwork Profile & Track Record #2',
      badge: '💰 High Earnings • Verified Feedback'
    },
    {
      src: 'profile3.png',
      title: 'Upwork Profile & Track Record #3',
      badge: '⭐ 5.0 Star Ratings • Long-Term Contracts'
    },
    {
      src: 'profile4.png',
      title: 'Upwork Profile & Track Record #4',
      badge: '⚙️ Specialized Skills • Continuous Delivery'
    }
  ];

  let currentIndex = 0;
  let zoomLevel = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const currentImg = document.getElementById('lightboxCurrentImg');
  const imgWrapper = document.getElementById('lightboxImgWrapper');
  const counterEl = document.getElementById('lightboxCounter');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const zoomInBtn = document.getElementById('lightboxZoomInBtn');
  const zoomOutBtn = document.getElementById('lightboxZoomOutBtn');
  const zoomResetBtn = document.getElementById('lightboxZoomResetBtn');

  const triggerCards = document.querySelectorAll('.screenshot-card');

  function openLightbox(index) {
    currentIndex = index;
    resetZoom();
    updateLightboxContent();
    modal.hidden = false;
    modal.style.display = 'flex';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  }

  function closeLightbox() {
    modal.hidden = true;
    modal.style.display = 'none';
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = screenshots[currentIndex];
    currentImg.src = item.src;
    currentImg.alt = item.title;
    counterEl.textContent = `${currentIndex + 1} / ${screenshots.length}`;
    captionEl.textContent = `${item.title} (${item.badge})`;
  }

  function applyTransform() {
    currentImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
    zoomResetBtn.textContent = `${Math.round(zoomLevel * 100)}%`;
  }

  function zoomIn() {
    if (zoomLevel < 3.0) {
      zoomLevel = Math.min(3.0, zoomLevel + 0.25);
      applyTransform();
    }
  }

  function zoomOut() {
    if (zoomLevel > 0.75) {
      zoomLevel = Math.max(0.75, zoomLevel - 0.25);
      if (zoomLevel === 1.0) {
        panX = 0;
        panY = 0;
      }
      applyTransform();
    }
  }

  function resetZoom() {
    zoomLevel = 1.0;
    panX = 0;
    panY = 0;
    applyTransform();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % screenshots.length;
    resetZoom();
    updateLightboxContent();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
    resetZoom();
    updateLightboxContent();
  }

  // Trigger Lightbox from Screenshot Cards
  triggerCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index));
  });

  // Modal Controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);

  // Mouse Wheel Zoom
  if (imgWrapper) {
    imgWrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }, { passive: false });

    // Drag to Pan
    imgWrapper.addEventListener('mousedown', (e) => {
      if (zoomLevel > 1.0) {
        isDragging = true;
        dragStartX = e.clientX - panX;
        dragStartY = e.clientY - panY;
        imgWrapper.classList.add('is-dragging');
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        applyTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        imgWrapper.classList.remove('is-dragging');
      }
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (modal.hidden || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-' || e.key === '_') zoomOut();
    if (e.key === '0') resetZoom();
  });
}

/* ==========================================================================
   6. Contact Form & Clipboard Copy Actions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const locationInput = document.getElementById('userLocation');
  const subjectInput = document.getElementById('userSubject');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Email Regex Validator
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // Reset errors
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const locationVal = locationInput.value.trim();
      const subjectVal = subjectInput.value;
      const messageVal = messageInput.value.trim();

      // Validation
      if (!nameVal) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        hasError = true;
      }

      if (!emailVal || !isValidEmail(emailVal)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      }

      if (!messageVal) {
        if (messageError) messageError.textContent = 'Please enter your message or inquiry.';
        hasError = true;
      }

      if (hasError) return;

      // Construct formatted email body
      const emailRecipient = 'contact@nexatech.partners';
      const emailSubject = encodeURIComponent(`[NEXATECH Inquiry] ${subjectVal} from ${nameVal}`);
      const emailBody = encodeURIComponent(
        `Dear NEXATECH Team,\n\n` +
        `Name: ${nameVal}\n` +
        `Email: ${emailVal}\n` +
        `Location: ${locationVal || 'Not specified'}\n` +
        `Topic: ${subjectVal}\n\n` +
        `Message:\n${messageVal}\n\n` +
        `-----------------------------------------\n` +
        `Sent via NEXATECH Partnership Landing Page`
      );

      // Trigger mailto client
      const mailtoUrl = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
      window.location.href = mailtoUrl;

      showToast('Opening your email client... Thank you for reaching out!');

      form.reset();
    });
  }

  // Copy Email Buttons
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${textToCopy} to clipboard!`);
        });
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${textToCopy} to clipboard!`);
      }
    });
  });
}

/* ==========================================================================
   7. Toast Notification Handler
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  clearTimeout(toastTimeout);
  toastMsg.textContent = message;
  toast.hidden = false;
  toast.style.display = 'flex';
  toast.classList.add('is-visible');

  toastTimeout = setTimeout(() => {
    toast.hidden = true;
    toast.style.display = 'none';
    toast.classList.remove('is-visible');
  }, 4000);
}

/* ==========================================================================
   8. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when clicking a link
  links.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}
