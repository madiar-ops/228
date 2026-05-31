document.addEventListener('DOMContentLoaded', function () {

  // ===== AURORA + STARFIELD =====
  (function () {
    const c = document.getElementById('fx');
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, stars = [], shooters = [], t = 0;
    function resize() { W = c.width = innerWidth; H = c.height = innerHeight; initStars(); }
    function initStars() {
      stars = [];
      const n = Math.min(260, Math.floor(W * H / 7000));
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.4 + 0.3,
          a: Math.random() * 0.6 + 0.2,
          tw: Math.random() * 0.006 + 0.001, td: Math.random() > .5 ? 1 : -1
        });
      }
    }
    resize(); addEventListener('resize', resize);

    // aurora ribbons
    const bands = [
      { hue: 'rgba(95,240,168,', y: 0.20, amp: 70, len: 0.9, sp: 0.000022, ph: 0, w: 150 },
      { hue: 'rgba(63,224,197,', y: 0.30, amp: 90, len: 1.2, sp: 0.000030, ph: 2, w: 130 },
      { hue: 'rgba(155,127,232,', y: 0.26, amp: 60, len: 0.7, sp: 0.000018, ph: 4, w: 170 },
      { hue: 'rgba(233,143,200,', y: 0.16, amp: 50, len: 1.0, sp: 0.000035, ph: 1, w: 110 }
    ];

    function drawAurora() {
      bands.forEach(b => {
        const baseY = H * b.y;
        const grad = ctx.createLinearGradient(0, baseY - b.w, 0, baseY + b.w);
        grad.addColorStop(0, b.hue + '0)');
        grad.addColorStop(0.5, b.hue + '0.09)');
        grad.addColorStop(1, b.hue + '0)');
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= W; x += 14) {
          const y = baseY
            + Math.sin(x * 0.0016 * b.len + t * b.sp * 1000 + b.ph) * b.amp
            + Math.sin(x * 0.004 * b.len + t * b.sp * 600 + b.ph) * (b.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H * 0); ctx.lineTo(W, baseY + b.w);
        for (let x = W; x >= 0; x -= 14) {
          const y = baseY + b.w
            + Math.sin(x * 0.0016 * b.len + t * b.sp * 1000 + b.ph) * b.amp
            + Math.sin(x * 0.004 * b.len + t * b.sp * 600 + b.ph) * (b.amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    function spawnShooter() {
      if (Math.random() < 0.004) {
        shooters.push({
          x: Math.random() * W, y: Math.random() * H * 0.4,
          len: Math.random() * 120 + 70, sp: Math.random() * 9 + 7,
          a: 1, ang: Math.PI / 4 + (Math.random() - 0.5) * 0.4
        });
      }
    }

    function draw() {
      t++;
      ctx.clearRect(0, 0, W, H);
      drawAurora();

      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28);
        ctx.fillStyle = `rgba(228,237,255,${s.a})`; ctx.fill();
      });

      spawnShooter();
      shooters = shooters.filter(s => s.a > 0);
      shooters.forEach(s => {
        const g = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len);
        g.addColorStop(0, `rgba(174,240,230,${s.a})`);
        g.addColorStop(1, 'rgba(174,240,230,0)');
        ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len);
        ctx.stroke();
        s.x += Math.cos(s.ang) * s.sp; s.y += Math.sin(s.ang) * s.sp; s.a -= 0.02;
      });

      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ===== HEADER =====
  const hdr = document.getElementById('hdr');
  if (hdr) addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 50));

  // ===== MOBILE =====
  const burger = document.getElementById('burger'), mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => mnav.classList.toggle('open'));
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.classList.remove('open')));
  }

  // ===== REVEAL =====
  const obs = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const d = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('in'), d);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ===== COUNTERS =====
  function count(el) {
    const t = parseInt(el.dataset.target), suf = el.dataset.suffix || '', s = performance.now();
    (function tick(n) {
      const p = Math.min((n - s) / 1800, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * t).toLocaleString('ru') + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(s);
  }
  const foot = document.querySelector('.hero-foot');
  if (foot) {
    const to = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('b').forEach(count); to.unobserve(e.target); } });
    }, { threshold: .4 });
    to.observe(foot);
  }

  // ===== REVIEWS =====
  const reviews = [
    { stars: 5, text: "Шла с большим скептицизмом — подруга уговорила. Косандра рассказала такие вещи про мою семью, о которых не знал вообще никто, даже мама. После сеанса многое встало на свои места. Спасибо огромное.", name: "Айгерим М.", city: "Алматы", srv: "Расклад Таро", i: "А" },
    { stars: 5, text: "Обращалась насчёт отношений — всё было плохо, думала расставаться. Косандра объяснила, что происходит с его стороны, дала конкретные советы. Прошло два месяца — всё наладилось. Не ожидала такого результата.", name: "Карина Л.", city: "Астана", srv: "Любовный расклад", i: "К" },
    { stars: 5, text: "Год не могла понять — оставаться на работе или уходить. После консультации всё прояснилось. Косандра не просто гадает, она реально объясняет. Через три недели уволилась и нашла новое место. Всё как она говорила.", name: "Дина Р.", city: "Шымкент", srv: "Карты Ленорман", i: "Д" },
    { stars: 5, text: "Делала диагностику негатива. Детали рассказывать не буду, но то, что она нашла, объяснило очень многое. После работы с ней стало заметно легче, перестали преследовать неудачи. Рекомендую всем.", name: "Гульнара А.", city: "Алматы", srv: "Очищение", i: "Г" },
    { stars: 5, text: "Нумерологию делала для себя и мужа. Очень точно — черты характера, которые я давно за ним замечала, полностью совпали с его числом судьбы. Ещё дала рекомендации по благоприятным периодам. Познавательно.", name: "Сауле Б.", city: "Караганда", srv: "Нумерология", i: "С" },
    { stars: 5, text: "Открывал новое дело, хотел понять перспективы. Косандра назвала точный период запуска и предупредила о двух рисках. Один уже реализовался в точности — хорошо, что был готов. Консультация окупилась многократно.", name: "Рустем К.", city: "Алматы", srv: "Расклад на бизнес", i: "Р" },
    { stars: 5, text: "Пишу спустя полгода. Косандра предсказала встречу с человеком из прошлого — так и произошло, один в один. Я была в шоке, когда вспомнила её слова. Теперь уже вторая консультация, и снова всё точно.", name: "Лейла Ж.", city: "Кокшетау", srv: "Полная диагностика", i: "Л" },
    { stars: 5, text: "Долго не решалась, потом всё-таки написала. Отвечает быстро, объясняет без лишней воды. Рунический расклад сделала подробно. После сеанса поняла, что меня держит на старом месте и почему я боюсь перемен.", name: "Инна С.", city: "Алматы", srv: "Руны", i: "И" },
    { stars: 4, text: "В целом очень доволен. Сделал расклад по здоровью после операции. Косандра сказала, что восстановление займёт дольше, чем обещали врачи, но пойдёт хорошо — так и вышло. Ждал записи пару дней, но оно того стоило.", name: "Марат Т.", city: "Семей", srv: "Расклад на здоровье", i: "М" }
  ];
  const grid = document.getElementById('reviewsGrid');
  if (grid) {
    grid.innerHTML = reviews.map(r => `
      <div class="voice">
        <div class="voice-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <p class="voice-text">«${r.text}»</p>
        <div class="voice-author">
          <div class="voice-ava">${r.i}</div>
          <div><div class="voice-name">${r.name}</div><div class="voice-meta">${r.city} · ${r.srv}</div></div>
        </div>
      </div>`).join('');
  }

  // ===== TELEGRAM =====
  function openTg() {
    const url = 'https://t.me/+77755837977';
    try { const w = window.open(url, '_blank', 'noopener,noreferrer'); if (!w) location.href = url; }
    catch (e) { location.href = url; }
  }
  document.querySelectorAll('a[href*="t.me"]').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); openTg(); }));

  // ===== SMOOTH NAV =====
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }));

});