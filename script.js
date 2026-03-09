/* ============================================================
   CHRISTIAN GROENEWALD — script.js
   Add this in WordPress via: Appearance > Theme File Editor
   OR use a plugin like "Insert Headers and Footers" (footer)
   OR WPCode plugin — paste in footer section
   ============================================================ */

(function () {
  'use strict';

  /* ===================== HELPERS ===================== */
  function $(id) { return document.getElementById(id); }
  function $$(sel) { return document.querySelectorAll(sel); }
  const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ===================== LOADER ===================== */
  var loaderEl = $('cg-loader');
  var lName    = $('cg-loader-name');
  var lBar     = $('cg-loader-bar');
  var lPct     = $('cg-loader-pct');

  if (lName) {
    'CHRISTIAN GROENEWALD'.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      s.textContent = ch === ' ' ? '\u00a0' : ch;
      s.style.cssText = 'transition:transform 0.6s ' + (i * 0.04) + 's cubic-bezier(0.16,1,0.3,1),opacity 0.6s ' + (i * 0.04) + 's';
      lName.appendChild(s);
    });
  }

  var loaderP = 0;
  var loaderTimer = setInterval(function () {
    loaderP = Math.min(loaderP + Math.random() * 14, 100);
    if (lBar) lBar.style.width = loaderP + '%';
    if (lPct) lPct.textContent = Math.floor(loaderP) + '%';
    if (loaderP >= 100) clearInterval(loaderTimer);
  }, 70);

  window.addEventListener('load', function () {
    setTimeout(function () {
      if (lName) {
        lName.querySelectorAll('span').forEach(function (s) {
          s.style.transform = 'translateY(0)';
          s.style.opacity = '1';
        });
      }
      setTimeout(function () {
        if (loaderEl) {
          loaderEl.style.transition = 'clip-path 0.9s cubic-bezier(0.76,0,0.24,1)';
          loaderEl.style.clipPath = 'inset(0 0 100% 0)';
          setTimeout(function () {
            if (loaderEl) loaderEl.style.display = 'none';
            heroIn();
          }, 950);
        } else {
          heroIn();
        }
      }, 900);
    }, 300);
  });

  /* ===================== HERO ANIMATION ===================== */
  function heroIn() {
    var hp  = $('cg-hp'),
        hr1 = $('cg-hr1'),
        hr2 = $('cg-hr2'),
        hb  = $('cg-hb'),
        hs  = $('cg-hs');

    if (hp)  setTimeout(function () { hp.style.cssText  = 'transition:opacity .8s,transform .8s;opacity:1;transform:translateY(0)'; }, 100);
    if (hr1) setTimeout(function () { hr1.style.cssText = 'transition:transform 1s cubic-bezier(0.16,1,0.3,1);transform:translateY(0)'; }, 300);
    if (hr2) setTimeout(function () { hr2.style.cssText = 'transition:transform 1.1s cubic-bezier(0.16,1,0.3,1);transform:translateY(0)'; }, 480);
    if (hb)  setTimeout(function () { hb.style.cssText  = 'transition:opacity .9s,transform .9s;opacity:1;transform:translateY(0)'; }, 800);
    if (hs)  setTimeout(function () { hs.style.cssText  = 'transition:opacity .8s;opacity:1'; }, 1200);
  }

  /* ===================== CANVAS PARTICLES ===================== */
  var canvas = $('cg-hero-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, particles = [], pmx = -999, pmy = -999;

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();

    var resizeDebounce;
    window.addEventListener('resize', function () {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(resizeCanvas, 150);
    });

    function Particle() { this.reset(); }
    Particle.prototype.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.r  = Math.random() * 1.5 + .4;
      this.a  = Math.random() * .35 + .08;
    };
    Particle.prototype.update = function () {
      var dx = this.x - pmx, dy = this.y - pmy;
      var d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130 && d > 0) {
        var f = (130 - d) / 130 * .8;
        this.vx += (dx / d) * f * .05;
        this.vy += (dy / d) * f * .05;
      }
      this.vx *= .98; this.vy *= .98;
      this.x  += this.vx; this.y  += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,245,62,' + this.a + ')';
      ctx.fill();
    };

    var count = window.innerWidth < 600 ? 55 : window.innerWidth < 900 ? 80 : 130;
    for (var i = 0; i < count; i++) particles.push(new Particle());

    function drawLines() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(200,245,62,' + (1 - d / 110) * .07 + ')';
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    }

    function animLoop() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(function (p) { p.update(); p.draw(); });
      requestAnimationFrame(animLoop);
    }
    animLoop();

    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      pmx = e.clientX - rect.left;
      pmy = e.clientY - rect.top;
    });
    document.addEventListener('touchmove', function (e) {
      var rect = canvas.getBoundingClientRect();
      pmx = e.touches[0].clientX - rect.left;
      pmy = e.touches[0].clientY - rect.top;
    }, { passive: true });
  }

  /* ===================== CUSTOM CURSOR (desktop only) ===================== */
  if (!isTouch) {
    document.body.classList.add('cg-cursor-active');
    var dot    = $('cg-cur-dot');
    var ring   = $('cg-cur-ring');
    var clabel = $('cg-cur-label');

    if (dot && ring && clabel) {
      var curX = 0, curY = 0, ringX = 0, ringY = 0;
      document.addEventListener('mousemove', function (e) { curX = e.clientX; curY = e.clientY; });

      (function cursorLoop() {
        ringX += (curX - ringX) * .1;
        ringY += (curY - ringY) * .1;
        dot.style.left   = curX + 'px'; dot.style.top   = curY + 'px';
        ring.style.left  = ringX + 'px'; ring.style.top = ringY + 'px';
        clabel.style.left = curX + 'px'; clabel.style.top = curY + 'px';
        requestAnimationFrame(cursorLoop);
      })();

      $$('[data-tilt], .cg-sk-tag, .cg-stat-block').forEach(function (el) {
        el.addEventListener('mouseenter', function () { document.body.classList.add('cur-big'); });
        el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-big'); });
      });
      $$('a, button').forEach(function (el) {
        el.addEventListener('mouseenter', function () { document.body.classList.add('cur-link'); });
        el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-link'); });
      });
      $$('[data-cur]').forEach(function (el) {
        el.addEventListener('mouseenter', function () { clabel.textContent = el.dataset.cur; clabel.style.opacity = '1'; });
        el.addEventListener('mouseleave', function () { clabel.style.opacity = '0'; });
      });
    }
  }

  /* ===================== SCROLL PROGRESS + NAV ===================== */
  var sprogf = $('cg-sprogf');
  var nav    = $('cg-nav');

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1) * 100;
    if (sprogf) sprogf.style.width = Math.min(scrolled, 100) + '%';
    if (nav)    nav.classList.toggle('compact', window.scrollY > 80);
  }, { passive: true });

  /* ===================== HAMBURGER MENU ===================== */
  var burger     = $('cg-burger');
  var mobileMenu = $('cg-mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var isOpen = burger.classList.toggle('open');
      if (isOpen) {
        mobileMenu.style.display = 'flex';
        setTimeout(function () { mobileMenu.classList.add('open'); }, 10);
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(function () { mobileMenu.style.display = 'none'; }, 350);
      }
    });

    $$('.cg-mm-link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(function () { mobileMenu.style.display = 'none'; }, 350);
      });
    });
  }

  /* ===================== SCROLL REVEAL ===================== */
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.cg-fade').forEach(function (el) { ro.observe(el); });
  } else {
    // Fallback for very old browsers — just show everything
    $$('.cg-fade').forEach(function (el) { el.classList.add('in'); });
  }

  /* ===================== SKILL BARS ===================== */
  var skBars = $('cg-sk-bars');
  if (skBars && 'IntersectionObserver' in window) {
    var sko = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.cg-sk-fill').forEach(function (b) {
            setTimeout(function () { b.style.width = b.dataset.w + '%'; }, 200);
          });
          sko.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    sko.observe(skBars);
  }

  /* ===================== COUNTER ANIMATION ===================== */
  function animCounter(el, target) {
    var start = null, dur = 2000;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / dur, 1);
      var eased    = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var statsEl = $('cg-stats');
  if (statsEl && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.cg-ctr').forEach(function (el) {
            animCounter(el, +el.dataset.t);
          });
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    co.observe(statsEl);
  }

  /* ===================== MAGNETIC BUTTONS (desktop only) ===================== */
  if (!isTouch) {
    $$('[data-mag]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' +
          ((e.clientX - r.left - r.width  / 2) * .3) + 'px,' +
          ((e.clientY - r.top  - r.height / 2) * .3) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });

    /* ===================== TILT CARDS (desktop only) ===================== */
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - .5;
        var y = (e.clientY - r.top)  / r.height - .5;
        el.style.transform  = 'perspective(800px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 6) + 'deg) translateZ(4px)';
        el.style.transition = 'transform .1s';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform  = '';
        el.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1), border-color .3s';
      });
    });
  }

  /* ===================== CONTACT FORM ===================== */
  var cfBtn = $('cg-cf-btn');
  if (cfBtn) {
    cfBtn.addEventListener('click', function () {
      var cfN = $('cg-cf-name');
      var cfE = $('cg-cf-email');
      var cfM = $('cg-cf-msg');
      var valid = true;

      [cfN, cfE, cfM].forEach(function (f) {
        if (!f || !f.value.trim()) {
          if (f) f.classList.add('error');
          valid = false;
        } else {
          f.classList.remove('error');
        }
      });

      // Basic email check
      if (cfE && cfE.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfE.value)) {
        cfE.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      var toast = $('cg-toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 4000);
      }

      [cfN, cfE, cfM].forEach(function (f) {
        if (f) { f.value = ''; f.classList.remove('error'); }
      });
    });

    // Remove error state on input
    $$('#cg-cf-name, #cg-cf-email, #cg-cf-msg').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('error'); });
    });
  }

})();
