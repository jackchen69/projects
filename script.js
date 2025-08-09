// Populate content from config.json and add small interactions
async function loadConfig() {
  try {
    const res = await fetch('config.json');
    const cfg = await res.json();

    document.getElementById('site-title').textContent = cfg.meta.title;
    document.getElementById('brand-text').textContent = cfg.nav.brand;
    document.getElementById('hero-title').textContent = cfg.hero.title;
    document.getElementById('hero-subtitle').textContent = cfg.hero.subtitle;
    document.getElementById('venue-pill').textContent = cfg.hero.venue_pill;
    document.getElementById('btn-register').href = cfg.links.register || '#';

    // Dates
    const grid = document.getElementById('dates-grid');
    grid.innerHTML = '';
    (cfg.dates || []).forEach(d => {
      const el = document.createElement('div');
      el.className = 'date-card';
      el.innerHTML = `<div class="label">${d.label}</div><div class="value">${d.value}</div>`;
      grid.appendChild(el);
    });

    // Countdown to event_start
    const countdown = document.getElementById('countdown');
    const target = new Date(cfg.event_start);
    function tick() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) { countdown.textContent = 'The workshop is live!'; return; }
      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor(diff / (1000*60*60)) % 24;
      const m = Math.floor(diff / (1000*60)) % 60;
      const s = Math.floor(diff / 1000) % 60;
      countdown.textContent = `Starts in ${d}d ${h}h ${m}m ${s}s`;
    }
    tick(); setInterval(tick, 1000);

    // Program
    const programTable = document.getElementById('program-table');
    programTable.innerHTML = '';
    (cfg.program || []).forEach(row => {
      const wrap = document.createElement('div');
      wrap.className = 'program-row';
      wrap.innerHTML = `<div class="program-time">${row.time}</div>
        <div class="program-item">
          <div class="title">${row.title}</div>
          ${row.speaker ? `<div class="speaker">${row.speaker}</div>` : ''}
        </div>`;
      programTable.appendChild(wrap);
    });

    // Speakers
    const sp = document.getElementById('speakers-grid'); sp.innerHTML = '';
    (cfg.speakers || []).forEach(p => {
      const card = document.createElement('div');
      card.className = 'person';
      card.innerHTML = `<img src="${p.photo}" alt="${p.name}">
        <div class="name">${p.name}</div>
        <div class="affil">${p.affiliation}</div>`;
      sp.appendChild(card);
    });

    // Organizers
    const org = document.getElementById('organizers-grid'); org.innerHTML = '';
    (cfg.organizers || []).forEach(p => {
      const card = document.createElement('div');
      card.className = 'person';
      card.innerHTML = `<img src="${p.photo}" alt="${p.name}">
        <div class="name">${p.name}</div>
        <div class="affil">${p.affiliation}</div>`;
      org.appendChild(card);
    });

    // Sponsors
    const spn = document.getElementById('sponsors-grid'); spn.innerHTML = '';
    (cfg.sponsors || []).forEach(s => {
      const logo = document.createElement('img');
      logo.src = s.logo; logo.alt = s.name;
      spn.appendChild(logo);
    });

    // Submission links
    if (cfg.links.openreview) document.getElementById('openreview-link').href = cfg.links.openreview;
    if (cfg.links.cmt) document.getElementById('cmt-link').href = cfg.links.cmt;

    // Contact
    const email = document.getElementById('contact-email');
    email.textContent = cfg.contact.email;
    email.href = `mailto:${cfg.contact.email}`;

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (e) {
    console.error('Failed to load config:', e);
  }
}

document.getElementById('toggleDark').addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

loadConfig();
