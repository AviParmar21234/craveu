/* CraveU website — small progressive enhancements (no dependencies) */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mark the current page in the nav
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var target = a.getAttribute('href').split('/').pop();
    if (target === here) a.setAttribute('aria-current', 'page');
  });

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  // "Open now" badges: CraveU hours 7:30am–11pm (Night Owl Noodles runs to 1am)
  var now = new Date();
  var mins = now.getHours() * 60 + now.getMinutes();
  document.querySelectorAll('[data-open][data-close]').forEach(function (el) {
    var o = el.getAttribute('data-open').split(':'), c = el.getAttribute('data-close').split(':');
    var open = +o[0] * 60 + +o[1], close = +c[0] * 60 + +c[1];
    var isOpen = close > open ? (mins >= open && mins < close) : (mins >= open || mins < close);
    el.textContent = isOpen ? 'Open now' : 'Closed';
    el.className = isOpen ? 'open' : 'closed';
  });

  // Demo forms: no backend on a static site — show a confirmation instead of navigating.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = form.parentElement.querySelector('.form-success');
      form.style.display = 'none';
      if (ok) ok.classList.add('is-visible');
    });
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
