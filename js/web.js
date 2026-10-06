/* AgenZoft — web v2 · comportamiento compartido */
(function () {
  var WA = 'https://wa.me/5492615154308?text=';

  // Enlaces de WhatsApp con mensaje precargado: <a data-wa="Hola, ...">
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = WA + encodeURIComponent(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Menú en celular
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.nav-drop > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = b.parentElement;
      var open = d.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    });
  });

  // Aparición al hacer scroll (?estatico la apaga, para capturas)
  if (/[?&]estatico/.test(location.search)) document.documentElement.classList.add('sin-anim');
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('on'); });
  }

  // Precios desde data/precios.json (fuente única para la web y Zoft)
  // <span data-precio="comerciopro.basico.mensual">  ·  <span data-desde="raices">
  var fmt = function (n) { return '$' + Number(n).toLocaleString('es-AR'); };
  var conPrecio = document.querySelectorAll('[data-precio], [data-desde]');
  if (conPrecio.length) {
    fetch('data/precios.json?v=1').then(function (r) { return r.json(); }).then(function (d) {
      conPrecio.forEach(function (el) {
        var ref = el.getAttribute('data-precio');
        if (ref) {
          var p = ref.split('.');
          var prod = d.productos[p[0]];
          var plan = prod && prod.planes.find(function (x) { return x.id === p[1]; });
          if (plan && plan[p[2]] != null) {
            var v = plan[p[2]];
            el.textContent = (p[2] === 'mensual' || p[2] === 'anual') ? fmt(v) : String(v);
          }
          return;
        }
        var prodD = d.productos[el.getAttribute('data-desde')];
        if (prodD) el.textContent = fmt(Math.min.apply(null, prodD.planes.map(function (x) { return x.mensual; })));
      });
    }).catch(function () { /* se quedan los valores escritos en el HTML */ });
  }

  // Preguntas sugeridas que abren el chat de Zoft con el texto escrito
  document.querySelectorAll('[data-zoft]').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      var fab = document.querySelector('.fab-zoft');
      if (!fab) return;
      var chat = document.querySelector('.zoft-chat');
      if (!chat || !chat.classList.contains('open')) fab.click();
      var input = document.querySelector('.zoft-chat input');
      if (input) { input.value = b.getAttribute('data-zoft') || ''; setTimeout(function () { input.focus(); }, 260); }
    });
  });

  // Año del pie
  document.querySelectorAll('[data-anio]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Cursor con los colores del logo (solo con mouse)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var dot = document.createElement('div'); dot.className = 'cur';
    var ring = document.createElement('div'); ring.className = 'cur-ring';
    document.body.append(dot, ring);
    document.body.classList.add('cur-on');
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      var hit = e.target.closest && e.target.closest('a, button, summary, .card, .preg');
      document.body.classList.toggle('cur-hover', !!hit);
    });
  }
})();
