/* ============================================================
   WorkDesk Tools — Salary Slip (A4 Print + PDF)
   Excel/CSV upload, column mapping, preview, PDF, print
============================================================ */

/* ============================================================
   STATE
============================================================ */
let hrRows = [];
let hrHeaders = [];
let hrMapping = {};
let hrLogoData = null;

/* ============================================================
   FIELD DEFINITIONS (auto-map aliases)
============================================================ */
const HR_FIELDS = [
  { key: 'empCode',    label: 'Emp Code',          aliases: ['emp code', 'code', 'id', 'employee code', 'empcode'] },
  { key: 'empName',    label: 'Employee Name',     aliases: ['name', 'employee name', 'emp name', 'employeename'] },
  { key: 'designation',label: 'Designation',       aliases: ['designation', 'role', 'post', 'desig'] },
  { key: 'department', label: 'Department',        aliases: ['dept', 'department', 'division'] },
  { key: 'days',       label: 'Days Worked',       aliases: ['days', 'days worked', 'present', 'working days'] },
  { key: 'basic',      label: 'Basic',             aliases: ['basic', 'basic salary', 'basic pay'] },
  { key: 'da',         label: 'DA',                aliases: ['da', 'dearness allowance'] },
  { key: 'hra',        label: 'HRA',               aliases: ['hra', 'house rent', 'house rent allowance'] },
  { key: 'allow',      label: 'Other Allowances',  aliases: ['allowance', 'allow', 'other', 'other allowance'] },
  { key: 'ot',         label: 'Overtime',          aliases: ['ot', 'overtime', 'over time'] },
  { key: 'gross',      label: 'Gross',             aliases: ['gross', 'gross salary', 'total earnings'] },
  { key: 'pf',         label: 'PF',                aliases: ['pf', 'provident fund', 'epf'] },
  { key: 'esi',        label: 'ESI',               aliases: ['esi', 'esic'] },
  { key: 'advance',    label: 'Advance',           aliases: ['advance', 'loan', 'adv'] },
  { key: 'deductions', label: 'Other Deductions',  aliases: ['deduction', 'other deduction', 'other ded'] },
  { key: 'totalDed',   label: 'Total Deductions',  aliases: ['total deductions', 'total ded', 'ded total'] },
  { key: 'net',        label: 'Net Pay',           aliases: ['net', 'net pay', 'take home', 'net salary'] },
];

/* ============================================================
   SAMPLE CSV DOWNLOAD
============================================================ */
function downloadSampleCSV() {
  const headers = ['Emp Code','Employee Name','Designation','Department','Days Worked','Basic','DA','HRA','Other Allowance','Overtime','Gross','PF','ESI','Advance','Other Deduction','Total Deductions','Net Pay'];
  const rows = [
    ['EMP001','Rahul Sharma','Fitter','Production','26','12000','3000','5000','2000','800','22800','1800','0','500','0','2300','20500'],
    ['EMP002','Priya Verma','Operator','Assembly','25','11000','2800','4500','1800','500','20600','1650','0','0','0','1650','18950'],
    ['EMP003','Amit Patel','Supervisor','Quality','27','15000','3500','6000','2500','1000','28000','2250','0','1000','0','3250','24750'],
    ['EMP004','Sneha Reddy','Helper','Store','24','9000','2400','4000','1500','300','17200','1350','0','0','0','1350','15850'],
    ['EMP005','Vikram Singh','Technician','Maintenance','26','13000','3100','5200','2200','700','24200','1950','0','0','0','1950','22250'],
    ['EMP006','Anjali Nair','Accountant','Accounts','25','14000','3200','5500','2300','0','25000','2100','0','1500','0','3600','21400'],
  ];
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'salary_slip_sample.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Sample CSV downloaded');
}

/* ============================================================
   EXCEL / CSV UPLOAD
============================================================ */
function onHrExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const nameEl = document.getElementById('hrFileName');
  const infoEl = document.getElementById('hrFileInfo');
  if (nameEl) nameEl.textContent = file.name;
  if (infoEl) infoEl.textContent = (file.size / 1024).toFixed(1) + ' KB • Processing...';

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
      if (!json.length) { showToast('File is empty', true); return; }
      hrHeaders = Object.keys(json[0]);
      hrRows = json;
      autoMapColumns();
      buildMappingUI();
      if (infoEl) infoEl.textContent = json.length + ' rows loaded • ' + file.name;
      updateHrView();
      showToast('File loaded: ' + json.length + ' rows');
    } catch (err) {
      console.error(err);
      showToast('Error parsing file', true);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ============================================================
   LOAD 6 SAMPLE EMPLOYEES
============================================================ */
function loadSampleHrRows() {
  hrHeaders = ['Emp Code','Employee Name','Designation','Department','Days Worked','Basic','DA','HRA','Other Allowance','Overtime','Gross','PF','ESI','Advance','Other Deduction','Total Deductions','Net Pay'];
  hrRows = [
    { 'Emp Code':'EMP001','Employee Name':'Rahul Sharma','Designation':'Fitter','Department':'Production','Days Worked':'26','Basic':'12000','DA':'3000','HRA':'5000','Other Allowance':'2000','Overtime':'800','Gross':'22800','PF':'1800','ESI':'0','Advance':'500','Other Deduction':'0','Total Deductions':'2300','Net Pay':'20500' },
    { 'Emp Code':'EMP002','Employee Name':'Priya Verma','Designation':'Operator','Department':'Assembly','Days Worked':'25','Basic':'11000','DA':'2800','HRA':'4500','Other Allowance':'1800','Overtime':'500','Gross':'20600','PF':'1650','ESI':'0','Advance':'0','Other Deduction':'0','Total Deductions':'1650','Net Pay':'18950' },
    { 'Emp Code':'EMP003','Employee Name':'Amit Patel','Designation':'Supervisor','Department':'Quality','Days Worked':'27','Basic':'15000','DA':'3500','HRA':'6000','Other Allowance':'2500','Overtime':'1000','Gross':'28000','PF':'2250','ESI':'0','Advance':'1000','Other Deduction':'0','Total Deductions':'3250','Net Pay':'24750' },
    { 'Emp Code':'EMP004','Employee Name':'Sneha Reddy','Designation':'Helper','Department':'Store','Days Worked':'24','Basic':'9000','DA':'2400','HRA':'4000','Other Allowance':'1500','Overtime':'300','Gross':'17200','PF':'1350','ESI':'0','Advance':'0','Other Deduction':'0','Total Deductions':'1350','Net Pay':'15850' },
    { 'Emp Code':'EMP005','Employee Name':'Vikram Singh','Designation':'Technician','Department':'Maintenance','Days Worked':'26','Basic':'13000','DA':'3100','HRA':'5200','Other Allowance':'2200','Overtime':'700','Gross':'24200','PF':'1950','ESI':'0','Advance':'0','Other Deduction':'0','Total Deductions':'1950','Net Pay':'22250' },
    { 'Emp Code':'EMP006','Employee Name':'Anjali Nair','Designation':'Accountant','Department':'Accounts','Days Worked':'25','Basic':'14000','DA':'3200','HRA':'5500','Other Allowance':'2300','Overtime':'0','Gross':'25000','PF':'2100','ESI':'0','Advance':'1500','Other Deduction':'0','Total Deductions':'3600','Net Pay':'21400' },
  ];
  autoMapColumns();
  buildMappingUI();
  const nameEl = document.getElementById('hrFileName');
  if (nameEl) nameEl.textContent = '6 sample employees';
  const infoEl = document.getElementById('hrFileInfo');
  if (infoEl) infoEl.textContent = 'Sample data loaded';
  updateHrView();
  showToast('Sample employees loaded');
}

/* ============================================================
   AUTO-MAP COLUMNS
============================================================ */
function autoMapColumns() {
  hrMapping = {};
  hrHeaders.forEach((h) => {
    const norm = String(h).toLowerCase().trim();
    const match = HR_FIELDS.find((f) =>
      f.aliases.some((a) => norm === a || norm.includes(a))
    );
    if (match && !hrMapping[match.key]) hrMapping[match.key] = h;
  });
}

/* ============================================================
   BUILD MAPPING UI (manual override)
============================================================ */
function buildMappingUI() {
  const grid = document.getElementById('hrMapGrid');
  if (!grid) return;
  if (!hrHeaders.length) {
    grid.innerHTML = `<p class="col-span-full text-xs text-indigo-300/70">Upload a file or load sample to see mapping.</p>`;
    return;
  }
  grid.innerHTML = HR_FIELDS.map((f) => {
    const mapped = hrMapping[f.key] || '';
    return `
      <div>
        <label class="lbl" style="font-size:10px" title="${escAttr(f.label)}">${escHtml(f.label)}</label>
        <select onchange="updateMapping('${f.key}', this.value)" class="map-select">
          <option value="">— None —</option>
          ${hrHeaders.map((h) =>
            `<option value="${escAttr(h)}" ${h === mapped ? 'selected' : ''}>${escHtml(h)}</option>`
          ).join('')}
        </select>
      </div>`;
  }).join('');
}

function updateMapping(fieldKey, colName) {
  if (colName) hrMapping[fieldKey] = colName;
  else delete hrMapping[fieldKey];
  updateHrView();
}

/* ============================================================
   LOGO UPLOAD
============================================================ */
function onHrLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    hrLogoData = ev.target.result;
    document.getElementById('hrClearLogoBtn')?.classList.remove('is-hidden');
    updateHrView();
  };
  reader.readAsDataURL(file);
}

function clearHrLogo() {
  hrLogoData = null;
  const el = document.getElementById('hrLogo');
  if (el) el.value = '';
  document.getElementById('hrClearLogoBtn')?.classList.add('is-hidden');
  updateHrView();
}

/* ============================================================
   HELPERS
============================================================ */
function getVal(row, key) {
  const col = hrMapping[key];
  if (!col) return '';
  return row[col] ?? '';
}

function processHrRow(row) {
  const auto = document.getElementById('hrAutoCalc')?.checked ?? true;
  const r = {
    empCode: getVal(row, 'empCode'),
    empName: getVal(row, 'empName'),
    designation: getVal(row, 'designation'),
    department: getVal(row, 'department'),
    days: getVal(row, 'days'),
    basic: num(getVal(row, 'basic')),
    da: num(getVal(row, 'da')),
    hra: num(getVal(row, 'hra')),
    allow: num(getVal(row, 'allow')),
    ot: num(getVal(row, 'ot')),
    pf: num(getVal(row, 'pf')),
    esi: num(getVal(row, 'esi')),
    advance: num(getVal(row, 'advance')),
    otherDed: num(getVal(row, 'deductions')),
  };
  let gross = num(getVal(row, 'gross'));
  if (auto && !gross) gross = r.basic + r.da + r.hra + r.allow + r.ot;
  r.gross = gross;
  let totalDed = num(getVal(row, 'totalDed'));
  if (auto && !totalDed) totalDed = r.pf + r.esi + r.advance + r.otherDed;
  r.totalDed = totalDed;
  let net = num(getVal(row, 'net'));
  if (auto && !net) net = gross - totalDed;
  r.net = net;
  return r;
}

/* ============================================================
   SLIP HTML (B&W preview + PDF rendering)
============================================================ */
function slipHtml(emp, opts = {}) {
  const company = document.getElementById('hrCompany')?.value || '';
  const month = document.getElementById('hrMonth')?.value || '';
  const tpa = document.getElementById('hrTpa')?.value || '';
  const logo = hrLogoData ? `<img src="${hrLogoData}" class="h-8 w-8 object-contain" alt="logo">` : '';
  const fontSize = opts.compact ? '8.5px' : '10px';
  return `
    <div class="bw-slip" style="font-size:${fontSize}">
      <div class="bw-slip-head flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          ${logo}
          <div class="min-w-0">
            <div style="font-size:${opts.compact ? '10px' : '12px'};font-weight:800;line-height:1.1" class="truncate">${escHtml(company)}</div>
            <div style="font-size:${opts.compact ? '8px' : '9px'};color:#374151" class="truncate">Salary Slip — ${escHtml(month)} • TPA: ${escHtml(tpa)}</div>
          </div>
        </div>
        <div style="font-size:${opts.compact ? '8px' : '9px'};text-align:right;color:#374151;white-space:nowrap">
          <div style="font-weight:700">${escHtml(emp.empCode)}</div>
          <div>${escHtml(emp.empName)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:4px 6px;border-bottom:1px solid #d1d5db;font-size:${opts.compact ? '8px' : '9px'}">
        <div><b>Designation:</b> ${escHtml(emp.designation)}</div>
        <div><b>Department:</b> ${escHtml(emp.department)}</div>
        <div><b>Days Worked:</b> ${escHtml(emp.days)}</div>
        <div><b>Month:</b> ${escHtml(month)}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:6px">
        <div class="bw-slip-panel" style="padding:4px 6px">
          <div style="font-weight:700;border-bottom:1px solid #9ca3af;padding-bottom:2px;margin-bottom:3px">Earnings</div>
          <table class="bw-table">
            <tr><td>Basic</td><td class="num">${inr(emp.basic)}</td></tr>
            <tr><td>DA</td><td class="num">${inr(emp.da)}</td></tr>
            <tr><td>HRA</td><td class="num">${inr(emp.hra)}</td></tr>
            <tr><td>Other Allow.</td><td class="num">${inr(emp.allow)}</td></tr>
            <tr><td>Overtime</td><td class="num">${inr(emp.ot)}</td></tr>
            <tr style="font-weight:700;background:#f3f4f6"><td>Gross</td><td class="num">${inr(emp.gross)}</td></tr>
          </table>
        </div>
        <div class="bw-slip-panel" style="padding:4px 6px">
          <div style="font-weight:700;border-bottom:1px solid #9ca3af;padding-bottom:2px;margin-bottom:3px">Deductions</div>
          <table class="bw-table">
            <tr><td>PF</td><td class="num">${inr(emp.pf)}</td></tr>
            <tr><td>ESI</td><td class="num">${inr(emp.esi)}</td></tr>
            <tr><td>Advance</td><td class="num">${inr(emp.advance)}</td></tr>
            <tr><td>Other Ded.</td><td class="num">${inr(emp.otherDed)}</td></tr>
            <tr style="font-weight:700;background:#f3f4f6"><td>Total Ded.</td><td class="num">${inr(emp.totalDed)}</td></tr>
          </table>
        </div>
      </div>
      <div class="bw-slip-net flex items-center justify-between" style="font-size:${opts.compact ? '10px' : '12px'}">
        <span style="font-weight:700">NET PAY</span>
        <span style="font-weight:800">${inr(emp.net)}</span>
      </div>
      <div style="font-size:7px;color:#4b5563;padding:3px 6px;text-align:center;border-top:1px solid #d1d5db">
        This is a computer-generated salary slip. No signature required.
      </div>
    </div>`;
}

/* ============================================================
   UPDATE PREVIEW
============================================================ */
function updateHrView() {
  const container = document.getElementById('hrPreviewContainer');
  if (!container) return;
  if (!hrRows.length) {
    container.innerHTML = `<div class="bw-slip" style="padding:20px;text-align:center;color:#4b5563;font-size:12px">Upload an Excel/CSV file or click "Load 6 Sample Employees" to preview.</div>`;
    updatePageSummary();
    return;
  }
  const emp = processHrRow(hrRows[0]);
  container.innerHTML = slipHtml(emp);
  updatePageSummary();
}

/* ============================================================
   PER-PAGE + SUMMARY
============================================================ */
function getPerPage() {
  const r = document.querySelector('input[name="hrPerPage"]:checked');
  return r ? parseInt(r.value, 10) : 2;
}

function updatePageSummary() {
  const summary = document.getElementById('hrPageSummary');
  if (!summary) return;
  const perPage = getPerPage();
  const pages = Math.ceil(hrRows.length / perPage) || 0;
  summary.textContent = `${hrRows.length} Slips • ${pages} Page${pages === 1 ? '' : 's'}`;
}

/* ============================================================
   GENERATE PDF (chunked by page)
============================================================ */
async function generateHrPdf() {
  if (!hrRows.length) { showToast('Please upload a file or load sample first', true); return; }
  if (!window.jspdf || !window.html2canvas) { showToast('PDF libraries not loaded', true); return; }

  const { jsPDF } = window.jspdf;
  const perPage = getPerPage();
  const gridClass = perPage === 1 ? 'a4-grid-1' : perPage === 2 ? 'a4-grid-2' : 'a4-grid-4';
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  const stage = document.getElementById('pdfStage');

  const progressWrap = document.getElementById('hrProgressWrap');
  const progressBar = document.getElementById('hrProgressBar');
  const progressText = document.getElementById('hrProgressText');
  const progressPct = document.getElementById('hrProgressPct');
  if (progressWrap) progressWrap.classList.remove('is-hidden');

  const employees = hrRows.map((r) => processHrRow(r));
  const totalPages = Math.ceil(employees.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    const chunk = employees.slice(p * perPage, p * perPage + perPage);
    stage.innerHTML = `
      <div class="a4-sheet ${gridClass}">
        ${chunk.map((emp) => slipHtml(emp, { compact: perPage === 4 })).join('')}
      </div>`;
    const canvas = await html2canvas(stage.querySelector('.a4-sheet'), {
      scale: 2, backgroundColor: '#ffffff', logging: false, useCORS: true,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    if (p > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, '', 'FAST');

    const pct = Math.round(((p + 1) / totalPages) * 100);
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressPct) progressPct.textContent = pct + '%';
    if (progressText) progressText.textContent = `Rendering page ${p + 1} of ${totalPages}...`;
  }

  stage.innerHTML = '';
  const monthVal = document.getElementById('hrMonth')?.value || 'salary';
  const fileName = `Salary_Slips_${monthVal.replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
  if (progressWrap) setTimeout(() => progressWrap.classList.add('is-hidden'), 1200);
  showToast('PDF downloaded: ' + fileName);
}

/* ============================================================
   PRINT (A4) — browser native
============================================================ */
function printSalarySlips() {
  if (!hrRows.length) { showToast('Load data first', true); return; }
  const perPage = getPerPage();
  const gridClass = perPage === 1 ? 'a4-grid-1' : perPage === 2 ? 'a4-grid-2' : 'a4-grid-4';
  const stage = document.getElementById('pdfStage');
  stage.innerHTML = '';

  const employees = hrRows.map((r) => processHrRow(r));
  const totalPages = Math.ceil(employees.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    const chunk = employees.slice(p * perPage, p * perPage + perPage);
    const sheet = document.createElement('div');
    sheet.className = `a4-sheet ${gridClass}`;
    sheet.innerHTML = chunk.map((emp) => slipHtml(emp, { compact: perPage === 4 })).join('');
    stage.appendChild(sheet);
  }

  setTimeout(() => window.print(), 100);
}