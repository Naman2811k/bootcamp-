/* ═══════════════════════════════════════════════
   STRATOS — script.js
═══════════════════════════════════════════════ */

const API_KEY = 'd046ea81a8b4825fed7fd685dd9804f7';
const BASE    = 'https://api.openweathermap.org/data/2.5';

/* ── DOM ── */
const searchToggle  = document.getElementById('searchToggle');
const searchPanel   = document.getElementById('searchPanel');
const searchInput   = document.getElementById('searchInput');
const searchGo      = document.getElementById('searchGo');
const tickerText    = document.getElementById('tickerText');

const screenInit    = document.getElementById('screenInit');
const screenLoading = document.getElementById('screenLoading');
const screenError   = document.getElementById('screenError');
const weatherEl     = document.getElementById('weather');
const loadingText   = document.getElementById('loadingText');
const errorMsg      = document.getElementById('errorMsg');
const retryBtn      = document.getElementById('retryBtn');

const recentsBar    = document.getElementById('recentsBar');
const recentsList   = document.getElementById('recentsList');
const recentsClear  = document.getElementById('recentsClear');
const savedBar      = document.getElementById('savedBar');
const savedChips    = document.getElementById('savedChips');
const savedClear    = document.getElementById('savedClear');
const aqiPanel      = document.getElementById('aqiPanel');

/* ── Storage ── */
const SK_R = 'stratos_recent_v1', SK_S = 'stratos_saved_v1';
const MAX_R = 6, MAX_S = 8;
function loadJ(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function saveJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

let lastCity = 'Delhi';
let savedCache = {};

/* ── AQI info ── */
const AQI_INFO = [
  { label: 'Good',      color: '#00E676', pct: 12 },
  { label: 'Fair',      color: '#AEEA00', pct: 30 },
  { label: 'Moderate',  color: '#FFD600', pct: 52 },
  { label: 'Poor',      color: '#FF6D00', pct: 74 },
  { label: 'Very Poor', color: '#D50000', pct: 92 },
];

/* ── Condition palette → accent color ── */
const COND_COLORS = {
  clear:        '#FF6B00',
  clouds:       '#8899AA',
  rain:         '#3399FF',
  drizzle:      '#55AAFF',
  thunderstorm: '#CC44FF',
  snow:         '#99CCFF',
  mist:         '#778899',
  fog:          '#778899',
  haze:         '#DDAA44',
};
function condColor(cond) {
  const k = (cond || '').toLowerCase();
  for (const [key, val] of Object.entries(COND_COLORS)) {
    if (k.includes(key)) return val;
  }
  return '#FF6B00';
}

/* ── Screen manager ── */
function showScreen(id) {
  [screenInit, screenLoading, screenError, weatherEl].forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

/* ── Loading messages ── */
const LOAD_MSGS = ['LOCATING', 'FETCHING DATA', 'READING SKIES', 'CALIBRATING'];
let loadMsgTimer;
function startLoading() {
  showScreen('screenLoading');
  let i = 0;
  loadingText.textContent = LOAD_MSGS[0];
  loadMsgTimer = setInterval(() => {
    i = (i + 1) % LOAD_MSGS.length;
    loadingText.textContent = LOAD_MSGS[i];
  }, 800);
}
function stopLoading() { clearInterval(loadMsgTimer); }

/* ── Formatters ── */
function fmtTime(unix, tz) {
  const d = new Date((unix + tz) * 1000);
  return `${d.getUTCHours().toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}`;
}
function fmtDate(unix) {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
}
function fmtDay(unix) {
  return new Date(unix * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

/* ── Animated counter ── */
function animCount(target, el, duration = 600) {
  const start = target - 8;
  const steps = 30;
  let s = 0;
  el.textContent = start;
  const iv = setInterval(() => {
    s++;
    el.textContent = Math.round(start + (target - start) * (s / steps));
    if (s >= steps) { clearInterval(iv); el.textContent = target; }
  }, duration / steps);
}

/* ── Recent / Saved ── */
function getRecent() { return loadJ(SK_R, []); }
function getSaved()  { return loadJ(SK_S, []); }

function pushRecent(obj) {
  let r = getRecent().filter(x => x.name.toLowerCase() !== obj.name.toLowerCase());
  r.unshift(obj);
  saveJ(SK_R, r.slice(0, MAX_R));
}
function pushSaved(obj) {
  let s = getSaved().filter(x => x.name.toLowerCase() !== obj.name.toLowerCase());
  s.unshift(obj);
  saveJ(SK_S, s.slice(0, MAX_S));
}

function renderRecents() {
  const r = getRecent();
  if (!r.length) { recentsBar.style.display = 'none'; return; }
  recentsBar.style.display = 'flex';
  recentsList.innerHTML = '';
  r.forEach(item => {
    const chip = document.createElement('button');
    chip.className = 'recent-chip';
    chip.textContent = item.name;
    chip.addEventListener('click', () => {
      searchInput.value = item.name;
      closeSearch();
      fetchWeather(item.name);
    });
    recentsList.appendChild(chip);
  });
}

function renderSaved() {
  const saved = getSaved();
  if (!saved.length) { savedBar.style.display = 'none'; return; }
  savedBar.style.display = 'block';
  savedChips.innerHTML = '';
  saved.forEach(s => {
    const chip = document.createElement('div');
    const key  = s.name.toLowerCase();
    const info = savedCache[key];
    const isActive = lastCity.toLowerCase() === key;
    chip.className = 'saved-chip' + (isActive ? ' active' : '');
    chip.innerHTML = `
      ${info ? `<img class="chip-icon-img" src="https://openweathermap.org/img/wn/${info.icon}.png" alt=""/>` : ''}
      <span class="chip-city">${s.name}</span>
      ${info ? `<span class="chip-temp">${info.temp}°</span>` : ''}
    `;
    chip.addEventListener('click', () => fetchWeather(s.name));
    savedChips.appendChild(chip);
  });
}

async function refreshSaved() {
  const saved = getSaved();
  for (const s of saved) {
    try {
      const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(s.name)}&units=metric&appid=${API_KEY}`);
      if (res.ok) {
        const d = await res.json();
        savedCache[s.name.toLowerCase()] = {
          temp: Math.round(d.main.temp),
          icon: d.weather[0].icon,
        };
      }
    } catch {}
  }
  renderSaved();
}

/* ── Forecast grouping ── */
function groupForecast(list) {
  const days = {};
  list.forEach(item => {
    const d = new Date(item.dt * 1000);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!days[k]) days[k] = [];
    days[k].push(item);
  });
  return Object.values(days).slice(0, 5).map(di => {
    const noon = di.find(i => { const h = new Date(i.dt * 1000).getHours(); return h >= 11 && h <= 14; }) || di[0];
    return { ...noon, high: Math.max(...di.map(i => i.main.temp_max)), low: Math.min(...di.map(i => i.main.temp_min)) };
  });
}

function renderForecast(items) {
  const list = document.getElementById('forecastList');
  list.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'fc-row';
    card.innerHTML = `
      <div class="fc-day">${fmtDay(item.dt)}</div>
      <img class="fc-icon" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt=""/>
      <div class="fc-temp-hi">${Math.round(item.high)}°</div>
      <div class="fc-temp-lo">${Math.round(item.low)}°</div>
      <div class="fc-desc">${item.weather[0].description}</div>
    `;
    list.appendChild(card);
  });
}

/* ── Sun arc ── */
function updateSunArc(rise, set, tz) {
  const now  = Date.now() / 1000;
  const prog = Math.max(0, Math.min(1, (now + tz - (rise + tz)) / (set - rise)));
  const t = prog;
  const p0 = { x: 10, y: 62 }, p1 = { x: 90, y: 6 }, p2 = { x: 170, y: 62 };
  const x = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
  const y = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y;

  const dot  = document.getElementById('sunDot');
  const halo = document.getElementById('sunHalo');
  const arc  = document.getElementById('sunArcProgress');

  dot.setAttribute('cx', x.toFixed(1));
  dot.setAttribute('cy', y.toFixed(1));
  halo.setAttribute('cx', x.toFixed(1));
  halo.setAttribute('cy', y.toFixed(1));

  if (arc) {
    const offset = 200 * (1 - prog);
    arc.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => { arc.style.strokeDashoffset = offset; }, 300);
  }
}

/* ── AQI render ── */
function renderAQI(aqi) {
  const info = AQI_INFO[(aqi || 1) - 1] || AQI_INFO[0];
  document.getElementById('aqiLevel').textContent = info.label;
  const fill = document.getElementById('aqiFill');
  fill.style.background = info.color;
  aqiPanel.style.display = 'block';
  setTimeout(() => { fill.style.width = info.pct + '%'; }, 200);
}

/* ── Ticker update ── */
function setTicker(city, cond, temp) {
  const txt = `${city.toUpperCase()} &nbsp;·&nbsp; ${cond.toUpperCase()} &nbsp;·&nbsp; ${temp}°C &nbsp;·&nbsp; LIVE WEATHER DATA &nbsp;·&nbsp; STRATOS ATMOSPHERIC INTELLIGENCE`;
  document.getElementById('tickerText').innerHTML = txt + ' &nbsp;&nbsp;&nbsp; ' + txt;
}

/* ── Main fetch ── */
async function fetchWeather(city) {
  startLoading();
  closeSearch();

  try {
    const [curRes, fcRes] = await Promise.all([
      fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
      fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
    ]);

    if (!curRes.ok) {
      const e = await curRes.json();
      throw new Error(e.message || 'City not found');
    }

    const cur = await curRes.json();
    const fc  = await fcRes.json();

    let aqiData = null;
    try {
      const ar = await fetch(`${BASE}/air_pollution?lat=${cur.coord.lat}&lon=${cur.coord.lon}&appid=${API_KEY}`);
      if (ar.ok) aqiData = await ar.json();
    } catch {}

    stopLoading();
    renderWeather(cur, fc.list, aqiData);

    const obj = { name: cur.name, country: cur.sys.country };
    pushRecent(obj);
    pushSaved(obj);
    savedCache[cur.name.toLowerCase()] = {
      temp: Math.round(cur.main.temp),
      icon: cur.weather[0].icon,
    };
    lastCity = cur.name;
    renderRecents();
    renderSaved();

  } catch (err) {
    stopLoading();
    errorMsg.textContent = err.message || 'Something went wrong.';
    showScreen('screenError');
  }
}

/* ── Render ── */
function renderWeather(data, fcList, aqiData) {
  const cond  = data.weather[0].main;
  const color = condColor(cond);

  // Accent color
  document.documentElement.style.setProperty('--amber', color);
  document.documentElement.style.setProperty('--amber-dim', color + '18');
  document.documentElement.style.setProperty('--amber-glow', color + '33');

  // Hero
  document.getElementById('cityName').textContent    = data.name;
  document.getElementById('countryCode').textContent = data.sys.country;
  document.getElementById('dateStr').textContent     = fmtDate(data.dt);
  document.getElementById('conditionText').textContent = data.weather[0].description;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('tempMax').textContent = Math.round(data.main.temp_max) + '°';
  document.getElementById('tempMin').textContent = Math.round(data.main.temp_min) + '°';

  const tempNumEl = document.getElementById('tempNum');
  animCount(Math.round(data.main.temp), tempNumEl);

  // Tape stats
  document.getElementById('humidity').textContent  = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${(data.wind.speed * 3.6).toFixed(0)}km/h`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)}km`;
  document.getElementById('pressure').textContent  = `${data.main.pressure}hPa`;
  document.getElementById('uvIndex').textContent   = data.uvi != null ? data.uvi.toFixed(0) : '—';

  // Sun
  const tz = data.timezone;
  document.getElementById('sunrise').textContent = fmtTime(data.sys.sunrise, tz);
  document.getElementById('sunset').textContent  = fmtTime(data.sys.sunset, tz);
  updateSunArc(data.sys.sunrise, data.sys.sunset, tz);

  // AQI
  if (aqiData?.list?.[0]) {
    renderAQI(aqiData.list[0].main.aqi);
  } else {
    aqiPanel.style.display = 'none';
  }

  // Forecast
  renderForecast(groupForecast(fcList));

  // Ticker
  setTicker(data.name, data.weather[0].description, Math.round(data.main.temp));

  showScreen('weather');
}

/* ── Search toggle ── */
function closeSearch() {
  searchPanel.classList.remove('open');
}
searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) {
    setTimeout(() => searchInput.focus(), 50);
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-container')) closeSearch();
});

searchGo.addEventListener('click', () => {
  const c = searchInput.value.trim();
  if (c) fetchWeather(c);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const c = searchInput.value.trim();
    if (c) fetchWeather(c);
  }
  if (e.key === 'Escape') closeSearch();
});

/* ── Other events ── */
retryBtn.addEventListener('click', () => fetchWeather(lastCity));
recentsClear.addEventListener('click', () => {
  saveJ(SK_R, []);
  renderRecents();
});
savedClear.addEventListener('click', () => {
  saveJ(SK_S, []);
  savedCache = {};
  renderSaved();
});

/* ── Init ── */
(async () => {
  renderRecents();
  renderSaved();
  await fetchWeather('Delhi');
  refreshSaved();
})();