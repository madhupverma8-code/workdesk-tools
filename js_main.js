/* ============================================================
   WorkDesk Tools — Main (Init, Cart, Toast, Shortcuts)
============================================================ */

let currentCategory = 'finance';
const currentToolByCat = {};
let cart = [];

/* ================= CART ================= */
function loadCart() {
  try {
    const raw = localStorage.getItem('workdesk_cart');
    cart = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(cart)) cart = [];
  } catch (e) { cart = []; }
}
function saveCart() {
  try { localStorage.setItem('workdesk_cart', JSON.stringify(cart)); } catch (e) {}
  renderCart();
}
function addToCart(cat, id) {
  if (cart.some((c) => c.cat === cat && c.id === id)) { showToast('Already in cart'); return; }
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
  if (open) { panel.classList.add('open'); overlay.classList.add('open'); renderCart(); }
  else { panel.classList.remove('open'); overlay.classList.remove('open'); }
}
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
      btn.style.background = inCart ? 'linear-gradient(135deg,#f59e0b,#f97316)' : 'rgba(139,92,246,0.18)';
      btn.style.color = inCart ? '#1a0f00' : '#c4b5fd';
    } else {
      btn.textContent = inCart ? '✓' : '★';
      btn.classList.toggle('active', inCart);
    }
  });
  renderCart();
}

/* ================= TOAST ================= */
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

/* ================= DEFAULT DATES ================= */
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

/* ================= ALL CAT FILTER ================= */
function populateAllCatFilter() {
  const sel = document.getElementById('allCatFilter');
  if (!sel) return;
  sel.innerHTML =
    `<option value="all">All Categories</option>` +
    CATEGORIES.filter((c) => c.key !== 'all').map((c) =>
      `<option value="${c.key}">${escHtml(c.label)}</option>`
    ).join('');
}

/* ================= FOOTER YEAR ================= */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ================= INIT ================= */
function init() {
  loadCart();
  buildNav();
  buildPills();
  renderToolPanels();
  populateAllCatFilter();
  renderCart();
  setDefaultDates();
  setFooterYear();        // ← new
  openCategory('finance');

  CATEGORIES.forEach((cat) => {
    if (cat.key === 'all' || cat.key === 'hr') return;
    const firstTool = TOOL_REGISTRY.find((t) => t.cat === cat.key);
    if (!firstTool) return;
    if (firstTool.type !== 'generic-unit' && firstTool.type !== 'land-converter' &&
        firstTool.type !== 'temp' && firstTool.calc) {
      runTool(firstTool.id);
    }
  });

  updateHrView();
}

/* ================= KEYBOARD ================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleCart(false);
});

/* ================= BOOT ================= */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
