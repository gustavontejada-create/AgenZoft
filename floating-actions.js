/* Zoft: botón de chat chico + volver arriba.
   Mientras el agente no esté conectado, Zoft deriva la conversación al WhatsApp del equipo.
   Para conectar el agente real: reemplazar open() por la llamada a su API. */
(function () {
  var WA = 'https://wa.me/5492615154308?text=';
  var SCROLL_THRESHOLD = 400;
  var OPTIONS = [
    ['ComercioPro', 'Hola! Quiero info sobre ComercioPro'],
    ['SuperTécnico', 'Hola! Quiero info sobre SuperTécnico'],
    ['InmobiliariaPro', 'Hola! Quiero info sobre InmobiliariaPro'],
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
      '<circle cx="82" cy="60" r="8.5" fill="#fff"/><circle cx="118" cy="60" r="8.5" fill="#fff"/>' +
      '<path d="M86 78 Q100 90 114 78" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>';
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
  OPTIONS.forEach(function (o) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'zoft-opt'; b.textContent = o[0];
    b.addEventListener('click', function () { openWA(o[1]); });
    opts.appendChild(b);
  });
  var input = chat.querySelector('input');
  chat.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (t) { openWA(t); input.value = ''; }
  });

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
