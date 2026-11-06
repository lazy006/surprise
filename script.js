/* ====== EDIT THIS PART ====== */
const CONFIG = {
  passcode: "0904",
  hint: "A date that matters to us",
  name: "Her Name",
  coverLine: "I made this for you",
  heroLine: "Happy birthday, my love",
  photosTitle: "Our little moments",
  // Put your 13 photos in assets/photos/ as photo-01.jpg ... photo-13.jpg (or change the names here)
  photos: Array.from({length: 13}, (_, i) => ({
    src: `assets/photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
    caption: "Caption goes here"
  })),
  letterTitle: "A letter for you",
  letter: [
    "My dearest, write the opening of your letter here.",
    "Write the second paragraph here. Tell her what she means to you.",
    "Write the third paragraph here. A memory, a promise, a thank you.",
    "Write the last lines here."
  ],
  letterSign: "Yours, always",
  videoTitle: "One more thing",
  video: { src: "assets/video/our-video.mp4", poster: "" },
  closing: "I will always love you",
  from: "From, your forever",
  wishButton: "Make a wish"
};
/* ====== END ====== */

const $ = (s, r = document) => r.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
document.title = `For ${CONFIG.name}`;

/* petals */
const cv = $("#petals"), cx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const cols = ["#e8a3ad", "#c46a78", "#f3c6c9", "#fff3ee", "#b04557"];
let P = [], running = false;
const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
addEventListener("resize", fit); fit();
function petals(n) {
  n = reduce ? Math.min(n, 10) : n;
  for (let i = 0; i < n; i++) P.push({
    x: Math.random() * cv.width, y: -Math.random() * cv.height * .6 - 20,
    s: (6 + Math.random() * 9) * dpr, vy: (.7 + Math.random() * 1.4) * dpr, ph: Math.random() * 6,
    r: Math.random() * 6, vr: (Math.random() - .5) * .05, c: cols[i % cols.length]
  });
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick(t) {
  cx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(p => p.y < cv.height + 30);
  for (const p of P) {
    p.y += p.vy; p.x += Math.sin(t / 900 + p.ph) * .9 * dpr; p.r += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.globalAlpha = .85;
    cx.beginPath(); cx.ellipse(0, 0, p.s, p.s * .55, 0, 0, 7); cx.fill(); cx.restore();
  }
  P.length ? requestAnimationFrame(tick) : (running = false);
}

/* cover + lock */
$("#coverLine").textContent = CONFIG.coverLine;
$("#coverTitle").textContent = `For ${CONFIG.name}`;
$("#hint").textContent = CONFIG.hint;
const show = id => { document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id)); };
$("#begin").onclick = () => { show("lock"); petals(24); };

let entry = "";
const dots = [...document.querySelectorAll("#dots i")];
const pad = $("#pad");
"123456789".split("").forEach(n => pad.append(btn(n)));
pad.append(btn("Clear", "sm"), btn("0"), btn("Back", "sm"));
function btn(l, c) { const b = el("button", c, l); b.type = "button"; b.onclick = () => press(l); return b; }
function press(k) {
  if (k === "Clear") entry = ""; else if (k === "Back") entry = entry.slice(0, -1); else if (entry.length < 4) entry += k;
  dots.forEach((d, i) => d.classList.toggle("f", i < entry.length));
  if (entry.length === 4) setTimeout(check, 180);
}
function check() {
  if (entry === CONFIG.passcode) return unlock();
  const d = $("#dots"); d.classList.add("shake"); setTimeout(() => d.classList.remove("shake"), 500);
  entry = ""; dots.forEach(x => x.classList.remove("f"));
}
addEventListener("keydown", e => {
  if (!$("#lock").classList.contains("on")) return;
  if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") press("Back");
});

/* the site is only built after unlocking */
function unlock() {
  show(""); petals(70);
  setTimeout(() => { build(); $("#site").hidden = false; scrollTo(0, 0); }, 900);
}
function build() {
  const s = $("#site"), C = CONFIG;
  s.innerHTML = `
  <section class="hero"><p class="soft">${esc(C.coverLine)}</p><h1>${esc(C.heroLine)}</h1><p class="soft scroll">scroll slowly</p></section>
  <section><h2>${esc(C.photosTitle)}</h2><div class="wall" id="wall"></div></section>
  <section><h2>${esc(C.letterTitle)}</h2><div class="paper" id="paper">${C.letter.map((t, i) => `<p style="--i:${i}">${esc(t)}</p>`).join("")}<p class="sig" style="--i:${C.letter.length}">${esc(C.letterSign)}</p></div></section>
  <section><h2>${esc(C.videoTitle)}</h2><div class="frame"><video controls playsinline preload="metadata" ${C.video.poster ? `poster="${esc(C.video.poster)}"` : ""} src="${esc(C.video.src)}"></video></div></section>
  <section class="end"><h2>${esc(C.closing)}</h2><p class="soft">${esc(C.from)}</p><button class="btn" id="wish">${esc(C.wishButton)}</button></section>`;
  const wall = $("#wall");
  C.photos.forEach((p, i) => {
    const b = el("button", "pol"); b.type = "button"; b.style.setProperty("--r", ((i * 37) % 9 - 4) + "deg");
    b.innerHTML = `<span class="ph" data-name="${esc(p.src.split("/").pop())}"><img loading="lazy" alt="${esc(p.caption)}" src="${esc(p.src)}"></span><span class="cap">${esc(p.caption)}</span>`;
    const img = $("img", b); img.onerror = () => { img.remove(); $(".ph", b).classList.add("empty"); };
    b.onclick = () => openLB(i); wall.append(b);
  });
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("read"); o.unobserve(e.target); } }), { threshold: .35 }).observe($("#paper"));
  $("#wish").onclick = () => petals(90);
}

/* lightbox */
let cur = 0; const lb = $("#lightbox");
function openLB(i) {
  cur = (i + CONFIG.photos.length) % CONFIG.photos.length; const p = CONFIG.photos[cur];
  $("img", lb).src = p.src; $("img", lb).alt = p.caption; $("figcaption", lb).textContent = p.caption; lb.hidden = false;
}
$(".lb-x").onclick = () => lb.hidden = true;
$(".prev").onclick = () => openLB(cur - 1); $(".next").onclick = () => openLB(cur + 1);
lb.onclick = e => { if (e.target === lb) lb.hidden = true; };
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") lb.hidden = true; if (e.key === "ArrowLeft") openLB(cur - 1); if (e.key === "ArrowRight") openLB(cur + 1);
});
