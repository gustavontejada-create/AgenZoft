/* Zoft: botón de chat chico + volver arriba.
   Sin agente conectado, Zoft deriva la conversación al WhatsApp del equipo.
   Con agente: la página define window.ZOFT_API (URL del endpoint /chat de zoft-api) antes de este
   script, y Zoft responde con IA; el botón "Hablar con una persona" sigue disponible siempre. */
(function () {
  var WA = 'https://wa.me/5492615154308?text=';
  var SCROLL_THRESHOLD = 400;
  var OPTIONS = [
    ['ComercioPro', 'Hola! Quiero info sobre ComercioPro'],
    ['SuperTécnico', 'Hola! Quiero info sobre SuperTécnico'],
    ['Raíces', 'Hola! Quiero info sobre Raíces'],
    ['Otra consulta', 'Hola! Quiero info sobre AgenZoft']
  ];

  // Zoft completo (la Z con carita) para el botón y el avatar
  var uid = 0;
  function face() {
    var id = 'zg' + (uid++);
    return '<svg viewBox="0 0 210 230" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A5CFF"/><stop offset="1" stop-color="#00C2FF"/></linearGradient></defs>' +
      '<path d="M138 112 L66 192 H150" fill="none" stroke="url(#' + id + ')" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="168" cy="190" r="27" fill="#9B8CFF"/>' +
      '<ellipse cx="100" cy="68" rx="80" ry="60" fill="url(#' + id + ')"/><ellipse cx="100" cy="66" rx="58" ry="36" fill="#0B0F1A"/>' +
      '<circle class="zf-eye zf-eye-l" cx="82" cy="60" r="8.5" fill="#fff"/><circle class="zf-eye zf-eye-r" cx="118" cy="60" r="8.5" fill="#fff"/>' +
      '<path class="zf-mouth" d="M86 78 Q100 90 114 78" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';
  }
  function openWA(text) { window.open(WA + encodeURIComponent(text), '_blank', 'noopener'); }

  var stack = document.createElement('div');
  stack.className = 'fab-stack';
  stack.setAttribute('aria-label', 'Acciones rápidas');

  var backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'fab-btn fab-back-top';
  backBtn.setAttribute('aria-label', 'Volver arriba');
  backBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  backBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var zoftBtn = document.createElement('button');
  zoftBtn.type = 'button';
  zoftBtn.className = 'fab-btn fab-zoft';
  zoftBtn.setAttribute('aria-label', 'Hablar con Zoft');
  zoftBtn.setAttribute('aria-expanded', 'false');
  zoftBtn.innerHTML = face();

  var chat = document.createElement('div');
  chat.className = 'zoft-chat';
  chat.setAttribute('role', 'dialog');
  chat.setAttribute('aria-label', 'Chat con Zoft');
  chat.innerHTML =
    '<div class="zoft-chat-head"><div class="zoft-chat-avatar">' + face() + '</div>' +
    '<div><div class="zoft-chat-title">Zoft</div><div class="zoft-chat-sub">Tu agente de IA · AgenZoft</div></div>' +
    '<button type="button" class="zoft-chat-close" aria-label="Cerrar chat">×</button></div>' +
    '<div class="zoft-chat-body"><div class="zoft-msg">¡Hola! Soy Zoft, tu agente de IA. ¿Sobre qué querés saber?</div><div class="zoft-opts"></div></div>' +
    '<form class="zoft-chat-form"><input type="text" placeholder="Escribí tu mensaje…" aria-label="Escribí tu mensaje" maxlength="300"><button type="submit" aria-label="Enviar">→</button></form>' +
    '<div class="zoft-chat-note">Seguimos la conversación por WhatsApp con el equipo.</div>';

  var opts = chat.querySelector('.zoft-opts');
  var input = chat.querySelector('input');
  var IA = window.ZOFT_API;
  if (IA) iniciarIA();
  else OPTIONS.forEach(function (o) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'zoft-opt'; b.textContent = o[0];
    b.addEventListener('click', function () { openWA(o[1]); });
    opts.appendChild(b);
  });
  if (!IA) chat.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (t) { openWA(t); input.value = ''; }
  });

  // ── Modo agente de IA ──
  function iniciarIA() {
    var body = chat.querySelector('.zoft-chat-body');
    var historial = [];
    var ocupado = false;
    chat.querySelector('.zoft-msg').textContent = '¡Hola! Soy Zoft, el agente de IA de AgenZoft. ¿En qué te ayudo?';
    chat.querySelector('.zoft-chat-note').innerHTML = 'No compartas datos personales en este chat. · <a href="#" class="zoft-persona">Hablar con una persona</a>';
    chat.querySelector('.zoft-persona').addEventListener('click', function (e) { e.preventDefault(); openWA(resumen()); });
    input.maxLength = 500;
    input.placeholder = 'Escribí tu pregunta…';
    ['¿Qué sistema me sirve?', 'Ver planes y precios', 'Quiero un desarrollo a medida'].forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'zoft-opt'; b.textContent = t;
      b.addEventListener('click', function () { enviar(t); });
      opts.appendChild(b);
    });
    chat.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var t = input.value.trim();
      if (t) { input.value = ''; enviar(t); }
    });

    function resumen() {
      var ult = historial.filter(function (m) { return m.rol === 'usuario'; }).slice(-1)[0];
      return ult ? 'Hola, vengo de hablar con Zoft en la web. Mi consulta: ' + ult.texto : 'Hola, quiero hacer una consulta sobre AgenZoft.';
    }
    function esc(t) { return t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function formato(t) {
      return esc(t)
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/(https?:\/\/[^\s<)]+[^\s<).,])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
        .replace(/^- (.*)$/gm, '• $1')
        .replace(/\n/g, '<br>');
    }
    function burbuja(html, clase) {
      var d = document.createElement('div');
      d.className = 'zoft-msg' + (clase ? ' ' + clase : '');
      d.innerHTML = html;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }
    function botonPersona() {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'zoft-opt zoft-wa'; b.textContent = 'Seguir por WhatsApp con el equipo';
      b.addEventListener('click', function () { openWA(resumen()); });
      body.appendChild(b);
      body.scrollTop = body.scrollHeight;
    }
    function enviar(texto) {
      if (ocupado) return;
      ocupado = true;
      opts.style.display = 'none';
      burbuja(esc(texto), 'yo');
      historial.push({ rol: 'usuario', texto: texto });
      var esperando = burbuja('<span class="zoft-dots"><i></i><i></i><i></i></span>', 'pensando');
      fetch(IA, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensajes: historial.slice(-12) }) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
        .then(function (x) {
          esperando.remove();
          if (!x.ok || !x.d.respuesta) {
            burbuja(x.status === 429 ? 'Por ahora llegamos al límite de consultas. Escribinos por WhatsApp y te respondemos.' : 'Ahora no puedo responder. ¿Te paso con una persona por WhatsApp?');
            botonPersona();
            historial.pop();
            return;
          }
          historial.push({ rol: 'zoft', texto: x.d.respuesta });
          burbuja(formato(x.d.respuesta));
          if (x.d.derivar) botonPersona();
        })
        .catch(function () {
          esperando.remove();
          historial.pop();
          burbuja('Ahora no puedo responder. ¿Te paso con una persona por WhatsApp?');
          botonPersona();
        })
        .then(function () { ocupado = false; input.focus(); });
    }
  }

  function toggle(show) {
    var on = typeof show === 'boolean' ? show : !chat.classList.contains('open');
    chat.classList.toggle('open', on);
    zoftBtn.setAttribute('aria-expanded', String(on));
    if (on) setTimeout(function () { input.focus(); }, 250);
  }
  zoftBtn.addEventListener('click', function () { toggle(); });
  chat.querySelector('.zoft-chat-close').addEventListener('click', function () { toggle(false); zoftBtn.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chat.classList.contains('open')) toggle(false); });

  stack.append(backBtn, zoftBtn);
  document.body.append(stack, chat);

  function onScroll() { backBtn.classList.toggle('visible', window.scrollY > SCROLL_THRESHOLD); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
