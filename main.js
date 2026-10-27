(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById('theme');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  function applyTheme(t, save) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', t === 'light');
    themeBtn.setAttribute('aria-label', t === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
    if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#ffffff' : '#000000');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  applyTheme(root.getAttribute('data-theme') || 'dark', false);
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.classList.add('theme-anim');
    applyTheme(next, true);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 600);
  });

  /* ---------- Reveal on scroll ---------- */
  var io = null;
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function (entries) {
      var i = 0;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.setProperty('--d', i++ * 90);
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  function watch(scope) {
    scope.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.remove('in');
      if (io) { void el.offsetWidth; io.observe(el); } else { el.classList.add('in'); }
    });
  }
  watch(document.getElementById('about'));
  document.querySelectorAll('.side [data-reveal], header [data-reveal], footer[data-reveal]').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });

  /* ---------- Page switch (About / Back) ---------- */
  var nav = document.getElementById('nav');
  var pages = { about: document.getElementById('about'), back: document.getElementById('back') };
  var current = 'about', busy = false;

  function show(name, instant) {
    if (busy || name === current) return;
    busy = true;
    var from = pages[current], to = pages[name];
    var done = function () {
      from.classList.add('hidden'); from.classList.remove('leaving');
      to.classList.remove('hidden');
      to.classList.add('leaving');
      void to.offsetWidth;
      to.classList.remove('leaving');
      watch(to);
      current = name;
      nav.textContent = name === 'about' ? 'Обо мне' : 'Назад';
      document.title = name === 'about' ? 'Артур Нанаев, старший программист' : 'Обо мне — Артур Нанаев';
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      busy = false;
    };
    if (instant || reduce) { done(); return; }
    from.classList.add('leaving');
    setTimeout(done, 300);
  }
  nav.addEventListener('click', function () {
    var next = current === 'about' ? 'back' : 'about';
    show(next);
    if (history.replaceState) history.replaceState(null, '', next === 'back' ? '#back' : '#');
  });
  if (location.hash === '#back') show('back', true);

  /* ---------- Scroll progress ---------- */
  var bar = document.getElementById('progress');
  var ticking = false;
  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
