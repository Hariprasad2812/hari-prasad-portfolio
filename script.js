/* =====================================================
   S. Hari Prasad — Portfolio interactions
===================================================== */
(function () {
  'use strict';

  var FORMSUBMIT_EMAIL = 'hariprasad281204@gmail.com';
  var PRELOADER_KEY = 'portfolio_preloader_seen';

  /* ---------- Preloader (first visit only) ---------- */
  var preloader = document.getElementById('preloader');
  var preStart = Date.now();
  var skipPreloader = localStorage.getItem(PRELOADER_KEY) === '1';

  function finishPreloader() {
    document.body.classList.add('hero-in');
    document.body.classList.remove('no-scroll');
    localStorage.setItem(PRELOADER_KEY, '1');
  }

  function exitPreloader() {
    if (!preloader || preloader.classList.contains('exit')) return;
    var elapsed = Date.now() - preStart;
    var wait = Math.max(0, 1750 - elapsed);
    setTimeout(function () {
      preloader.classList.add('exit');
      finishPreloader();
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 950);
    }, wait);
  }

  if (skipPreloader) {
    if (preloader) {
      preloader.classList.add('skip');
      preloader.setAttribute('aria-hidden', 'true');
    }
    finishPreloader();
  } else {
    document.body.classList.add('no-scroll');
    window.addEventListener('load', exitPreloader);
    setTimeout(exitPreloader, 3500);
  }

  /* ---------- Navbar scrolled state ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Active section nav indicator ---------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('data-nav');
    var section = document.getElementById(id);
    if (section) sections.push({ id: id, el: section });
  });

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute('data-nav') === id;
      link.classList.toggle('active', match);
      if (match) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { navIO.observe(s.el); });
    setActiveNav('hero');
  }

  /* ---------- Hero video control ---------- */
  var heroVideo = document.querySelector('.hero-video');
  var videoToggle = document.getElementById('hero-video-toggle');
  if (heroVideo && videoToggle) {
    function updateVideoToggle() {
      var playing = !heroVideo.paused;
      var hasSound = !heroVideo.muted;
      videoToggle.classList.toggle('is-playing', playing);
      videoToggle.setAttribute('aria-pressed', hasSound ? 'true' : 'false');
      if (!playing) videoToggle.setAttribute('aria-label', 'Play video with sound');
      else if (!hasSound) videoToggle.setAttribute('aria-label', 'Turn on video sound');
      else videoToggle.setAttribute('aria-label', 'Pause video');
      videoToggle.querySelector('span').textContent = !playing ? 'Play video' : (hasSound ? 'Pause video' : 'Play sound');
    }

    videoToggle.addEventListener('click', function () {
      if (heroVideo.paused) {
        heroVideo.muted = false;
        heroVideo.play().catch(function () { heroVideo.muted = true; });
      } else if (heroVideo.muted) {
        heroVideo.muted = false;
      } else {
        heroVideo.pause();
        heroVideo.muted = true;
      }
      updateVideoToggle();
    });
    heroVideo.addEventListener('play', updateVideoToggle);
    heroVideo.addEventListener('pause', updateVideoToggle);
    heroVideo.addEventListener('volumechange', updateVideoToggle);
    updateVideoToggle();
    heroVideo.muted = true;
    var p = heroVideo.play(); if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Mobile panel ---------- */
  var burgerBtn = document.getElementById('burgerBtn');
  var closeBurger = document.getElementById('closeBurger');
  var mobilePanel = document.getElementById('mobile-panel');

  function setMobileOpen(open) {
    mobilePanel.classList.toggle('open', open);
    burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobilePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('no-scroll', open);
  }

  burgerBtn.addEventListener('click', function () { setMobileOpen(true); });
  closeBurger.addEventListener('click', function () { setMobileOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobilePanel.classList.contains('open')) {
      setMobileOpen(false);
      burgerBtn.focus();
    }
  });
  mobilePanel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMobileOpen(false); });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealIO.observe(el);
  });

  /* ---------- Journey dashed line ---------- */
  var trackLine = document.querySelector('.track-line');
  if (trackLine) {
    var trackIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackLine.classList.add('in');
          trackIO.disconnect();
        }
      });
    }, { threshold: 0.15 });
    trackIO.observe(trackLine);
  }

  /* ---------- Journey cards: active state while centered ---------- */
  var jcards = document.querySelectorAll('.jcard');
  if (jcards.length) {
    var jcardIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
        else entry.target.classList.remove('active');
      });
    }, { threshold: 0.6, rootMargin: '-8% 0px -8% 0px' });
    jcards.forEach(function (card) { jcardIO.observe(card); });
  }

  /* ---------- Footer big text ---------- */
  var footerText = document.querySelector('.footer-hero-text');
  if (footerText) {
    var footIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) footerText.classList.add('in');
        else footerText.classList.remove('in');
      });
    }, { threshold: 0.4 });
    footIO.observe(footerText);
  }

  /* ---------- Contact form — email via FormSubmit + WhatsApp ---------- */
  var form = document.getElementById('contact-form');
  var submitBtn = document.getElementById('cf-submit-btn');
  var whatsappBtn = document.getElementById('cf-whatsapp-btn');
  var formStatus = document.getElementById('form-status');

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status show ' + type;
  }

  function clearErrors() {
    ['name', 'email', 'subject', 'message'].forEach(function (field) {
      var err = document.getElementById('err-' + field);
      var input = document.getElementById('cf-' + field);
      if (err) err.textContent = '';
      if (input) {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getFormData() {
    return {
      name: document.getElementById('cf-name').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      subject: document.getElementById('cf-subject').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };
  }

  function validateForm(data) {
    clearErrors();
    var valid = true;

    if (!data.name) {
      document.getElementById('err-name').textContent = 'Name is required.';
      document.getElementById('cf-name').classList.add('invalid');
      document.getElementById('cf-name').setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!data.email) {
      document.getElementById('err-email').textContent = 'Email is required.';
      document.getElementById('cf-email').classList.add('invalid');
      document.getElementById('cf-email').setAttribute('aria-invalid', 'true');
      valid = false;
    } else if (!validateEmail(data.email)) {
      document.getElementById('err-email').textContent = 'Enter a valid email address.';
      document.getElementById('cf-email').classList.add('invalid');
      document.getElementById('cf-email').setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!data.subject) {
      document.getElementById('err-subject').textContent = 'Subject is required.';
      document.getElementById('cf-subject').classList.add('invalid');
      document.getElementById('cf-subject').setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!data.message) {
      document.getElementById('err-message').textContent = 'Message is required.';
      document.getElementById('cf-message').classList.add('invalid');
      document.getElementById('cf-message').setAttribute('aria-invalid', 'true');
      valid = false;
    }
    return valid;
  }

  function openWhatsApp(data) {
    var text =
      'Hello Hari!\n\n' +
      'Name: ' + data.name + '\n' +
      'Email: ' + data.email + '\n' +
      'Subject: ' + data.subject + '\n\n' +
      'Message:\n' + data.message;
    window.open('https://wa.me/918520938972?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      var data = getFormData();
      if (!validateForm(data)) {
        showStatus('Please fix the errors above.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      formStatus.className = 'form-status';

      fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          _subject: 'Portfolio Contact — ' + data.subject,
          _captcha: 'false'
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Send failed');
          return res.json();
        })
        .then(function () {
          showStatus('Message sent! I\'ll get back to you soon.', 'success');
          form.reset();
        })
        .catch(function () {
          showStatus('Could not send email. Try WhatsApp or email me directly.', 'error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        });
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function () {
      var data = getFormData();
      if (!validateForm(data)) {
        showStatus('Fill in all fields before sending via WhatsApp.', 'error');
        return;
      }
      openWhatsApp(data);
      showStatus('Opening WhatsApp…', 'success');
    });
  }

  /* ---------- Card tilt (subtle) ---------- */
  var tiltCards = document.querySelectorAll('.tilt-card');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'rotate(' + (-y * 4) + 'deg) rotateX(' + (y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  var magneticBtns = document.querySelectorAll('.magnetic-btn');
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Cursor glow ---------- */
  if (!prefersReduced && window.matchMedia('(hover: hover)').matches && window.innerWidth > 860) {
    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    document.body.classList.add('cursor-ready');

    window.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
