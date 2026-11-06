// ============================================================
// DATA (Single Source of Truth)
// ============================================================
const DATA = {
  images: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596357395217-80de13130e92?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1637430308606-86576d8fef3c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop'
  ],
  rooms: [
    { name: 'Reception', img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=600&auto=format&fit=crop', desc: 'Front desk and lounge area.' },
    { name: 'Gym Floor', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', desc: 'Fully equipped main training area.' },
    { name: 'Cardio Floor', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop', desc: 'Dedicated endurance zone.' },
    { name: 'Weights', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop', desc: 'Free weights and strength machines.' },
    { name: 'Trainer', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop', desc: 'One-on-one coaching space.' },
    { name: 'Yoga', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop', desc: 'Quiet room for mobility and focus.' }
  ]
};

// ============================================================
// INITIALIZATION & ROUTING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // 1. Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Rep Counter
  lenis.on('scroll', ({ scroll, limit }) => {
    const progress = Math.round((scroll / limit) * 100) || 0;
    document.getElementById('rep-num').textContent = String(progress).padStart(3, '0');
    document.getElementById('rep-line').style.transform = `scaleY(${progress / 100})`;
    document.getElementById('navbar').classList.toggle('scrolled', scroll > 50);
  });

  // 2. Preloader
  const preloaderText = document.getElementById('preloader-text');
  const text = "LOADING";
  preloaderText.innerHTML = text.split('').map(char => `<span>${char}</span>`).join('');

  const tl = gsap.timeline({
    onComplete: () => {
      document.getElementById('preloader').style.opacity = '0';
      handleRoute(); // Init first route
    }
  });

  tl.to('.preloader-text span', { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' })
    .to('#preloader', { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.5 });

  // 3. Router
  const pages = document.querySelectorAll('.page');
  const links = document.querySelectorAll('[data-link]');
  let currentRoute = '';

  function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const targetView = document.getElementById(`view-${hash}`) || document.getElementById('view-404');

    if (currentRoute === hash) return;

    // Update Nav
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${hash}`));

    // Fade out current
    if (currentRoute) {
      gsap.to(`#view-${currentRoute}`, {
        opacity: 0, duration: 0.3, onComplete: () => {
          document.getElementById(`view-${currentRoute}`).classList.remove('active');
          transitionIn(targetView, hash);
        }
      });
    } else {
      transitionIn(targetView, hash);
    }
  }

  function transitionIn(targetView, routeName) {
    targetView.classList.add('active');
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
    
    // Animate in
    gsap.fromTo(targetView, { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: () => {
      initPageAnimations(routeName);
      currentRoute = routeName;
    }});
  }

  window.addEventListener('hashchange', handleRoute);

  // Initialize page specific logic
  function initPageAnimations(route) {
    ScrollTrigger.getAll().forEach(t => t.kill()); // Cleanup

    // Global Text Reveals
    const splitTexts = document.querySelectorAll(`#view-${route} .split-text`);
    splitTexts.forEach(el => {
      const split = new SplitText(el, { type: 'lines,words,chars' });
      gsap.fromTo(split.chars, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.02, ease: 'power3.out', 
          scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });

    // Image Reveals
    const imgReveals = document.querySelectorAll(`#view-${route} .img-reveal`);
    imgReveals.forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%',
        onEnter: () => el.classList.add('active')
      });
    });

    // Page Specifics
    if (route === 'home') {
      initWheel();
      initBMI();
      initStats();
    }
    if (route === 'gallery') {
      initGallery();
      initFAQ();
    }
    if (route === 'contact') {
      initForm();
    }

    ScrollTrigger.refresh();
  }

  // ============================================================
  // COMPONENT: CANVAS (Energy Field)
  // ============================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const maxParticles = 80;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -1000; mouse.y = -1000; });

    class Particle {
      constructor() {
        this.x = Math.random() * width; this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) { this.x -= dx * 0.02; this.y -= dy * 0.02; }
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 37, 37, 0.4)'; ctx.fill();
      }
    }

    for (let i=0; i<maxParticles; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.update(); p.draw();
        for (let j=i+1; j<particles.length; j++) {
          const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(159, 216, 255, ${0.15 - dist/120 * 0.15})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ============================================================
  // COMPONENT: 3D WHEEL
  // ============================================================
  function initWheel() {
    const track = document.getElementById('wheel-track');
    if (!track) return;
    track.innerHTML = '';
    const radius = 350;
    const angleStep = 360 / DATA.rooms.length;
    let currentAngle = 0;
    
    // Create cards
    DATA.rooms.forEach((room, i) => {
      const card = document.createElement('div');
      card.className = 'wheel-card';
      card.innerHTML = `
        <img src="${room.img}" alt="${room.name}">
        <div class="wheel-card-info">
          <div class="wheel-card-title">${room.name}</div>
          <div class="wheel-card-desc">${room.desc}</div>
        </div>
      `;
      track.appendChild(card);
    });

    const cards = track.querySelectorAll('.wheel-card');

    function render() {
      cards.forEach((card, i) => {
        const angle = i * angleStep + currentAngle;
        const rad = angle * (Math.PI / 180);
        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius;
        
        const normalizedZ = (z + radius) / (radius * 2);
        const opacity = Math.max(0.1, Math.pow(normalizedZ, 2));
        const scale = 0.6 + (normalizedZ * 0.4);
        
        gsap.set(card, { x, z, rotationY: -angle, opacity, scale, zIndex: Math.round(z) });
        card.classList.toggle('active', Math.abs(angle % 360) < 10 || Math.abs(angle % 360) > 350);
      });
    }
    render();

    document.getElementById('wheel-next')?.addEventListener('click', () => {
      currentAngle -= angleStep;
      gsap.to({}, { duration: 0.8, onUpdate: render }); // fake easing
      // Real logic with proxy
      let proxy = { angle: currentAngle + angleStep };
      gsap.to(proxy, { angle: currentAngle, duration: 0.8, ease: 'power3.out', onUpdate: () => {
        currentAngle = proxy.angle; render();
      }});
    });

    document.getElementById('wheel-prev')?.addEventListener('click', () => {
      let proxy = { angle: currentAngle - angleStep };
      gsap.to(proxy, { angle: currentAngle, duration: 0.8, ease: 'power3.out', onUpdate: () => {
        currentAngle = proxy.angle; render();
      }});
    });
  }

  // ============================================================
  // COMPONENT: BMI CALCULATOR
  // ============================================================
  function initBMI() {
    const hInput = document.getElementById('height');
    const wInput = document.getElementById('weight');
    const btn = document.getElementById('calc-bmi');
    const valEl = document.getElementById('bmi-value');
    const catEl = document.getElementById('bmi-category');
    const gauge = document.getElementById('bmi-gauge');

    btn?.addEventListener('click', () => {
      const h = parseFloat(hInput.value) / 100;
      const w = parseFloat(wInput.value);
      if (!h || !w || h <= 0 || w <= 0) {
        catEl.textContent = 'Invalid Input';
        valEl.textContent = '--';
        return;
      }
      const bmi = (w / (h * h)).toFixed(1);
      valEl.textContent = bmi;
      
      let cat = '';
      let pct = 0;
      if (bmi < 18.5) { cat = 'Underweight'; pct = 25; }
      else if (bmi < 25) { cat = 'Healthy'; pct = 50; }
      else if (bmi < 30) { cat = 'Overweight'; pct = 75; }
      else { cat = 'Obese'; pct = 100; }
      
      catEl.textContent = cat;
      gauge.style.setProperty('--gauge', `${pct}%`);
      
      gsap.fromTo(valEl, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' });
    });
  }

  // ============================================================
  // COMPONENT: STATS COUNT UP
  // ============================================================
  function initStats() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = +el.getAttribute('data-count');
      ScrollTrigger.create({
        trigger: el, start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(el, { textContent: 0 }, {
            textContent: target, duration: 2, ease: 'power1.out',
            snap: { textContent: 1 },
            onUpdate: function() { el.textContent = Math.round(this.targets()[0].textContent) + (target === 7 || target === 4 || target === 8 || target === 1 ? '+' : ''); }
          });
        }
      });
    });
  }

  // ============================================================
  // COMPONENT: GALLERY & LIGHTBOX
  // ============================================================
  function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid || grid.innerHTML !== '') return;

    DATA.images.forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${src}" alt="Gallery ${i+1}" loading="lazy">
        <div class="gallery-overlay">View</div>
      `;
      item.addEventListener('click', () => openLightbox(i));
      grid.appendChild(item);
    });

    // Lightbox Logic
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbCounter = document.getElementById('lb-counter');
    let currentIndex = 0;

    function update() {
      lbImg.src = DATA.images[currentIndex];
      lbCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(DATA.images.length).padStart(2, '0')}`;
    }

    window.openLightbox = function(index) {
      currentIndex = index;
      update();
      lb.classList.add('open');
      lenis.stop();
      gsap.to(lb, { opacity: 1, duration: 0.3 });
    };

    window.closeLightbox = function() {
      gsap.to(lb, { opacity: 0, duration: 0.3, onComplete: () => {
        lb.classList.remove('open');
        lenis.start();
      }});
    };

    document.getElementById('lb-close').onclick = closeLightbox;
    document.getElementById('lb-prev').onclick = () => {
      currentIndex = (currentIndex - 1 + DATA.images.length) % DATA.images.length;
      update();
    };
    document.getElementById('lb-next').onclick = () => {
      currentIndex = (currentIndex + 1) % DATA.images.length;
      update();
    };

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') document.getElementById('lb-prev').click();
      if (e.key === 'ArrowRight') document.getElementById('lb-next').click();
    });
  }

  // ============================================================
  // COMPONENT: FAQ
  // ============================================================
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      const icon = item.querySelector('i');
      
      if (q.dataset.init) return;
      q.dataset.init = 'true';

      q.onclick = () => {
        const isOpen = item.classList.contains('open');
        
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            gsap.to(other.querySelector('.faq-a'), { height: 0, duration: 0.4 });
            gsap.to(other.querySelector('i'), { rotation: 0, duration: 0.4 });
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          gsap.to(a, { height: 0, duration: 0.4 });
          gsap.to(icon, { rotation: 0, duration: 0.4 });
        } else {
          item.classList.add('open');
          gsap.to(a, { height: 'auto', duration: 0.4 });
          gsap.to(icon, { rotation: 45, duration: 0.4 });
        }
      };
    });
  }

  // ============================================================
  // COMPONENT: CONTACT FORM
  // ============================================================
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form || form.dataset.init) return;
    form.dataset.init = 'true';

    form.onsubmit = (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const status = document.getElementById('form-status');
      
      btn.innerHTML = 'Sending... <i class="ri-loader-4-line"></i>';
      
      setTimeout(() => {
        btn.innerHTML = 'Send Message';
        form.reset();
        status.className = 'form-status success';
        status.textContent = 'Demo mode — message logged to console.';
        console.log('Form payload:', {
          name: document.getElementById('name').value,
          phone: document.getElementById('phone').value,
          email: document.getElementById('email').value,
          message: document.getElementById('message').value
        });
        
        setTimeout(() => { status.className = 'form-status'; }, 4000);
      }, 1500);
    };
  }

  // ============================================================
  // MOBILE MENU & FOOTER PARALLAX
  // ============================================================
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  let menuOpen = false;

  toggle.onclick = () => {
    menuOpen = !menuOpen;
    drawer.classList.toggle('open', menuOpen);
    toggle.innerHTML = menuOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-3-line"></i>';
    if (menuOpen) {
      lenis.stop();
      gsap.fromTo('.mobile-drawer a', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 });
    } else {
      lenis.start();
    }
  };

  // Close mobile drawer on link click
  document.querySelectorAll('.mobile-drawer a').forEach(a => {
    a.onclick = () => {
      menuOpen = false;
      drawer.classList.remove('open');
      toggle.innerHTML = '<i class="ri-menu-3-line"></i>';
      lenis.start();
    };
  });

  // Footer Watermark Parallax
  gsap.to('#footer-watermark', {
    xPercent: -30,
    scrollTrigger: {
      trigger: '.footer',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

});