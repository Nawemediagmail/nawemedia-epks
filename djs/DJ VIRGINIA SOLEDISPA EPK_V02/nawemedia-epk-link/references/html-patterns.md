# HTML Patterns — EPK Link

Snippets reutilizables para construir el EPK. Adapta colores, nombres y datos
al artista específico.

---

## CSS — Design System Completo

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:      #070707;
  --bg2:     #0e0e0e;
  --bg3:     #161616;
  --text:    #ffffff;
  --text2:   #888888;
  --text3:   #444444;
  --accent:  #E8177A;          /* ← cambiar por color del artista */
  --accent2: rgba(232,23,122,0.12);
  --border:  rgba(255,255,255,0.06);
  --borderp: rgba(232,23,122,0.18);
  --font:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --nav-h:   64px;
}
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 16px; line-height: 1.6; overflow-x: hidden; }
```

---

## Nav CSS + HTML

```css
nav {
  position: fixed; top: 0; left: 0; right: 0; height: var(--nav-h); z-index: 100;
  display: flex; align-items: center; justify-content: space-between; padding: 0 48px;
  background: rgba(7,7,7,0.94); backdrop-filter: blur(20px);
  border-bottom: 1px solid transparent; transition: border-color 0.3s;
}
nav.scrolled { border-color: var(--border); }
.nav-logo img { height: 22px; filter: invert(1); opacity: 0.9; }
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text3); text-decoration: none; transition: color 0.2s; }
.nav-links a:hover { color: var(--text); }
.nav-cta { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 9px 22px; border: 1px solid var(--borderp); background: var(--accent2); color: var(--accent); text-decoration: none; transition: all 0.2s; }
.nav-cta:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; }
.hamburger span { display: block; width: 22px; height: 1.5px; background: var(--text); }
@media (max-width: 900px) { nav { padding: 0 24px; } .nav-links, .nav-cta { display: none; } .hamburger { display: flex; } }
.mobile-menu { display: none; position: fixed; top: var(--nav-h); left: 0; right: 0; bottom: 0; background: var(--bg); z-index: 99; flex-direction: column; align-items: center; justify-content: center; gap: 44px; }
.mobile-menu.open { display: flex; }
.mobile-menu a { font-size: 26px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text); text-decoration: none; }
```

```html
<nav id="main-nav">
  <a class="nav-logo" href="#"><img src="assets/logo-black.png" alt="Artist Name"></a>
  <ul class="nav-links">
    <li><a href="#bio">Bio</a></li>
    <li><a href="#shows">Shows</a></li>
    <li><a href="#gallery">Galería</a></li>
    <li><a href="#music">Música</a></li>
    <li><a href="#presskit">Press Kit</a></li>
  </ul>
  <a class="nav-cta" id="nav-cta" href="#">Booking</a>
  <div class="hamburger" id="hmb" onclick="toggleMobileMenu()">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mobile-menu" id="mmenu">
  <a href="#bio" onclick="closeMobileMenu()">Bio</a>
  <a href="#shows" onclick="closeMobileMenu()">Shows</a>
  <a href="#gallery" onclick="closeMobileMenu()">Galería</a>
  <a href="#music" onclick="closeMobileMenu()">Música</a>
  <a href="#presskit" onclick="closeMobileMenu()">Press Kit</a>
</div>
```

---

## Hero CSS + HTML

```css
.hero { position: relative; height: 100vh; min-height: 680px; display: flex; align-items: flex-end; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center top; background-color: #111; transform: scale(1.04); transition: transform 10s ease-out; }
.hero-bg.loaded { transform: scale(1); }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(7,7,7,0.1) 0%, rgba(7,7,7,0.05) 30%, rgba(7,7,7,0.55) 65%, rgba(7,7,7,0.96) 100%); }
.hero-content { position: relative; z-index: 1; padding: 0 48px 72px; width: 100%; max-width: 1280px; margin: 0 auto; }
.hero-tags { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.hero-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 5px 14px; border: 1px solid var(--borderp); color: var(--accent); background: var(--accent2); }
.hero-name { font-size: clamp(52px, 9.5vw, 120px); font-weight: 900; line-height: 0.88; letter-spacing: -0.03em; text-transform: uppercase; margin-bottom: 22px; }
.hero-name span { color: var(--accent); }
.hero-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.48); max-width: 500px; margin-bottom: 44px; line-height: 1.8; }
.hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-accent { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: opacity 0.2s; }
.btn-accent:hover { opacity: 0.86; }
.btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 36px; border: 1px solid rgba(255,255,255,0.18); color: var(--text); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: all 0.2s; }
.btn-ghost:hover { background: rgba(255,255,255,0.06); }
@media (max-width: 768px) { .hero-content { padding: 0 24px 56px; } }
```

```html
<div class="hero">
  <div class="hero-bg" id="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-tags" id="hero-tags"></div>
    <h1 class="hero-name" id="hero-name"></h1>
    <p class="hero-sub" id="hero-sub"></p>
    <div class="hero-btns">
      <a class="btn-accent" id="hero-booking" href="#">✉ Booking</a>
      <a class="btn-ghost" href="#music">▶ Escuchar</a>
    </div>
  </div>
</div>
```

---

## Render Functions — JS

```javascript
let EPK = JSON.parse(document.getElementById('epk-data').textContent);

function render() {
  const D = EPK;
  document.title = 'DJ ' + D.artist.name + ' — EPK';

  // Nav + hero
  document.getElementById('nav-cta').href = 'mailto:' + D.artist.contact;
  const bg = document.getElementById('hero-bg');
  if (D.artist.photo) { bg.style.backgroundImage = `url(${D.artist.photo})`; setTimeout(() => bg.classList.add('loaded'), 80); }
  document.getElementById('hero-tags').innerHTML = D.artist.genre.map(g => `<span class="hero-tag">${g}</span>`).join('');
  document.getElementById('hero-name').textContent = D.artist.name;
  document.getElementById('hero-sub').textContent = (D.artist.bio[0] || '').substring(0, 140) + '…';
  document.getElementById('hero-booking').href = 'mailto:' + D.artist.contact;

  // Bio
  document.getElementById('bio-text').innerHTML = D.artist.bio.map(p => `<p>${p}</p>`).join('');
  const socials = [
    { k: 'instagram', l: 'Instagram' }, { k: 'soundcloud', l: 'SoundCloud' },
    { k: 'spotify', l: 'Spotify' }, { k: 'facebook', l: 'Facebook' },
  ];
  document.getElementById('bio-social').innerHTML = socials
    .filter(s => D.artist.social[s.k])
    .map(s => `<a class="social-lnk" href="${D.artist.social[s.k]}" target="_blank" rel="noopener">↗ ${s.l}</a>`)
    .join('');

  // Shows, Gallery, Music, PK...
  renderShows(); renderGallery(currentFilter);
  document.getElementById('music-list').innerHTML = D.music.map(m => `
    <div class="music-card">
      <div class="music-head">
        <div class="music-title">${m.title}</div>
        <span class="music-badge">${m.type === 'set' ? 'Set' : 'Release'}</span>
      </div>
      <iframe scrolling="no" src="${m.embedUrl}" allow="autoplay" style="width:100%;height:166px;border:none;display:block;"></iframe>
    </div>`).join('');
  document.getElementById('pk-desc').textContent = D.presskit.description;
  document.getElementById('pk-items').innerHTML = D.presskit.items.map(item => `
    <div class="pk-item">
      <div class="pk-item-left">
        <div class="pk-icon">${item.icon || '◻'}</div>
        <div><div class="pk-name">${item.name}</div><div class="pk-sub">${item.format}${item.size && item.size !== '—' ? ' · ' + item.size : ''}</div></div>
      </div>
      <a class="pk-dl-btn" href="${item.url}" target="_blank">↓ Descargar</a>
    </div>`).join('');
  document.getElementById('footer-email').textContent = D.artist.contact;
  document.getElementById('footer-email').href = 'mailto:' + D.artist.contact;
  document.getElementById('footer-copy').textContent = `© ${new Date().getFullYear()} DJ ${D.artist.name}. Todos los derechos reservados.`;
}

function renderShows() {
  const today = new Date().toISOString().split('T')[0];
  const list = document.getElementById('shows-list');
  const upcoming = EPK.shows.filter(s => s.date >= today).sort((a,b) => a.date.localeCompare(b.date));
  if (!upcoming.length) { list.innerHTML = '<div class="no-shows">Próximas fechas próximamente — síguenos en redes.</div>'; return; }
  list.innerHTML = upcoming.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    const dateStr = d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const dayStr  = d.toLocaleDateString('es-CL', { weekday: 'long' });
    const isSO = s.status === 'sold-out', isC = s.status === 'cancelled';
    const btn = isC ? `<span class="ticket-cancelled">Cancelado</span>`
      : `<a class="ticket-btn ${isSO ? 'sold-out' : ''}" href="${s.ticketUrl||'#'}" target="_blank">${isSO ? 'Sold Out' : '→ Tickets'}</a>`;
    return `<div class="show-item">
      <div><div class="show-date">${dateStr}</div><div class="show-date-day">${dayStr.charAt(0).toUpperCase()+dayStr.slice(1)}</div></div>
      <div><div class="show-venue">${s.venue}</div><div class="show-city">${s.city}, ${s.country}</div></div>
      <div class="show-type">${s.type}</div>${btn}
    </div>`;
  }).join('');
}

let currentFilter = 'all', lbItems = [], lbIdx = 0;
function renderGallery(filter) {
  currentFilter = filter;
  lbItems = filter === 'all' ? EPK.gallery : EPK.gallery.filter(g => g.category === filter);
  document.getElementById('gallery-grid').innerHTML = lbItems.map((g, i) =>
    `<div class="gallery-item ${g.featured && filter==='all' ? 'feat' : ''}" onclick="openLB(${i})">
      <img src="${g.url}" alt="${g.caption}" loading="lazy">
      <div class="gallery-hover">↗</div>
    </div>`).join('');
}
function filterGal(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); renderGallery(cat);
}
function openLB(i) { lbIdx=i; updateLB(); document.getElementById('lightbox').classList.add('open'); document.body.style.overflow='hidden'; }
function closeLB() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
function updateLB() { const item=lbItems[lbIdx]; if(!item)return; document.getElementById('lb-img').src=item.url; document.getElementById('lb-cap').textContent=item.caption; }
function navLB(dir) { lbIdx=(lbIdx+dir+lbItems.length)%lbItems.length; updateLB(); }
document.getElementById('lightbox').addEventListener('click', function(e){ if(e.target===this)closeLB(); });
document.addEventListener('keydown', e => {
  if(!document.getElementById('lightbox').classList.contains('open'))return;
  if(e.key==='Escape')closeLB(); if(e.key==='ArrowLeft')navLB(-1); if(e.key==='ArrowRight')navLB(1);
});
```

---

## Nav Scroll + Mobile JS

```javascript
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
function toggleMobileMenu() { document.getElementById('mmenu').classList.toggle('open'); }
function closeMobileMenu() { document.getElementById('mmenu').classList.remove('open'); }
```

---

## Fade-in (IntersectionObserver)

```javascript
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade').forEach(el => io.observe(el));
```

CSS:
```css
.fade { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade.vis { opacity: 1; transform: translateY(0); }
```

---

## Export HTML Function

```javascript
function exportHTML() {
  document.getElementById('epk-data').textContent = JSON.stringify(EPK, null, 2);
  const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'index.html';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('✓ index.html exportado — sube a GitHub para publicar');
}
```

---

## Toast Notification

```javascript
let tTimer;
function toast(msg, dur=3200) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(tTimer);
  tTimer = setTimeout(() => el.classList.remove('show'), dur);
}
```

CSS:
```css
.toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--accent); color: #fff; padding: 11px 24px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; z-index: 500; pointer-events: none; transition: transform 0.28s ease; }
.toast.show { transform: translateX(-50%) translateY(0); }
```

---

## Admin Panel — Auth + Tabs JS

```javascript
function openAdmin() { document.getElementById('adm-overlay').classList.add('open'); document.body.style.overflow='hidden'; document.getElementById('pwd-in').value=''; document.getElementById('pwd-err').style.display='none'; }
function closeAdmin() { document.getElementById('adm-overlay').classList.remove('open'); document.body.style.overflow=''; }
function checkPwd() {
  if(document.getElementById('pwd-in').value === EPK.admin.password) {
    document.getElementById('adm-pwd').style.display='none';
    document.getElementById('adm-dash').style.display='flex';
    loadAdminData();
  } else {
    document.getElementById('pwd-err').style.display='block';
    document.getElementById('pwd-in').value=''; document.getElementById('pwd-in').focus();
  }
}
function tab(name, btn) {
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-sec').forEach(s=>s.classList.remove('active'));
  btn.classList.add('active'); document.getElementById('tab-'+name).classList.add('active');
}
```

---

## Sections Layout CSS (util)

```css
.sw { padding: 104px 48px; max-width: 1280px; margin: 0 auto; }
.divider { height: 1px; background: var(--border); }
.s-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); opacity: 0.7; margin-bottom: 14px; }
.s-title { font-size: clamp(30px, 4.5vw, 54px); font-weight: 900; letter-spacing: -0.025em; text-transform: uppercase; line-height: 0.9; margin-bottom: 60px; }
@media (max-width: 768px) { .sw { padding: 68px 24px; } }
::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: var(--bg3); }
```
