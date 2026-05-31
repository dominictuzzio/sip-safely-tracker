// Smarter Sipping — shared client logic (vanilla JS)

/* ---------- Nav active state ---------- */
(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });
})();

/* ---------- Rotating fact (home) ---------- */
const FACTS = [
  {
    header: 'The liver clears about <span class="primary-text">one standard drink</span> per hour.',
    sub: "Drinking faster than that means alcohol builds up in your blood — that's how a fun night turns risky.",
  },
  {
    header: 'Over the 10 years from 2015–2024, more than <span class="primary-text">11,500 people</span> died every year in drunk-driving crashes.',
    sub: "In every state, it's illegal to drive drunk, yet one person was killed in a drunk-driving crash every 44 minutes in the United States in 2024.",
  },
  {
    header: '<span class="primary-text">804,926 Americans</span> were arrested for suspected DUI in 2024 — about 11% of all arrests nationwide.',
    sub: "",
  },
  {
    header: 'Drunk driving crashes drain <span class="primary-text">$58 billion</span> from the U.S. economy annually.',
    sub: "One DUI can cost a single offender as much as $30,000 in legal fees and penalties.",
  },
];
(function () {
  const root = document.getElementById("rotating-fact");
  if (!root) return;
  let i = 0;
  const headerEl = root.querySelector(".fact-header");
  const subEl = root.querySelector(".fact-sub");
  const dots = root.querySelectorAll(".fact-dot");
  function render() {
    const f = FACTS[i];
    headerEl.innerHTML = f.header;
    subEl.innerHTML = f.sub;
    subEl.style.display = f.sub ? "" : "none";
    headerEl.style.animation = "none"; void headerEl.offsetWidth; headerEl.style.animation = "";
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }
  dots.forEach((d, idx) => d.addEventListener("click", () => { i = idx; render(); }));
  render();
  setInterval(() => { i = (i + 1) % FACTS.length; render(); }, 6000);
})();

/* ---------- Drink log (log.html) ---------- */
const PROFILE_KEY = "smart sipping:profile";
const LOG_KEY = "smart sipping:log";
const METABOLISM_RATE = 0.015;
const DRINK_PRESETS = [
  { name: "Beer (12oz, 5%)", standardDrinks: 1 },
  { name: "Light beer (12oz, 4.2%)", standardDrinks: 0.85 },
  { name: "Craft/IPA (12oz, 7%)", standardDrinks: 1.4 },
  { name: "Wine (5oz, 12%)", standardDrinks: 1 },
  { name: "Shot (1.5oz, 40%)", standardDrinks: 1 },
  { name: "Cocktail (mixed)", standardDrinks: 1.5 },
  { name: "Hard seltzer (12oz, 5%)", standardDrinks: 1 },
];

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function widmarkR(g) { return g === "male" ? 0.68 : g === "female" ? 0.55 : 0.615; }
function estimateBAC(drinks, profile, now = new Date()) {
  if (!profile || !profile.weightKg || drinks.length === 0) return 0;
  const r = widmarkR(profile.gender);
  const weightG = profile.weightKg * 1000;
  let total = 0;
  for (const d of drinks) {
    const grams = d.standardDrinks * 14;
    const hours = Math.max(0, (now.getTime() - new Date(d.time).getTime()) / 3600000);
    const peak = (grams / (weightG * r)) * 100;
    total += Math.max(0, peak - METABOLISM_RATE * hours);
  }
  return Math.max(0, total);
}
function minutesUntilNext(drinks, profile, now = new Date()) {
  const bac = estimateBAC(drinks, profile, now);
  if (drinks.length === 0 || bac <= 0) return { minutes: 0, reason: "ready", currentBAC: bac };
  const SAFE = 0.03;
  const excess = Math.max(0, bac - SAFE);
  return { minutes: Math.ceil((excess / METABOLISM_RATE) * 60), reason: bac > SAFE ? "metabolize" : "pace", currentBAC: bac };
}
function loadProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); } catch { return null; } }
function loadDrinks() {
  try {
    const arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    const t = todayKey();
    return arr.filter((d) => d.dayKey === t);
  } catch { return []; }
}
function saveDrinks(arr) { localStorage.setItem(LOG_KEY, JSON.stringify(arr)); }

(function initLog() {
  const root = document.getElementById("log-root");
  if (!root) return;

  let profile = loadProfile();
  let drinks = loadDrinks();
  let showSetup = !profile;
  let useCustom = false;

  function render() {
    if (showSetup || !profile) {
      root.innerHTML = profileFormHTML(profile);
      wireProfileForm();
      return;
    }
    const now = new Date();
    const bac = estimateBAC(drinks, profile, now);
    const next = minutesUntilNext(drinks, profile, now);
    root.innerHTML = mainViewHTML(bac, next, drinks, now);
    wireMain();
  }

  function profileFormHTML(p) {
    const g = (p && p.gender) || "other";
    return `
      <form id="profile-form" class="card card-lg" style="max-width:36rem">
        <h2 style="font-family:var(--font-display);font-size:1.875rem;">A bit about you</h2>
        <p class="muted text-sm mt-2">We use this to estimate how your body processes alcohol. Nothing leaves your device.</p>
        <div class="mt-6" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <label class="field-label"><span>Height (cm)</span><div><input class="form-input" type="number" min="100" max="250" name="heightCm" value="${p?.heightCm ?? ""}" required></div></label>
          <label class="field-label"><span>Weight (kg)</span><div><input class="form-input" type="number" min="30" max="250" name="weightKg" value="${p?.weightKg ?? ""}" required></div></label>
          <label class="field-label"><span>Age</span><div><input class="form-input" type="number" min="18" max="120" name="age" value="${p?.age ?? ""}" required></div></label>
        </div>
        <label class="field-label mt-4"><span>Gender</span>
          <div class="gender-grid">
            ${["male","female","other"].map(x => `<button type="button" data-gender="${x}" class="gender-btn ${g===x?"active":""}">${x}</button>`).join("")}
          </div>
        </label>
        <input type="hidden" name="gender" value="${g}">
        <p id="profile-error" class="text-sm mt-4" style="color:var(--destructive);display:none"></p>
        <div class="mt-8" style="display:flex;gap:0.75rem">
          <button type="submit" class="btn btn-primary">Save & continue</button>
          ${profile ? `<button type="button" id="profile-cancel" class="btn btn-outline">Cancel</button>` : ""}
        </div>
      </form>`;
  }

  function wireProfileForm() {
    const form = root.querySelector("#profile-form");
    form.querySelectorAll(".gender-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        form.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        form.querySelector("[name=gender]").value = btn.dataset.gender;
      });
    });
    const cancel = root.querySelector("#profile-cancel");
    if (cancel) cancel.addEventListener("click", () => { showSetup = false; render(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const h = +data.get("heightCm"), w = +data.get("weightKg"), a = +data.get("age"), g = data.get("gender");
      const err = root.querySelector("#profile-error");
      const fail = (m) => { err.textContent = m; err.style.display = ""; };
      if (!h || h < 100 || h > 250) return fail("Enter a realistic height in cm (100–250).");
      if (!w || w < 30 || w > 250) return fail("Enter a realistic weight in kg (30–250).");
      if (!a || a < 18 || a > 120) return fail("Enter a realistic age (18–120). You must be of legal drinking age.");
      profile = { heightCm: h, weightKg: w, age: a, gender: g };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      showSetup = false;
      render();
    });
  }

  function timerHTML(next) {
    if (!next) return "";
    if (next.minutes === 0) {
      return `<p class="timer-value now">Now</p>
        <p class="muted mt-3">${next.currentBAC === 0 ? "Have a great night. Pace yourself." : "One more is okay — slowly."}</p>`;
    }
    const h = Math.floor(next.minutes / 60), m = next.minutes % 60;
    return `<p class="timer-value tabular">${h>0?h+"h ":""}${m}m</p>
      <p class="muted mt-3">${next.reason === "metabolize" ? "Your body is processing alcohol — give it time before the next one." : "Pacing rule of thumb: about one drink per hour."}</p>`;
  }

  function mainViewHTML(bac, next, drinks, now) {
    const bacTone = bac > 0.08 ? "danger" : bac > 0.05 ? "warn" : "";
    const cntTone = drinks.length >= 4 ? "warn" : "";
    const sorted = [...drinks].sort((a,b)=> new Date(b.time)-new Date(a.time));
    return `
      <div class="log-grid">
        <section class="log-timer">
          <p class="eyebrow-sm">Next safe drink in</p>
          ${timerHTML(next)}
          <div class="stat-grid">
            <div class="stat"><p class="eyebrow-sm">Estimated BAC</p><p class="stat-value ${bacTone}">${bac.toFixed(3)}%</p></div>
            <div class="stat"><p class="eyebrow-sm">Drinks tonight</p><p class="stat-value ${cntTone}">${drinks.length}</p></div>
          </div>
          ${bac > 0.08 ? `<p class="warn-banner">You're estimated above 0.08% BAC. Stop drinking, hydrate, and <strong>do not drive</strong>. If anyone is confused, vomiting, unconscious, or breathing slowly — call 911.</p>` : ""}
        </section>

        <section class="log-add">
          <h2 style="font-family:var(--font-display);font-size:1.5rem;">Log a drink</h2>
          <div class="mt-6" style="display:flex;flex-direction:column;gap:1rem">
            ${useCustom ? `
              <input id="custom-name" class="form-input" placeholder="Drink name">
              <input id="custom-std" class="form-input" type="number" step="0.1" min="0.1" placeholder="Standard drinks (e.g. 1.5)">
            ` : `
              <select id="preset-select" class="form-select">
                ${DRINK_PRESETS.map((p,i)=>`<option value="${i}">${p.name} — ${p.standardDrinks} std</option>`).join("")}
              </select>
            `}
            <button id="toggle-custom" class="text-xs" style="text-decoration:underline;opacity:0.7;text-align:left">${useCustom ? "Use a preset" : "Add a custom drink"}</button>
            <button id="add-drink" class="btn btn-accent" style="width:100%;padding:1rem;border-radius:1rem">Add to log →</button>
            <p class="text-xs" style="opacity:0.6">Logged at the current time, ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.</p>
          </div>
        </section>

        <section class="log-list">
          <h2 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:1.5rem">Tonight's log</h2>
          ${drinks.length === 0
            ? `<p class="muted text-sm">No drinks yet. Log one to start your pacing timer.</p>`
            : `<ul>${sorted.map(d => `
                <li class="log-entry">
                  <div>
                    <p style="font-weight:500">${escapeHtml(d.name)}</p>
                    <p class="text-xs muted" style="margin-top:0.125rem">${new Date(d.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${d.standardDrinks} standard</p>
                  </div>
                  <button data-remove="${d.id}" class="text-xs muted" style="text-decoration:none">Remove</button>
                </li>`).join("")}</ul>`}
        </section>
      </div>`;
  }

  function wireMain() {
    const toggle = root.querySelector("#toggle-custom");
    if (toggle) toggle.addEventListener("click", () => { useCustom = !useCustom; render(); });
    const add = root.querySelector("#add-drink");
    if (add) add.addEventListener("click", () => {
      let entry;
      if (useCustom) {
        const name = (root.querySelector("#custom-name").value || "").trim() || "Custom drink";
        const std = Math.max(0.1, +root.querySelector("#custom-std").value || 1);
        entry = { id: crypto.randomUUID(), name, standardDrinks: std, time: new Date().toISOString(), dayKey: todayKey() };
      } else {
        const idx = +root.querySelector("#preset-select").value;
        const p = DRINK_PRESETS[idx];
        entry = { id: crypto.randomUUID(), name: p.name, standardDrinks: p.standardDrinks, time: new Date().toISOString(), dayKey: todayKey() };
      }
      drinks = [...drinks, entry];
      saveDrinks(drinks);
      render();
    });
    root.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => {
      drinks = drinks.filter(d => d.id !== b.dataset.remove);
      saveDrinks(drinks);
      render();
    }));
  }

  // Edit profile button (in header)
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn) editBtn.addEventListener("click", () => { showSetup = true; render(); });

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  render();
  // tick every 30s for live timer / midnight reset
  setInterval(() => {
    const today = todayKey();
    const before = drinks.length;
    drinks = drinks.filter(d => d.dayKey === today);
    if (drinks.length !== before) saveDrinks(drinks);
    if (!showSetup && profile) render();
  }, 30000);
})();
