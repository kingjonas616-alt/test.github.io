/* ═══════════════════════════════════════
   پیشانگای یونس — Main Application JS
   ═══════════════════════════════════════ */

/* ─── STATE ─── */
let favorites   = JSON.parse(localStorage.getItem('fav') || '[]');
let compareList = JSON.parse(localStorage.getItem('cmp') || '[]');
let currentView = 'grid';
let currentPage = 'home';

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

function saveFav() { localStorage.setItem('fav', JSON.stringify(favorites)); updateFavPill(); }
function saveCmp() { localStorage.setItem('cmp', JSON.stringify(compareList)); updateCompareBar(); }

function isFav(id) { return favorites.includes(id); }
function isCmp(id) { return compareList.includes(id); }

function updateFavPill() {
  const pill = document.getElementById('fav-pill');
  pill.textContent = favorites.length;
  pill.classList.toggle('show', favorites.length > 0);
}

/* ─── FAVORITES ─── */
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
  if (currentPage === 'favorites') renderFavorites();
}

/* ─── COMPARE ─── */
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
  if (currentPage === 'compare') renderCompare();
}

function clearCompare() {
  compareList = [];
  saveCmp();
  if (currentPage === 'compare') renderCompare();
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  bar.classList.toggle('show', compareList.length > 0);
  document.getElementById('compare-bar-items').innerHTML = compareList.map(id => {
    const c = CARS.find(x => x.id === id);
    return c ? `<span class="compare-chip">${c.make} ${c.model}</span>` : '';
  }).join('');
}

/* ─── NAVIGATION ─── */
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  document.querySelectorAll('.mobile-link').forEach(l => l.classList.toggle('active', l.dataset.mpage === page));
  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'cars')      initCarsPage();
  if (page === 'favorites') renderFavorites();
  if (page === 'compare')   renderCompare();
  if (page === 'home')      initCounters();

  observeReveal();
}

function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('open'); }
function closeMobileMenu()   { document.getElementById('mobile-menu').classList.remove('open'); }

/* ─── THEME ─── */
let darkMode = true;
function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('light', !darkMode);
  document.getElementById('theme-btn').textContent = darkMode ? '🌙' : '☀️';
}

/* ─── CAR CARD HTML ─── */
function carCardHTML(car) {
  const fav = isFav(car.id);
  const cmp = isCmp(car.id);
  return `
    <div class="car-card" onclick="openModal(${car.id})">
      <div class="car-img-wrap">
        <img src="${CAR_IMG}" alt="${car.make} ${car.model}" loading="lazy"/>
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
        <img src="${CAR_IMG}" alt="${car.make}" loading="lazy"/>
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

/* ─── MODAL ─── */
function openModal(id) {
  const car = CARS.find(c => c.id === id);
  if (!car) return;
  const fav = isFav(id);
  const cmp = isCmp(id);
  document.getElementById('car-modal').innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(event)">
      <div class="modal-box">
        <button class="modal-close-btn" onclick="document.getElementById('car-modal').style.display='none'">✕</button>
        <img class="modal-img" src="${CAR_IMG}" alt="${car.make}"/>
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

/* ─── HOME ─── */
function initHome() {
  const featured = CARS.filter(c => c.featured).slice(0, 3);
  document.getElementById('home-featured').innerHTML = featured.map(c => carCardHTML(c)).join('');

  // Testimonials
  document.getElementById('testimonials-grid').innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card reveal">
      <div class="testi-stars">${'★'.repeat(t.stars)}</div>
      <p class="testi-text">${t.text}</p>
      <div class="testi-author">
        <div class="testi-avatar">${t.avatar}</div>
        <div><div class="testi-name">${t.name}</div><div class="testi-loc">${t.city}</div></div>
      </div>
    </div>`).join('');
}

/* ─── CARS PAGE ─── */
function initCarsPage() {
  const makes = [...new Set(CARS.map(c => c.make))];
  document.getElementById('make-filters').innerHTML =
    `<label class="radio-option"><input type="radio" name="make" value="" checked onchange="applyFilters()"><span>هەموو</span></label>` +
    makes.map(m => `<label class="radio-option"><input type="radio" name="make" value="${m}" onchange="applyFilters()"><span>${m}</span></label>`).join('');
  applyFilters();
}

function applyFilters() {
  const search   = (document.getElementById('cars-search')?.value || '').toLowerCase();
  const cond     = document.querySelector('input[name="cond"]:checked')?.value || '';
  const make     = document.querySelector('input[name="make"]:checked')?.value || '';
  const pMin     = parseFloat(document.getElementById('price-min')?.value) || 0;
  const pMax     = parseFloat(document.getElementById('price-max')?.value) || Infinity;
  const yMin     = parseInt(document.getElementById('year-min')?.value)   || 0;
  const yMax     = parseInt(document.getElementById('year-max')?.value)   || 9999;
  const sort     = document.getElementById('cars-sort')?.value || '';

  let list = CARS.filter(c =>
    (!search || c.make.includes(search) || c.model.includes(search) || c.desc.includes(search)) &&
    (!cond || c.condition === cond) &&
    (!make || c.make === make) &&
    c.price >= pMin && c.price <= pMax &&
    c.year >= yMin  && c.year  <= yMax
  );

  if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'year-desc')  list.sort((a, b) => b.year  - a.year);
  if (sort === 'year-asc')   list.sort((a, b) => a.year  - b.year);

  const out   = document.getElementById('cars-output');
  const count = document.getElementById('results-count');
  if (count) count.textContent = `${list.length} ئوتومبێل دۆزرایەوە`;

  if (!list.length) {
    out.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:var(--text2)">
        <div style="font-size:3rem;margin-bottom:16px">🔍</div>
        <h3 style="font-size:1.2rem;margin-bottom:8px">هیچ ئوتومبێلێک نەدۆزرایەوە</h3>
        <p style="font-size:.88rem">هەوڵبدە فلتەرەکانت بگۆڕیت</p>
      </div>`;
    return;
  }

  if (currentView === 'grid') {
    out.className = 'cars-grid';
    out.innerHTML = list.map(c => carCardHTML(c)).join('');
  } else {
    out.className = 'cars-list';
    out.innerHTML = list.map(c => carListHTML(c)).join('');
  }
}

function resetFilters() {
  const allCond = document.querySelectorAll('input[name="cond"]');
  const allMake = document.querySelectorAll('input[name="make"]');
  if (allCond[0]) allCond[0].checked = true;
  if (allMake[0]) allMake[0].checked = true;
  ['price-min','price-max','year-min','year-max'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const s  = document.getElementById('cars-search'); if (s)  s.value  = '';
  const so = document.getElementById('cars-sort');   if (so) so.value = '';
  applyFilters();
}

function setView(v) {
  currentView = v;
  document.getElementById('grid-btn').classList.toggle('active', v === 'grid');
  document.getElementById('list-btn').classList.toggle('active', v === 'list');
  applyFilters();
}

/* ─── SELL FORM ─── */
function sellNext(step) {
  if (step === 1) {
    if (!document.getElementById('s-name').value.trim() || !document.getElementById('s-phone').value.trim()) {
      toast('تکایە زانیاری کەسی پڕبکەرەوە', 'error'); return;
    }
  }
  if (step === 2) {
    if (!document.getElementById('s-make').value.trim() || !document.getElementById('s-model').value.trim() || !document.getElementById('s-year').value) {
      toast('تکایە زانیاری ئوتومبێل پڕبکەرەوە', 'error'); return;
    }
  }
  document.getElementById(`sell-step-${step}`).classList.remove('active');
  document.getElementById(`sell-step-${step + 1}`).classList.add('active');
  document.getElementById(`step-tab-${step}`).classList.remove('active');
  document.getElementById(`step-tab-${step}`).classList.add('done');
  document.getElementById(`step-tab-${step + 1}`).classList.add('active');
}

function sellPrev(step) {
  document.getElementById(`sell-step-${step}`).classList.remove('active');
  document.getElementById(`sell-step-${step - 1}`).classList.add('active');
  document.getElementById(`step-tab-${step}`).classList.remove('active');
  document.getElementById(`step-tab-${step - 1}`).classList.remove('done');
  document.getElementById(`step-tab-${step - 1}`).classList.add('active');
}

function sellSubmit() {
  if (!document.getElementById('s-price').value || !document.getElementById('s-desc').value.trim()) {
    toast('تکایە وەصف و نرخ پڕبکەرەوە', 'error'); return;
  }
  document.getElementById('sell-form-card').style.display = 'none';
  document.getElementById('sell-success-view').style.display = 'block';
  document.querySelectorAll('.steps .step').forEach(s => { s.classList.remove('active'); s.classList.add('done'); });
  toast('داواکارییەکەت ناردرا! ✅');
}

/* ─── CONTACT ─── */
function submitContact() {
  const name = document.getElementById('c-name').value;
  const msg  = document.getElementById('c-msg').value;
  if (!name || !msg) { toast('تکایە ناو و پەیام پڕبکەرەوە', 'error'); return; }
  toast('پەیامەکەت ناردرا، سوپاس! ✅');
  ['c-name','c-phone','c-subject','c-msg'].forEach(id => document.getElementById(id).value = '');
}

/* ─── FAVORITES PAGE ─── */
function renderFavorites() {
  const out      = document.getElementById('fav-output');
  const favCars  = CARS.filter(c => favorites.includes(c.id));
  if (!favCars.length) {
    out.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🤍</div>
        <h3>هیچ ئوتومبێلێکت زیاد نەکردووە</h3>
        <p>لەسەر کارتی ئوتومبێل دوگمەی دڵ کلیک بکە بۆ زیادکردن</p>
        <button class="btn btn-gold" onclick="nav('cars')">گەڕان لە ئوتومبێلەکان</button>
      </div>`;
    return;
  }
  out.innerHTML = `<div class="cars-grid">${favCars.map(c => carCardHTML(c)).join('')}</div>`;
}

/* ─── COMPARE PAGE ─── */
function renderCompare() {
  const slots = document.getElementById('compare-slots');
  const html  = [];
  for (let i = 0; i < 3; i++) {
    const id = compareList[i];
    if (id) {
      const car = CARS.find(c => c.id === id);
      html.push(`
        <div class="compare-slot filled">
          <button class="slot-remove" onclick="toggleCompare(${id})">✕</button>
          <img class="slot-car-img" src="${CAR_IMG}" alt="${car.make}"/>
          <div class="slot-car-name">${car.make} ${car.model}</div>
          <div class="slot-car-price">${fmt(car.price)}</div>
          <span class="tag ${car.condition === 'new' ? 'tag-new' : 'tag-used'}" style="font-size:.72rem">
            ${car.condition === 'new' ? 'نوێ' : 'بەکارهێنراو'}
          </span>
        </div>`);
    } else {
      html.push(`
        <div class="compare-slot">
          <div class="slot-empty">
            <div class="plus">+</div>
            <div>ئوتومبێل زیاد بکە</div>
            <div style="font-size:.75rem;margin-top:4px;color:var(--text3)">لەسەر کارتی ئوتومبێل ⚖️ کلیک بکە</div>
          </div>
        </div>`);
    }
  }
  slots.innerHTML = html.join('');

  const tw = document.getElementById('compare-table-wrap');
  if (compareList.length < 2) {
    tw.innerHTML = '<p style="text-align:center;color:var(--text3);padding:20px;font-size:.88rem">دوو ئوتومبێل یان زیاتر زیاد بکە بۆ بەراوردکردن</p>';
    return;
  }

  const cars = compareList.map(id => CARS.find(c => c.id === id));
  const rows = [
    ['نرخ',       ...cars.map(c => fmt(c.price))],
    ['ساڵ',       ...cars.map(c => String(c.year))],
    ['کیلۆمەتر', ...cars.map(c => c.mileage.toLocaleString() + ' km')],
    ['دۆخ',       ...cars.map(c => c.condition === 'new' ? 'نوێ' : 'بەکارهێنراو')],
    ['سووتمەنی', ...cars.map(c => c.fuel)],
    ['گیربۆکس',  ...cars.map(c => c.trans)],
    ['ڕەنگ',      ...cars.map(c => c.color)],
  ];

  const emptyTh = Array(3 - compareList.length).fill('<th></th>').join('');
  const emptyTd = Array(3 - compareList.length).fill('<td></td>').join('');

  tw.innerHTML = `
    <div class="compare-table">
      <table>
        <thead>
          <tr>
            <th style="text-align:right">تایبەتمەندی</th>
            ${cars.map(c => `<th>${c.make} ${c.model}</th>`).join('')}${emptyTh}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r[0]}</td>
              ${r.slice(1).map((v, i) => `<td class="${i === 0 ? 'highlight' : ''}">${v}</td>`).join('')}
              ${emptyTd}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ─── ANIMATED COUNTERS ─── */
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target);
    let val = 0;
    const dur = 1800;
    const step = target / dur * 16;
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

/* ─── INIT ─── */
updateFavPill();
updateCompareBar();
initHome();
initCounters();
observeReveal();

window.addEventListener('scroll', () => observeReveal(), { passive: true });
