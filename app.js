const DB_KEY = 'concrete_plant_system';

function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : null;
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function initData() {
  try {
    const testKey = '_test_storage';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
  } catch (e) {
    showToast('您的浏览器不支持本地存储，系统无法正常运行', 'error');
    return;
  }
  const existing = localStorage.getItem(DB_KEY);
  if (existing) {
    const db = JSON.parse(existing);
    let changed = false;
    if (!db.fixedPersonnel) { db.fixedPersonnel = []; changed = true; }
    if (!db.fixedMachinery) { db.fixedMachinery = []; changed = true; }
    if (!db.fixedExpenses) { db.fixedExpenses = []; changed = true; }
    if (changed) localStorage.setItem(DB_KEY, JSON.stringify(db));
    return;
  }
  const db = {
    users: [
      { id: 'admin', username: 'admin', password: '123456', role: 'super_admin', name: '超级管理员', projects: ['jx5','jx15','py9'] },
      { id: 'leader', username: 'leader', password: '123456', role: 'leader', name: '公司领导', projects: ['jx5','jx15','py9'] },
      { id: 'jx5', username: 'jx5', password: '123456', role: 'project_manager', name: '金西5标负责人', projects: ['jx5'] },
      { id: 'jx15', username: 'jx15', password: '123456', role: 'project_manager', name: '金西15标负责人', projects: ['jx15'] },
      { id: 'py9', username: 'py9', password: '123456', role: 'project_manager', name: '攀盐9标负责人', projects: ['py9'] },
      { id: 'finance', username: 'finance', password: '123456', role: 'finance', name: '财务', projects: ['jx5','jx15','py9'] }
    ],
    projects: [
      { id: 'jx5', name: '金西5标拌合站', defaultProcessingPrice: 30, defaultTransportPrice: 20, targetVolume: 180000 },
      { id: 'jx15', name: '金西15标拌合站', defaultProcessingPrice: 28, defaultTransportPrice: 18, targetVolume: 150000 },
      { id: 'py9', name: '攀盐9标拌合站', defaultProcessingPrice: 35, defaultTransportPrice: 22, targetVolume: 120000 }
    ],
    costTypes: [
      { id: 'diesel', name: '柴油', enabled: true },
      { id: 'repair', name: '维修', enabled: true },
      { id: 'lube', name: '润滑油', enabled: true },
      { id: 'reimbursement', name: '报销', enabled: true },
      { id: 'cafeteria', name: '食堂', enabled: true },
      { id: 'office', name: '办公', enabled: true },
      { id: 'consumable', name: '易损件', enabled: true },
      { id: 'parts', name: '配件', enabled: true },
      { id: 'other', name: '其它', enabled: true }
    ],
    fixedPersonnel: [
      { id: 'fp1', name: '张工', position: '站长', projectId: 'jx5', monthlySalary: 8000, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fp2', name: '李师傅', position: '操作员', projectId: 'jx5', monthlySalary: 5000, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fp3', name: '王工', position: '站长', projectId: 'jx15', monthlySalary: 7500, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fp4', name: '刘师傅', position: '操作员', projectId: 'py9', monthlySalary: 5500, startDate: '2026-01-01', endDate: '', note: '' }
    ],
    fixedMachinery: [
      { id: 'fm1', name: '装载机', unit: '租赁公司A', projectId: 'jx5', monthlyRent: 12000, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fm2', name: '发电机', unit: '租赁公司B', projectId: 'jx15', monthlyRent: 5000, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fm3', name: '地泵', unit: '租赁公司A', projectId: 'py9', monthlyRent: 8000, startDate: '2026-02-01', endDate: '', note: '' }
    ],
    fixedExpenses: [
      { id: 'fe1', name: '办公房租', projectId: 'jx5', amount: 3000, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fe2', name: '网络费', projectId: 'jx5', amount: 500, startDate: '2026-01-01', endDate: '', note: '' },
      { id: 'fe3', name: '保险费', projectId: 'jx15', amount: 2000, startDate: '2026-01-01', endDate: '2026-12-31', note: '年度保险' }
    ],
    dailyRecords: generateSampleRecords()
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function generateSampleRecords() {
  const records = [];
  const projects = ['jx5', 'jx15', 'py9'];
  const today = new Date();
  for (let d = 30; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    projects.forEach((pid, pi) => {
      const prodVol = Math.round(80 + Math.random() * 120);
      const prices = { jx5: 30, jx15: 28, py9: 35 };
      const transPrices = { jx5: 20, jx15: 18, py9: 22 };
      const extraVol = Math.round(Math.random() * 10);
      const extraPrices = { jx5: 25, jx15: 22, py9: 28 };
      const costs = [
        { costTypeId: 'diesel', amount: Math.round(3000 + Math.random() * 2000), quantity: Math.round(100 + Math.random() * 80), note: '' },
        { costTypeId: 'repair', amount: Math.round(500 + Math.random() * 1500), quantity: '', note: '' },
        { costTypeId: 'reimbursement', amount: Math.round(2000 + Math.random() * 1000), quantity: '', note: '' },
        { costTypeId: 'other', amount: Math.round(200 + Math.random() * 500), quantity: '', note: '' }
      ];
      records.push({
        id: 'rec_' + dateStr + '_' + pid,
        date: dateStr,
        projectId: pid,
        productionVolume: prodVol,
        processingUnitPrice: prices[pid],
        transportVolume: prodVol,
        transportUnitPrice: transPrices[pid],
        contractOutsideTransportVolume: extraVol,
        contractOutsideTransportUnitPrice: extraPrices[pid],
        costs: costs,
        note: '',
        createdBy: projects[0],
        createdAt: dateStr + 'T08:00:00'
      });
    });
  }
  return records;
}

function genId() { return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6); }

function formatNum(n) {
  if (n == null || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(n) {
  if (n == null || isNaN(n) || !isFinite(n)) return '0.0%';
  return (n * 100).toFixed(1) + '%';
}

function formatWan(n) {
  if (n == null || isNaN(n)) return '0';
  return (n / 10000).toFixed(1);
}

function formatAmt(n) {
  if (n == null || isNaN(n)) return '¥0万';
  return '¥' + (n / 10000).toFixed(2) + '万';
}

function formatProfit(n) {
  if (n == null || isNaN(n)) return '¥0万';
  const prefix = n >= 0 ? '+' : '';
  return prefix + '¥' + (Math.abs(n) / 10000).toFixed(2) + '万';
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function currentMonthStr() { return new Date().toISOString().slice(0, 7); }

function calcMonthlyFixedCost(projectId, monthStr) {
  const db = getDB();
  const [y, m] = monthStr.split('-').map(Number);
  const monthStart = monthStr + '-01';
  const monthEnd = new Date(y, m, 0).toISOString().slice(0, 10);
  let total = 0;
  (db.fixedPersonnel || []).forEach(p => {
    if (p.projectId !== projectId) return;
    if (p.startDate > monthEnd) return;
    if (p.endDate && p.endDate < monthStart) return;
    total += p.monthlySalary || 0;
  });
  (db.fixedMachinery || []).forEach(mc => {
    if (mc.projectId !== projectId) return;
    if (mc.startDate > monthEnd) return;
    if (mc.endDate && mc.endDate < monthStart) return;
    total += mc.monthlyRent || 0;
  });
  (db.fixedExpenses || []).forEach(fe => {
    if (fe.projectId !== projectId) return;
    if (fe.startDate > monthEnd) return;
    if (fe.endDate && fe.endDate < monthStart) return;
    total += fe.amount || 0;
  });
  return total;
}

function calcDailyFixedCost(projectId, dateStr) {
  const monthStr = dateStr.slice(0, 7);
  const monthTotal = calcMonthlyFixedCost(projectId, monthStr);
  const daysInMonth = new Date(parseInt(monthStr.slice(0,4)), parseInt(monthStr.slice(5,7)), 0).getDate();
  return monthTotal / daysInMonth;
}

function calcCumulativeFixedCost(projectId) {
  const db = getDB();
  const records = db.dailyRecords.filter(r => r.projectId === projectId);
  if (records.length === 0) return 0;
  const months = new Set();
  records.forEach(r => months.add(r.date.slice(0, 7)));
  let total = 0;
  months.forEach(m => total += calcMonthlyFixedCost(projectId, m));
  return total;
}

function getProjectName(pid) {
  const db = getDB();
  const p = db.projects.find(x => x.id === pid);
  return p ? p.name : pid;
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let currentUser = null;

function init() {
  initData();
  const saved = sessionStorage.getItem('currentUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('app').classList.remove('active');
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('app').classList.add('active');
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('topBarUser').textContent = currentUser.name;
  const roleMap = { super_admin: '超级管理员', leader: '公司领导', project_manager: '项目负责人', finance: '财务' };
  document.getElementById('userRole').textContent = roleMap[currentUser.role] || currentUser.role;
  const pnames = currentUser.projects.map(getProjectName).join('、');
  document.getElementById('userProjects').textContent = '负责项目：' + pnames;
  document.getElementById('navSettings').style.display = currentUser.role === 'super_admin' ? 'flex' : 'none';
  navigate('dashboard');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  document.getElementById('loginError').textContent = '';
  if (!username || !password) { document.getElementById('loginError').textContent = '请输入账号和密码'; return; }
  const db = getDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) { document.getElementById('loginError').textContent = '账号或密码错误'; return; }
  currentUser = { ...user, password: undefined };
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  showApp();
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  showLogin();
});

function canEdit() { return currentUser.role === 'super_admin' || currentUser.role === 'project_manager'; }
function canEditSettlement() { return currentUser.role === 'super_admin' || currentUser.role === 'finance'; }
function canManageSettings() { return currentUser.role === 'super_admin'; }
function canAccessProject(pid) { return currentUser.projects.includes(pid); }
function canModifyProject(pid) {
  if (currentUser.role === 'super_admin') return true;
  if (currentUser.role === 'project_manager' && currentUser.projects.includes(pid)) return true;
  return false;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sideOverlay').classList.toggle('show');
}

// Touch support for mobile sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      toggleSidebar();
    });
  }
});

function navigate(page) {
  // Close mobile sidebar if open
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sideOverlay').classList.remove('show');

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageId = 'page' + page.charAt(0).toUpperCase() + page.slice(1);
  const pg = document.getElementById(pageId);
  if (pg) pg.classList.add('active');
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'daily': renderDaily(); break;
    case 'ledger': renderLedger(); break;
    case 'settlement': renderSettlement(); break;
    case 'analysis': renderAnalysis(); break;
    case 'settings': renderSettings(); break;
  }
}

document.getElementById('nav').addEventListener('click', function(e) {
  const item = e.target.closest('.nav-item');
  if (item) {
    const page = item.dataset.page;
    if (page === 'settings' && !canManageSettings()) { showToast('无权访问设置', 'error'); return; }
    navigate(page);
  }
});

document.getElementById('settingsTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.tab-item');
  if (!tab) return;
  document.querySelectorAll('#settingsTabs .tab-item').forEach(el => el.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('#pageSettings .tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
});

document.getElementById('ledgerTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.tab-item');
  if (!tab) return;
  document.querySelectorAll('#ledgerTabs .tab-item').forEach(el => el.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('#pageLedger .tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
});

let toastTimer = null;
function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + (type || 'info');
  clearTimeout(toastTimer);
  requestAnimationFrame(() => el.classList.add('show'));
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

function showModal(title, html) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function calcIncome(rec) {
  return (rec.productionVolume || 0) * (rec.processingUnitPrice || 0)
    + (rec.transportVolume || 0) * (rec.transportUnitPrice || 0)
    + (rec.contractOutsideTransportVolume || 0) * (rec.contractOutsideTransportUnitPrice || 0);
}

function calcCost(rec) {
  if (!rec.costs || !rec.costs.length) return 0;
  return rec.costs.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
}

// ========== Dashboard ==========
function renderDashboard() {
  const db = getDB();
  const projects = db.projects.filter(p => canAccessProject(p.id));
  const today = todayStr();
  const isPM = currentUser.role === 'project_manager';
  const projData = projects.map(proj => {
    const records = db.dailyRecords.filter(r => r.projectId === proj.id);
    const todayRec = records.find(r => r.date === today);
    const month = today.slice(0, 7);
    const monthRecs = records.filter(r => r.date.startsWith(month));
    const todayFloating = todayRec ? calcCost(todayRec) : 0;
    const todayIncome = todayRec ? calcIncome(todayRec) : 0;
    const todayFixed = calcDailyFixedCost(proj.id, today);
    const monthIncome = monthRecs.reduce((s, r) => s + calcIncome(r), 0);
    const monthFloating = monthRecs.reduce((s, r) => s + calcCost(r), 0);
    const monthFixed = calcMonthlyFixedCost(proj.id, month);
    const allIncome = records.reduce((s, r) => s + calcIncome(r), 0);
    const allFloating = records.reduce((s, r) => s + calcCost(r), 0);
    const allFixed = calcCumulativeFixedCost(proj.id);
    const allProd = records.reduce((s, r) => s + (r.productionVolume || 0), 0);
    return {
      proj, records, todayRec,
      todayProd: todayRec ? todayRec.productionVolume : 0,
      todayIncome, todayFloating, todayFixed,
      todayProfit: todayIncome - todayFloating - todayFixed,
      monthIncome, monthFloating, monthFixed,
      monthProfit: monthIncome - monthFloating - monthFixed,
      allIncome, allFloating, allFixed, allProd,
      allProfit: allIncome - allFloating - allFixed,
      submitted: !!todayRec
    };
  });

  const totals = projData.reduce((t, d) => ({
    todayProd: t.todayProd + d.todayProd,
    todayIncome: t.todayIncome + d.todayIncome,
    todayCost: t.todayCost + (d.todayFloating + d.todayFixed),
    todayProfit: t.todayProfit + d.todayProfit
  }), { todayProd: 0, todayIncome: 0, todayCost: 0, todayProfit: 0 });

  renderTopSection(projData, isPM);
  renderOverview(totals);
  renderCumulative(projData);
  renderAlerts(projData);
  renderProjectCards(projData);
  renderRanking(projData);
}

function renderTopSection(projData, isPM) {
  const container = document.getElementById('dashTop');
  const roleMap = { super_admin: '超级管理员', leader: '公司领导', project_manager: '项目负责人', finance: '财务' };
  if (isPM) {
    const myData = projData[0];
    const done = myData && myData.submitted;
    container.innerHTML = `<div class="dash-top">
      <div class="dash-welcome">
        <h1>欢迎回来，${currentUser.name}</h1>
        <div class="sub">${done ? '<span class="check">✅</span> 今日经营数据已完成' : '☐ 录入今日经营 &nbsp;·&nbsp; ☐ 查看今日利润'}</div>
      </div>
      <div class="dash-actions">
        <button class="btn btn-primary" onclick="navigate('daily')">＋ 今日经营</button>
        <button class="btn btn-outline" onclick="navigate('settlement')">进入结算</button>
      </div>
    </div>`;
  } else {
    container.innerHTML = `<div class="dash-top">
      <div class="dash-welcome">
        <h1>经营驾驶舱</h1>
        <div class="sub">${roleMap[currentUser.role] || ''} · <span class="highlight">${todayStr()}</span></div>
      </div>
      <div class="dash-actions">
        <button class="btn btn-primary" onclick="navigate('daily')">＋ 今日经营</button>
        <button class="btn btn-outline" onclick="navigate('settlement')">进入结算</button>
      </div>
    </div>`;
  }
}

function renderOverview(totals) {
  document.getElementById('dashOverview').innerHTML = `<div class="dash-overview">
    <div class="ov-card"><div class="ov-icon">🏗️</div><div class="ov-label">今日生产</div><div class="ov-value dark">${totals.todayProd}<span style="font-size:16px;"> m³</span></div><div class="ov-sub">全项目合计</div></div>
    <div class="ov-card"><div class="ov-icon">💰</div><div class="ov-label">今日收入</div><div class="ov-value blue">${totals.todayIncome >= 10000 ? formatAmt(totals.todayIncome) : '¥'+formatNum(totals.todayIncome)}</div><div class="ov-sub">含加工/运输/合同外</div></div>
    <div class="ov-card"><div class="ov-icon">📉</div><div class="ov-label">今日成本</div><div class="ov-value red">${formatAmt(totals.todayCost||0)}</div><div class="ov-sub">固定+浮动</div></div>
    <div class="ov-card"><div class="ov-icon">📊</div><div class="ov-label">今日利润</div><div class="ov-value ${totals.todayProfit >= 0 ? 'green' : 'red'}">${formatProfit(totals.todayProfit)}</div><div class="ov-sub">含固定成本自动分摊</div></div>
  </div>`;
}

function renderCumulative(projData) {
  const allProd = projData.reduce((s, d) => s + d.allProd, 0);
  const allIncome = projData.reduce((s, d) => s + d.allIncome, 0);
  const allFloating = projData.reduce((s, d) => s + d.allFloating, 0);
  const allFixed = projData.reduce((s, d) => s + d.allFixed, 0);
  const allProfit = allIncome - allFloating - allFixed;
  document.getElementById('dashCumulative').innerHTML = `<div class="dash-cumulative">
    <div class="cu-header">📋 累计经营（全项目）</div>
    <div class="cu-grid">
      <div class="cu-card cu-prod"><div class="cu-label">累计生产</div><div class="cu-value dark">${formatWan(allProd)}<span style="font-size:13px;">万 m³</span></div></div>
      <div class="cu-card cu-income"><div class="cu-label">累计收入</div><div class="cu-value blue">${formatAmt(allIncome)}</div></div>
      <div class="cu-card cu-cost"><div class="cu-label">累计成本</div><div class="cu-value red">${formatAmt(allFloating + allFixed)}</div></div>
      <div class="cu-card cu-profit"><div class="cu-label">累计利润</div><div class="cu-value ${allProfit >= 0 ? 'green' : 'red'}">${formatProfit(allProfit)}</div></div>
    </div>
  </div>`;
}

function renderAlerts(projData) {
  const alerts = [];
  const db = getDB();
  projData.forEach(d => {
    if (!d.submitted) alerts.push({ type: 'warning', text: `<strong>${d.proj.name}</strong>：今日数据未录入` });
    if (d.todayRec && d.todayRec.costs) {
      d.todayRec.costs.forEach(c => {
        const ct = db.costTypes.find(t => t.id === c.costTypeId);
        if (c.costTypeId === 'diesel' && c.amount > 8000) alerts.push({ type: 'warning', text: `<strong>${d.proj.name}</strong>：${ct ? ct.name : '柴油'}成本偏高（¥${formatNum(c.amount)}）` });
      });
      if (d.todayRec.costs.some(c => c.costTypeId === 'repair')) {
        const yStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const yRecs = db.dailyRecords.filter(r => r.projectId === d.proj.id && r.date === yStr);
        if (yRecs.length > 0) {
          const yR = yRecs[0].costs.filter(c => c.costTypeId === 'repair').reduce((s, c) => s + (c.amount || 0), 0);
          const tR = d.todayRec.costs.filter(c => c.costTypeId === 'repair').reduce((s, c) => s + (c.amount || 0), 0);
          if (yR > 0 && tR > yR * 1.3) alerts.push({ type: 'warning', text: `<strong>${d.proj.name}</strong>：维修费用较昨日增长${Math.round((tR - yR) / yR * 100)}%` });
        }
      }
    }
  });
  const container = document.getElementById('dashAlerts');
  if (alerts.length === 0) {
    container.innerHTML = `<div class="dash-alerts"><div class="alert-header"><span class="warn-icon">✅</span> 今日经营状态</div><div class="alert-normal">所有项目数据已录入，经营正常，没有异常。</div></div>`;
  } else {
    container.innerHTML = `<div class="dash-alerts"><div class="alert-header"><span class="warn-icon">⚠️</span> 今日经营预警</div><div class="alert-list">${alerts.map(a => `<div class="alert-item"><span class="dot ${a.type}"></span><span>${a.text}</span></div>`).join('')}</div></div>`;
  }
}

function renderProjectCards(projData) {
  const container = document.getElementById('dashCards');
  if (projData.length === 0) { container.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:40px;">暂无项目数据</p>'; return; }
  let html = '<div class="dash-cards">';
  projData.forEach(d => {
    const rate = d.monthIncome > 0 ? d.monthProfit / d.monthIncome : 0;
    const target = d.proj.targetVolume || 180000;
    const comp = Math.min(Math.round(d.allProd / target * 100), 100);
    html += `<div class="dash-card">
      <div class="card-head"><h3>${d.proj.name}</h3><span class="status-tag"><span class="sd ${d.submitted ? 'green' : 'red'}"></span><span class="sdt">${d.submitted ? '今日已录入' : '今日未录入'}</span></span></div>
      <div class="card-body">
        <div class="card-metric"><span class="ml">今日利润</span><span class="mv ${d.todayProfit >= 0 ? 'green' : 'red'}">${d.todayProfit >= 0 ? '+' : ''}¥${formatNum(d.todayProfit)}</span></div>
        <div class="card-divider"></div>
        <div class="card-metric"><span class="ml">本月利润</span><span class="mv ${d.monthProfit >= 0 ? 'green' : 'red'}">${d.monthProfit >= 0 ? '+' : ''}¥${formatNum(d.monthProfit)}</span></div>
        <div class="card-metric"><span class="ml">利润率</span><span class="mv dark sm">${formatPercent(rate)}</span></div>
        <div class="card-divider"></div>
        <div class="card-metric"><span class="ml">累计利润</span><span class="mv ${d.allProfit >= 0 ? 'green' : 'red'}">${d.allProfit >= 0 ? '+' : ''}¥${formatNum(d.allProfit)}</span></div>
        <div class="card-progress"><div class="cp-label"><span>合同完成率</span><span>已完成 ${formatWan(d.allProd)}m³ / ${formatWan(target)}m³</span></div><div class="cp-track"><div class="cp-fill" style="width:${comp}%"></div></div></div>
      </div>
      <div class="card-foot"><button class="btn btn-primary btn-sm" onclick="navigate('daily')">进入项目 →</button></div>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderRanking(projData) {
  const container = document.getElementById('dashRanking');
  const sorted = [...projData].sort((a, b) => b.allProfit - a.allProfit);
  if (sorted.length === 0) { container.innerHTML = ''; return; }
  const classes = ['r1', 'r2', 'r3'];
  let html = '<div class="dash-rank"><div class="rank-title">🏆 项目利润排行榜</div><div class="rank-list">';
  sorted.forEach((d, i) => {
    const rate = d.allIncome > 0 ? (d.allProfit / d.allIncome * 100).toFixed(1) : '0.0';
    html += `<div class="rank-item">
      <div class="rank-num ${classes[i] || ''}">${i + 1}</div>
      <div class="rank-info"><div class="rn">${['🥇','🥈','🥉'][i] || ''} ${d.proj.name}</div><div class="rs">累计利润率：${rate}% &nbsp;·&nbsp; 累计方量：${formatWan(d.allProd)}m³</div></div>
      <div class="rank-stats"><div class="rv ${d.allProfit >= 0 ? 'green' : 'red'}">${d.allProfit >= 0 ? '' : '-'}¥${formatWan(d.allProfit)}万</div><div class="rsm">累计利润</div></div>
    </div>`;
  });
  html += '</div></div>';
  container.innerHTML = html;
}

// ========== Daily ==========
let _currentPeriod = '';

function renderDaily() {
  const db = getDB();
  const isPM = currentUser.role === 'project_manager';
  if (!_currentPeriod) _currentPeriod = isPM ? 'today' : 'month';

  const projects = db.projects.filter(p => canAccessProject(p.id));
  const projSel = document.getElementById('dailyProjectFilter');
  if (projSel) {
    const cur = projSel.value;
    projSel.innerHTML = '<option value="">全部项目</option>';
    projects.forEach(p => { projSel.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
    if (cur) projSel.value = cur;
    projSel.disabled = isPM;
  }

  renderPeriodSelector();
  const range = getPeriodDateRange(_currentPeriod);
  if (!range) return;
  renderPeriodCards(range);
  renderTrendChart(range);
  renderDailyForm(todayStr());
  renderDailyHistory(range);
}

function renderPeriodSelector() {
  const keys = ['today','week','month','all','custom'];
  const labels = { today:'今日', week:'本周', month:'本月', all:'累计', custom:'自定义' };
  document.getElementById('periodBar').innerHTML = keys.map(k =>
    `<button class="period-btn ${_currentPeriod === k ? 'active' : ''}" onclick="setPeriod('${k}')">${labels[k]}</button>`
  ).join('');

  const row = document.getElementById('dailyFilterRow');
  const rangeEl = document.getElementById('periodDateRange');
  if (_currentPeriod === 'custom') {
    rangeEl.style.display = 'flex';
    if (!document.getElementById('periodStartDate').value) {
      const d = new Date(); d.setDate(1);
      document.getElementById('periodStartDate').value = d.toISOString().slice(0, 10);
      document.getElementById('periodEndDate').value = todayStr();
    }
  } else {
    rangeEl.style.display = 'none';
  }
  if (row) row.style.display = 'flex';
}

function setPeriod(key) {
  _currentPeriod = key;
  renderDaily();
}

function getPeriodDateRange(period) {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  const ts = todayStr();
  switch (period) {
    case 'today': return { start: ts, end: ts, label: '今日' };
    case 'week': {
      const off = today.getDay() === 0 ? -6 : 1 - today.getDay();
      const mon = new Date(today); mon.setDate(d + off);
      const sun = new Date(today); sun.setDate(d + off + 6);
      return { start: mon.toISOString().slice(0, 10), end: sun.toISOString().slice(0, 10), label: '本周' };
    }
    case 'month': return { start: `${y}-${String(m+1).padStart(2,'0')}-01`, end: ts, label: '本月' };
    case 'all': {
      const db = getDB();
      let e = ts;
      if (db.dailyRecords.length > 0) { const dates = db.dailyRecords.map(r => r.date).sort(); e = dates[0]; }
      return { start: e, end: ts, label: '累计' };
    }
    case 'custom': {
      const s = document.getElementById('periodStartDate')?.value;
      const e = document.getElementById('periodEndDate')?.value;
      if (!s || !e) { showToast('请选择日期范围', 'error'); return null; }
      return { start: s, end: e, label: s + ' ~ ' + e };
    }
    default: return { start: ts, end: ts, label: '今日' };
  }
}

function renderPeriodCards(range) {
  const db = getDB();
  const fp = document.getElementById('dailyProjectFilter')?.value || '';
  const projs = db.projects.filter(p => canAccessProject(p.id) && (!fp || p.id === fp));
  let prod = 0, inc = 0, fix = 0, flt = 0;
  projs.forEach(p => {
    const recs = db.dailyRecords.filter(r => r.projectId === p.id && r.date >= range.start && r.date <= range.end);
    recs.forEach(r => { prod += r.productionVolume || 0; inc += calcIncome(r); flt += calcCost(r); fix += calcDailyFixedCost(p.id, r.date); });
  });
  const tc = fix + flt;
  const profit = inc - tc;
  const rate = inc > 0 ? profit / inc : 0;
  document.getElementById('periodCards').innerHTML = `<div class="period-cards">
    <div class="pc-card"><div class="pc-label">${range.label}生产方量</div><div class="pc-value dark">${prod} m³</div></div>
    <div class="pc-card"><div class="pc-label">${range.label}收入</div><div class="pc-value blue">${formatAmt(inc)}</div></div>
    <div class="pc-card"><div class="pc-label">${range.label}成本</div><div class="pc-value red">${formatAmt(tc)}</div></div>
    <div class="pc-card"><div class="pc-label">${range.label}利润</div><div class="pc-value ${profit >= 0 ? 'green' : 'red'}">${formatProfit(profit)}</div></div>
    <div class="pc-card"><div class="pc-label">利润率</div><div class="pc-value ${profit >= 0 ? 'green' : 'red'}">${formatPercent(rate)}</div></div>
  </div>`;
}

function renderTrendChart(range) {
  const el = document.getElementById('periodTrend');
  if (_currentPeriod === 'today') { el.style.display = 'none'; return; }
  const db = getDB();
  const projs = db.projects.filter(p => canAccessProject(p.id));
  const daily = {};
  let cur = new Date(range.start);
  const end = new Date(range.end);
  while (cur <= end) { daily[cur.toISOString().slice(0,10)] = { prod:0, inc:0, cost:0, profit:0 }; cur.setDate(cur.getDate()+1); }
  projs.forEach(p => {
    db.dailyRecords.filter(r => r.projectId === p.id && r.date >= range.start && r.date <= range.end).forEach(r => {
      if (!daily[r.date]) daily[r.date] = { prod:0, inc:0, cost:0, profit:0 };
      const i = calcIncome(r), f = calcCost(r), x = calcDailyFixedCost(p.id, r.date);
      daily[r.date].prod += r.productionVolume||0; daily[r.date].inc += i;
      daily[r.date].cost += f + x; daily[r.date].profit += i - f - x;
    });
  });
  const dates = Object.keys(daily).sort();
  if (dates.length === 0) { el.style.display = 'none'; return; }
  const step = dates.length > 20 ? Math.ceil(dates.length / 15) : 1;
  const maxV = Math.max(...dates.map(d => Math.max(daily[d].prod, daily[d].inc/50, daily[d].cost/50, Math.abs(daily[d].profit)/50)), 1);
  let html = `<div class="pt-title">📈 经营趋势（${range.label}）</div>
    <div class="pt-legend">
      <span class="pt-legend-item"><span class="pt-legend-dot" style="background:#1a73e8"></span>生产</span>
      <span class="pt-legend-item"><span class="pt-legend-dot" style="background:#10b981"></span>收入</span>
      <span class="pt-legend-item"><span class="pt-legend-dot" style="background:#ef4444"></span>成本</span>
      <span class="pt-legend-item"><span class="pt-legend-dot" style="background:#f59e0b"></span>利润</span>
    </div><div class="pt-grid">`;
  dates.forEach((d, i) => {
    if (i % step !== 0 && i !== dates.length - 1) return;
    const dd = daily[d];
    html += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;">
      <div class="pt-bar" style="height:${Math.max(Math.abs(dd.profit)/maxV*50,1)}px;background:${dd.profit>=0?'#10b981':'#ef4444'};width:6px;" title="${d} 利润:¥${formatNum(dd.profit)}"></div>
      <div class="pt-bar" style="height:${Math.max(dd.cost/maxV*50,1)}px;background:#ef4444;width:6px;" title="${d} 成本:¥${formatNum(dd.cost)}"></div>
      <div class="pt-bar" style="height:${Math.max(dd.inc/maxV*50,1)}px;background:#10b981;width:6px;" title="${d} 收入:¥${formatNum(dd.inc)}"></div>
      <div class="pt-bar" style="height:${Math.max(dd.prod/maxV*100,1)}px;background:#1a73e8;width:6px;" title="${d} 生产:${dd.prod}m³"></div>
    </div>`;
  });
  html += `</div><div class="pt-labels">`;
  dates.forEach((d, i) => { if (i % step !== 0 && i !== dates.length - 1) return; html += `<span class="pt-label">${d.slice(5)}</span>`; });
  html += `</div>`;
  el.innerHTML = html;
  el.style.display = 'block';
}

function renderDailyForm(targetDate, targetProject) {
  if (!canEdit()) {
    document.getElementById('dailyFormContent').innerHTML = '<div class="df-body" style="text-align:center;color:#94a3b8;padding:30px;">您无权录入经营数据</div>';
    return;
  }
  try {
    const db = getDB();
    const dateVal = targetDate || todayStr();
    const fp = document.getElementById('dailyProjectFilter')?.value || '';
    let projects = db.projects.filter(p => canModifyProject(p.id));
    if (fp) projects = projects.filter(p => p.id === fp);
    const def = projects.length === 1 ? projects[0] : null;
    const pv = targetProject || (def ? def.id : '');
    const rec = pv ? db.dailyRecords.find(r => r.projectId === pv && r.date === dateVal) : null;
    const prodVol = rec ? rec.productionVolume : '';
    const extraVol = rec ? rec.contractOutsideTransportVolume : '';
    const extraPrice = rec ? rec.contractOutsideTransportUnitPrice : '';
    const noteVal = rec ? escHtml(rec.note) : '';
    const costs = rec ? (Array.isArray(rec.costs) ? JSON.parse(JSON.stringify(rec.costs)) : []) : [];
    if (costs.length === 0) { costs.push({ costTypeId: 'diesel', amount: '', quantity: '', note: '' }); costs.push({ costTypeId: 'other', amount: '', quantity: '', note: '' }); }

    document.getElementById('dfHeaderDate').textContent = dateVal;
    document.getElementById('dailyFormContent').innerHTML = `<div class="df-body">
      <input type="hidden" id="df_editId" value="${rec ? rec.id : ''}">
      <div class="fr-row">
        <div class="fr-field"><label>项目</label><select id="df_project" onchange="onDailyFormChange()">${projects.map(p => `<option value="${p.id}" ${p.id === pv ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div>
        <div class="fr-field"><label>日期</label><input type="date" id="df_date" value="${dateVal}" onchange="onDailyFormChange()"></div>
      </div>
      <div class="fr-section-title">生产与运输</div>
      <div class="fr-row">
        <div class="fr-field"><label>今日生产方量 (m³)</label><input type="number" id="df_prodVol" value="${prodVol}" min="0" step="0.1" oninput="recalcDailyForm2()" placeholder="0"></div>
        <div class="fr-field"><label>合同外运输方量 (m³)</label><input type="number" id="df_extraVol" value="${extraVol}" min="0" step="0.1" oninput="recalcDailyForm2()" placeholder="0"></div>
        <div class="fr-field"><label>合同外运输单价 (元/m³)</label><input type="number" id="df_extraPrice" value="${extraPrice}" min="0" step="0.01" oninput="recalcDailyForm2()" placeholder="0"></div>
      </div>
      <div class="fr-section-title"><span>今日新增浮动成本</span><button type="button" class="btn btn-primary btn-sm" onclick="addCostRow2()">＋ 新增成本</button></div>
      <div class="cr-list" id="cr2Container"></div>
      <div class="fr-section-title">经营备注</div>
      <div class="fr-row fr-notes"><textarea id="df_note" placeholder="记录今天发生的重要事情，如停工、维修、天气、甲方检查等">${noteVal}</textarea></div>
      <div class="auto-summary" id="autoSummary">
        <div class="as-title">📊 自动统计</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;">
          <div class="as-item"><div class="as-label">加工收入</div><div class="as-value blue" id="as_income1" style="font-size:15px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">运输收入</div><div class="as-value blue" id="as_income2" style="font-size:15px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">合同外运输收入</div><div class="as-value blue" id="as_income3" style="font-size:15px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">总收入</div><div class="as-value blue" id="as_totalIncome" style="font-size:17px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">固定成本 (自动)</div><div class="as-value red" id="as_fixedCost" style="font-size:15px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">浮动成本</div><div class="as-value red" id="as_floatingCost" style="font-size:15px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">总成本</div><div class="as-value red" id="as_totalCost" style="font-size:17px;">¥0.00</div></div>
          <div class="as-item"><div class="as-label">利润</div><div class="as-value green" id="as_profit" style="font-size:20px;">¥0.00</div></div>
        </div>
        <div style="margin-top:6px;font-size:12px;color:#94a3b8;">固定成本来自基础台账，按月自动分摊。加工单价和运输单价来自项目设置。</div>
      </div>
      <div class="fr-actions">
        <button type="button" class="btn btn-outline" onclick="saveDaily('draft')">保存草稿</button>
        <button type="button" class="btn btn-primary" onclick="saveDaily('submitted')">提交今日经营</button>
      </div>
    </div>`;
    renderCostRows2(costs);
    recalcDailyForm2();
  } catch (e) {
    console.error('表单渲染失败:', e);
    document.getElementById('dailyFormContent').innerHTML = '<div class="df-body" style="text-align:center;color:#ef4444;padding:30px;">表单加载失败：' + escHtml(e.message) + '</div>';
  }
}

function renderCostRows2(costs) {
  const container = document.getElementById('cr2Container');
  if (!container) return;
  const db = getDB();
  const types = db.costTypes.filter(ct => ct.enabled);
  container.innerHTML = costs.map(c => {
    const opts = types.map(t => `<option value="${t.id}" ${t.id === c.costTypeId ? 'selected' : ''}>${t.name}</option>`).join('');
    return `<div class="cr-item">
      <select onchange="recalcDailyForm2()">${opts}</select>
      <input type="number" class="cr-amount" placeholder="金额" value="${c.amount !== '' && c.amount != null ? c.amount : ''}" min="0" step="0.01" oninput="recalcDailyForm2()">
      <input type="number" class="cr-qty" placeholder="数量" value="${c.quantity || ''}" min="0" step="0.1">
      <input type="text" placeholder="备注" value="${escHtml(c.note)}">
      <button type="button" class="btn btn-danger btn-sm cr-del" onclick="removeCostRow2(this)">×</button>
    </div>`;
  }).join('');
}

function addCostRow2() {
  const container = document.getElementById('cr2Container');
  const db = getDB();
  const types = db.costTypes.filter(ct => ct.enabled);
  const div = document.createElement('div');
  div.className = 'cr-item';
  div.innerHTML = `<select onchange="recalcDailyForm2()">${types.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}</select>
    <input type="number" class="cr-amount" placeholder="金额" min="0" step="0.01" oninput="recalcDailyForm2()">
    <input type="number" class="cr-qty" placeholder="数量" min="0" step="0.1">
    <input type="text" placeholder="备注">
    <button type="button" class="btn btn-danger btn-sm cr-del" onclick="removeCostRow2(this)">×</button>`;
  container.appendChild(div);
  recalcDailyForm2();
}

function removeCostRow2(btn) {
  const container = document.getElementById('cr2Container');
  if (container.querySelectorAll('.cr-item').length <= 1) { showToast('至少保留一项成本', 'error'); return; }
  btn.closest('.cr-item').remove();
  recalcDailyForm2();
}

function recalcDailyForm2() {
  const g = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const pj = document.getElementById('df_project')?.value || '';
  const dv = document.getElementById('df_date')?.value || todayStr();
  const pv = g('df_prodVol'), ev = g('df_extraVol'), ep = g('df_extraPrice');
  const db = getDB();
  const proj = db.projects.find(x => x.id === pj);
  const pp = proj ? (proj.defaultProcessingPrice || 0) : 0;
  const tp = proj ? (proj.defaultTransportPrice || 0) : 0;
  const i1 = pv * pp, i2 = pv * tp, i3 = ev * ep, ti = i1 + i2 + i3;
  let fc = 0;
  const cont = document.getElementById('cr2Container');
  if (cont) cont.querySelectorAll('.cr-amount').forEach(inp => { fc += parseFloat(inp.value) || 0; });
  const fx = pj ? calcDailyFixedCost(pj, dv) : 0;
  const tc = fx + fc, profit = ti - tc;
  const f = (n) => (n >= 0 ? '' : '-') + '¥' + formatNum(Math.abs(n));
  document.getElementById('as_income1').textContent = f(i1);
  document.getElementById('as_income2').textContent = f(i2);
  document.getElementById('as_income3').textContent = f(i3);
  document.getElementById('as_totalIncome').textContent = f(ti);
  document.getElementById('as_fixedCost').textContent = f(fx);
  document.getElementById('as_floatingCost').textContent = f(fc);
  document.getElementById('as_totalCost').textContent = f(tc);
  const pf = document.getElementById('as_profit');
  pf.textContent = f(profit);
  pf.className = 'as-value ' + (profit >= 0 ? 'green' : 'red');
}

function onDailyFormChange() {
  const nd = document.getElementById('df_date').value;
  const np = document.getElementById('df_project').value;
  if (nd && np) renderDailyForm(nd, np);
}

function copyFromYesterday() {
  const db = getDB();
  const pj = document.getElementById('df_project').value;
  if (!pj) { showToast('请先选择项目', 'error'); return; }
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yr = db.dailyRecords.find(r => r.projectId === pj && r.date === y);
  if (!yr) { showToast('昨天没有经营记录', 'error'); return; }
  document.getElementById('df_prodVol').value = yr.productionVolume || '';
  document.getElementById('df_extraVol').value = yr.contractOutsideTransportVolume || '';
  document.getElementById('df_extraPrice').value = yr.contractOutsideTransportUnitPrice || '';
  document.getElementById('df_note').value = yr.note || '';
  const costs = yr.costs ? (Array.isArray(yr.costs) ? JSON.parse(JSON.stringify(yr.costs)) : []) : [];
  if (costs.length === 0) { costs.push({ costTypeId: 'diesel', amount: '', quantity: '', note: '' }); costs.push({ costTypeId: 'other', amount: '', quantity: '', note: '' }); }
  renderCostRows2(costs);
  recalcDailyForm2();
  showToast('已复制昨天数据，请核对后保存', 'info');
}

function saveDaily(status) {
  const db = getDB();
  const eid = document.getElementById('df_editId').value;
  const isEdit = !!eid;
  const date = document.getElementById('df_date').value;
  const pid = document.getElementById('df_project').value;
  if (!date || !pid) { showToast('请选择日期和项目', 'error'); return; }
  if (!isEdit) {
    const dup = db.dailyRecords.find(r => r.projectId === pid && r.date === date);
    if (dup) { if (!confirm(`项目「${getProjectName(pid)}」在 ${date} 已有记录，是否覆盖？`)) return; db.dailyRecords = db.dailyRecords.filter(r => r.id !== dup.id); }
  }
  const costItems = [];
  const cont = document.getElementById('cr2Container');
  if (cont) {
    cont.querySelectorAll('.cr-item').forEach(row => {
      const sel = row.querySelector('select');
      if (!sel) return;
      costItems.push({
        costTypeId: sel.value,
        amount: parseFloat(row.querySelector('.cr-amount')?.value) || 0,
        quantity: parseFloat(row.querySelector('.cr-qty')?.value) || '',
        note: (row.querySelector('input[type="text"]')?.value) || ''
      });
    });
  }
  const proj = db.projects.find(x => x.id === pid);
  const record = {
    id: isEdit ? eid : genId(), date, projectId: pid,
    productionVolume: parseFloat(document.getElementById('df_prodVol').value) || 0,
    processingUnitPrice: proj ? (proj.defaultProcessingPrice || 0) : 0,
    transportVolume: parseFloat(document.getElementById('df_prodVol').value) || 0,
    transportUnitPrice: proj ? (proj.defaultTransportPrice || 0) : 0,
    contractOutsideTransportVolume: parseFloat(document.getElementById('df_extraVol').value) || 0,
    contractOutsideTransportUnitPrice: parseFloat(document.getElementById('df_extraPrice').value) || 0,
    costs: costItems, note: document.getElementById('df_note').value || '',
    status: status || 'submitted', createdBy: currentUser.id,
    createdAt: isEdit ? (db.dailyRecords.find(r => r.id === eid)?.createdAt || new Date().toISOString()) : new Date().toISOString()
  };
  if (isEdit) { const idx = db.dailyRecords.findIndex(r => r.id === eid); if (idx >= 0) db.dailyRecords[idx] = record; }
  else db.dailyRecords.push(record);
  saveDB(db);
  showToast(status === 'draft' ? '草稿已保存' : '今日经营已保存', 'success');
  renderDaily();
}

function focusTodayForm() {
  renderDailyForm(todayStr());
  document.getElementById('dailyFormContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDailyHistory(range) {
  const db = getDB();
  const fp = document.getElementById('dailyProjectFilter')?.value || '';
  let records = [...db.dailyRecords].filter(r => canAccessProject(r.projectId) && (!fp || r.projectId === fp));
  if (range) records = records.filter(r => r.date >= range.start && r.date <= range.end);
  records.sort((a, b) => b.date.localeCompare(a.date) || a.projectId.localeCompare(b.projectId));
  const tbody = document.getElementById('dailyTableBody');
  const empty = document.getElementById('dailyEmpty');
  const cnt = document.getElementById('dhCount');
  if (cnt) cnt.textContent = `（${records.length}条）`;
  if (records.length === 0) { tbody.innerHTML = ''; if (empty) empty.style.display = 'block'; return; }
  if (empty) empty.style.display = 'none';
  const userMap = {}; db.users.forEach(u => { userMap[u.id] = u.name; });
  const isAdmin = canManageSettings();
  tbody.innerHTML = records.map(rec => {
    const inc = calcIncome(rec), flt = calcCost(rec);
    const fix = calcDailyFixedCost(rec.projectId, rec.date);
    const tc = fix + flt, profit = inc - tc;
    const rate = inc > 0 ? profit / inc : 0;
    const canDel = canModifyProject(rec.projectId);
    return `<tr>
      <td>${rec.date}</td>
      <td>${getProjectName(rec.projectId)}</td>
      <td class="num">${rec.productionVolume}</td>
      <td class="num">${formatAmt(inc)}</td>
      <td class="num">${formatAmt(tc)}</td>
      <td class="num" style="color:${profit >= 0 ? '#10b981' : '#ef4444'}">${formatProfit(profit)}</td>
      <td class="num" style="color:${profit >= 0 ? '#10b981' : '#ef4444'}">${formatPercent(rate)}</td>
      <td class="text-center"><span class="pl-tag ${profit >= 0 ? 'profit' : 'loss'}">${profit >= 0 ? '盈利' : '亏损'}</span></td>
      <td>${userMap[rec.createdBy] || '—'}</td>
      <td class="text-center">
        <button class="btn btn-primary btn-sm" onclick="showDailyDetail('${rec.id}')" style="padding:0 8px;font-size:11px;">查看详情</button>
        ${canDel ? `<button class="btn btn-outline btn-sm" onclick="editDaily2('${rec.id}')" style="padding:0 6px;font-size:11px;">编辑</button>` : ''}
        ${isAdmin && canDel ? `<button class="btn btn-danger btn-sm" onclick="deleteDaily2('${rec.id}')" style="padding:0 6px;font-size:11px;">删除</button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function showDailyDetail(id) {
  const db = getDB();
  const rec = db.dailyRecords.find(r => r.id === id);
  if (!rec) { showToast('记录不存在', 'error'); return; }
  const inc = calcIncome(rec), flt = calcCost(rec), fix = calcDailyFixedCost(rec.projectId, rec.date);
  const tc = fix + flt, profit = inc - tc, rate = inc > 0 ? profit / inc : 0;
  const i1 = (rec.productionVolume||0)*(rec.processingUnitPrice||0);
  const i2 = (rec.transportVolume||0)*(rec.transportUnitPrice||0);
  const i3 = (rec.contractOutsideTransportVolume||0)*(rec.contractOutsideTransportUnitPrice||0);
  const costByType = {};
  (rec.costs||[]).forEach(c => { const ct = db.costTypes.find(t => t.id === c.costTypeId); const n = ct ? ct.name : c.costTypeId; if (!costByType[n]) costByType[n]=0; costByType[n] += c.amount||0; });
  const costRows = Object.entries(costByType).map(([n, a]) => {
    const sample = (rec.costs||[]).find(c => { const ct = db.costTypes.find(t => t.id === c.costTypeId); return ct ? ct.name === n : c.costTypeId === n; });
    const qt = sample && sample.quantity ? `（${sample.quantity}）` : '';
    return `<div class="dg-item"><span class="dg-label">${n}${qt}</span><span class="dg-value">${formatAmt(a)}</span></div>`;
  }).join('');
  showModal('经营详情 - ' + rec.date, `<div class="detail-grid">
    <div class="dg-item"><span class="dg-label">日期</span><span class="dg-value">${rec.date}</span></div>
    <div class="dg-item"><span class="dg-label">项目</span><span class="dg-value">${getProjectName(rec.projectId)}</span></div>
    <div class="dg-item"><span class="dg-label">生产方量</span><span class="dg-value">${rec.productionVolume} m³</span></div>
    <div class="dg-item"><span class="dg-label">备注</span><span class="dg-value">${rec.note || '—'}</span></div>
    <div class="dg-section dg-full">收入组成</div>
    <div class="dg-item"><span class="dg-label">加工收入</span><span class="dg-value">${formatAmt(i1)}</span></div>
    <div class="dg-item"><span class="dg-label">运输收入</span><span class="dg-value">${formatAmt(i2)}</span></div>
    <div class="dg-item dg-full"><span class="dg-label">合同外运输收入</span><span class="dg-value">${formatAmt(i3)}</span></div>
    <div class="dg-section dg-full">成本组成</div>
    ${costRows || '<div class="dg-item dg-full"><span class="dg-label">暂无成本数据</span></div>'}
    <div class="dg-item dg-full"><span class="dg-label">固定成本（自动）</span><span class="dg-value">${formatAmt(fix)}</span></div>
    <div class="dg-section dg-full" style="font-weight:700;border-top:2px solid #e2e8f0;">合计</div>
    <div class="dg-item"><span class="dg-label">总收入</span><span class="dg-value total blue">${formatAmt(inc)}</span></div>
    <div class="dg-item"><span class="dg-label">总成本</span><span class="dg-value total red">${formatAmt(tc)}</span></div>
    <div class="dg-item"><span class="dg-label">利润</span><span class="dg-value total ${profit>=0?'green':'red'}">${formatProfit(profit)}</span></div>
    <div class="dg-item"><span class="dg-label">利润率</span><span class="dg-value total">${formatPercent(rate)}</span></div>
  </div>`);
}

function editDaily2(id) {
  const db = getDB();
  const rec = db.dailyRecords.find(r => r.id === id);
  if (!rec || !canModifyProject(rec.projectId)) { showToast('无权操作', 'error'); return; }
  _currentPeriod = 'today';
  renderDaily();
  renderDailyForm(rec.date, rec.projectId);
  document.getElementById('dailyFormContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteDaily2(id) {
  if (!confirm('确定删除此记录吗？')) return;
  const db = getDB();
  const rec = db.dailyRecords.find(r => r.id === id);
  if (rec && !canModifyProject(rec.projectId)) { showToast('无权删除', 'error'); return; }
  db.dailyRecords = db.dailyRecords.filter(r => r.id !== id);
  saveDB(db);
  showToast('记录已删除', 'success');
  renderDaily();
}

// ========== Ledger ==========
function renderLedger() {
  const db = getDB();
  const isPM = currentUser.role === 'project_manager';
  const projects = db.projects.filter(p => canAccessProject(p.id));
  const sel = document.getElementById('ledgerProjectFilter');
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = '<option value="">全部项目</option>';
    projects.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
    if (cur) sel.value = cur;
    sel.disabled = isPM;
  }
  renderLedgerTab('Personnel'); renderLedgerTab('Machinery'); renderLedgerTab('Fixed');
}

function renderLedgerTab(type) {
  const db = getDB();
  const fp = document.getElementById('ledgerProjectFilter')?.value || '';
  let items, fields, idField;
  if (type === 'Personnel') {
    items = (db.fixedPersonnel||[]).filter(i => !fp || i.projectId === fp);
    fields = [{key:'name',label:'姓名'},{key:'position',label:'岗位'},{key:'projectId',label:'所属项目',render:v=>getProjectName(v)},{key:'monthlySalary',label:'月工资',cls:'num',render:v=>'¥'+formatNum(v)},{key:'startDate',label:'入职日期'},{key:'endDate',label:'离职日期',render:v=>v||'—'},{key:'note',label:'备注',render:v=>v||'—'}];
    idField = 'ledgerPersonnelBody';
  } else if (type === 'Machinery') {
    items = (db.fixedMachinery||[]).filter(i => !fp || i.projectId === fp);
    fields = [{key:'name',label:'设备名称'},{key:'unit',label:'租赁单位'},{key:'projectId',label:'所属项目',render:v=>getProjectName(v)},{key:'monthlyRent',label:'月租金',cls:'num',render:v=>'¥'+formatNum(v)},{key:'startDate',label:'开始日期'},{key:'endDate',label:'结束日期',render:v=>v||'—'},{key:'note',label:'备注',render:v=>v||'—'}];
    idField = 'ledgerMachineryBody';
  } else {
    items = (db.fixedExpenses||[]).filter(i => !fp || i.projectId === fp);
    fields = [{key:'name',label:'费用名称'},{key:'projectId',label:'所属项目',render:v=>getProjectName(v)},{key:'amount',label:'金额',cls:'num',render:v=>'¥'+formatNum(v)},{key:'startDate',label:'开始日期'},{key:'endDate',label:'结束日期',render:v=>v||'—'},{key:'note',label:'备注',render:v=>v||'—'}];
    idField = 'ledgerFixedBody';
  }
  const tbody = document.getElementById(idField);
  if (!tbody) return;
  const typeKey = type === 'Personnel' ? 'personnel' : type === 'Machinery' ? 'machinery' : 'fixed';
  if (items.length === 0) { tbody.innerHTML = '<tr><td colspan="99" style="text-align:center;color:#94a3b8;padding:20px;">暂无数据</td></tr>'; return; }
  tbody.innerHTML = items.map(item => {
    const canDel = canModifyProject(item.projectId);
    return '<tr>' + fields.map(f => {
      const val = f.render ? f.render(item[f.key]) : (item[f.key] || '—');
      return `<td${f.cls ? ' class="'+f.cls+'"' : ''}>${val}</td>`;
    }).join('') + `<td class="text-center">${canDel ? `<button class="btn btn-primary btn-sm" onclick="showLedgerForm('${typeKey}','${item.id}')">编辑</button> <button class="btn btn-danger btn-sm" onclick="deleteLedgerItem('${typeKey}','${item.id}')">删除</button>` : '<span style="color:#94a3b8;">—</span>'}</td></tr>`;
  }).join('');
}

function showLedgerForm(type, editId) {
  if (!canManageSettings() && currentUser.role !== 'project_manager') { showToast('无权操作', 'error'); return; }
  const db = getDB();
  const isEdit = !!editId;
  const isPM = currentUser.role === 'project_manager';
  const allowed = db.projects.filter(p => isPM ? canModifyProject(p.id) : canAccessProject(p.id));
  const defPid = allowed.length === 1 ? allowed[0].id : '';
  let item, title, formFields;
  if (type === 'personnel') {
    item = isEdit ? db.fixedPersonnel.find(x => x.id === editId) : { name:'', position:'', projectId:defPid, monthlySalary:'', startDate:todayStr(), endDate:'', note:'' };
    title = isEdit ? '编辑人员' : '新增人员';
    formFields = [{id:'lf_name',label:'姓名',type:'text',val:item.name},{id:'lf_position',label:'岗位',type:'text',val:item.position},{id:'lf_salary',label:'月工资',type:'number',val:item.monthlySalary},{id:'lf_startDate',label:'入职日期',type:'date',val:item.startDate},{id:'lf_endDate',label:'离职日期（留空在职）',type:'date',val:item.endDate||''},{id:'lf_note',label:'备注',type:'text',val:item.note}];
  } else if (type === 'machinery') {
    item = isEdit ? db.fixedMachinery.find(x => x.id === editId) : { name:'', unit:'', projectId:defPid, monthlyRent:'', startDate:todayStr(), endDate:'', note:'' };
    title = isEdit ? '编辑机械' : '新增机械';
    formFields = [{id:'lf_name',label:'设备名称',type:'text',val:item.name},{id:'lf_unit',label:'租赁单位',type:'text',val:item.unit},{id:'lf_rent',label:'月租金',type:'number',val:item.monthlyRent},{id:'lf_startDate',label:'开始日期',type:'date',val:item.startDate},{id:'lf_endDate',label:'结束日期（留空持续中）',type:'date',val:item.endDate||''},{id:'lf_note',label:'备注',type:'text',val:item.note}];
  } else {
    item = isEdit ? db.fixedExpenses.find(x => x.id === editId) : { name:'', projectId:defPid, amount:'', startDate:todayStr(), endDate:'', note:'' };
    title = isEdit ? '编辑固定费用' : '新增固定费用';
    formFields = [{id:'lf_name',label:'费用名称',type:'text',val:item.name},{id:'lf_amount',label:'金额',type:'number',val:item.amount},{id:'lf_startDate',label:'开始日期',type:'date',val:item.startDate},{id:'lf_endDate',label:'结束日期（留空持续中）',type:'date',val:item.endDate||''},{id:'lf_note',label:'备注',type:'text',val:item.note}];
  }
  const projOpts = allowed.map(p => `<option value="${p.id}" ${p.id === item.projectId ? 'selected' : ''}>${p.name}</option>`).join('');
  let html = `<form id="ledgerForm" onsubmit="return saveLedgerItem('${type}','${isEdit ? editId : ''}')"><div class="form-grid">`;
  if (allowed.length > 1 || !isPM) {
    html += `<div class="form-group form-full"><label>所属项目</label><select id="lf_project" required>${projOpts}</select></div>`;
  } else {
    html += `<input type="hidden" id="lf_project" value="${allowed[0].id}">`;
  }
  formFields.forEach(f => {
    html += `<div class="form-group${f.id==='lf_note'?' form-full':''}"><label>${f.label}</label><input type="${f.type}" id="${f.id}" value="${escHtml(String(f.val||''))}" ${f.type==='number'?'min="0" step="0.01"':''}></div>`;
  });
  html += `</div><div class="form-actions"><button type="button" class="btn btn-outline" onclick="closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form>`;
  showModal(title, html);
}

function saveLedgerItem(type, editId) {
  const db = getDB();
  const isEdit = !!editId;
  const pid = document.getElementById('lf_project')?.value || '';
  let collection, item;
  if (type === 'personnel') {
    collection = db.fixedPersonnel;
    item = { id: isEdit ? editId : genId(), name: document.getElementById('lf_name').value.trim(), position: document.getElementById('lf_position').value.trim(), projectId: pid, monthlySalary: parseFloat(document.getElementById('lf_salary').value)||0, startDate: document.getElementById('lf_startDate').value||todayStr(), endDate: document.getElementById('lf_endDate').value||'', note: document.getElementById('lf_note').value.trim()||'' };
  } else if (type === 'machinery') {
    collection = db.fixedMachinery;
    item = { id: isEdit ? editId : genId(), name: document.getElementById('lf_name').value.trim(), unit: document.getElementById('lf_unit').value.trim(), projectId: pid, monthlyRent: parseFloat(document.getElementById('lf_rent').value)||0, startDate: document.getElementById('lf_startDate').value||todayStr(), endDate: document.getElementById('lf_endDate').value||'', note: document.getElementById('lf_note').value.trim()||'' };
  } else {
    collection = db.fixedExpenses;
    item = { id: isEdit ? editId : genId(), name: document.getElementById('lf_name').value.trim(), projectId: pid, amount: parseFloat(document.getElementById('lf_amount').value)||0, startDate: document.getElementById('lf_startDate').value||todayStr(), endDate: document.getElementById('lf_endDate').value||'', note: document.getElementById('lf_note').value.trim()||'' };
  }
  if (!item.name) { showToast('请填写名称', 'error'); return false; }
  if (isEdit) { const idx = collection.findIndex(x => x.id === editId); if (idx >= 0) collection[idx] = item; }
  else collection.push(item);
  saveDB(db);
  closeModal();
  showToast('已保存', 'success');
  renderLedger();
  return false;
}

function deleteLedgerItem(type, id) {
  if (!confirm('确定删除此项吗？')) return;
  const db = getDB();
  const c = type === 'personnel' ? db.fixedPersonnel : type === 'machinery' ? db.fixedMachinery : db.fixedExpenses;
  const idx = c.findIndex(x => x.id === id);
  if (idx >= 0) c.splice(idx, 1);
  saveDB(db);
  showToast('已删除', 'success');
  renderLedger();
}

// ========== Settlement ==========
function renderSettlement() {
  const db = getDB();
  const projects = db.projects.filter(p => canAccessProject(p.id));
  const sel = document.getElementById('settleFilterProject');
  const cur = sel.value;
  sel.innerHTML = '<option value="">全部项目</option>';
  projects.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
  sel.value = cur;
  const mi = document.getElementById('settleFilterMonth');
  if (!mi.value) mi.value = currentMonthStr();
  const fp = sel.value, fm = mi.value;
  let records = [...db.dailyRecords].filter(r => canAccessProject(r.projectId));
  if (fp) records = records.filter(r => r.projectId === fp);
  if (fm) records = records.filter(r => r.date.startsWith(fm));
  const grouped = {};
  records.forEach(r => { if (!grouped[r.projectId]) grouped[r.projectId] = []; grouped[r.projectId].push(r); });
  const summary = document.getElementById('settleSummary');
  const tbody = document.getElementById('settleCostBody');
  const costCard = document.getElementById('settleCostDetailCard');
  if (Object.keys(grouped).length === 0) {
    summary.innerHTML = '<p style="color:#94a3b8;grid-column:1/-1;text-align:center;padding:20px;">暂无数据</p>';
    tbody.innerHTML = ''; costCard.style.display = 'none'; return;
  }
  costCard.style.display = 'block';
  let projRows = '', totalProd = 0, totalInc = 0, totalFix = 0, totalFlt = 0, totalProfit = 0;
  const costAgg = {};
  Object.keys(grouped).forEach(pid => {
    const recs = grouped[pid];
    const prod = recs.reduce((s,r) => s+(r.productionVolume||0),0);
    const inc = recs.reduce((s,r) => s+calcIncome(r),0);
    const flt = recs.reduce((s,r) => s+calcCost(r),0);
    const fix = calcMonthlyFixedCost(pid, fm);
    const tc = fix+flt, profit = inc-tc;
    totalProd += prod; totalInc += inc; totalFix += fix; totalFlt += flt; totalProfit += profit;
    recs.forEach(r => { if (r.costs) r.costs.forEach(c => { if (!costAgg[c.costTypeId]) costAgg[c.costTypeId]=0; costAgg[c.costTypeId] += c.amount||0; }); });
    projRows += `<tr style="background:#f8fafc;font-weight:600;"><td>${getProjectName(pid)}</td><td>${fm}</td><td class="num">${prod} m³</td><td class="num">¥${formatNum(inc)}</td><td class="num">¥${formatNum(fix)}</td><td class="num">¥${formatNum(flt)}</td><td class="num">¥${formatNum(tc)}</td><td class="num" style="color:${profit>=0?'#10b981':'#ef4444'}">¥${formatNum(profit)}</td><td class="num">${formatPercent(inc>0?profit/inc:0)}</td></tr>`;
  });
  const totalCost = totalFix + totalFlt;
  summary.innerHTML = `<div class="summary-item"><div class="label">月生产方量</div><div class="value">${totalProd} m³</div></div>
    <div class="summary-item"><div class="label">月总收入</div><div class="value" style="color:#1a73e8;">¥${formatNum(totalInc)}</div></div>
    <div class="summary-item"><div class="label">月固定成本</div><div class="value" style="color:#64748b;">¥${formatNum(totalFix)}</div></div>
    <div class="summary-item"><div class="label">月浮动成本</div><div class="value" style="color:#ef4444;">¥${formatNum(totalFlt)}</div></div>
    <div class="summary-item"><div class="label">月总成本</div><div class="value" style="color:#ef4444;">¥${formatNum(totalCost)}</div></div>
    <div class="summary-item"><div class="label">月利润</div><div class="value ${totalProfit>=0?'positive':'negative'}">¥${formatNum(totalProfit)}</div></div>
    <div class="summary-item"><div class="label">月利润率</div><div class="value">${formatPercent(totalInc>0?totalProfit/totalInc:0)}</div></div>`;
  const costTypes = db.costTypes.filter(ct => ct.enabled);
  let costHtml = '';
  const costTotal = Object.values(costAgg).reduce((s,v) => s+v, 0);
  costTypes.forEach(ct => {
    const amt = costAgg[ct.id]||0; if (amt===0) return;
    costHtml += `<tr><td>${ct.name}</td><td class="num">¥${formatNum(amt)}</td><td class="num">${formatPercent(costTotal>0?amt/costTotal:0)}</td></tr>`;
  });
  if (!costHtml) costHtml = '<tr><td colspan="3" style="text-align:center;color:#94a3b8;">暂无浮动成本数据</td></tr>';
  costHtml += `<tr style="font-weight:600;border-top:2px solid #e2e8f0;"><td>固定成本合计</td><td class="num">¥${formatNum(totalFix)}</td><td class="num">${formatPercent(totalCost>0?totalFix/totalCost:0)}</td></tr>`;
  tbody.innerHTML = costHtml;
  const fullHtml = `<div class="table-container" style="margin-top:12px;"><table><thead><tr><th>项目</th><th>月份</th><th class="num">方量</th><th class="num">收入</th><th class="num">固定成本</th><th class="num">浮动成本</th><th class="num">总成本</th><th class="num">利润</th><th class="num">利润率</th></tr></thead><tbody>${projRows}<tr style="font-weight:700;background:#1e293b;color:#fff;"><td colspan="2">合计</td><td class="num">${totalProd} m³</td><td class="num">¥${formatNum(totalInc)}</td><td class="num">¥${formatNum(totalFix)}</td><td class="num">¥${formatNum(totalFlt)}</td><td class="num">¥${formatNum(totalCost)}</td><td class="num" style="color:${totalProfit>=0?'#10b981':'#ef4444'}">¥${formatNum(totalProfit)}</td><td class="num">${formatPercent(totalInc>0?totalProfit/totalInc:0)}</td></tr></tbody></table></div>`;
  const prev = document.querySelector('#settleSummary + .table-container');
  if (prev) prev.remove();
  summary.insertAdjacentHTML('afterend', fullHtml);
}

// ========== Analysis ==========
function renderAnalysis() {
  const db = getDB();
  const projects = db.projects.filter(p => canAccessProject(p.id));
  const sel = document.getElementById('analysisFilterProject');
  const cur = sel.value;
  sel.innerHTML = '<option value="">全部项目</option>';
  projects.forEach(p => { sel.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
  sel.value = cur;
  const mi = document.getElementById('analysisFilterMonth');
  if (!mi.value) mi.value = currentMonthStr();
  const fp = sel.value, fm = mi.value;
  let records = [...db.dailyRecords].filter(r => canAccessProject(r.projectId));
  if (fp) records = records.filter(r => r.projectId === fp);
  if (fm) records = records.filter(r => r.date.startsWith(fm));
  const cont = document.getElementById('analysisContent');
  if (records.length === 0) { cont.innerHTML = '<div class="card"><p style="text-align:center;color:#94a3b8;padding:40px;">暂无数据</p></div>'; return; }
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));
  const byDate = {};
  sorted.forEach(r => { if (!byDate[r.date]) byDate[r.date] = { inc:0, cost:0, profit:0 }; const i=calcIncome(r), f=calcCost(r), x=calcDailyFixedCost(r.projectId,r.date); byDate[r.date].inc+=i; byDate[r.date].cost+=f+x; byDate[r.date].profit+=i-f-x; });
  const dk = Object.keys(byDate).sort(), dv = dk.map(d=>byDate[d]);
  const maxV = Math.max(...dv.map(v=>Math.max(v.inc,v.cost,Math.abs(v.profit))),1);
  const step = dk.length > 20 ? Math.ceil(dk.length/15) : 1;
  let trendHtml = '', costAgg = {}, projProfit = {};
  records.forEach(r => {
    const i=calcIncome(r), f=calcCost(r), x=calcDailyFixedCost(r.projectId,r.date);
    if (!projProfit[r.projectId]) projProfit[r.projectId] = 0;
    projProfit[r.projectId] += i-f-x;
    if (r.costs) r.costs.forEach(c => { if (!costAgg[c.costTypeId]) costAgg[c.costTypeId]=0; costAgg[c.costTypeId] += c.amount||0; });
  });
  trendHtml = `<div class="card chart-container"><div class="chart-title">📈 收入趋势（${fm}）</div>`;
  dk.forEach((d,i) => {
    if (i%step !== 0 && i !== dk.length-1) return;
    const pct = Math.min(byDate[d].inc / maxV * 100, 100);
    trendHtml += `<div class="chart-row"><span class="chart-label">${d.slice(5)}</span><div class="chart-bar-wrap"><div class="chart-bar blue" style="width:${pct}%">${pct>10?'¥'+formatNum(byDate[d].inc):''}</div></div><span class="chart-val">¥${formatNum(byDate[d].inc)}</span></div>`;
  });
  trendHtml += `</div><div class="card chart-container"><div class="chart-title">📉 成本趋势（${fm}）</div>`;
  dk.forEach((d,i) => {
    if (i%step !== 0 && i !== dk.length-1) return;
    const pct = Math.min(byDate[d].cost / maxV * 100, 100);
    trendHtml += `<div class="chart-row"><span class="chart-label">${d.slice(5)}</span><div class="chart-bar-wrap"><div class="chart-bar red" style="width:${pct}%">${pct>10?'¥'+formatNum(byDate[d].cost):''}</div></div><span class="chart-val">¥${formatNum(byDate[d].cost)}</span></div>`;
  });
  trendHtml += `</div><div class="card chart-container"><div class="chart-title">📊 利润趋势（${fm}）</div>`;
  dk.forEach((d,i) => {
    if (i%step !== 0 && i !== dk.length-1) return;
    const v = byDate[d].profit;
    const pct = Math.min(Math.abs(v) / maxV * 100, 100);
    trendHtml += `<div class="chart-row"><span class="chart-label">${d.slice(5)}</span><div class="chart-bar-wrap"><div class="chart-bar" style="width:${pct}%;background:${v>=0?'#10b981':'#ef4444'}">${pct>10?'¥'+formatNum(v):''}</div></div><span class="chart-val" style="color:${v>=0?'#10b981':'#ef4444'}">¥${formatNum(v)}</span></div>`;
  });
  trendHtml += `</div>`;
  const colors = ['#1a73e8','#ef4444','#f59e0b','#10b981','#8b5cf6','#ec4899','#14b8a6','#f97316','#64748b'];
  const ctTotal = Object.values(costAgg).reduce((s,v) => s+v, 0);
  if (ctTotal > 0) {
    trendHtml += `<div class="card chart-container"><div class="chart-title">成本构成</div>`;
    let ci = 0;
    const ctypes = db.costTypes.filter(ct=>ct.enabled);
    ctypes.forEach(ct => {
      const amt = costAgg[ct.id]||0; if (amt===0) return;
      const pct = amt / ctTotal;
      trendHtml += `<div class="chart-row"><span class="chart-label">${ct.name}</span><div class="chart-bar-wrap"><div class="chart-bar" style="width:${(pct*100).toFixed(1)}%;background:${colors[ci%colors.length]}">${pct>0.08?(pct*100).toFixed(1)+'%':''}</div></div><span class="chart-val">¥${formatNum(amt)}</span></div>`;
      ci++;
    });
    trendHtml += `</div>`;
  }
  if (!fp) {
    const sortedProjs = Object.entries(projProfit).sort((a,b) => b[1] - a[1]);
    const maxP = Math.max(...sortedProjs.map(x=>Math.abs(x[1])),1);
    trendHtml += `<div class="card chart-container"><div class="chart-title">项目利润排名（${fm}）</div>`;
    sortedProjs.forEach(([pid, profit], i) => {
      const pct = Math.abs(profit) / maxP * 100;
      trendHtml += `<div class="chart-row"><span class="chart-label">${getProjectName(pid).slice(0,6)}</span><div class="chart-bar-wrap"><div class="chart-bar" style="width:${pct}%;background:${profit>=0?['#10b981','#1a73e8','#f59e0b'][i]||'#10b981':'#ef4444'}">${pct>10?'¥'+formatNum(profit):''}</div></div><span class="chart-val" style="color:${profit>=0?'#10b981':'#ef4444'}">¥${formatNum(profit)}</span></div>`;
    });
    trendHtml += `</div>`;
  }
  cont.innerHTML = trendHtml;
}

// ========== Settings ==========
function renderSettings() {
  if (!canManageSettings()) { showToast('无权访问', 'error'); navigate('dashboard'); return; }
  renderProjectsTab(); renderUsersTab(); renderCostTypesTab();
}

function renderProjectsTab() {
  const db = getDB();
  document.getElementById('projectTableBody').innerHTML = db.projects.map(p =>
    `<tr><td>${escHtml(p.name)}</td><td class="num">¥${formatNum(p.defaultProcessingPrice)}</td><td class="num">¥${formatNum(p.defaultTransportPrice)}</td><td class="num">${(p.targetVolume||'').toLocaleString()} m³</td><td class="text-center"><button class="btn btn-primary btn-sm" onclick="showProjectForm('${p.id}')">编辑</button> <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')">删除</button></td></tr>`
  ).join('');
}

function showProjectForm(editId) {
  const db = getDB();
  const isEdit = !!editId;
  const p = isEdit ? db.projects.find(x => x.id === editId) : { id:'', name:'', defaultProcessingPrice:'', defaultTransportPrice:'', targetVolume:'' };
  showModal(isEdit ? '编辑项目' : '新增项目', `<form id="projectForm" onsubmit="return saveProject('${isEdit?editId:''}')"><div class="form-grid">
    <div class="form-group form-full"><label>项目名称 *</label><input type="text" id="pf_name" value="${escHtml(p.name)}" required></div>
    <div class="form-group"><label>项目编号</label><input type="text" id="pf_id" value="${escHtml(p.id)}" ${isEdit?'readonly':''} placeholder="唯一标识" required></div>
    <div class="form-group"><label>默认加工单价 (元/m³)</label><input type="number" id="pf_procPrice" value="${p.defaultProcessingPrice||''}" min="0" step="0.01"></div>
    <div class="form-group"><label>默认运输单价 (元/m³)</label><input type="number" id="pf_transPrice" value="${p.defaultTransportPrice||''}" min="0" step="0.01"></div>
    <div class="form-group form-full"><label>合同总方量 (m³)</label><input type="number" id="pf_targetVol" value="${p.targetVolume||''}" min="0" placeholder="用于计算合同完成率"></div>
  </div><div class="form-actions"><button type="button" class="btn btn-outline" onclick="closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form>`);
}

function saveProject(editId) {
  const db = getDB();
  const name = document.getElementById('pf_name').value.trim();
  const id = document.getElementById('pf_id').value.trim();
  if (!name || !id) { showToast('请填写项目名称和编号', 'error'); return false; }
  const p = { id, name, defaultProcessingPrice: parseFloat(document.getElementById('pf_procPrice').value)||0, defaultTransportPrice: parseFloat(document.getElementById('pf_transPrice').value)||0, targetVolume: parseFloat(document.getElementById('pf_targetVol').value)||0 };
  if (editId) {
    const idx = db.projects.findIndex(x => x.id === editId);
    if (idx >= 0) db.projects[idx] = p;
  } else {
    if (db.projects.find(x => x.id === id)) { showToast('项目编号已存在', 'error'); return false; }
    db.projects.push(p);
  }
  saveDB(db); closeModal(); showToast('项目已保存', 'success'); renderProjectsTab(); return false;
}

function deleteProject(id) {
  const db = getDB();
  if (db.projects.length <= 1) { showToast('至少保留一个项目', 'error'); return; }
  if (!confirm('确定删除此项目及相关数据吗？')) return;
  db.projects = db.projects.filter(p => p.id !== id);
  saveDB(db); showToast('项目已删除', 'success'); renderProjectsTab();
}

function renderUsersTab() {
  const db = getDB();
  const rm = { super_admin:'超级管理员', leader:'公司领导', project_manager:'项目负责人', finance:'财务' };
  document.getElementById('userTableBody').innerHTML = db.users.map(u =>
    `<tr><td>${escHtml(u.username)}</td><td>${escHtml(u.name)}</td><td>${rm[u.role]||u.role}</td><td>${(u.projects||[]).map(getProjectName).join('、')}</td><td class="text-center"><button class="btn btn-primary btn-sm" onclick="showUserForm('${u.id}')">编辑</button> <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')" ${db.users.length<=1?'disabled style="opacity:0.3"':''}>删除</button></td></tr>`
  ).join('');
}

function showUserForm(editId) {
  const db = getDB();
  const isEdit = !!editId;
  const u = isEdit ? db.users.find(x => x.id === editId) : { id:'', username:'', name:'', password:'', role:'project_manager', projects:[] };
  const rm = { super_admin:'超级管理员', leader:'公司领导', project_manager:'项目负责人', finance:'财务' };
  const pOpts = db.projects.map(p => `<label style="display:inline-flex;align-items:center;gap:4px;margin-right:12px;margin-bottom:6px;font-weight:400;"><input type="checkbox" value="${p.id}" ${(u.projects||[]).includes(p.id)?'checked':''}> ${p.name}</label>`).join('');
  showModal(isEdit ? '编辑用户' : '新增用户', `<form id="userForm" onsubmit="return saveUser('${isEdit?editId:''}')"><div class="form-grid">
    <div class="form-group"><label>账号 *</label><input type="text" id="uf_username" value="${escHtml(u.username)}" ${isEdit?'readonly style="background:#f8fafc;"':''} required></div>
    <div class="form-group"><label>密码 *</label><input type="text" id="uf_password" value="" placeholder="${isEdit?'留空不修改':'请输入密码'}" ${isEdit?'':'required'}></div>
    <div class="form-group"><label>姓名 *</label><input type="text" id="uf_name" value="${escHtml(u.name)}" required></div>
    <div class="form-group"><label>角色</label><select id="uf_role">${Object.entries(rm).map(([k,v]) => `<option value="${k}" ${u.role===k?'selected':''}>${v}</option>`).join('')}</select></div>
    <div class="form-group form-full"><label>负责项目</label><div style="padding:8px 0;">${pOpts}</div></div>
  </div><div class="form-actions"><button type="button" class="btn btn-outline" onclick="closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form>`);
}

function saveUser(editId) {
  const db = getDB();
  const username = document.getElementById('uf_username').value.trim();
  const password = document.getElementById('uf_password').value.trim();
  const name = document.getElementById('uf_name').value.trim();
  const role = document.getElementById('uf_role').value;
  const projects = [];
  document.querySelectorAll('#modalBody input[type="checkbox"]').forEach(cb => { if (cb.checked) projects.push(cb.value); });
  if (!username || !name) { showToast('请填写完整信息', 'error'); return false; }
  if (!editId && !password) { showToast('请设置密码', 'error'); return false; }
  if (editId) {
    const u = db.users.find(x => x.id === editId);
    if (u) { u.name = name; u.role = role; u.projects = projects; if (password) u.password = password; }
  } else {
    if (db.users.find(u => u.username === username)) { showToast('账号已存在', 'error'); return false; }
    db.users.push({ id: genId(), username, password, role, name, projects });
  }
  saveDB(db); closeModal(); showToast('用户已保存', 'success'); renderUsersTab(); return false;
}

function deleteUser(id) {
  const db = getDB();
  if (db.users.length <= 1) { showToast('至少保留一个用户', 'error'); return; }
  if (!confirm('确定删除此用户吗？')) return;
  db.users = db.users.filter(u => u.id !== id);
  saveDB(db); showToast('用户已删除', 'success'); renderUsersTab();
}

function renderCostTypesTab() {
  const db = getDB();
  document.getElementById('costTypeTableBody').innerHTML = db.costTypes.map(ct =>
    `<tr><td>${escHtml(ct.name)}</td><td style="color:${ct.enabled?'#10b981':'#94a3b8'};">${ct.enabled?'启用':'禁用'}</td><td class="text-center"><button class="btn btn-primary btn-sm" onclick="showCostTypeForm('${ct.id}')">编辑</button> <button class="btn btn-warning btn-sm" onclick="toggleCostType('${ct.id}')">${ct.enabled?'禁用':'启用'}</button></td></tr>`
  ).join('');
}

function showCostTypeForm(editId) {
  const db = getDB();
  const isEdit = !!editId;
  const ct = isEdit ? db.costTypes.find(c => c.id === editId) : { id:'', name:'' };
  showModal(isEdit ? '编辑成本类型' : '新增成本类型', `<form id="costTypeForm" onsubmit="return saveCostType('${isEdit?editId:''}')"><div class="form-grid">
    <div class="form-group"><label>标识ID</label><input type="text" id="ctf_id" value="${escHtml(ct.id)}" ${isEdit?'readonly':''} placeholder="唯一标识" required></div>
    <div class="form-group"><label>名称 *</label><input type="text" id="ctf_name" value="${escHtml(ct.name)}" required></div>
  </div><div class="form-actions"><button type="button" class="btn btn-outline" onclick="closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form>`);
}

function saveCostType(editId) {
  const db = getDB();
  const id = document.getElementById('ctf_id').value.trim();
  const name = document.getElementById('ctf_name').value.trim();
  if (!id || !name) { showToast('请填写完整信息', 'error'); return false; }
  if (editId) { const ct = db.costTypes.find(c => c.id === editId); if (ct) ct.name = name; }
  else {
    if (db.costTypes.find(c => c.id === id)) { showToast('标识ID已存在', 'error'); return false; }
    db.costTypes.push({ id, name, enabled: true });
  }
  saveDB(db); closeModal(); showToast('成本类型已保存', 'success'); renderCostTypesTab(); return false;
}

function toggleCostType(id) {
  const db = getDB();
  const ct = db.costTypes.find(c => c.id === id);
  if (ct) ct.enabled = !ct.enabled;
  saveDB(db); showToast(`成本类型已${ct.enabled?'启用':'禁用'}`, 'info'); renderCostTypesTab();
}

document.addEventListener('DOMContentLoaded', init);
