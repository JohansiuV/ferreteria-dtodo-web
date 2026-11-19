/* Ferretería D'todo · lógica de la web. Los datos se editan en js/config.js */
(function () {
  'use strict';
  var C = window.DTODO || {};
  var CAT = window.DTODO_CATALOGO || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 3000; // cambio de imagen cada 3 segundos

  var WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 7.5c-.4 0-1 .6-1 1.6 0 2.700 3.700 6.400 6.400 6.400 1 0 1.600-.6 1.600-1l-2-1-1 .8c-1.200-.4-2.300-1.500-2.800-2.800l.8-1z" fill="currentColor"/></svg>';

  /* ---------- WhatsApp ---------- */
  function wa(msg) {
    var n = String(C.whatsapp || '').replace(/\D/g, '');
    if (!n) return '#';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(msg || C.mensajeWhatsapp || 'Hola');
  }
  function fmtTel(n) {
    n = String(n || '').replace(/\D/g, '');
    if (n.length === 9) return n.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    if (n.length === 11 && n.indexOf('51') === 0) return '+51 ' + fmtTel(n.slice(2));
    return n;
  }
  function wireWa() {
    $$('[data-wa]').forEach(function (a) {
      a.href = wa(a.getAttribute('data-msg'));
      a.target = '_blank'; a.rel = 'noopener';
    });
    $$('.fab').forEach(function (a) { a.innerHTML = WA_ICON; });
    if (!C.whatsapp) $$('[data-wa]').forEach(function (a) { a.hidden = true; });
  }

  function toast(t) {
    var e = $('#toast'); e.textContent = t; e.classList.add('on');
    clearTimeout(toast.t); toast.t = setTimeout(function () { e.classList.remove('on'); }, 2200);
  }

  /* ---------- Menú móvil ---------- */
  var burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Carrusel ---------- */
  var DEFAULT_SLIDES = [
    { src: 'images/slide-herramientas.svg', titulo: 'Herramientas', sub: 'Martillos, winchas, llaves y alicates' },
    { src: 'images/slide-gasfiteria.svg', titulo: 'Gasfitería', sub: 'Tubos, codos, llaves de paso y grifería' },
    { src: 'images/slide-electricidad.svg', titulo: 'Electricidad', sub: 'Focos, cables, interruptores y tomacorrientes' },
    { src: 'images/slide-pinturas.svg', titulo: 'Pinturas', sub: 'Látex, esmalte, thinner, brochas y rodillos' },
    { src: 'images/slide-construccion.svg', titulo: 'Construcción', sub: 'Cemento, fierro, yeso y alambre' }
  ];
  var slides = (C.fotosCarrusel && C.fotosCarrusel.length ? C.fotosCarrusel.map(function (f) { return { src: f.src, titulo: f.titulo || C.negocio.nombre, sub: f.sub || '' }; }) : DEFAULT_SLIDES);
  var cur = 0, timer = null, tStart = 0, elapsed = 0, paused = false;
  var stage = $('#slides'), dots = $('#dots'), fill = $('#tapeFill'), visor = $('#carousel');

  stage.innerHTML = slides.map(function (s, i) {
    return '<div class="slide' + (i === 0 ? ' on' : '') + '"><img src="' + esc(s.src) + '" alt="' + esc(s.titulo) + '"' + (i ? ' loading="lazy"' : '') + '></div>';
  }).join('');
  dots.innerHTML = slides.map(function (s, i) { return '<button type="button" role="tab" aria-label="Ir a ' + esc(s.titulo) + '"' + (i === 0 ? ' class="on"' : '') + '></button>'; }).join('');
  var slideEls = $$('.slide', stage), dotEls = $$('button', dots);

  function caption() {
    $('#capTitle').textContent = slides[cur].titulo; $('#capSub').textContent = slides[cur].sub;
    var c = $('.visor__cap'); c.classList.remove('swap'); void c.offsetWidth; c.classList.add('swap');
  }
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slideEls.forEach(function (el, k) {
      var on = k === cur; el.classList.remove('on');
      if (on) { var img = $('img', el); img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; el.classList.add('on'); }
    });
    dotEls.forEach(function (d, k) { d.classList.toggle('on', k === cur); });
    caption(); restart();
  }
  function frame(ts) {
    if (paused) { tStart = ts - elapsed; requestAnimationFrame(frame); return; }
    if (!tStart) tStart = ts;
    elapsed = ts - tStart;
    fill.style.width = Math.min(100, elapsed / INTERVAL * 100) + '%';
    if (elapsed >= INTERVAL) { go(cur + 1); return; }
    requestAnimationFrame(frame);
  }
  function restart() { elapsed = 0; tStart = 0; fill.style.width = '0%'; cancelAnimationFrame(timer); if (slides.length > 1 && !reduce) timer = requestAnimationFrame(frame); }
  $('#prev').onclick = function () { go(cur - 1); };
  $('#next').onclick = function () { go(cur + 1); };
  dotEls.forEach(function (d, k) { d.onclick = function () { go(k); }; });
  visor.addEventListener('mouseenter', function () { paused = true; visor.classList.add('paused'); });
  visor.addEventListener('mouseleave', function () { paused = false; visor.classList.remove('paused'); });
  var sx = null;
  visor.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; paused = true; }, { passive: true });
  visor.addEventListener('touchend', function (e) {
    paused = false; if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null;
  });
  document.addEventListener('visibilitychange', function () { paused = document.hidden; });
  caption(); restart();

  /* ---------- Cinta de categorías ---------- */
  var cats = []; CAT.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
  var mq = cats.map(function (c) { return '<span>' + esc(c) + '</span><i></i>'; }).join('');
  $('#marquee').innerHTML = mq + mq + mq + mq;

  /* ---------- Catálogo ---------- */
  var COLORS = { 'Gasfitería': '#BFE0F5', 'Electricidad': '#FFE27A', 'Pinturas': '#F6C9C2', 'Fijaciones': '#D8DDE0', 'Herramientas': '#CBE8D6', 'Construcción': '#F1D2B3' };
  var S = 'fill="none" stroke="#15212B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    'Gasfitería': '<svg viewBox="0 0 64 64" ' + S + '><path d="M6 40h30a10 10 0 0 0 10-10V10"/><rect x="2" y="34" width="8" height="12" fill="#fff"/><rect x="40" y="6" width="12" height="8" fill="#fff"/><circle cx="46" cy="50" r="8" fill="#D2392B"/></svg>',
    'Electricidad': '<svg viewBox="0 0 64 64" ' + S + '><path d="M32 6a16 16 0 0 0-9 29v7h18v-7A16 16 0 0 0 32 6z" fill="#fff"/><path d="M24 46h16M26 52h12M28 58h8"/><path d="M27 34V22l5 5 5-5v12" stroke="#D2392B"/></svg>',
    'Pinturas': '<svg viewBox="0 0 64 64" ' + S + '><rect x="12" y="22" width="40" height="34" rx="4" fill="#fff"/><ellipse cx="32" cy="22" rx="20" ry="6" fill="#C9CFD3"/><rect x="12" y="34" width="40" height="12" fill="#2F6FA3"/><path d="M16 14q16-14 32 0"/></svg>',
    'Fijaciones': '<svg viewBox="0 0 64 64" ' + S + '><path d="M10 54L42 22M40 14l10 10M34 20l10 10" /><path d="M46 8l10 10-6 6-10-10z" fill="#9FB0BB"/><path d="M14 58l-4-4M22 50l-4-4" stroke="#D2392B"/></svg>',
    'Herramientas': '<svg viewBox="0 0 64 64" ' + S + '><rect x="28" y="22" width="8" height="38" rx="3" fill="#B07A3F"/><rect x="14" y="8" width="36" height="16" rx="3" fill="#9FB0BB"/><path d="M14 10C8 12 6 16 4 20c4-2 8-2 10-1z" fill="#9FB0BB"/></svg>',
    'Construcción': '<svg viewBox="0 0 64 64" ' + S + '><rect x="6" y="36" width="24" height="12" fill="#C8643C"/><rect x="30" y="36" width="24" height="12" fill="#B9552F"/><rect x="18" y="24" width="24" height="12" fill="#B9552F"/><rect x="6" y="48" width="24" height="10" fill="#B9552F"/><rect x="30" y="48" width="24" height="10" fill="#C8643C"/><path d="M8 14l48-6" stroke="#9FB0BB" stroke-width="5"/></svg>'
  };
  var state = { cat: 'Todos', q: '' };
  var money = function (n) { return 'S/ ' + Number(n).toFixed(2); };
  var norm = function (t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  function renderChips() {
    var all = ['Todos'].concat(cats);
    $('#chips').innerHTML = all.map(function (c) { return '<button type="button" role="tab" aria-selected="' + (c === state.cat) + '" class="' + (c === state.cat ? 'on' : '') + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
  }
  function renderGrid() {
    var q = norm(state.q);
    var list = CAT.filter(function (p) { return (state.cat === 'Todos' || p.cat === state.cat) && (!q || norm(p.nombre + ' ' + p.cat).indexOf(q) >= 0); });
    $('#grid').innerHTML = list.map(function (p, i) {
      var msg = "Hola D'todo, quiero consultar por: " + p.nombre + '. ¿Tienen stock?';
      var price = C.mostrarPrecios ? '<span class="tag">' + money(p.precio) + '</span>' : '<span class="tag tag--q">Consultar</span>';
      return '<article class="card" style="animation-delay:' + Math.min(i, 12) * 35 + 'ms"><div class="card__img" style="--c:' + (COLORS[p.cat] || '#FFE27A') + '">' + (ICONS[p.cat] || '') + '<span class="card__cat">' + esc(p.cat) + '</span></div>' +
        '<div class="card__b"><h3>' + esc(p.nombre) + '</h3><div class="card__f">' + price +
        '<a class="ask" target="_blank" rel="noopener" href="' + wa(msg) + '" aria-label="Consultar ' + esc(p.nombre) + ' por WhatsApp">' + WA_ICON + '</a></div></div></article>';
    }).join('');
    $('#count').textContent = list.length + (list.length === 1 ? ' producto' : ' productos') + (state.cat !== 'Todos' ? ' en ' + state.cat : '');
    $('#empty').hidden = list.length > 0;
  }
  $('#chips').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; state.cat = b.getAttribute('data-c'); renderChips(); renderGrid();
  });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  if (!C.mostrarPrecios) $('#catSub').textContent = 'Toca un producto y consulta precio y stock por WhatsApp.';
  renderChips(); renderGrid();

  /* ---------- Formas de pago ---------- */
  var P = C.pagos || {}, pay = [], pills = [];
  if (P.efectivo) { pills.push('Efectivo'); pay.push('<div class="pcard"><div class="ico">S/</div><h3>Efectivo</h3><p>Paga en la tienda al recoger tu pedido.</p></div>'); }
  if (P.yape && P.yape.numero) {
    pills.push('Yape');
    pay.push('<div class="pcard pcard--yape"><div class="ico">Y</div><h3>Yape</h3><div class="num">' + fmtTel(P.yape.numero) + '</div>' + (P.yape.titular ? '<p>A nombre de ' + esc(P.yape.titular) + '</p>' : '<p>Envía la captura del pago por WhatsApp.</p>') +
      (P.yapeQR ? '<img class="qr" src="' + esc(P.yapeQR) + '" alt="Código QR de Yape">' : '') +
      '<button class="copy" type="button" data-copy="' + esc(P.yape.numero) + '">Copiar número</button></div>');
  }
  if (P.plin && P.plin.numero) {
    pills.push('Plin');
    pay.push('<div class="pcard pcard--plin"><div class="ico">P</div><h3>Plin</h3><div class="num">' + fmtTel(P.plin.numero) + '</div>' + (P.plin.titular ? '<p>A nombre de ' + esc(P.plin.titular) + '</p>' : '<p>Envía la captura del pago por WhatsApp.</p>') +
      '<button class="copy" type="button" data-copy="' + esc(P.plin.numero) + '">Copiar número</button></div>');
  }
  if (P.fiado) { pills.push('Fiado para clientes'); pay.push('<div class="pcard"><div class="ico">%</div><h3>Fiado</h3><p>Para clientes frecuentes, con un límite de crédito según cada cliente. Consulta en tienda o por WhatsApp.</p></div>'); }
  $('#payGrid').innerHTML = pay.join('');
  $('#heroPay').innerHTML = pills.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
  $('#payGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var v = b.getAttribute('data-copy');
    (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(function () { toast('Número copiado'); }, function () { toast('Número: ' + v); });
  });

  /* ---------- Ubicación ---------- */
  var q = encodeURIComponent((C.direccion || C.negocio.distrito) + ', Perú');
  $('#locDir').textContent = C.direccion || C.negocio.distrito;
  $('#locHor').innerHTML = C.horario ? esc(C.horario) : 'Consulta el horario por WhatsApp';
  $('#locWa').innerHTML = C.whatsapp ? '<a data-wa href="#">' + fmtTel(C.whatsapp) + '</a>' : 'Próximamente';
  $('#locRuc').textContent = C.negocio.razonSocial + ' · RUC ' + C.negocio.ruc;
  $('#mapLink').href = 'https://www.google.com/maps/search/?api=1&query=' + q;
  $('#map').src = C.mapaEmbed || ('https://www.google.com/maps?q=' + q + '&output=embed');
  var soc = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok']].filter(function (s) { return C.redes && C.redes[s[0]]; });
  $('#social').innerHTML = soc.map(function (s) { return '<li><a target="_blank" rel="noopener" href="' + esc(C.redes[s[0]]) + '">' + s[1] + '</a></li>'; }).join('');
  $('#year').textContent = new Date().getFullYear();

  wireWa();

  /* ---------- Datos estructurados (SEO) ---------- */
  var ld = { '@context': 'https://schema.org', '@type': 'HardwareStore', name: C.negocio.nombre, legalName: C.negocio.razonSocial, taxID: C.negocio.ruc,
    address: { '@type': 'PostalAddress', streetAddress: C.direccion, addressLocality: 'San Martín de Porres', addressRegion: 'Lima', addressCountry: 'PE' } };
  if (C.whatsapp) ld.telephone = '+' + String(C.whatsapp).replace(/\D/g, '');
  var sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);

  /* ---------- Revelado suave de secciones ---------- */
  var rv = $$('.sec__head,.pay,.steps,.loc');
  if ('IntersectionObserver' in window && !reduce) {
    rv.forEach(function (el) { el.classList.add('rv'); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .15 });
    rv.forEach(function (el) { io.observe(el); });
  }
})();
