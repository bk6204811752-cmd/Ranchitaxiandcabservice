/* =========================================================
   main.js - Ranchi Taxi And Cab Service
   ========================================================= */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ── Navbar Scroll Behaviour ─────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Nav ──────────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');

  if (hamburger && mobileNav) {
    const closeMobileNav = () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ── Hero Banner Slideshow ───────────────────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideshowTimer = null;

  function goToSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i)  => d.classList.toggle('active',  i === index));
    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  if (slides.length > 0) {
    goToSlide(0);

    const startSlideshow = () => {
      if (slideshowTimer) clearInterval(slideshowTimer);
      slideshowTimer = setInterval(nextSlide, 2700);
    };

    startSlideshow();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (slideshowTimer) clearInterval(slideshowTimer);
        slideshowTimer = null;
      } else if (!slideshowTimer) {
        startSlideshow();
      }
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideshowTimer);
        goToSlide(i);
        startSlideshow();
      });
    });
  }

  /* ── Booking Tabs ────────────────────────────────────── */
  const tabs = document.querySelectorAll('.booking-tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const card = tab.closest('.booking-card');
        const cardTabs = card ? card.querySelectorAll('.booking-tab') : [tab];
        cardTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const tripInput = card ? card.querySelector('[name="trip"]') : document.getElementById('trip-type');
        if (tripInput && tab.dataset.trip) tripInput.value = tab.dataset.trip;
        const target = tab.dataset.tab;
        if (card) {
          card.querySelectorAll('.booking-tab-content').forEach(c => {
            c.style.display = c.dataset.content === target ? 'block' : 'none';
          });
        }
      });
    });
  }

  /* ── FAQ Accordion ───────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => {
          i.classList.remove('open');
          const q = i.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); }
      });
    }
  });

  /* ── Scroll Animations (IntersectionObserver) ────────── */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animatedEls.forEach(el => observer.observe(el));
  } else {
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Counter Animation ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = String(el.dataset.count || '0');
          const target = parseFloat(raw);
          const decimals = (raw.split('.')[1] || '').length;
          const suffix = el.dataset.suffix || '';
          const increment = Math.max(target / 60, 1 / Math.pow(10, decimals));
          let current = 0;
          const fmt = n => n.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            el.textContent = fmt(current) + suffix;
            if (current >= target) clearInterval(timer);
          }, 20);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ── Floating Particles (hero only) ─────────────────── */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.cssText = `left:${Math.random()*100}%;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*5}s;opacity:${Math.random()*0.4+0.2};`;
      particleContainer.appendChild(p);
    }
  }

  /* ── Contact Form ────────────────────────────────────── */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = contactForm.elements;
      const msg = encodeURIComponent(
        `Hello! New website enquiry.\n\nName: ${(fields.name?.value || '').trim()}\nPhone: ${(fields.phone?.value || '').trim()}\nEmail: ${(fields.email?.value || '').trim()}\nService: ${fields.service?.value || ''}\nDetails: ${(fields.message?.value || '').trim()}\n\nPlease contact me back.`
      );
      const btn = contactForm.querySelector('[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '&#9993; Opening WhatsApp...';
      window.open(`https://wa.me/919006123451?text=${msg}`, '_blank');
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
        contactForm.reset();
      }, 2000);
    });
  }

  /* ── Booking Form WhatsApp redirect ──────────────────── */
  document.querySelectorAll('#booking-form, .booking-form').forEach(bookingForm => {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const trip = bookingForm.querySelector('[name="trip"]')?.value || '';
      const from = bookingForm.querySelector('[name="from"]')?.value || '';
      const to   = bookingForm.querySelector('[name="to"]')?.value   || '';
      const date = bookingForm.querySelector('[name="date"]')?.value  || '';
      const cab  = bookingForm.querySelector('[name="cab"]')?.value   || '';
      const msg  = encodeURIComponent(
        `Hello! I want to book a cab.\n\nTrip Type: ${trip}\nFrom: ${from}\nTo: ${to}\nDate: ${date}\nCab Type: ${cab}\n\nPlease confirm availability and price.`
      );
      window.open(`https://wa.me/919006123451?text=${msg}`, '_blank');
    });
  });

  /* ── Scroll-to-Top Button ────────────────────────────── */
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active nav link ─────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .footer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });

  /* ── Smooth anchor scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Live Booking Toast Notifications (Social Proof) ── */
  const bookingNotifications = [
    { name: 'Rahul Sharma', location: 'Harmu, Ranchi', route: 'Birsa Munda Airport (IXR)', cab: 'Swift Dzire', time: '2 mins ago' },
    { name: 'Priya Singh', location: 'Lalpur, Ranchi', route: 'Ranchi to Deoghar', cab: 'Dzire Sedan', time: '5 mins ago' },
    { name: 'Vikash Mahato', location: 'Hinoo, Ranchi', route: 'Ranchi to Jamshedpur', cab: 'Toyota Innova Crysta', time: '7 mins ago' },
    { name: 'Amit Kumar', location: 'Main Road, Ranchi', route: 'Ranchi Sightseeing Tour', cab: 'Maruti Ertiga', time: 'Just now' },
    { name: 'Suresh Rai', location: 'Kanke Road, Ranchi', route: 'Ranchi to Bokaro', cab: 'Swift Dzire', time: '3 mins ago' },
    { name: 'Rohan Tiwari', location: 'Morabadi, Ranchi', route: 'Ranchi to Netarhat (2-Day)', cab: 'Tempo Traveller', time: '11 mins ago' },
    { name: 'Sneha Verma', location: 'Ranchi Airport', route: 'Airport to City Drop', cab: 'Swift Dzire', time: '4 mins ago' },
    { name: 'Deepak Choudhary', location: 'Dharampur, Ranchi', route: 'Ranchi to Patna', cab: 'Innova Crysta', time: '15 mins ago' },
    { name: 'Anjali Gupta', location: 'Doranda, Ranchi', route: 'Ranchi to Hazaribagh', cab: 'Dzire Sedan', time: '8 mins ago' },
    { name: 'Rajesh Mishra', location: 'Bariatu, Ranchi', route: 'Ranchi to Dhanbad', cab: 'Maruti Ertiga', time: '6 mins ago' }
  ];

  function createLiveBookingToast() {
    if (document.querySelector('.live-booking-toast')) return;
    const toast = document.createElement('div');
    toast.className = 'live-booking-toast';
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('role', 'status');

    toast.innerHTML = `
      <button class="toast-close" aria-label="Close notification">&times;</button>
      <div class="toast-avatar">🚖</div>
      <div class="toast-content">
        <div class="toast-title"><span class="toast-name"></span> <span class="toast-badge">Verified Booking</span></div>
        <div class="toast-route">Booked <strong class="toast-cab"></strong> &bull; <span class="toast-dest"></span></div>
        <div class="toast-time"><span>⏱️</span> <span class="toast-time-text"></span></div>
      </div>
    `;

    (document.body || document.documentElement).appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    let toastTimer = null;
    let loopTimer = null;

    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      if (toastTimer) clearTimeout(toastTimer);
      if (loopTimer) clearInterval(loopTimer);
    });

    let notifyIndex = 0;

    function showNotification() {
      const item = bookingNotifications[notifyIndex];
      if (!item) return;
      toast.querySelector('.toast-name').textContent = item.name;
      toast.querySelector('.toast-cab').textContent = item.cab;
      toast.querySelector('.toast-dest').textContent = item.route;
      toast.querySelector('.toast-time-text').textContent = `${item.location} • ${item.time}`;

      toast.classList.add('show');

      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 6000);

      notifyIndex = (notifyIndex + 1) % bookingNotifications.length;
    }

    // Trigger first notification 1.2s after load
    setTimeout(() => {
      showNotification();
      loopTimer = setInterval(showNotification, 11000);
    }, 1200);
  }

  // Ensure execution regardless of DOM load state
  if (document.body) {
    createLiveBookingToast();
  } else {
    document.addEventListener('DOMContentLoaded', createLiveBookingToast);
  }

})();

