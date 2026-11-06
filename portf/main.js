(function () {

  var root = document.documentElement;

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
    applyTheme(next, true);
  });

  /* ---------- Page switch (About / Back) ---------- */

  var nav = document.getElementById('nav');
  var pages = { about: document.getElementById('about'), back: document.getElementById('back') };
  var current = 'about';

  function show(name) {
    if (name === current) return;
    pages[current].classList.add('hidden');
    pages[name].classList.remove('hidden');
    current = name;
    nav.textContent = name === 'about' ? 'Обо мне' : 'Назад';
    document.title = name === 'about' ? 'Артур Нанаев, старший программист' : 'Обо мне — Артур Нанаев';
    window.scrollTo(0, 0);
  }

  nav.addEventListener('click', function () {
    var next = current === 'about' ? 'back' : 'about';
    show(next);
    if (history.replaceState) history.replaceState(null, '', next === 'back' ? '#back' : '#');
  });

  if (location.hash === '#back') show('back');

})();
