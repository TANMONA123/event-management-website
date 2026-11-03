/* ===================== DATA ===================== */
const EVENTS = [
  { id: 1, name: "CodeStorm Hackathon 2026", category: "Technology", date: "2026-12-12T09:00:00", venue: "KIIT Campus, Bhubaneswar", price: "Free", seats: 300, featured: true,
    img: "https://picsum.photos/seed/hackathon/800/500",
    desc: "A 24-hour coding marathon where teams build innovative solutions to real-world problems.",
    details: "Form a team of up to 4, pick a problem statement and build a working prototype in 24 hours. Mentors, snacks, swag and cash prizes worth ₹1,00,000 await the winners." },
  { id: 2, name: "Neon Nights Music Festival", category: "Music", date: "2026-12-20T18:00:00", venue: "Marine Drive Arena, Mumbai", price: "₹999", seats: 1500, featured: true,
    img: "https://picsum.photos/seed/musicfest/800/500",
    desc: "An electrifying night of live bands, DJs and food stalls under the open sky.",
    details: "Headline acts, indie artists and a silent-disco zone. Gates open at 5 PM. Food courts, merchandise stalls and a dedicated camping zone available on site." },
  { id: 3, name: "UI/UX Design Workshop", category: "Workshop", date: "2026-11-28T10:00:00", venue: "Design Hub, Bengaluru", price: "₹499", seats: 80, featured: false,
    img: "https://picsum.photos/seed/uxworkshop/800/500",
    desc: "Hands-on workshop covering Figma, design thinking and building a portfolio.",
    details: "Learn user research, wireframing, prototyping and usability testing from industry designers. Bring your laptop; Figma accounts are free." },
  { id: 4, name: "Startup Pitch Summit", category: "Business", date: "2027-01-10T10:30:00", venue: "T-Hub, Hyderabad", price: "₹299", seats: 250, featured: true,
    img: "https://picsum.photos/seed/startup/800/500",
    desc: "Watch founders pitch to top investors and network with the startup ecosystem.",
    details: "Twenty early-stage startups pitch live to a panel of VCs. Includes a networking lunch, fireside chats and a investor speed-dating round." },
  { id: 5, name: "Inter-College Cricket Cup", category: "Sports", date: "2027-01-18T08:00:00", venue: "Chepauk Ground, Chennai", price: "Free", seats: 2000, featured: false,
    img: "https://picsum.photos/seed/cricket/800/500",
    desc: "Teams from across the country battle it out for the championship trophy.",
    details: "A knockout T20 tournament featuring 16 college teams. Free entry for spectators; live commentary, food stalls and fan zones throughout the day." },
  { id: 6, name: "AI & Machine Learning Conference", category: "Technology", date: "2027-02-05T09:30:00", venue: "Convention Centre, Pune", price: "₹1,499", seats: 600, featured: true,
    img: "https://picsum.photos/seed/aiconf/800/500",
    desc: "Keynotes and talks on generative AI, LLMs and the future of intelligent systems.",
    details: "Two days, three tracks, 40+ speakers. Topics include generative AI, MLOps, responsible AI and career paths. Certificate of participation provided." },
  { id: 7, name: "Street Food & Culture Carnival", category: "Culture", date: "2027-02-14T11:00:00", venue: "Indira Gandhi Park, Delhi", price: "₹150", seats: 1200, featured: false,
    img: "https://picsum.photos/seed/foodfest/800/500",
    desc: "A vibrant celebration of regional cuisines, folk dances and handicrafts.",
    details: "Over 60 food stalls, live folk performances, craft bazaars and a kids' activity zone. A great day out for friends and families." },
  { id: 8, name: "Photography Masterclass", category: "Workshop", date: "2027-03-01T14:00:00", venue: "Art Gallery, Kolkata", price: "₹699", seats: 50, featured: false,
    img: "https://picsum.photos/seed/photoclass/800/500",
    desc: "Learn composition, lighting and editing from award-winning photographers.",
    details: "A practical session with a live photo walk, portrait lighting demo and a Lightroom editing clinic. Bring your own camera or smartphone." }
];

const STORAGE_KEY = "eventora_registrations";
const THEME_KEY = "eventora_theme";

/* ===================== HELPERS ===================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function getRegistrations() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveRegistrations(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
}

function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 2800);
}

const imgFallback = "this.onerror=null;this.style.display='none';";

/* ===================== THEME ===================== */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("#theme-toggle").textContent = theme === "dark" ? "☀️" : "🌙";
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch { /* ignore */ }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  });
}

/* ===================== EVENT LISTING ===================== */
let activeCategory = "All";
let searchTerm = "";

function renderFilters() {
  const cats = ["All", ...new Set(EVENTS.map((e) => e.category))];
  $("#filters").innerHTML = cats
    .map((c) => `<button class="filter-btn ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
}

function renderEvents() {
  const term = searchTerm.trim().toLowerCase();
  const list = EVENTS.filter((e) => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const hay = `${e.name} ${e.venue} ${e.desc} ${e.category}`.toLowerCase();
    return matchCat && hay.includes(term);
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  $("#event-grid").innerHTML = list
    .map((e, i) => `
      <article class="card" style="animation-delay:${i * 0.07}s">
        <div class="card-img">
          <img src="${e.img}" alt="${escapeHTML(e.name)}" loading="lazy" onerror="${imgFallback}" />
          <span class="tag">${e.category}</span>
          ${e.featured ? '<span class="featured">⭐ Featured</span>' : ""}
        </div>
        <div class="card-body">
          <h3>${escapeHTML(e.name)}</h3>
          <p class="meta">📅 ${formatDate(e.date)} • ${formatTime(e.date)}</p>
          <p class="meta">📍 ${escapeHTML(e.venue)}</p>
          <p class="desc">${escapeHTML(e.desc)}</p>
          <div class="card-actions">
            <button class="btn btn-outline" data-details="${e.id}">View Details</button>
            <button class="btn btn-primary" data-register="${e.id}">Register</button>
          </div>
        </div>
      </article>`)
    .join("");

  $("#no-results").hidden = list.length > 0;
}

/* ===================== COUNTDOWN ===================== */
function countdownHTML(iso, small = false) {
  const diff = new Date(iso) - new Date();
  if (diff <= 0) return `<span class="countdown-ended">Event started / ended</span>`;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const box = (v, l) => `<div class="time-box"><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`;
  return `<div class="countdown ${small ? "small" : ""}">${box(d, "Days")}${box(h, "Hrs")}${box(m, "Min")}${box(s, "Sec")}</div>`;
}

function updateCountdowns() {
  const upcoming = EVENTS.filter((e) => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const next = upcoming[0];
  if (next) {
    $("#next-event-name").textContent = next.name;
    $("#hero-countdown").innerHTML = countdownHTML(next.date);
  } else {
    $("#next-event-name").textContent = "No upcoming events";
    $("#hero-countdown").innerHTML = "";
  }
  const modalCd = $("#modal-countdown");
  if (modalCd) modalCd.innerHTML = countdownHTML(modalCd.dataset.date, true);
}

/* ===================== MODAL ===================== */
function openModal(id, focusForm = false) {
  const ev = EVENTS.find((e) => e.id === Number(id));
  if (!ev) return;
  const options = EVENTS.map(
    (x) => `<option value="${x.id}" ${x.id === ev.id ? "selected" : ""}>${escapeHTML(x.name)}</option>`
  ).join("");

  $("#modal-body").innerHTML = `
    <div class="detail-img"><img src="${ev.img}" alt="${escapeHTML(ev.name)}" onerror="${imgFallback}" /></div>
    <div class="detail-grid">
      <div class="detail-info">
        <span class="meta">${ev.category}${ev.featured ? " • ⭐ Featured" : ""}</span>
        <h2 id="modal-title">${escapeHTML(ev.name)}</h2>
        <ul class="info-list">
          <li>📅 <strong>Date:</strong> ${formatDate(ev.date)}</li>
          <li>⏰ <strong>Time:</strong> ${formatTime(ev.date)}</li>
          <li>📍 <strong>Venue:</strong> ${escapeHTML(ev.venue)}</li>
          <li>🎟️ <strong>Price:</strong> ${ev.price}</li>
          <li>💺 <strong>Capacity:</strong> ${ev.seats.toLocaleString("en-IN")} seats</li>
        </ul>
        <p>${escapeHTML(ev.desc)}</p>
        <p style="margin-top:10px">${escapeHTML(ev.details)}</p>
        <div id="modal-countdown" data-date="${ev.date}">${countdownHTML(ev.date, true)}</div>
      </div>
      <div class="reg-box" id="reg-box">
        <h3>Register Now</h3>
        <form id="reg-form" novalidate>
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="e.g. Rahul Sharma" autocomplete="name" />
            <small class="error-msg"></small>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" autocomplete="email" />
            <small class="error-msg"></small>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" placeholder="10-digit mobile number" autocomplete="tel" maxlength="14" />
            <small class="error-msg"></small>
          </div>
          <div class="form-group">
            <label for="event">Selected Event</label>
            <select id="event" name="event">${options}</select>
            <small class="error-msg"></small>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Confirm Registration</button>
        </form>
      </div>
    </div>`;

  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
  $("#modal-body").parentElement.scrollTop = 0;
  setupForm();
  if (focusForm) setTimeout(() => $("#name").focus(), 150);
}

function closeModal() {
  $("#modal").hidden = true;
  document.body.style.overflow = "";
}

/* ===================== FORM VALIDATION ===================== */
const validators = {
  name(v) {
    v = v.trim();
    if (!v) return "Name is required.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) return "Name can only contain letters and spaces.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v)) return "Enter a valid email address.";
    return "";
  },
  phone(v) {
    const digits = v.replace(/[\s-]/g, "").replace(/^\+91/, "");
    if (!v.trim()) return "Phone number is required.";
    if (!/^\d+$/.test(digits)) return "Phone number must contain digits only.";
    if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number.";
    return "";
  },
  event(v) {
    return v ? "" : "Please select an event.";
  }
};

function setFieldState(input, message) {
  const group = input.closest(".form-group");
  group.classList.toggle("invalid", !!message);
  group.classList.toggle("valid", !message);
  $(".error-msg", group).textContent = message;
}

function setupForm() {
  const form = $("#reg-form");
  const fields = $$("input, select", form);

  fields.forEach((f) => {
    f.addEventListener("blur", () => setFieldState(f, validators[f.name](f.value)));
    f.addEventListener("input", () => {
      if (f.closest(".form-group").classList.contains("invalid")) setFieldState(f, validators[f.name](f.value));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    fields.forEach((f) => {
      const msg = validators[f.name](f.value);
      setFieldState(f, msg);
      if (msg) ok = false;
    });
    if (!ok) {
      const firstBad = $(".invalid input, .invalid select", form);
      if (firstBad) firstBad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const ev = EVENTS.find((x) => x.id === Number(data.event));
    const list = getRegistrations();

    const duplicate = list.some(
      (r) => r.eventId === ev.id && r.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (duplicate) {
      setFieldState($("#email"), "This email is already registered for this event.");
      return;
    }

    const reg = {
      ref: "EVT" + Date.now().toString().slice(-7),
      eventId: ev.id,
      eventName: ev.name,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      registeredOn: new Date().toISOString()
    };
    list.push(reg);
    saveRegistrations(list);
    renderRegistrations();

    $("#reg-box").innerHTML = `
      <div class="confirm">
        <div class="check">✓</div>
        <h3>Registration Successful!</h3>
        <p>Thank you, <strong>${escapeHTML(reg.name)}</strong>. You're registered for</p>
        <p><strong>${escapeHTML(ev.name)}</strong></p>
        <p>📅 ${formatDate(ev.date)} • 📍 ${escapeHTML(ev.venue)}</p>
        <p>Booking ID: <strong>${reg.ref}</strong></p>
        <p>A confirmation has been noted for ${escapeHTML(reg.email)}.</p>
        <button class="btn btn-outline" style="margin-top:14px" id="done-btn">Done</button>
      </div>`;
    $("#done-btn").addEventListener("click", closeModal);
    showToast("🎉 Registration confirmed!");
  });
}

/* ===================== MY REGISTRATIONS ===================== */
function renderRegistrations() {
  const list = getRegistrations();
  const box = $("#reg-list");
  if (!list.length) {
    box.innerHTML = `<div class="empty">You haven't registered for any events yet. <a href="#events">Browse events →</a></div>`;
    return;
  }
  box.innerHTML = list
    .slice()
    .reverse()
    .map((r) => `
      <div class="reg-item">
        <div>
          <h4>${escapeHTML(r.eventName)}</h4>
          <p>👤 ${escapeHTML(r.name)} • ✉️ ${escapeHTML(r.email)} • 📞 ${escapeHTML(r.phone)}</p>
          <p>Booking ID: <strong>${r.ref}</strong></p>
        </div>
        <button class="btn btn-danger" data-cancel="${r.ref}">Cancel</button>
      </div>`)
    .join("");
}

/* ===================== UI BEHAVIOUR ===================== */
function initNav() {
  const menu = $("#nav-menu");
  const toggle = $("#menu-toggle");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.textContent = "☰";
      toggle.setAttribute("aria-expanded", false);
    })
  );

  const sections = $$("section[id]");
  window.addEventListener("scroll", () => {
    $("#navbar").classList.toggle("scrolled", window.scrollY > 10);
    $("#to-top").classList.toggle("show", window.scrollY > 500);
    let current = "home";
    sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    $$("a", menu).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  });
  $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  const counters = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, target = Number(el.dataset.count);
      const start = performance.now(), dur = 1600;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(p * target).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counters.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counters.observe(el));
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initTheme();
  initNav();
  renderFilters();
  renderEvents();
  renderRegistrations();
  updateCountdowns();
  setInterval(updateCountdowns, 1000);
  initReveal();

  $("#search").addEventListener("input", (e) => { searchTerm = e.target.value; renderEvents(); });

  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderFilters();
    renderEvents();
  });

  $("#event-grid").addEventListener("click", (e) => {
    const d = e.target.closest("[data-details]");
    const r = e.target.closest("[data-register]");
    if (d) openModal(d.dataset.details);
    if (r) openModal(r.dataset.register, true);
  });

  $("#reg-list").addEventListener("click", (e) => {
    const c = e.target.closest("[data-cancel]");
    if (!c) return;
    if (!confirm("Cancel this registration?")) return;
    saveRegistrations(getRegistrations().filter((r) => r.ref !== c.dataset.cancel));
    renderRegistrations();
    showToast("Registration cancelled.");
  });

  $("#modal-close").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });
});
