// Wait for full DOM
document.addEventListener('DOMContentLoaded', function() {

// ===== STAR CANVAS =====
(function () {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shootingStars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }
  initStars();

  function spawnShootingStar() {
    if (Math.random() < 0.003) {
      shootingStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 6,
        alpha: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.9 || s.alpha < 0.05) s.twinkleDir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 200, 255, ${s.alpha})`;
      ctx.fill();
    });
    spawnShootingStar();
    shootingStars = shootingStars.filter(s => s.alpha > 0);
    shootingStars.forEach(s => {
      const grad = ctx.createLinearGradient(s.x, s.y,
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len);
      grad.addColorStop(0, `rgba(201, 168, 76, ${s.alpha})`);
      grad.addColorStop(1, 'rgba(201, 168, 76, 0)');
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.02;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString('ru');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-num').forEach(animateCounter);
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsEl);
}

// ===== REVIEWS =====
const reviews = [
  {
    stars: 5,
    text: "Честно говоря, шла с большим скептицизмом. Подруга уговорила. Косандра сказала такие вещи про мою семью, про которые вообще никто не знал — даже мама. Про бабушку сказала что-то точь-в-точь. После этого сеанса многое встало на своё место. Спасибо огромное.",
    name: "Айгерим М.", city: "Алматы", service: "Расклад Таро", initials: "А"
  },
  {
    stars: 5,
    text: "Обращалась насчёт отношений — всё было очень плохо, думала расставаться. Косандра сделала расклад, объяснила что происходит с его стороны и со стороны нашей совместной энергии. Дала конкретные советы. Прошло 2 месяца — у нас всё наладилось. Не ожидала такого результата.",
    name: "Карина Л.", city: "Нур-Султан", service: "Любовный расклад", initials: "К"
  },
  {
    stars: 5,
    text: "Хотела разобраться с работой, уже год не могла понять — оставаться или уходить. После консультации поняла что мне нужно делать. Косандра не просто гадает, она реально объясняет всё подробно. Через три недели уволилась и уже нашла новое место. Всё как она и говорила.",
    name: "Дина Р.", city: "Шымкент", service: "Карты Ленорман", initials: "Д"
  },
  {
    stars: 5,
    text: "Делала диагностику порчи. Не буду рассказывать детали, но то что она нашла — это жесть. Объяснила откуда это и как убрать. После работы с ней реально стало легче, перестали преследовать неудачи. Рекомендую всем кто чувствует что что-то идёт не так в жизни.",
    name: "Гульнара А.", city: "Алматы", service: "Диагностика негатива", initials: "Г"
  },
  {
    stars: 5,
    text: "Нумерологию делала для себя и мужа. Очень интересно — многие черты характера, которые я давно заметила у него, полностью совпали с его числом судьбы. Про меня тоже всё правда. Косандра ещё дала рекомендации по благоприятным периодам. Очень познавательно и точно.",
    name: "Сауле Б.", city: "Талдыкорган", service: "Нумерология", initials: "С"
  },
  {
    stars: 5,
    text: "Обращался по поводу бизнеса — открывал новое дело, хотел понять перспективы. Косандра назвала точный период когда стоит запускаться и предупредила о двух рисках. Один из них уже реализовался в точности как она сказала — хорошо что был готов. Деньги потраченные на консультацию окупились многократно.",
    name: "Рустем К.", city: "Алматы", service: "Расклад на бизнес", initials: "Р"
  },
  {
    stars: 5,
    text: "Пишу спустя полгода. Косандра предсказала мне встречу с человеком из прошлого — именно так и произошло. И сказала что из этого получится. Всё вышло один в один. Я была в шоке когда вспомнила что она говорила. Теперь уже вторая консультация, и снова точно.",
    name: "Лейла Ж.", city: "Кокшетау", service: "Полная диагностика судьбы", initials: "Л"
  },
  {
    stars: 5,
    text: "Долго не решалась, потом всё-таки написала. Отвечает быстро, всё объясняет без лишней воды. Рунический расклад сделала подробно, дала распечатку значений. После сеанса поняла что меня держит на старом месте работы и почему я боюсь перемен. Это была настоящая работа с собой.",
    name: "Инна С.", city: "Алматы", service: "Руны", initials: "И"
  },
  {
    stars: 4,
    text: "В целом очень доволен. Сделал расклад по здоровью после операции, хотел понять прогноз. Косандра сказала что восстановление займёт дольше чем сказали врачи но пойдёт хорошо — так и вышло. Единственное — ждал записи три дня, но оно того стоило. Спасибо.",
    name: "Марат Т.", city: "Семей", service: "Расклад на здоровье", initials: "М"
  }
];

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.initials}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-meta">${r.city} · ${r.service}</div>
        </div>
      </div>
    </div>
  `).join('');
}

renderReviews();

// ===== OPEN TELEGRAM SAFELY (https only, no tg://) =====
function openTelegram(extraText) {
  const base = 'https://t.me/+77755837977';
  const url = extraText ? `${base}?text=${encodeURIComponent(extraText)}` : base;
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  } catch (e) {
    window.location.href = url;
  }
}

// Patch ALL tg links
document.querySelectorAll('a[href*="t.me"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    openTelegram();
  });
});

// ===== CONTACT FORM =====
const sendBtn = document.getElementById('sendToTg');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const nameEl = document.getElementById('nameInput');
    const questionEl = document.getElementById('questionInput');
    const name = nameEl ? nameEl.value.trim() : '';
    const question = questionEl ? questionEl.value.trim() : '';
    if (!name && !question) {
      alert('Пожалуйста, заполните имя или вопрос');
      return;
    }
    const msg = `Привет, Косандра!\n\nИмя: ${name || 'не указано'}\n\nВопрос: ${question || 'не указан'}`;
    openTelegram(msg);
  });
}

// ===== SMOOTH NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CURSOR GLOW (desktop only) =====
if (window.innerWidth > 768) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none; z-index: 999;
    background: radial-gradient(circle, rgba(201,168,76,0.04), transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s, top 0.1s;
  `;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

}); // end DOMContentLoaded