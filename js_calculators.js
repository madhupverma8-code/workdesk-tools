/* ============================================================
   WorkDesk Tools — Calculators (Runners & Helpers)
   Ye file js_data.js ke calc() functions ko chalati hai
============================================================ */

/* ============================================================
   HELPERS (number, currency, escape)
============================================================ */
function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (v === null || v === undefined || v === '') return 0;
  const cleaned = String(v).replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function fmt(n) {
  if (!isFinite(n)) return '—';
  return (Math.round(n * 100) / 100).toLocaleString('en-IN');
}

function inr(n) {
  const r = Math.round(n * 100) / 100;
  return '₹' + r.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(r) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ============================================================
   RUN STANDARD TOOL (inputs-based)
   Reads all input fields for a tool, calls calc(), renders results
============================================================ */
function runTool(toolId) {
  const tool = TOOL_REGISTRY.find((t) => t.id === toolId);
  if (!tool || !tool.calc) return;

  const values = {};
  tool.inputs.forEach((inp) => {
    const el = document.getElementById(`${tool.id}_${inp.id}`);
    if (!el) return;
    values[inp.id] = inp.type === 'number' ? num(el.value) : el.value;
  });

  let result;
  try {
    result = tool.calc(values);
  } catch (err) {
    console.error('calc error', toolId, err);
    return;
  }

  const outEl = document.getElementById(`${tool.id}_out`);
  if (!outEl) return;

  outEl.innerHTML = result.out.map((o) => {
    const cls = o.big ? 'result-value big' : 'result-value';
    const color = o.money ? ' result-money' : (o.amber ? ' result-amber' : '');
    return `
      <div class="result-tile">
        <span class="result-label">${escHtml(o.label)}</span>
        <p class="${cls}${color}">${escHtml(String(o.value))}</p>
      </div>`;
  }).join('');
}

/* ============================================================
   RUN GENERIC UNIT CONVERTER
   Uses tool.unitDef.units map
============================================================ */
function runGenericUnit(toolId) {
  const tool = TOOL_REGISTRY.find((t) => t.id === toolId);
  if (!tool || !tool.unitDef) return;

  const valEl = document.getElementById(`${toolId}_val`);
  const fromEl = document.getElementById(`${toolId}_from`);
  const toEl = document.getElementById(`${toolId}_to`);
  const outEl = document.getElementById(`${toolId}_out`);
  if (!valEl || !fromEl || !toEl || !outEl) return;

  const val = num(valEl.value);
  const from = fromEl.value;
  const to = toEl.value;
  const units = tool.unitDef.units;

  const base = val * units[from];
  const out = base / units[to];
  outEl.textContent = fmt(out) + ' ' + to;
}

/* ============================================================
   RUN TEMPERATURE CONVERTER
============================================================ */
function runTemp() {
  const valEl = document.getElementById('temp_val');
  const fromEl = document.getElementById('temp_from');
  const toEl = document.getElementById('temp_to');
  const outEl = document.getElementById('temp_out');
  if (!valEl || !fromEl || !toEl || !outEl) return;

  const v = num(valEl.value);
  const from = fromEl.value;
  const to = toEl.value;

  let c;
  if (from === 'C') c = v;
  else if (from === 'F') c = (v - 32) * 5 / 9;
  else c = v - 273.15;

  let out;
  if (to === 'C') out = c;
  else if (to === 'F') out = c * 9 / 5 + 32;
  else out = c + 273.15;

  outEl.textContent = fmt(out) + ' °' + to;
}

/* ============================================================
   RUN LAND CONVERTER (custom Bigha support)
============================================================ */
function runLandConverter() {
  const valEl = document.getElementById('land_val');
  const fromEl = document.getElementById('land_from');
  const toEl = document.getElementById('land_to');
  const bighaEl = document.getElementById('customBighaSqFt');
  const outEl = document.getElementById('land_out');
  if (!valEl || !fromEl || !toEl || !outEl) return;

  const customBigha = num(bighaEl?.value) || 27225;
  const val = num(valEl.value);
  const from = fromEl.value;
  const to = toEl.value;

  const toSqFt = {
    sqft: 1,
    sqm: 10.7639,
    gaj: 9,
    acre: 43560,
    hectare: 107639,
    bigha: customBigha,
  };

  const base = val * toSqFt[from];
  const out = base / toSqFt[to];
  outEl.textContent = fmt(out) + ' ' + to;
}