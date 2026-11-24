/* ============================================================
   WorkDesk Tools — Main (Init, Cart, Toast, Shortcuts)
   Ye file sabse last mein load hoti hai
============================================================ */

/* ============================================================
   STATE
============================================================ */
let currentCategory = 'finance';
const currentToolByCat = {};
let cart = [];

/* ============================================================
   CART — load / save / add / remove / toggle
============================================================ */
function loadCart() {
  try {
    const raw = localStorage.getItem('workdesk_cart');
    cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem('workdesk_cart', JSON.stringify(cart));
  } catch (e) { /* ignore */ }
  renderCart();
}

function addToCart(cat, id) {
  if (cart.some((c) => c.cat === cat && c.id === id)) {
    showToast('Already in cart');
    return;
  }
  cart.push({ cat, id });
  saveCart();
  showToast('Added to cart ★');
  refreshCartButtons();
}

function removeFromCart(cat, id) {
  cart = cart.filter((c) => !(c.cat === cat && c.id === id));
  saveCart();
  refreshCartButtons();
}

function clearCart() {
  cart = [];
  saveCart();
  refreshCartButtons();
  showToast('Cart cleared');
}

function openAllCartTools() {
  toggleCart(false);
  if (!cart.length) { showToast('Cart is empty', true); return; }
  const first = cart[0];
  openCategory(first.cat, first.id);
}

function toggleCart(open) {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (!panel || !overlay) return;
  if (open) {
    panel.classList.add('open');
    overlay.classList.add('open');
    renderCart();
  } else {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  }
}

/* Refresh ★/✓ buttons when cart changes */
function refreshCartButtons() {
  document.querySelectorAll('.tool-cart-btn, .tool-cart').forEach((btn) => {
    const onclick = btn.getAttribute('onclick') || '';
    const m = onclick.match(/addToCart\('([^']+)','([^']+)'\)/);
    if (!m) return;
    const [, cat, id] = m;
    const inCart = cart.some((c) => c.cat === cat && c.id === id);
    if (btn.classList.contains('tool-cart-btn')) {
      btn.textContent = inCart ? '✓' : '★';
      btn.classList.toggle('active', inCart);
      if (inCart) {
        btn.style.background = 'linear-gradient(135deg,#f59e0b,#f97316)';
        btn.style.color = '#1a0f00';
      } else {
        btn.style.background = 'rgba(99,102,241,0.2)';
        btn.style.color = '#c7d2fe';
      }
    } else {
      btn.textContent = inCart ? '✓' : '★';
      btn.classList.toggle('active', inCart);
    }
  });
  /* Refresh "Open" buttons inside cart list — re-render */
  renderCart();
}

/* ============================================================
   TOAST
============================================================ */
let toastTimer = null;

function showToast(msg, error = false) {
  const wrap = document.getElementById('toastWrap');
  const box = document.getElementById('toastBox');
  const txt = document.getElementById('toastMsg');
  if (!wrap || !box || !txt) return;
  txt.textContent = msg;
  box.classList.toggle('error', !!error);
  wrap.classList.remove('is-hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 3500);
}

function hideToast() {
  document.getElementById('toastWrap')?.classList.add('is-hidden');
}

/* ============================================================
   DEFAULTS for date inputs
============================================================ */
function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = val;
  };

  setVal('daily-age_dob', '1998-06-15');
  setVal('daily-age_ref', today);
  setVal('daily-date_start', today);
  setVal('daily-date_end', today);
}

/* ============================================================
   POPULATE "ALL CATEGORIES" SELECT in All Tools
============================================================ */
function populateAllCatFilter() {
  const sel = document.getElementById('allCatFilter');
  if (!sel) return;
  sel.innerHTML =
    `<option value="all">All Categories</option>` +
    CATEGORIES.filter((c) => c.key !== 'all').map((c) =>
      `<option value="${c.key}">${escHtml(c.label)}</option>`
    ).join('');
}

/* ============================================================
   INIT — runs once on page load
============================================================ */
function init() {
  /* 1. Load cart from storage */
  loadCart();

  /* 2. Build UI */
  buildNav();
  buildPills();
  renderToolPanels();
  populateAllCatFilter();
  renderCart();

  /* 3. Default dates */
  setDefaultDates();

  /* 4. Open first category */
  openCategory('finance');

  /* 5. Run initial tool calc for every category's default tool */
  CATEGORIES.forEach((cat) => {
    if (cat.key === 'all' || cat.key === 'hr') return;
    const firstTool = TOOL_REGISTRY.find((t) => t.cat === cat.key);
    if (!firstTool) return;
    /* Silently run calc so switching later shows fresh values */
    if (firstTool.type === 'generic-unit' || firstTool.type === 'land-converter' || firstTool.type === 'temp') {
      /* These are lazily run via openTool */
    } else if (firstTool.calc) {
      runTool(firstTool.id);
    }
  });

  /* 6. HR preview empty-state */
  updateHrView();
}

/* ============================================================
   KEYBOARD SHORTCUTS
============================================================ */
document.addEventListener('keydown', (e) => {
  /* ESC closes cart */
  if (e.key === 'Escape') toggleCart(false);
});

/* ============================================================
   BOOT
============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}