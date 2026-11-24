/* ============================================================
   WorkDesk Tools — UI Rendering
   Nav tabs, pills, tool panels, cart, all tools directory
============================================================ */

/* ============================================================
   BUILD CATEGORY TABS (header nav)
============================================================ */
function buildNav() {
  const nav = document.getElementById('primaryNav');
  if (!nav) return;

  nav.innerHTML = CATEGORIES.map((c, i) => `
    <button type="button" data-cat-tab="${c.key}" onclick="openCategory('${c.key}')"
      class="cat-btn">${i + 1}. ${escHtml(c.label)}</button>
  `).join('');
}

/* ============================================================
   BUILD TOOL PILLS per category
============================================================ */
function buildPills() {
  CATEGORIES.forEach((cat) => {
    if (cat.key === 'all' || cat.key === 'hr') return;
    const holder = document.getElementById(`pills-${cat.key}`);
    if (!holder) return;
    const tools = TOOL_REGISTRY.filter((t) => t.cat === cat.key);
    holder.innerHTML = tools.map((t) => `
      <button type="button" data-pill-id="${t.id}" onclick="openTool('${cat.key}','${t.id}')"
        class="tool-select-pill">${escHtml(t.title)}</button>
    `).join('');
  });
}

/* ============================================================
   RENDER TOOL PANELS (static once)
============================================================ */
function renderToolPanels() {
  CATEGORIES.forEach((cat) => {
    if (cat.key === 'all' || cat.key === 'hr') return;
    const holder = document.getElementById(`panels-${cat.key}`);
    if (!holder) return;
    const tools = TOOL_REGISTRY.filter((t) => t.cat === cat.key);
    holder.innerHTML = tools.map((t) => renderToolPanel(t)).join('');
  });
}

/* ============================================================
   RENDER SINGLE TOOL PANEL
============================================================ */
function renderToolPanel(tool) {
  const pid = `tool-${tool.id}`;
  const inCart = cart.some((c) => c.cat === tool.cat && c.id === tool.id);

  const headerHtml = `
    <div class="flex items-start justify-between gap-2">
      <div>
        <h2>${escHtml(tool.title)}</h2>
        <p class="text-xs text-zinc-400 mt-0.5">${escHtml(tool.desc)}</p>
      </div>
      <button type="button" onclick="addToCart('${tool.cat}','${tool.id}')" title="Add to cart"
        class="tool-cart-btn ${inCart ? 'active' : ''}"
        style="width:36px;height:36px;border-radius:10px;border:none;font-size:15px;font-weight:700;cursor:pointer;flex-shrink:0;
        ${inCart ? 'background:linear-gradient(135deg,#f59e0b,#f97316);color:#1a0f00;' : 'background:rgba(99,102,241,0.2);color:#c7d2fe;'}">
        ${inCart ? '✓' : '★'}
      </button>
    </div>`;

  /* Generic unit converter */
  if (tool.type === 'generic-unit') {
    const unitKeys = Object.keys(tool.unitDef.units);
    return `
      <div id="${pid}" class="tool-panel is-hidden glass p-5 sm:p-6 space-y-4">
        ${headerHtml}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label class="lbl">Value</label>
            <input type="number" id="${tool.id}_val" value="1" step="any"
              oninput="runGenericUnit('${tool.id}')" class="inp" />
          </div>
          <div>
            <label class="lbl">From</label>
            <select id="${tool.id}_from" onchange="runGenericUnit('${tool.id}')" class="inp">
              ${unitKeys.map((k) => `<option value="${k}">${escHtml(k)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="lbl">To</label>
            <select id="${tool.id}_to" onchange="runGenericUnit('${tool.id}')" class="inp">
              ${unitKeys.map((k, i) => `<option value="${k}" ${i === 1 ? 'selected' : ''}>${escHtml(k)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="result-tile">
          <span class="result-label">Converted Result</span>
          <p id="${tool.id}_out" class="result-value big">—</p>
        </div>
      </div>`;
  }

  /* Land converter */
  if (tool.type === 'land-converter') {
    return `
      <div id="${pid}" class="tool-panel is-hidden glass p-5 sm:p-6 space-y-4">
        ${headerHtml}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label class="lbl">Land Value</label>
            <input type="number" id="land_val" value="1" step="any" oninput="runLandConverter()" class="inp" />
          </div>
          <div>
            <label class="lbl">From Unit</label>
            <select id="land_from" onchange="runLandConverter()" class="inp">
              <option value="bigha" selected>Bigha (custom)</option>
              <option value="gaj">Gaj / Sq. Yard</option>
              <option value="sqft">Sq. Feet</option>
              <option value="sqm">Sq. Meter</option>
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
            </select>
          </div>
          <div>
            <label class="lbl">To Unit</label>
            <select id="land_to" onchange="runLandConverter()" class="inp">
              <option value="sqft" selected>Sq. Feet</option>
              <option value="gaj">Gaj / Sq. Yard</option>
              <option value="bigha">Bigha (custom)</option>
              <option value="sqm">Sq. Meter</option>
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
            </select>
          </div>
        </div>
        <div class="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label class="lbl" style="margin-bottom:0">1 Bigha = how many Sq.Ft?</label>
            <span class="text-[11px] text-indigo-300/70">Regional adjustment</span>
          </div>
          <input type="number" id="customBighaSqFt" value="27225" min="1" step="any"
            oninput="runLandConverter()" class="inp sm:w-36" style="width:100%" />
        </div>
        <div class="result-tile">
          <span class="result-label">Converted Land Area</span>
          <p id="land_out" class="result-value big">—</p>
        </div>
      </div>`;
  }

  /* Temperature converter */
  if (tool.type === 'temp') {
    return `
      <div id="${pid}" class="tool-panel is-hidden glass p-5 sm:p-6 space-y-4">
        ${headerHtml}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label class="lbl">Value</label>
            <input type="number" id="temp_val" value="0" step="any" oninput="runTemp()" class="inp" />
          </div>
          <div>
            <label class="lbl">From</label>
            <select id="temp_from" onchange="runTemp()" class="inp">
              <option value="C" selected>°C</option>
              <option value="F">°F</option>
              <option value="K">K</option>
            </select>
          </div>
          <div>
            <label class="lbl">To</label>
            <select id="temp_to" onchange="runTemp()" class="inp">
              <option value="F" selected>°F</option>
              <option value="C">°C</option>
              <option value="K">K</option>
            </select>
          </div>
        </div>
        <div class="result-tile">
          <span class="result-label">Converted Temperature</span>
          <p id="temp_out" class="result-value big">—</p>
        </div>
      </div>`;
  }

  /* Standard inputs tool */
  const inputsHtml = tool.inputs.map((inp) => {
    const inpId = `${tool.id}_${inp.id}`;
    if (inp.type === 'select') {
      return `
        <div>
          <label class="lbl">${escHtml(inp.label)}</label>
          <select id="${inpId}" onchange="runTool('${tool.id}')" class="inp">
            ${inp.opts.map(([val, lab]) =>
              `<option value="${val}" ${val === inp.def ? 'selected' : ''}>${escHtml(lab)}</option>`
            ).join('')}
          </select>
        </div>`;
    }
    if (inp.type === 'date') {
      return `
        <div>
          <label class="lbl">${escHtml(inp.label)}</label>
          <input type="date" id="${inpId}" value="${escAttr(inp.def || '')}"
            onchange="runTool('${tool.id}')" class="inp" />
        </div>`;
    }
    if (inp.type === 'text') {
      return `
        <div class="sm:col-span-2">
          <label class="lbl">${escHtml(inp.label)}</label>
          <input type="text" id="${inpId}" value="${escAttr(inp.def || '')}"
            oninput="runTool('${tool.id}')" class="inp" />
        </div>`;
    }
    return `
      <div>
        <label class="lbl">${escHtml(inp.label)}</label>
        <input type="number" id="${inpId}" value="${inp.def}"
          step="${inp.step || 'any'}"
          ${inp.min !== undefined ? `min="${inp.min}"` : ''}
          ${inp.max !== undefined ? `max="${inp.max}"` : ''}
          oninput="runTool('${tool.id}')" class="inp" />
      </div>`;
  }).join('');

  return `
    <div id="${pid}" class="tool-panel is-hidden glass p-5 sm:p-6 space-y-4">
      ${headerHtml}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        ${inputsHtml}
      </div>
      <div id="${tool.id}_out" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="result-tile">
          <span class="result-label">Result</span>
          <p class="result-value">—</p>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   OPEN CATEGORY (hide all, show one)
============================================================ */
function openCategory(catKey, targetToolId = null) {
  currentCategory = catKey;
  if (targetToolId) currentToolByCat[catKey] = targetToolId;

  document.querySelectorAll('.category-view').forEach((sec) => sec.classList.add('is-hidden'));
  const sec = document.getElementById(`cat-${catKey}`);
  if (sec) sec.classList.remove('is-hidden');

  document.querySelectorAll('.cat-btn').forEach((btn) => {
    const active = btn.getAttribute('data-cat-tab') === catKey;
    btn.classList.toggle('active', active);
  });

  if (catKey === 'all') {
    renderAllToolsDirectory();
  } else if (catKey === 'hr') {
    if (typeof updateHrView === 'function') updateHrView();
  } else {
    const target = targetToolId || currentToolByCat[catKey] ||
      TOOL_REGISTRY.find((t) => t.cat === catKey)?.id;
    if (target) openTool(catKey, target);
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ============================================================
   OPEN TOOL (hide siblings, show one)
============================================================ */
function openTool(catKey, toolId) {
  currentToolByCat[catKey] = toolId;
  const sec = document.getElementById(`cat-${catKey}`);
  if (!sec) return;

  sec.querySelectorAll('.tool-panel').forEach((p) => p.classList.add('is-hidden'));
  const panel = document.getElementById(`tool-${toolId}`);
  if (panel) panel.classList.remove('is-hidden');

  sec.querySelectorAll('.tool-select-pill').forEach((pill) => {
    const match = pill.getAttribute('data-pill-id') === toolId;
    pill.classList.toggle('active', match);
  });

  const tool = TOOL_REGISTRY.find((t) => t.id === toolId);
  if (!tool) return;
  if (tool.type === 'generic-unit') runGenericUnit(toolId);
  else if (tool.type === 'land-converter') runLandConverter();
  else if (tool.type === 'temp') runTemp();
  else if (tool.calc) runTool(toolId);

  /* Update cart button state for this panel */
  const inCart = cart.some((c) => c.cat === catKey && c.id === toolId);
  const btn = panel?.querySelector('.tool-cart-btn');
  if (btn) {
    btn.textContent = inCart ? '✓' : '★';
    btn.classList.toggle('active', inCart);
    if (inCart) {
      btn.style.background = 'linear-gradient(135deg,#f59e0b,#f97316)';
      btn.style.color = '#1a0f00';
    } else {
      btn.style.background = 'rgba(99,102,241,0.2)';
      btn.style.color = '#c7d2fe';
    }
  }
}

/* ============================================================
   CART RENDERING
============================================================ */
function renderCart() {
  const badge = document.getElementById('cartBadge');
  const itemsEl = document.getElementById('cartItems');
  if (badge) {
    badge.textContent = cart.length;
    badge.classList.toggle('is-hidden', cart.length === 0);
  }
  if (!itemsEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `<p class="text-xs text-zinc-400 text-center py-10">Your cart is empty. Add tools using the ★ button.</p>`;
    return;
  }

  itemsEl.innerHTML = cart.map((c) => {
    const tool = TOOL_REGISTRY.find((t) => t.cat === c.cat && t.id === c.id);
    if (!tool) return '';
    const cat = CATEGORIES.find((x) => x.key === c.cat);
    const catLabel = cat?.label || c.cat;
    const dotColor = cat?.color || '#94a3b8';
    return `
      <div class="cart-item">
        <div class="min-w-0 flex items-start gap-2">
          <span class="cat-dot" style="background:${dotColor}"></span>
          <div class="min-w-0">
            <p class="cart-item-cat">${escHtml(catLabel)}</p>
            <p class="cart-item-title">${escHtml(tool.title)}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" onclick="openCategory('${c.cat}','${c.id}'); toggleCart(false)"
            class="cart-item-btn open" title="Open">▶</button>
          <button type="button" onclick="removeFromCart('${c.cat}','${c.id}')"
            class="cart-item-btn remove" title="Remove">✕</button>
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   ALL TOOLS DIRECTORY
============================================================ */
function renderAllToolsDirectory() {
  const q = (document.getElementById('allSearchInput')?.value || '').trim().toLowerCase();
  const catFilter = document.getElementById('allCatFilter')?.value || 'all';
  const grid = document.getElementById('allToolsGrid');
  const badge = document.getElementById('allToolsCountBadge');
  if (!grid) return;

  const items = TOOL_REGISTRY.map((t) => ({
    ...t,
    catLabel: CATEGORIES.find((c) => c.key === t.cat)?.label || t.cat,
  }));

  const filtered = items.filter((t) => {
    const catOk = catFilter === 'all' || t.cat === catFilter;
    const textOk = !q || (t.title + t.desc + t.catLabel).toLowerCase().includes(q);
    return catOk && textOk;
  });

  if (badge) badge.textContent = `Showing ${filtered.length} of ${items.length} tools`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="glass col-span-full p-6 text-center text-xs text-zinc-400">No matching tool.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((t) => {
    const inCart = cart.some((c) => c.cat === t.cat && c.id === t.id);
    return `
      <div class="all-tool-card">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">${escHtml(t.catLabel)}</span>
          <h2 class="text-sm font-bold text-white mt-0.5">${escHtml(t.title)}</h2>
          <p class="text-xs text-zinc-400 mt-1">${escHtml(t.desc)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="openCategory('${t.cat}','${t.id}')" class="tool-open flex-1">Open →</button>
          <button type="button" onclick="addToCart('${t.cat}','${t.id}')"
            class="tool-cart ${inCart ? 'active' : ''}" title="Add to cart">${inCart ? '✓' : '★'}</button>
        </div>
      </div>`;
  }).join('');
}