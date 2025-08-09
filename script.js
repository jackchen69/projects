async function loadConfig(){
  const res = await fetch('config.json'); const cfg = await res.json();
  document.getElementById('site-title').textContent = cfg.meta.title;
  document.getElementById('brand-text').textContent = cfg.nav.brand;
  document.getElementById('hero-title').textContent = cfg.hero.title;
  document.getElementById('hero-subtitle').textContent = cfg.hero.subtitle;
  document.getElementById('venue-pill').textContent = cfg.hero.venue_pill;
  document.getElementById('btn-register').href = cfg.links.register || '#';

  // Dates
  const grid = document.getElementById('dates-grid'); grid.innerHTML='';
  (cfg.dates||[]).forEach(d=>{
    const el=document.createElement('div');
    el.className='date-card';
    el.innerHTML=`<div class="label">${d.label}</div><div class="value">${d.value}</div>`;
    grid.appendChild(el);
  });

  // Countdown
  const countdown=document.getElementById('countdown');
  const target=new Date(cfg.event_start);
  function tick(){
    const now=new Date(); const diff=target-now;
    if(diff<=0){ countdown.textContent='The workshop is live!'; return; }
    const d=Math.floor(diff/86400000);
    const h=Math.floor(diff/3600000)%24;
    const m=Math.floor(diff/60000)%60;
    const s=Math.floor(diff/1000)%60;
    countdown.textContent=`Starts in ${d}d ${h}h ${m}m ${s}s`;
  } tick(); setInterval(tick,1000);

  // Program
  const table=document.getElementById('program-table'); table.innerHTML='';
  (cfg.program||[]).forEach(row=>{
    const wrap=document.createElement('div'); wrap.className='program-row';
    wrap.innerHTML=`<div class="program-time">${row.time}</div>
    <div class="program-item">
      <div class="title">${row.title}</div>
      ${row.speaker?`<div class="speaker">${row.speaker}</div>`:''}
    </div>`;
    table.appendChild(wrap);
  });

  // People
  function fillPeople(id, list){
    const grid=document.getElementById(id); grid.innerHTML='';
    (list||[]).forEach(p=>{
      const card=document.createElement('div'); card.className='person';
      card.innerHTML=`<img src="${p.photo}" alt="${p.name}">
      <div class="name">${p.name}</div><div class="affil">${p.affiliation}</div>`;
      grid.appendChild(card);
    });
  }
  fillPeople('speakers-grid', cfg.speakers);
  fillPeople('organizers-grid', cfg.organizers);

  // Sponsors
  const spn=document.getElementById('sponsors-grid'); spn.innerHTML='';
  (cfg.sponsors||[]).forEach(s=>{ const img=document.createElement('img'); img.src=s.logo; img.alt=s.name; spn.appendChild(img); });

  // Contact
  const email=document.getElementById('contact-email');
  email.textContent = cfg.contact.email; email.href = `mailto:${cfg.contact.email}`;

  document.getElementById('year').textContent = new Date().getFullYear();
}
loadConfig();
