/* ═══════════════════════════════════════════════
   THOTA SAI RAM — PORTFOLIO JS
   main.js
═══════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── REVEAL ON SCROLL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ─── SKILL BARS ANIMATE ─── */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('#skills').forEach(s => skillObserver.observe(s));

/* ═══════════════════════════════════════════════
   HERO FOREST SCENE — CANVAS ANIMATIONS
═══════════════════════════════════════════════ */
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');

function resizeHeroCanvas() {
  heroCanvas.width  = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

/* ── Stars ── */
const stars = Array.from({ length: 180 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.55,
  r: Math.random() * 1.5 + 0.3,
  alpha: Math.random(),
  speed: Math.random() * 0.008 + 0.003
}));

function drawStars(W, H) {
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.1) s.speed *= -1;
    hCtx.save();
    hCtx.globalAlpha = Math.abs(Math.sin(s.alpha * Math.PI));
    hCtx.fillStyle = '#ffffff';
    hCtx.beginPath();
    hCtx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    hCtx.fill();
    hCtx.restore();
  });
}

/* ── Mountains ── */
function drawMountains(W, H) {
  const baseY = H * 0.68;
  // Back mountains (lighter)
  hCtx.beginPath();
  hCtx.moveTo(0, baseY + 20);
  const pts1 = [
    [0.05, 0.52], [0.12, 0.44], [0.2, 0.38], [0.28, 0.45],
    [0.36, 0.35], [0.45, 0.42], [0.55, 0.33], [0.65, 0.40],
    [0.75, 0.36], [0.85, 0.43], [0.92, 0.38], [1.0, 0.45]
  ];
  pts1.forEach(([px, py]) => hCtx.lineTo(px * W, py * H));
  hCtx.lineTo(W, H); hCtx.lineTo(0, H); hCtx.closePath();
  const mGrad1 = hCtx.createLinearGradient(0, H * 0.33, 0, H * 0.68);
  mGrad1.addColorStop(0, '#1a2d3a');
  mGrad1.addColorStop(1, '#0d1e1a');
  hCtx.fillStyle = mGrad1; hCtx.fill();

  // Front mountains (darker)
  hCtx.beginPath();
  hCtx.moveTo(0, baseY + 10);
  const pts2 = [
    [0.0, 0.59], [0.08, 0.50], [0.16, 0.55], [0.25, 0.47],
    [0.34, 0.54], [0.43, 0.48], [0.52, 0.56], [0.60, 0.49],
    [0.70, 0.57], [0.80, 0.50], [0.90, 0.55], [1.0, 0.51]
  ];
  pts2.forEach(([px, py]) => hCtx.lineTo(px * W, py * H));
  hCtx.lineTo(W, H); hCtx.lineTo(0, H); hCtx.closePath();
  const mGrad2 = hCtx.createLinearGradient(0, H * 0.45, 0, H * 0.7);
  mGrad2.addColorStop(0, '#0f2218');
  mGrad2.addColorStop(1, '#071410');
  hCtx.fillStyle = mGrad2; hCtx.fill();
}

/* ── Tree drawing helper ── */
function drawTree(ctx, x, y, h, color, swayAmt, tick) {
  const trunkH = h * 0.3;
  const trunkW = h * 0.06;
  const sway = Math.sin(tick * 0.02 + x * 0.01) * swayAmt;

  ctx.save();
  ctx.translate(x, y);

  // Trunk
  ctx.fillStyle = '#1a0f08';
  ctx.beginPath();
  ctx.rect(-trunkW / 2, -trunkH, trunkW, trunkH);
  ctx.fill();

  // Foliage layers (3 triangles)
  for (let i = 0; i < 3; i++) {
    const layerH = h * (0.55 - i * 0.08);
    const layerW = h * (0.42 - i * 0.05);
    const layerY = -trunkH - (h * 0.28 * i);
    ctx.beginPath();
    ctx.moveTo(sway, layerY - layerH);
    ctx.lineTo(-layerW / 2 + sway * 0.5, layerY);
    ctx.lineTo(layerW / 2 + sway * 0.5, layerY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
}

/* ── Forest trees setup ── */
const treesBack = Array.from({ length: 28 }, (_, i) => ({
  x: (i / 27),
  h: 70 + Math.random() * 40,
  color: `hsl(${130 + Math.random() * 20}, ${35 + Math.random() * 15}%, ${12 + Math.random() * 8}%)`
}));
const treesMid = Array.from({ length: 22 }, (_, i) => ({
  x: (i / 21) + (Math.random() - 0.5) * 0.04,
  h: 90 + Math.random() * 50,
  color: `hsl(${125 + Math.random() * 20}, ${40 + Math.random() * 15}%, ${16 + Math.random() * 8}%)`
}));
const treesFront = Array.from({ length: 14 }, (_, i) => ({
  x: (i / 13) + (Math.random() - 0.5) * 0.06,
  h: 120 + Math.random() * 60,
  color: `hsl(${120 + Math.random() * 20}, ${45 + Math.random() * 15}%, ${9 + Math.random() * 6}%)`
}));

function drawForest(W, H, tick) {
  // Back forest row
  treesBack.forEach(t => {
    drawTree(hCtx, t.x * W, H * 0.70, t.h, t.color, 1.5, tick);
  });
  // Mid forest row
  treesMid.forEach(t => {
    drawTree(hCtx, t.x * W, H * 0.77, t.h, t.color, 2, tick);
  });
  // Ground strip
  const gGrad = hCtx.createLinearGradient(0, H * 0.76, 0, H);
  gGrad.addColorStop(0, '#142014');
  gGrad.addColorStop(0.4, '#0d180d');
  gGrad.addColorStop(1, '#060e06');
  hCtx.fillStyle = gGrad;
  hCtx.fillRect(0, H * 0.77, W, H * 0.23);
  // Front trees (on top of ground)
  treesFront.forEach(t => {
    drawTree(hCtx, t.x * W, H * 0.88, t.h, t.color, 3, tick);
  });
}

/* ── Animals ── */
class Animal {
  constructor(type, startX, y, speed, size, W) {
    this.type  = type;
    this.x     = startX;
    this.y     = y;
    this.speed = speed;
    this.size  = size;
    this.W     = W;
    this.legAnim = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speed;
    this.legAnim += 0.12;
    if (this.x > this.W + 120) this.x = -120;
    if (this.x < -120) this.x = this.W + 120;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.speed < 0) ctx.scale(-1, 1);
    const s = this.size;
    const leg = Math.sin(this.legAnim) * s * 0.3;

    if (this.type === 'deer') {
      // Body
      ctx.fillStyle = '#5c3d1e';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 1.1, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      // Neck
      ctx.beginPath();
      ctx.ellipse(s * 0.7, -s * 0.4, s * 0.28, s * 0.45, Math.PI * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#5c3d1e';
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.ellipse(s * 1.1, -s * 0.75, s * 0.35, s * 0.28, -Math.PI * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#6b4a2a';
      ctx.fill();
      // Antlers
      ctx.strokeStyle = '#3d2510';
      ctx.lineWidth = s * 0.08;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s * 1.1, -s * 0.95);
      ctx.lineTo(s * 1.2, -s * 1.4);
      ctx.lineTo(s * 1.0, -s * 1.6);
      ctx.moveTo(s * 1.2, -s * 1.4);
      ctx.lineTo(s * 1.4, -s * 1.55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 1.0, -s * 0.9);
      ctx.lineTo(s * 0.9, -s * 1.3);
      ctx.lineTo(s * 0.7, -s * 1.5);
      ctx.moveTo(s * 0.9, -s * 1.3);
      ctx.lineTo(s * 1.1, -s * 1.45);
      ctx.stroke();
      // Legs
      ctx.strokeStyle = '#4a2e10';
      ctx.lineWidth = s * 0.12;
      [[-s*0.6, s*0.5 + leg], [-s*0.2, s*0.5 - leg], [s*0.2, s*0.5 + leg], [s*0.6, s*0.5 - leg]].forEach(([lx, ly]) => {
        ctx.beginPath();
        ctx.moveTo(lx, s * 0.3);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      });
      // Belly white
      ctx.fillStyle = 'rgba(255,230,180,0.4)';
      ctx.beginPath();
      ctx.ellipse(0, s * 0.1, s * 0.55, s * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-s * 0.95, -s * 0.15, s * 0.18, s * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.type === 'fox') {
      // Body
      ctx.fillStyle = '#c4621a';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.9, s * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.ellipse(s * 0.85, -s * 0.28, s * 0.38, s * 0.3, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Snout
      ctx.fillStyle = '#e8843a';
      ctx.beginPath();
      ctx.ellipse(s * 1.15, -s * 0.18, s * 0.22, s * 0.14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = '#c4621a';
      ctx.beginPath();
      ctx.moveTo(s * 0.72, -s * 0.52);
      ctx.lineTo(s * 0.58, -s * 0.8);
      ctx.lineTo(s * 0.88, -s * 0.54);
      ctx.fill();
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath();
      ctx.moveTo(s * 0.73, -s * 0.53);
      ctx.lineTo(s * 0.63, -s * 0.72);
      ctx.lineTo(s * 0.82, -s * 0.54);
      ctx.fill();
      // Bushy tail
      ctx.fillStyle = '#c4621a';
      ctx.beginPath();
      ctx.ellipse(-s * 0.9, -s * 0.1, s * 0.55, s * 0.28, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-s * 1.1, -s * 0.05, s * 0.22, s * 0.13, 0.4, 0, Math.PI * 2);
      ctx.fill();
      // Legs
      ctx.strokeStyle = '#9b4412';
      ctx.lineWidth = s * 0.1;
      [[-s*0.5, s*0.4 + leg], [-s*0.15, s*0.4 - leg], [s*0.2, s*0.4 + leg], [s*0.55, s*0.4 - leg]].forEach(([lx, ly]) => {
        ctx.beginPath();
        ctx.moveTo(lx, s * 0.2);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      });

    } else if (this.type === 'rabbit') {
      // Body
      ctx.fillStyle = '#c8c8c8';
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.6, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.ellipse(s * 0.5, -s * 0.45, s * 0.35, s * 0.3, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = '#c8c8c8';
      ctx.beginPath();
      ctx.ellipse(s * 0.35, -s * 0.85, s * 0.1, s * 0.28, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.55, -s * 0.88, s * 0.1, s * 0.28, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Inner ears
      ctx.fillStyle = '#ffaaaa';
      ctx.beginPath();
      ctx.ellipse(s * 0.35, -s * 0.85, s * 0.05, s * 0.18, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.55, -s * 0.88, s * 0.05, s * 0.18, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Eye
      ctx.fillStyle = '#ff3366';
      ctx.beginPath();
      ctx.arc(s * 0.68, -s * 0.52, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-s * 0.55, -s * 0.1, s * 0.16, 0, Math.PI * 2);
      ctx.fill();
      // Legs hop
      ctx.fillStyle = '#b8b8b8';
      const hop = Math.abs(Math.sin(this.legAnim)) * s * 0.2;
      ctx.beginPath();
      ctx.ellipse(-s * 0.1, s * 0.4 - hop, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.3, s * 0.4 - hop * 0.5, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

let animalsArr = [];
function initAnimals() {
  const W = heroCanvas.width;
  const H = heroCanvas.height;
  animalsArr = [
    new Animal('deer',   W * 0.1,  H * 0.835, 0.55, 22, W),
    new Animal('deer',   W * 0.35, H * 0.838, 0.40, 18, W),
    new Animal('fox',    W * 0.6,  H * 0.842, 0.70, 14, W),
    new Animal('rabbit', W * 0.75, H * 0.848, 1.1,  10, W),
    new Animal('rabbit', W * 0.15, H * 0.846, -0.9, 9,  W),
    new Animal('deer',   W * 0.85, H * 0.835, -0.45, 20, W),
    new Animal('fox',    W * 0.5,  H * 0.840, -0.65, 13, W),
  ];
}
initAnimals();
window.addEventListener('resize', () => { resizeHeroCanvas(); initAnimals(); });

/* ── Sun / glow ── */
function drawSun(W, H) {
  const sx = W * 0.82, sy = H * 0.13;
  const grd = hCtx.createRadialGradient(sx, sy, 5, sx, sy, 90);
  grd.addColorStop(0, 'rgba(255,220,80,0.95)');
  grd.addColorStop(0.3, 'rgba(255,180,50,0.55)');
  grd.addColorStop(0.7, 'rgba(255,140,20,0.15)');
  grd.addColorStop(1, 'transparent');
  hCtx.fillStyle = grd;
  hCtx.beginPath();
  hCtx.arc(sx, sy, 90, 0, Math.PI * 2);
  hCtx.fill();
  // Sun disc
  hCtx.fillStyle = 'rgba(255,230,100,0.92)';
  hCtx.beginPath();
  hCtx.arc(sx, sy, 22, 0, Math.PI * 2);
  hCtx.fill();
}

/* ── Clouds ── */
const clouds = [
  { x: 0.05, y: 0.08, w: 180, h: 50, speed: 0.00018, alpha: 0.18 },
  { x: 0.28, y: 0.05, w: 240, h: 65, speed: 0.00012, alpha: 0.14 },
  { x: 0.55, y: 0.09, w: 200, h: 55, speed: 0.00022, alpha: 0.16 },
  { x: 0.72, y: 0.04, w: 160, h: 45, speed: 0.00015, alpha: 0.12 },
];

function drawCloud(ctx, cx, cy, w, h, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#c8dff0';
  ctx.filter = 'blur(10px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.2, cy + h * 0.1, w * 0.32, h * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + w * 0.22, cy + h * 0.08, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ── Sky gradient ── */
function drawSky(W, H) {
  const grad = hCtx.createLinearGradient(0, 0, 0, H * 0.72);
  grad.addColorStop(0, '#040b1c');
  grad.addColorStop(0.25, '#0d1e38');
  grad.addColorStop(0.5, '#193656');
  grad.addColorStop(0.72, '#204a36');
  grad.addColorStop(1, '#0f2414');
  hCtx.fillStyle = grad;
  hCtx.fillRect(0, 0, W, H);
}

/* ─── MAIN ANIMATION LOOP ─── */
let tick = 0;
function animateHero() {
  const W = heroCanvas.width;
  const H = heroCanvas.height;
  hCtx.clearRect(0, 0, W, H);

  drawSky(W, H);
  drawStars(W, H);
  drawSun(W, H);

  clouds.forEach(c => {
    c.x += c.speed;
    if (c.x > 1.2) c.x = -0.25;
    drawCloud(hCtx, c.x * W, c.y * H, c.w, c.h, c.alpha);
  });

  drawMountains(W, H);
  drawForest(W, H, tick);

  animalsArr.forEach(a => {
    a.W = W;
    a.y = H * (a.type === 'deer' ? 0.835 : a.type === 'fox' ? 0.840 : 0.846);
    a.update();
    a.draw(hCtx);
  });

  tick++;
  requestAnimationFrame(animateHero);
}
animateHero();

/* ═══════════════════════════════════════════════
   HELICOPTER SVG ANIMATION
═══════════════════════════════════════════════ */
// Helicopter is in HTML as SVG, just ensure rotor spins via CSS
// The flag canvas draws text
const flagCanvas = document.getElementById('flagCanvas');
if (flagCanvas) {
  const fCtx = flagCanvas.getContext('2d');
  flagCanvas.width  = 130;
  flagCanvas.height = 36;

  let flagTick = 0;
  function drawFlag() {
    fCtx.clearRect(0, 0, 130, 36);

    // Flag background with wave distortion
    for (let x = 0; x < 130; x++) {
      const wave = Math.sin((x * 0.08) + flagTick * 0.07) * 4;
      const grad = fCtx.createLinearGradient(0, wave, 0, 36 + wave);
      grad.addColorStop(0, '#1a2e6e');
      grad.addColorStop(0.5, '#2255aa');
      grad.addColorStop(1, '#1a2e6e');
      fCtx.fillStyle = grad;
      fCtx.fillRect(x, wave, 1, 36);
    }

    // Gold stripe
    fCtx.fillStyle = 'rgba(201,169,110,0.8)';
    for (let x = 0; x < 130; x++) {
      const wave = Math.sin((x * 0.08) + flagTick * 0.07) * 4;
      fCtx.fillRect(x, 14 + wave, 1, 3);
      fCtx.fillRect(x, 20 + wave, 1, 3);
    }

    // Text
    fCtx.save();
    fCtx.font = 'bold 9px Space Mono, monospace';
    fCtx.fillStyle = '#E8D5A3';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    // Slight wave on text
    const tw = Math.sin(flagTick * 0.07) * 2;
    fCtx.translate(65, 18 + tw);
    fCtx.fillText('THOTA SAI RAM', 0, 0);
    fCtx.restore();

    // Left pole connector
    fCtx.fillStyle = 'rgba(180,180,180,0.8)';
    fCtx.fillRect(0, 14, 4, 8);

    flagTick++;
    requestAnimationFrame(drawFlag);
  }
  drawFlag();
}

/* ═══════════════════════════════════════════════
   ID CARD DRAG & SPRING-BACK
═══════════════════════════════════════════════ */
const card   = document.getElementById('idCard');
const strCvs = document.getElementById('stringCanvas');
const sCtx   = strCvs ? strCvs.getContext('2d') : null;

if (strCvs) {
  strCvs.style.cssText = 'position:fixed;top:0;left:0;z-index:9997;pointer-events:none;';

  function resizeStrCanvas() {
    strCvs.width  = window.innerWidth;
    strCvs.height = window.innerHeight;
  }
  resizeStrCanvas();
  window.addEventListener('resize', resizeStrCanvas);
}

let originX = 0, originY = 0;
let currentX = 0, currentY = 0;
let velX = 0, velY = 0;
let isDragging = false, animating = false;
let dragOffX = 0, dragOffY = 0;

function getOrigin() {
  if (!card) return;
  const r = card.getBoundingClientRect();
  originX = r.left + r.width  / 2;
  originY = r.top  + r.height / 2 - currentY;
}

function drawString() {
  if (!sCtx || !card) return;
  sCtx.clearRect(0, 0, strCvs.width, strCvs.height);
  const r = card.getBoundingClientRect();
  const cardCX  = r.left + r.width / 2;
  const cardTop = r.top;
  const anchorX = originX;
  const anchorY = originY - 140;

  const dist = Math.hypot(cardCX - anchorX, cardTop - anchorY);
  const sag  = Math.min(dist * 0.28, 75);
  const cpX  = (cardCX + anchorX) / 2;
  const cpY  = (cardTop + anchorY) / 2 + sag;

  // Strap thick
  sCtx.beginPath();
  sCtx.moveTo(anchorX - 5, anchorY);
  sCtx.quadraticCurveTo(cpX - 4, cpY, cardCX - 4, cardTop);
  sCtx.lineWidth   = 12;
  sCtx.strokeStyle = 'rgba(26,46,110,0.88)';
  sCtx.lineCap     = 'round';
  sCtx.stroke();

  // Gold stripe
  sCtx.beginPath();
  sCtx.moveTo(anchorX, anchorY);
  sCtx.quadraticCurveTo(cpX, cpY, cardCX, cardTop);
  sCtx.lineWidth   = 2;
  sCtx.strokeStyle = 'rgba(201,169,110,0.75)';
  sCtx.stroke();

  // Pin
  sCtx.beginPath();
  sCtx.arc(anchorX, anchorY, 7, 0, Math.PI * 2);
  sCtx.fillStyle = 'rgba(180,180,180,0.9)';
  sCtx.fill();
  sCtx.beginPath();
  sCtx.arc(anchorX, anchorY, 4, 0, Math.PI * 2);
  sCtx.fillStyle = 'rgba(90,90,90,0.9)';
  sCtx.fill();
}

if (card) {
  card.addEventListener('mousedown', e => {
    isDragging = true; animating = false;
    velX = 0; velY = 0;
    getOrigin();
    const r = card.getBoundingClientRect();
    dragOffX = e.clientX - (r.left + r.width  / 2);
    dragOffY = e.clientY - (r.top  + r.height / 2);
    card.style.transition = 'none';
    card.style.zIndex = '9999';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    currentX = e.clientX - originX - dragOffX;
    currentY = e.clientY - originY - dragOffY;
    velX = e.movementX * 0.5;
    velY = e.movementY * 0.5;
    card.style.transform = `translate(${currentX}px,${currentY}px) rotate(${currentX * 0.025}deg)`;
    drawString();
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    springBack();
  });

  // Touch support
  card.addEventListener('touchstart', e => {
    const t = e.touches[0];
    isDragging = true; animating = false;
    velX = 0; velY = 0;
    getOrigin();
    const r = card.getBoundingClientRect();
    dragOffX = t.clientX - (r.left + r.width  / 2);
    dragOffY = t.clientY - (r.top  + r.height / 2);
    card.style.transition = 'none';
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const t = e.touches[0];
    currentX = t.clientX - originX - dragOffX;
    currentY = t.clientY - originY - dragOffY;
    card.style.transform = `translate(${currentX}px,${currentY}px) rotate(${currentX * 0.025}deg)`;
    drawString();
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    springBack();
  });
}

function springBack() {
  animating = true;
  const k = 0.11, d = 0.72;
  (function step() {
    if (!animating) return;
    velX = (velX - k * currentX) * d;
    velY = (velY - k * currentY) * d;
    currentX += velX;
    currentY += velY;
    if (card) card.style.transform = `translate(${currentX}px,${currentY}px) rotate(${currentX * 0.022}deg)`;
    drawString();
    if (Math.abs(currentX) < 0.3 && Math.abs(currentY) < 0.3 &&
        Math.abs(velX) < 0.1 && Math.abs(velY) < 0.1) {
      currentX = 0; currentY = 0;
      if (card) { card.style.transform = 'translate(0,0) rotate(0deg)'; card.style.zIndex = ''; }
      if (sCtx) sCtx.clearRect(0, 0, strCvs.width, strCvs.height);
      animating = false;
      return;
    }
    requestAnimationFrame(step);
  })();
}

setTimeout(() => { getOrigin(); drawString(); }, 600);

/* ─── TYPED EFFECT for hero subtitle ─── */
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const words = ['Full Stack Developer', 'React Enthusiast', 'Problem Solver', 'UI/UX Designer', 'Open Source Lover'];
  let wi = 0, ci = 0, deleting = false;

  function typeLoop() {
    const word = words[wi % words.length];
    typedEl.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
    if (deleting && ci < 0) { deleting = false; wi++; }
    setTimeout(typeLoop, deleting ? 50 : 90);
  }
  typeLoop();
}
