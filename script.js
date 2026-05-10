/* ============================================
   MADRE'S DAY — Interactive Experience
   Purple & Pink Pastel Edition
   ============================================ */

'use strict';

/* ─── STATE ─── */
let currentScreen = 'screen-login';
let userName = '';

/* ─── CANVAS HEARTS ─── */
(function initCanvas() {
  const canvas = document.getElementById('heart-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const hearts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(192,132,252,',   // p-soft
    'rgba(244,114,182,',   // pk-soft
    'rgba(167,139,250,',   // lavender-ish
    'rgba(233,213,255,',   // p-pale
    'rgba(251,207,232,',   // blush
    'rgba(221,214,254,',   // lavender
  ];

  function heartPath(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(0, -12, -10, -14, -12, -6);
    ctx.bezierCurveTo(-14, 2, -4, 10, 0, 16);
    ctx.bezierCurveTo(4, 10, 14, 2, 12, -6);
    ctx.bezierCurveTo(10, -14, 0, -12, 0, -8);
    ctx.closePath();
    ctx.restore();
  }

  function createHeart() {
    return {
      x:     Math.random() * W,
      y:     H + 30,
      size:  8 + Math.random() * 20,
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.06 + Math.random() * 0.14,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      angle:  Math.random() * Math.PI * 2,
      spin:   (Math.random() - 0.5) * 0.015,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
    };
  }

  for (let i = 0; i < 30; i++) {
    const h = createHeart();
    h.y = Math.random() * H;
    hearts.push(h);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    if (hearts.length < 35) hearts.push(createHeart());

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y -= h.speedY;
      h.x += h.speedX + Math.sin(h.wobble) * 0.3;
      h.wobble += h.wobbleSpeed;
      h.angle  += h.spin;

      ctx.save();
      ctx.globalAlpha = h.opacity;
      ctx.translate(h.x, h.y);
      ctx.rotate(h.angle);
      heartPath(ctx, 0, 0, h.size);
      ctx.fillStyle = h.color + h.opacity + ')';
      ctx.fill();
      ctx.restore();

      if (h.y < -40) {
        hearts.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ─── AMBIENT PETALS ─── */
(function spawnPetals() {
  const SYMBOLS = ['🌸','💜','🌷','✦','🌺','💫','🌸','💜'];
  let count = 0;
  function spawn() {
    if (count > 18) return;
    const el = document.createElement('div');
    el.className = 'ambient-petal';
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${12 + Math.random() * 14}px`;
    el.style.animationDuration = `${8 + Math.random() * 10}s`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    document.body.appendChild(el);
    count++;
    setTimeout(() => { el.remove(); count--; }, 20000);
  }
  for (let i = 0; i < 10; i++) setTimeout(spawn, i * 700);
  setInterval(spawn, 3000);
})();

/* ─── SCREEN TRANSITIONS ─── */
function goTo(screenId) {
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(screenId);
  if (!next || currentScreen === screenId) return;

  prev.classList.remove('active');
  prev.classList.add('exit');
  setTimeout(() => prev.classList.remove('exit'), 800);

  requestAnimationFrame(() => {
    next.classList.add('active');
  });

  currentScreen = screenId;
}

/* ─── LOGIN ─── */
function handleLogin() {
  const input = document.getElementById('login-input');
  const error = document.getElementById('login-error');
  const val   = input.value.trim().toLowerCase();

  if (!val) {
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 500);
    return;
  }

  if (val.length < 2) {
    error.classList.add('show');
    input.classList.add('error');
    setTimeout(() => { input.classList.remove('error'); }, 500);
    return;
  }

  error.classList.remove('show');

  // Capitalize properly
  userName = input.value.trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // Update names in other screens
  document.getElementById('env-name').textContent = userName;
  document.getElementById('letter-name').textContent = userName;
  document.getElementById('final-name-display').textContent = userName;

  // Launch loading screen then gift
  goTo('screen-loading');
  setTimeout(() => {
    goTo('screen-gift');
    initGiftScreen();
  }, 2800);
}

// Allow Enter key
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('login-input');
  if (inp) {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });
  }
});

/* ─── GIFT SCREEN ─── */
function initGiftScreen() {
  const container = document.getElementById('gift-container');
  if (!container) return;
  container.addEventListener('click', openGift, { once: true });
  container.addEventListener('touchstart', e => {
    e.preventDefault();
    openGift();
  }, { passive: false, once: true });
}

let giftOpened = false;
function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const lid       = document.getElementById('gift-lid');
  const envPop    = document.getElementById('gift-envelope-pop');
  const box       = document.getElementById('gift-box');
  const sparkles  = document.getElementById('gift-sparkles');
  const container = document.getElementById('gift-container');

  container.style.animation = 'none';
  lid.classList.add('open');

  setTimeout(() => {
    envPop.classList.add('pop');
    box.classList.add('shrink');
    spawnSparkles(sparkles);
    spawnConfetti(40);
  }, 400);

  setTimeout(() => {
    goTo('screen-envelope');
    initEnvelopeScreen();
    giftOpened = false;
  }, 1800);
}

function spawnSparkles(container) {
  const symbols = ['✨','💜','🌸','⭐','💫'];
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const angle = (i / 12) * Math.PI * 2;
    const dist  = 60 + Math.random() * 50;
    s.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    s.style.left  = '50%';
    s.style.top   = '50%';
    s.style.animationDuration = `${0.6 + Math.random() * 0.5}s`;
    s.style.animationDelay   = `${Math.random() * 0.3}s`;
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    container.appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }
}

/* ─── ENVELOPE SCREEN ─── */
function initEnvelopeScreen() {
  const wrapper = document.getElementById('envelope-wrapper');
  if (!wrapper) return;
  wrapper.addEventListener('click', openEnvelope, { once: true });
  wrapper.addEventListener('touchstart', e => {
    e.preventDefault();
    openEnvelope();
  }, { passive: false, once: true });
}

function openEnvelope() {
  const env = document.getElementById('envelope');
  env.classList.add('open');
  spawnConfetti(25);
  setTimeout(() => {
    goTo('screen-letter');
  }, 800);
}

/* ─── LETTER → GAME ─── */
function goToGame() {
  spawnConfetti(20);
  goTo('screen-game');
  initMahjongGame();
}

/* ─── MAHJONG SOLITAIRE GAME ─── */
// Emojis for the game - 8 pairs = 16 tiles total
const MAHJONG_EMOJIS = ['💜', '🌸', '⭐', '🎀', '💖', '🦋', '🌙', '🌺'];

// Layout: Pyramid with 3 layers
// Each upper tile sits EXACTLY on top of one lower tile (same r,c)
// A tile is blocked ONLY if there's a tile directly above it (same r,c, higher layer)
// OR if both left and right neighbors in SAME layer touch it
const MAHJONG_LAYOUT = [
  // === LAYER 0 (bottom) === 12 tiles
  { r: 1, c: 2, layer: 0 }, { r: 1, c: 3, layer: 0 },  // row 1: 2 tiles
  { r: 2, c: 1, layer: 0 }, { r: 2, c: 2, layer: 0 }, { r: 2, c: 3, layer: 0 }, { r: 2, c: 4, layer: 0 },  // row 2: 4 tiles
  { r: 3, c: 1, layer: 0 }, { r: 3, c: 2, layer: 0 }, { r: 3, c: 3, layer: 0 }, { r: 3, c: 4, layer: 0 },  // row 3: 4 tiles
  { r: 4, c: 2, layer: 0 }, { r: 4, c: 3, layer: 0 },  // row 4: 2 tiles

  // === LAYER 1 (middle) === 4 tiles - each sits on top of layer 0 tile with same r,c
  { r: 2, c: 2, layer: 1 },  // on top of layer0 (2,2)
  { r: 2, c: 3, layer: 1 },  // on top of layer0 (2,3)
  { r: 3, c: 2, layer: 1 },  // on top of layer0 (3,2)
  { r: 3, c: 3, layer: 1 },  // on top of layer0 (3,3)
];

let mahjongTiles = [];
let mahjongSelected = null;
let mahjongPairs = 0;
let mahjongMoves = 0;
let mahjongLock = false;

function initMahjongGame() {
  mahjongSelected = null;
  mahjongPairs = 0;
  mahjongMoves = 0;
  mahjongLock = false;

  // Create pairs and shuffle
  const emojis = [...MAHJONG_EMOJIS, ...MAHJONG_EMOJIS];
  // Shuffle
  for (let i = emojis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
  }

  // Assign emojis to layout positions
  mahjongTiles = MAHJONG_LAYOUT.map((pos, index) => ({
    ...pos,
    id: index,
    emoji: emojis[index],
    removed: false,
    element: null
  }));

  // Ensure the game is solvable by checking
  if (!isMahjongSolvable()) {
    // Retry with new shuffle
    initMahjongGame();
    return;
  }

  renderMahjongBoard();
  updateMahjongStats();
  document.getElementById('mahjong-win').style.display = 'none';
}

function isMahjongSolvable() {
  // Simple check: at least one pair should be initially playable
  const playable = getPlayableTiles();
  const emojiCounts = {};
  playable.forEach(t => {
    emojiCounts[t.emoji] = (emojiCounts[t.emoji] || 0) + 1;
  });
  return Object.values(emojiCounts).some(c => c >= 2);
}

function getPlayableTiles() {
  return mahjongTiles.filter(tile => {
    if (tile.removed) return false;

    // Check if covered from above (same position, higher layer)
    const covered = mahjongTiles.some(t => 
      !t.removed && 
      t.layer > tile.layer && 
      Math.abs(t.r - tile.r) < 0.8 && 
      Math.abs(t.c - tile.c) < 0.8
    );
    if (covered) return false;

    // Check if both sides are blocked (left and right in same layer)
    const leftBlocked = mahjongTiles.some(t =>
      !t.removed &&
      t.layer === tile.layer &&
      t.id !== tile.id &&
      t.c === tile.c - 1 &&
      Math.abs(t.r - tile.r) < 0.5
    );

    const rightBlocked = mahjongTiles.some(t =>
      !t.removed &&
      t.layer === tile.layer &&
      t.id !== tile.id &&
      t.c === tile.c + 1 &&
      Math.abs(t.r - tile.r) < 0.5
    );

    // Playable if at least one side is free
    return !leftBlocked || !rightBlocked;
  });
}

function renderMahjongBoard() {
  const board = document.getElementById('mahjong-board');
  board.innerHTML = '';

  // First, create a wrapper for each grid cell that can hold multiple layers
  // We'll use absolute positioning within the grid cell for upper layers

  mahjongTiles.forEach(tile => {
    if (tile.removed) return;

    const tileEl = document.createElement('div');
    tileEl.className = 'mj-tile';
    tileEl.dataset.id = tile.id;
    tileEl.dataset.layer = tile.layer;

    // Position in grid (1-indexed)
    tileEl.style.gridRow = `${tile.r + 1}`;
    tileEl.style.gridColumn = `${tile.c + 1}`;

    // For layer 1 tiles that share the same cell as layer 0,
    // we need them to visually sit on top
    if (tile.layer > 0) {
      tileEl.style.zIndex = tile.layer + 1;
      // Slight offset to show they're on top
      tileEl.style.transform = `translateY(${-3 * tile.layer}px) scale(${1 + 0.02 * tile.layer})`;
    }

    // Check if playable
    const playable = isTilePlayable(tile);
    if (!playable) {
      tileEl.classList.add('blocked');
    }

    tileEl.addEventListener('click', () => handleMahjongClick(tile.id));
    tileEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleMahjongClick(tile.id);
    }, { passive: false });

    tile.element = tileEl;
    board.appendChild(tileEl);
  });

  updateMahjongVisuals();
}

function isTilePlayable(tile) {
  if (tile.removed) return false;

  // 1. Check if covered from above: a tile at EXACTLY same (r,c) with higher layer
  const covered = mahjongTiles.some(t => 
    !t.removed && 
    t.layer > tile.layer && 
    t.r === tile.r && 
    t.c === tile.c
  );
  if (covered) return false;

  // 2. Check if both left AND right sides are blocked (same layer, adjacent columns, same row)
  const leftBlocked = mahjongTiles.some(t =>
    !t.removed &&
    t.layer === tile.layer &&
    t.id !== tile.id &&
    t.c === tile.c - 1 &&
    t.r === tile.r
  );

  const rightBlocked = mahjongTiles.some(t =>
    !t.removed &&
    t.layer === tile.layer &&
    t.id !== tile.id &&
    t.c === tile.c + 1 &&
    t.r === tile.r
  );

  // Playable if at least one side is free (not both blocked)
  return !(leftBlocked && rightBlocked);
}

function updateMahjongVisuals() {
  mahjongTiles.forEach(tile => {
    if (tile.removed || !tile.element) return;

    const playable = isTilePlayable(tile);
    if (playable) {
      tile.element.classList.remove('blocked');
    } else {
      tile.element.classList.add('blocked');
    }

    // Always show the emoji on the tile
    tile.element.textContent = tile.emoji;
  });
}

function handleMahjongClick(id) {
  if (mahjongLock) return;

  const tile = mahjongTiles.find(t => t.id === id);
  if (!tile || tile.removed) return;
  if (!isTilePlayable(tile)) return;

  // If nothing selected, select this tile
  if (mahjongSelected === null) {
    mahjongSelected = id;
    tile.element.classList.add('selected');
    return;
  }

  // If clicking same tile, deselect
  if (mahjongSelected === id) {
    const prevTile = mahjongTiles.find(t => t.id === mahjongSelected);
    prevTile.element.classList.remove('selected');
    mahjongSelected = null;
    return;
  }

  // Try to match
  const prevTile = mahjongTiles.find(t => t.id === mahjongSelected);
  mahjongMoves++;

  if (prevTile.emoji === tile.emoji) {
    // Match!
    prevTile.element.classList.add('matched');
    tile.element.classList.add('matched');

    prevTile.removed = true;
    tile.removed = true;
    mahjongPairs++;
    mahjongSelected = null;

    spawnMiniHearts(prevTile.element);
    spawnMiniHearts(tile.element);

    setTimeout(() => {
      prevTile.element.style.display = 'none';
      tile.element.style.display = 'none';
      updateMahjongVisuals();
      updateMahjongStats();

      if (mahjongPairs >= MAHJONG_EMOJIS.length) {
        setTimeout(showMahjongWin, 500);
      }
    }, 400);
  } else {
    // No match
    tile.element.classList.add('wrong');

    setTimeout(() => {
      prevTile.element.classList.remove('selected');
      tile.element.classList.remove('wrong');
      mahjongSelected = null;
    }, 800);
  }

  updateMahjongStats();
}

function updateMahjongStats() {
  document.getElementById('mj-pairs').textContent = mahjongPairs;
  document.getElementById('mj-moves').textContent = mahjongMoves;
  document.getElementById('mj-remaining').textContent = MAHJONG_EMOJIS.length * 2 - mahjongPairs * 2;
}

function showMahjongWin() {
  document.getElementById('mahjong-win').style.display = 'block';
  document.querySelector('.mahjong-board-container').style.display = 'none';
  document.querySelector('.mahjong-header').style.display = 'none';
  spawnConfetti(50);
}

function spawnMiniHearts(fromEl) {
  const rect = fromEl.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const container = document.getElementById('particles-container');
  const EMOJIS = ['💜','💗','🌸','✨'];

  for (let i = 0; i < 5; i++) {
    const h = document.createElement('div');
    h.style.position  = 'fixed';
    h.style.left      = cx + 'px';
    h.style.top       = cy + 'px';
    h.style.fontSize  = `${14 + Math.random() * 12}px`;
    h.style.pointerEvents = 'none';
    h.style.zIndex    = '600';
    h.textContent     = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    h.style.transition = `all ${0.6 + Math.random() * 0.4}s ease`;
    container.appendChild(h);
    requestAnimationFrame(() => {
      const angle = (Math.random() * Math.PI * 2);
      const dist  = 40 + Math.random() * 60;
      h.style.transform   = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist-60}px)`;
      h.style.opacity     = '0';
    });
    setTimeout(() => h.remove(), 1200);
  }
}

/* ─── FINAL SCREEN ─── */
function goToFinal() {
  goTo('screen-final');
  spawnConfetti(70);
  setTimeout(() => spawnConfetti(50), 1200);
}

function launchConfetti() {
  spawnConfetti(80);
  setTimeout(() => spawnConfetti(60), 500);
  setTimeout(() => spawnConfetti(40), 1000);
}

/* ─── CONFETTI ─── */
function spawnConfetti(count) {
  const container = document.getElementById('particles-container');
  const COLORS = [
    '#c084fc','#a855f7','#e879f9','#f472b6',
    '#fce7f3','#ddd6fe','#fbcfe8','#e9d5ff',
    '#fff','#7c3aed'
  ];
  const SHAPES = ['50%', '0%', '3px'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left       = `${Math.random() * 100}%`;
    p.style.top        = `${-5 - Math.random() * 15}vh`;
    p.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    p.style.width      = `${5 + Math.random() * 9}px`;
    p.style.height     = `${5 + Math.random() * 9}px`;
    p.style.borderRadius = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    p.style.animationDuration = `${2 + Math.random() * 2.5}s`;
    p.style.animationDelay    = `${Math.random() * 0.8}s`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
}