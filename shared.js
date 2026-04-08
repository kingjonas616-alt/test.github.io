/* ═══════════════════════════════════════
   پیشانگای یونس — Shared Utilities
   Loaded on every page
   ═══════════════════════════════════════ */

/* ─── STATE ─── */
let favorites   = JSON.parse(localStorage.getItem('fav') || '[]');
let compareList = JSON.parse(localStorage.getItem('cmp') || '[]');

/* ─── UTILS ─── */
function fmt(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);
}

function toast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = (type === 'success' ? '✅ ' : '❌ ') + msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3100);
}

/* ─── FAVORITES ─── */
function isFav(id) { return favorites.includes(id); }
function saveFav() { localStorage.setItem('fav', JSON.stringify(favorites)); updateFavPill(); }

function updateFavPill() {
  const pill = document.getElementById('fav-pill');
  if (!pill) return;
  pill.textContent = favorites.length;
  pill.classList.toggle('show', favorites.length > 0);
}

function toggleFav(id, e) {
  e && e.stopPropagation();
  if (isFav(id)) {
    favorites = favorites.filter(x => x !== id);
    toast('لە دڵخوازەکانت لابرا', 'error');
  } else {
    favorites.push(id);
    toast('زیادکرا بۆ دڵخوازەکانت');
  }
  saveFav();
  document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(b => {
    b.classList.toggle('active', isFav(id));
    b.textContent = isFav(id) ? '❤️' : '🤍';
  });
  if (typeof renderFavorites === 'function') renderFavorites();
}

/* ─── COMPARE ─── */
function isCmp(id) { return compareList.includes(id); }
function saveCmp() { localStorage.setItem('cmp', JSON.stringify(compareList)); updateCompareBar(); }

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (!bar) return;
  bar.classList.toggle('show', compareList.length > 0);
  const items = document.getElementById('compare-bar-items');
  if (items) {
    items.innerHTML = compareList.map(id => {
      const c = CARS.find(x => x.id === id);
      return c ? `<span class="compare-chip">${c.make} ${c.model}</span>` : '';
    }).join('');
  }
}

function toggleCompare(id, e) {
  e && e.stopPropagation();
  if (isCmp(id)) {
    compareList = compareList.filter(x => x !== id);
    toast('لە بەراوردەکانت لابرا', 'error');
  } else if (compareList.length >= 3) {
    toast('زۆرترین ٣ ئوتومبێل دەتوانیت بەراورد بکەیت', 'error');
    return;
  } else {
    compareList.push(id);
    toast('زیادکرا بۆ بەراوردەکانت');
  }
  saveCmp();
  document.querySelectorAll(`.compare-btn[data-id="${id}"]`).forEach(b => {
    b.classList.toggle('added', isCmp(id));
    b.textContent = isCmp(id) ? '⚖️✓' : '⚖️';
  });
  if (typeof renderCompare === 'function') renderCompare();
}

function clearCompare() {
  compareList = [];
  saveCmp();
  if (typeof renderCompare === 'function') renderCompare();
}

/* ─── THEME ─── */
let darkMode = localStorage.getItem('theme') !== 'light';

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  document.body.classList.toggle('light', !darkMode);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = darkMode ? '🌙' : '☀️';
}

function applyTheme() {
  document.body.classList.toggle('light', !darkMode);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = darkMode ? '🌙' : '☀️';
}

/* ─── MOBILE MENU ─── */
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('open'); }
function closeMobileMenu()   { document.getElementById('mobile-menu').classList.remove('open'); }

/* ─── CAR CARD HTML ─── */
function carCardHTML(car) {
  const fav = isFav(car.id);
  const cmp = isCmp(car.id);
  return `
    <div class="car-card" onclick="openModal(${car.id})">
      <div class="car-img-wrap">
        <img src="${`photos/car-${car.id}.png`}" alt="${car.make} ${car.model}" loading="lazy"/>
        <div class="car-tags">
          <span class="tag ${car.condition === 'new' ? 'tag-new' : 'tag-used'}">
            ${car.condition === 'new' ? 'نوێ' : 'بەکارهێنراو'}
          </span>
          ${car.featured ? '<span class="tag tag-feat">تایبەت</span>' : ''}
        </div>
        <button class="fav-btn ${fav ? 'active' : ''}" data-id="${car.id}"
          onclick="toggleFav(${car.id},event)">${fav ? '❤️' : '🤍'}</button>
      </div>
      <div class="car-body">
        <div class="car-header">
          <div class="car-name">${car.make} ${car.model}</div>
          <div class="car-price">${fmt(car.price)}</div>
        </div>
        <div class="car-desc">${car.desc}</div>
        <div class="car-specs">
          <div class="spec-item"><span>📅</span>${car.year}</div>
          <div class="spec-item"><span>🛣️</span><span dir="ltr">${car.mileage.toLocaleString()} km</span></div>
          <div class="spec-item"><span>⛽</span>${car.fuel}</div>
          <div class="spec-item"><span>⚙️</span>${car.trans}</div>
        </div>
        <div class="car-actions">
          <div class="car-btn" onclick="event.stopPropagation();openModal(${car.id})">وردەکاری</div>
          <div class="car-btn compare-btn ${cmp ? 'added' : ''}" data-id="${car.id}"
            onclick="toggleCompare(${car.id},event)">${cmp ? '⚖️✓' : '⚖️'}</div>
        </div>
      </div>
    </div>`;
}

function carListHTML(car) {
  const fav = isFav(car.id);
  return `
    <div class="car-list-item" onclick="openModal(${car.id})">
      <div class="car-list-img">
        <img src="${`photos/car-${car.id}.png`}" alt="${car.make}" loading="lazy"/>
        <div class="car-tags" style="top:8px;right:8px">
          <span class="tag ${car.condition === 'new' ? 'tag-new' : 'tag-used'}" style="font-size:.68rem">
            ${car.condition === 'new' ? 'نوێ' : 'بەکارهێنراو'}
          </span>
        </div>
      </div>
      <div class="car-list-body">
        <div class="car-list-info">
          <div style="font-size:1.05rem;font-weight:800;margin-bottom:4px">${car.make} ${car.model}</div>
          <div style="color:var(--text2);font-size:.82rem;margin-bottom:10px">${car.desc.slice(0, 80)}...</div>
          <div class="car-list-specs">
            <span class="spec-item" style="padding:5px 10px;font-size:.78rem">📅 ${car.year}</span>
            <span class="spec-item" style="padding:5px 10px;font-size:.78rem">⛽ ${car.fuel}</span>
            <span class="spec-item" style="padding:5px 10px;font-size:.78rem">🛣️ <span dir="ltr">${car.mileage.toLocaleString()} km</span></span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">
          <div style="font-size:1.2rem;font-weight:900;color:var(--gold)">${fmt(car.price)}</div>
          <div style="display:flex;gap:8px">
            <button class="car-btn ${fav ? 'primary' : ''}" style="padding:8px 14px;font-size:.78rem"
              onclick="toggleFav(${car.id},event)">${fav ? '❤️' : '🤍'}</button>
            <button class="car-btn" style="padding:8px 14px;font-size:.78rem"
              onclick="openModal(${car.id})">وردەکاری</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ─── CAR MODAL ─── */
function openModal(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;
  const fav = isFav(id), cmp = isCmp(id);
  document.getElementById('car-modal').innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(event)">
      <div class="modal-box">
        <button class="modal-close-btn" onclick="document.getElementById('car-modal').style.display='none'">✕</button>
        <img class="modal-img" src="${`photos/car-${car.id}.png`}" alt="${car.make}"/>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <div class="modal-title">${car.make} ${car.model}</div>
          <div class="modal-price">${fmt(car.price)}</div>
        </div>
        <div class="modal-desc">${car.desc}</div>
        <div class="modal-spec-grid">
          <div class="mspec"><div class="mspec-label">ساڵ</div><div class="mspec-val">${car.year}</div></div>
          <div class="mspec"><div class="mspec-label">کیلۆمەتر</div><div class="mspec-val" dir="ltr">${car.mileage.toLocaleString()}</div></div>
          <div class="mspec"><div class="mspec-label">دۆخ</div><div class="mspec-val">${car.condition === 'new' ? 'نوێ' : 'بەکارهێنراو'}</div></div>
          <div class="mspec"><div class="mspec-label">سووتمەنی</div><div class="mspec-val">${car.fuel}</div></div>
          <div class="mspec"><div class="mspec-label">گیربۆکس</div><div class="mspec-val">${car.trans}</div></div>
          <div class="mspec"><div class="mspec-label">ڕەنگ</div><div class="mspec-val">${car.color}</div></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-gold" style="flex:1;justify-content:center"
            onclick="document.getElementById('car-modal').style.display='none'">
            📞 +964 750 123 4567
          </button>
          <button class="btn btn-outline" style="padding:14px"
            onclick="toggleFav(${id},event);this.textContent=isFav(${id})?'❤️':'🤍'">
            ${fav ? '❤️' : '🤍'}
          </button>
          <button class="btn btn-outline" style="padding:14px"
            onclick="toggleCompare(${id},event);this.textContent=isCmp(${id})?'⚖️✓':'⚖️'">
            ${cmp ? '⚖️✓' : '⚖️'}
          </button>
        </div>
      </div>
    </div>`;
  document.getElementById('car-modal').style.display = 'block';
}

function closeModal(e) {
  if (e.target.classList.contains('modal-backdrop'))
    document.getElementById('car-modal').style.display = 'none';
}

/* ─── SCROLL REVEAL ─── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .12 });
  els.forEach(el => obs.observe(el));
}

/* ─── ANIMATED COUNTERS ─── */
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    let val = 0;
    const step = target / 1800 * 16;
    const run = () => {
      val = Math.min(val + step, target);
      el.textContent = val >= 1000
        ? '+' + (Math.round(val / 100) * 100).toLocaleString()
        : Math.round(val);
      if (val < target) requestAnimationFrame(run);
    };
    run();
  });
}

/* ─── SHARED NAV HTML ─── */
function navHTML(activePage) {
  const pages = [
    { id: 'index',    href: 'index.html',    label: 'سەرەکی' },
    { id: 'cars',     href: 'cars.html',     label: 'ئوتومبێلەکان' },
    { id: 'sell',     href: 'sell.html',     label: 'بفرۆشە' },
    { id: 'about',    href: 'about.html',    label: 'دەربارەمان' },
    { id: 'contact',  href: 'contact.html',  label: 'پەیوەندی' },
  ];
  return `
    <nav>
      <div class="nav-inner">
        <a class="logo" href="index.html">
          <div class="logo-icon">🚗</div>
         پیشانگای <span>یونس</span>
        </a>
        <div class="nav-links">
          ${pages.map(p => `<a class="nav-link${activePage === p.id ? ' active' : ''}" href="${p.href}">${p.label}</a>`).join('')}
        </div>
        <div class="nav-actions">
          <a class="icon-btn" href="favorites.html" title="دڵخوازەکانم">
            ❤️ <span class="badge-pill" id="fav-pill">0</span>
          </a>
          <a class="icon-btn" href="compare.html" title="بەراوردکردن">⚖️</a>
          <button class="icon-btn" onclick="toggleTheme()" id="theme-btn">🌙</button>
          <a class="nav-buy" href="cars.html">کڕینی ئوتومبێل</a>
          <button class="hamburger" onclick="toggleMobileMenu()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      <a class="mobile-link${activePage==='index'?' active':''}" href="index.html" onclick="closeMobileMenu()">🏠 سەرەکی</a>
      <a class="mobile-link${activePage==='cars'?' active':''}" href="cars.html" onclick="closeMobileMenu()">🚗 ئوتومبێلەکان</a>
      <a class="mobile-link${activePage==='sell'?' active':''}" href="sell.html" onclick="closeMobileMenu()">💰 بفرۆشە</a>
      <a class="mobile-link${activePage==='about'?' active':''}" href="about.html" onclick="closeMobileMenu()">ℹ️ دەربارەمان</a>
      <a class="mobile-link${activePage==='contact'?' active':''}" href="contact.html" onclick="closeMobileMenu()">📞 پەیوەندی</a>
      <a class="mobile-link${activePage==='favorites'?' active':''}" href="favorites.html" onclick="closeMobileMenu()">❤️ دڵخوازەکانم</a>
      <a class="mobile-link${activePage==='compare'?' active':''}" href="compare.html" onclick="closeMobileMenu()">⚖️ بەراوردکردن</a>
    </div>`;
}

const FOOTER_HTML = `
  <footer>
    <div class="footer-inner">
      <div class="footer-brand">
        <a class="logo" href="index.html"><div class="logo-icon">🚗</div>پیشانگای <span>یونس</span></a>
        <p>باشترین و باوەڕپێکراوترین نمایشگای ئوتومبێل لە کوردستان. ئامانجمان دابینکردنی باشترین ئوتومبێلە بۆ تۆ بە گونجاوترین نرخ.</p>
      </div>
      <div class="footer-col">
        <h4>بەستەرە خێراکان</h4>
        <ul>
          <li><a href="index.html">سەرەکی</a></li>
          <li><a href="cars.html">ئوتومبێلەکان</a></li>
          <li><a href="sell.html">بفرۆشە</a></li>
          <li><a href="about.html">دەربارەمان</a></li>
          <li><a href="contact.html">پەیوەندی</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>خزمەتگوزاری</h4>
        <ul>
          <li><span>کڕینی ئوتومبێل</span></li>
          <li><span>فرۆشتنی ئوتومبێل</span></li>
          <li><span>بەراوردکردن</span></li>
          <li><span>گەرەنتی</span></li>
          <li><span>دابەشکردن</span></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>پەیوەندی</h4>
        <ul>
          <li><span>📍 هەولێر، شەقامی ١٠٠ مەتری</span></li>
          <li><span dir="ltr">📞 +964 750 000 0000</span></li>
          <li><span dir="ltr">✉️ younsking4@outlook.com</span></li>
          <li><span>⏰ شەممە-پێنجشەممە: ٩ بەیانی تا ١٠ شەو</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 پیشانگای یونس. هەموو مافێک پارێزراوە.</p>
      <p style="color:var(--gold)">دروستکراو بۆ کوردستان ❤️</p>
    </div>
  </footer>`;

/* ─── SHARED CHROME (nav + footer + compare bar + modal + toasts) ─── */
function buildPage(activePage) {
  document.body.insertAdjacentHTML('afterbegin',
    navHTML(activePage) +
    '<div id="toast-container"></div>' +
    `<div id="compare-bar">
      <p>بەراوردی ئوتومبێل:</p>
      <div class="compare-bar-items" id="compare-bar-items"></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <a class="btn btn-gold" href="compare.html" style="padding:10px 20px;font-size:.85rem">بینینی بەراورد</a>
        <button style="background:transparent;border:1px solid var(--border2);color:var(--text2);padding:10px 16px;border-radius:10px;font-size:.82rem;font-weight:600;cursor:pointer" onclick="clearCompare()">پاکردنەوە</button>
      </div>
    </div>`
  );
  document.body.insertAdjacentHTML('beforeend',
    FOOTER_HTML + '<div id="car-modal" style="display:none"></div>'
  );
  applyTheme();
  updateFavPill();
  updateCompareBar();
  observeReveal();
  initCounters();
  window.addEventListener('scroll', () => observeReveal(), { passive: true });
}
