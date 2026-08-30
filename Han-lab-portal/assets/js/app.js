/* =========================================================
 * app.js —— 全站共用脚本
 * 功能：注入顶部导航 + 全站搜索 + 首页卡片 + 通用工具函数
 * 注意：本文件不依赖任何后端，所有数据来自 window.DATA（见 data/*.js）
 * ========================================================= */

/* ---------- 路径工具：自动判断当前在根目录还是 pages/ 目录 ---------- */
function isRoot() {
  // 首页（index.html 或目录根）在根目录；其余页面在 pages/ 目录
  return /(index\.html|\/)$/.test(location.pathname);
}
function P()  { return isRoot() ? "pages/" : ""; }      // 进入 pages/ 下的前缀
function HOME() { return isRoot() ? "index.html" : "../index.html"; }

/* ---------- 通用工具 ---------- */
function esc(s) {
  if (s === null || s === undefined) return "";
  return String(s).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
function getParam(name) {
  const m = new URLSearchParams(location.search).get(name);
  return m;
}
function $(sel, root = document) { return root.querySelector(sel); }
function el(tag, attrs = {}, html = "") {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (html !== "") e.innerHTML = html;
  return e;
}

/* ---------- 状态标签：把文字映射成带颜色的徽章 ---------- */
function badge(text, color) {
  const colors = {
    "准备中": "blue", "进行中": "green", "暂停": "orange", "结题中": "purple", "已结题": "gray",
    "在库": "green", "使用中": "blue", "已耗尽": "red", "已转移": "orange", "已废弃": "gray",
    "待整理": "gray", "待提交": "blue", "已提交": "purple", "退回修改": "red", "审核中": "orange", "已报销": "green",
    "未开始": "gray", "已完成": "green", "需要修改": "red",
    "教师": "purple", "博士后": "blue", "博士生": "green", "硕士生": "orange", "本科生": "blue", "已毕业成员": "gray",
  };
  const c = color || colors[text] || "gray";
  return `<span class="badge badge-${c}">${esc(text)}</span>`;
}

/* ---------- 注入顶部导航 + 搜索框 ---------- */
function injectHeader(activeName) {
  const SITE = window.SITE, NAV = window.NAV || [];
  const navHtml = NAV.map(n =>
    `<a href="${P() + n.file}" class="${n.name === activeName ? "active" : ""}">${esc(n.name)}</a>`
  ).join("");

  const bar = el("header", { class: "topbar" });
  bar.innerHTML = `
    <div class="topbar-inner">
      <div class="brand">
        <a href="${HOME()}">
          <div class="gname">${esc(SITE.groupName)}</div>
          <div class="sname">${esc(SITE.siteName)}</div>
        </a>
      </div>
      <button class="menu-toggle" onclick="document.getElementById('navMenu').classList.toggle('show')">菜单</button>
      <nav class="nav" id="navMenu">${navHtml}</nav>
      <div class="search-wrap">
        <input id="globalSearch" type="text" placeholder="🔍 搜索项目 / 成员 / 方法 / 样品…" autocomplete="off">
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>`;
  document.body.prepend(bar);

  // 页脚
  const foot = el("footer", { class: "footer" });
  foot.innerHTML = `
    <div class="footer-inner">
      <div>${esc(SITE.groupName)} · ${esc(SITE.siteName)}（第一版原型）</div>
      <div>本网站为静态原型，数据均为示例。后续可接入表格/云盘/API。</div>
    </div>`;
  document.body.append(foot);

  // 绑定搜索
  const input = $("#globalSearch");
  input.addEventListener("input", e => runSearch(e.target.value));
  input.addEventListener("focus", e => { if (e.target.value) runSearch(e.target.value); });
  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrap")) $("#searchResults").classList.remove("show");
  });
}

/* ---------- 全站搜索：基于本地数据构建索引（第一版方案） ---------- */
let _searchIndex = null;
function buildSearchIndex() {
  if (_searchIndex) return _searchIndex;
  const idx = [];
  (window.SEARCH_CONFIG || []).forEach(cfg => {
    const list = (window.DATA && window.DATA[cfg.key]) || [];
    list.forEach(item => {
      const title = item[cfg.title] || "";
      const sub = item[cfg.sub] ? item[cfg.sub] : "";
      idx.push({
        typeName: cfg.typeName,
        title: title,
        sub: sub,
        url: P() + cfg.url + (cfg.param ? `?${cfg.param}=${encodeURIComponent(item.id)}` : ""),
      });
    });
  });
  _searchIndex = idx;
  return idx;
}
function runSearch(q) {
  const box = $("#searchResults");
  q = (q || "").trim();
  if (!q) { box.classList.remove("show"); box.innerHTML = ""; return; }
  const idx = buildSearchIndex();
  const lower = q.toLowerCase();
  const hits = idx.filter(it =>
    (it.title && it.title.toLowerCase().includes(lower)) ||
    (it.sub && it.sub.toLowerCase().includes(lower))
  ).slice(0, 40);

  if (hits.length === 0) {
    box.innerHTML = `<div class="sr-empty">未找到与“${esc(q)}”相关的内容</div>`;
    box.classList.add("show");
    return;
  }
  // 按类型分组
  const groups = {};
  hits.forEach(h => { (groups[h.typeName] = groups[h.typeName] || []).push(h); });
  let html = "";
  for (const type in groups) {
    html += `<div class="sr-group">${esc(type)}（${groups[type].length}）</div>`;
    groups[type].forEach(h => {
      html += `<a href="${esc(h.url)}"><div class="t">${esc(h.title)}</div>
        <div class="sr-sub">${esc(h.sub || "")}</div></a>`;
    });
  }
  box.innerHTML = html;
  box.classList.add("show");
}

/* ---------- 首页：渲染 8 个入口卡片 ---------- */
function renderEntryCards() {
  const box = $("#entry-cards");
  if (!box) return;
  box.innerHTML = (window.HOME_CARDS || []).map(c => `
    <div class="entry-card">
      <div class="ic">${c.icon}</div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.desc)}</p>
      <a class="btn btn-sm" href="${P() + c.file}">进入 →</a>
    </div>`).join("");
}

/* ---------- 通用：把数组渲染成简单表格（带表头） ---------- */
function simpleTable(headers, rowsHtml) {
  return `<div class="table-wrap"><table>
    <thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rowsHtml}</tbody></table></div>`;
}

/* ---------- 页面骨架：标题 + 面包屑（在页面中调用） ---------- */
function pageHead(title, desc, crumbs) {
  const bc = (crumbs || []).map((c, i, arr) =>
    i === arr.length - 1 ? esc(c.name) : `<a href="${esc(c.url)}">${esc(c.name)}</a>`
  ).join(" / ");
  return `<div class="page-head">
    <div class="breadcrumb">${bc}</div>
    <div class="page-title">${esc(title)}</div>
    ${desc ? `<div class="page-desc">${esc(desc)}</div>` : ""}
  </div>`;
}

/* ---------- 找不到数据时的占位 ---------- */
function emptyTip(text) {
  return `<div class="placeholder">${esc(text || "暂无数据（示例数据占位）")}</div>`;
}
