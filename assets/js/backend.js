/* ============================================================
 * backend.js —— 统一数据层（云端实时共享 / 本机草稿自动回退）
 * ------------------------------------------------------------
 * 目的：让「组员在网页上保存 → 全组刷新即可见」真正实现。
 *
 * 工作方式：
 *   · 在 config.js 里填好 window.SUPABASE_URL 与 window.SUPABASE_ANON_KEY 后，
 *     所有保存会**直接写入云端数据库**，全组共享，保存即见（与学院官网体验一致）；
 *   · 没填（或网络失败）时，自动回退到原来的「本机 localStorage 草稿 + 导出/Issue 发布」模式，
 *     网站不会白屏、功能不受影响。
 *
 * 用法（页面里）：
 *   await DB.ready();                       // 等配置/连通性探测完成
 *   DB.mode                                 // "cloud" | "local"
 *   await DB.list("meetings")               // 取全组数据
 *   await DB.upsert("meetings", obj)        // 新增或按 id 覆盖
 *   await DB.remove("meetings", id)         // 删除
 *   DB.onStatus(fn)                         // 监听在线/离线状态变化
 *
 * 说明：使用 Supabase 的 REST 接口（PostgREST），不需要引入额外 SDK，
 *      纯 fetch 实现，避免依赖 CDN、离线也能优雅回退。
 * ============================================================ */
window.DB = (function () {
  /* ---------- 表名映射：页面用的逻辑名 → 数据库表名与字段 ---------- */
  var TABLES = {
    meetings:  { table: "lab_meetings",  fields: ["id","date","time","place","reporter","topic","pptUrl","docUrl","publishDate","publisher"] },
    plans:     { table: "lab_plans",     fields: ["id","name","month","content","status","finalAt","revising","reviseReason","revisedAt","done","doneNote","doneBy","doneAt"] },
    expenses:  { table: "lab_expenses",  fields: ["id","projectId","date","cat","item","amount","person","receipt","note"] },
    equipment: { table: "lab_equipment", fields: ["id","category","name","model","brand","qty","unit","location","keeper","purchaseDate","price","status","url","note"] },
    datasets:  { table: "lab_datasets",  fields: ["id","site","uploader","date","url","note"] }
  };

  var state = { mode: "local", checked: false, reason: "", listeners: [] };

  function cfg() {
    return {
      url: (window.SUPABASE_URL || "").replace(/\/+$/, ""),
      key: window.SUPABASE_ANON_KEY || ""
    };
  }
  function configured() {
    var c = cfg();
    return !!(c.url && c.key && c.url.indexOf("http") === 0);
  }
  function setMode(m, why) {
    if (state.mode !== m) {
      state.mode = m; state.reason = why || "";
      state.listeners.forEach(function (f) { try { f(m, why); } catch (e) {} });
    } else if (why) { state.reason = why; }
  }
  function onStatus(fn) { state.listeners.push(fn); }

  /* ---------- 探测连通性（一次） ---------- */
  function ready() {
    if (state.checked) return Promise.resolve(state.mode);
    if (!configured()) {
      state.checked = true;
      setMode("local", "未配置云端数据库（config.js 里的 SUPABASE_URL / SUPABASE_ANON_KEY 为空）");
      return Promise.resolve("local");
    }
    var c = cfg();
    return fetch(c.url + "/rest/v1/" + TABLES.meetings.table + "?select=id&limit=1", {
      headers: { "apikey": c.key, "Authorization": "Bearer " + c.key }
    }).then(function (r) {
      state.checked = true;
      if (r.ok) { setMode("cloud", ""); return "cloud"; }
      setMode("local", "云端返回 " + r.status + "，已回退到本机模式");
      return "local";
    }).catch(function (e) {
      state.checked = true;
      setMode("local", "连接云端失败（" + e.message + "），已回退到本机模式");
      return "local";
    });
  }

  /* ---------- 通用 REST 封装 ---------- */
  function headers(extra) {
    var c = cfg();
    var h = {
      "apikey": c.key,
      "Authorization": "Bearer " + c.key,
      "Content-Type": "application/json"
    };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function clean(which, obj) {
    var def = TABLES[which];
    var out = {};
    (def ? def.fields : Object.keys(obj)).forEach(function (k) {
      if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
    });
    return out;
  }

  /* ---------- 本地草稿回退实现（与原有逻辑一致） ---------- */
  var LOCAL_KEY = { meetings: "meeting-local", plans: "plan-items", expenses: "exp-local", equipment: "equip-items", datasets: "ds-items" };
  var LOCAL_DEL = { meetings: "meeting-deleted", plans: "plan-deleted", expenses: "exp-deleted", equipment: "equip-deleted", datasets: "ds-deleted" };
  function lget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- 对外接口 ---------- */
  function list(which) {
    if (state.mode !== "cloud") {
      return Promise.resolve(lget(LOCAL_KEY[which] || ("db-" + which), []));
    }
    var c = cfg();
    return fetch(c.url + "/rest/v1/" + TABLES[which].table + "?select=*", { headers: headers() })
      .then(function (r) { if (!r.ok) throw new Error("读取失败 " + r.status); return r.json(); })
      .catch(function (e) { setMode("local", e.message); return lget(LOCAL_KEY[which] || ("db-" + which), []); });
  }

  function upsert(which, obj) {
    if (state.mode !== "cloud") {
      var arr = lget(LOCAL_KEY[which], []);
      var i = arr.findIndex(function (x) { return x.id === obj.id; });
      if (i >= 0) arr[i] = obj; else arr.push(obj);
      lset(LOCAL_KEY[which], arr);
      return Promise.resolve({ mode: "local", item: obj });
    }
    var c = cfg();
    var body = clean(which, obj);
    return fetch(c.url + "/rest/v1/" + TABLES[which].table + "?on_conflict=id", {
      method: "POST",
      headers: headers({ "Prefer": "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error("保存失败 " + r.status + " " + t); });
      return r.json();
    }).then(function (rows) {
      return { mode: "cloud", item: (rows && rows[0]) || obj };
    });
  }

  function remove(which, id) {
    if (state.mode !== "cloud") {
      var arr = lget(LOCAL_KEY[which], []).filter(function (x) { return x.id !== id; });
      lset(LOCAL_KEY[which], arr);
      var del = lget(LOCAL_DEL[which], []);
      if (del.indexOf(id) < 0) del.push(id);
      lset(LOCAL_DEL[which], del);
      return Promise.resolve({ mode: "local" });
    }
    var c = cfg();
    return fetch(c.url + "/rest/v1/" + TABLES[which].table + "?id=eq." + encodeURIComponent(id), {
      method: "DELETE", headers: headers()
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error("删除失败 " + r.status + " " + t); });
      return { mode: "cloud" };
    });
  }

  /* ---------- 一次性拉取某个栏目并覆盖到 window.DATA ---------- */
  function hydrate(which, dataKey) {
    return list(which).then(function (rows) {
      if (state.mode === "cloud" && Array.isArray(rows)) {
        window.DATA = window.DATA || {};
        window.DATA[dataKey] = rows;
      }
      return rows;
    });
  }

  /* ---------- 状态提示条（页面可调用） ---------- */
  function statusBanner() {
    if (!state.checked) return "";
    if (state.mode === "cloud") {
      return '<div class="note-box" style="margin:10px 0; border-left-color:#2e9e5b;">' +
        '🟢 <b>云端实时模式已开启</b>：你在本页保存的内容会<b>立即对全组可见</b>，不需要再导出或发布。' +
        '</div>';
    }
    var issueUrl = (typeof window.ISSUE_NEW_URL === "function") ? window.ISSUE_NEW_URL() : "";
    return '<div class="warn-box" style="margin:10px 0;">' +
      '🟡 <b>当前是本机草稿模式</b>：保存的内容只在这台电脑上，换电脑或别人打开看不到。' +
      (state.reason ? '（原因：' + state.reason + '）' : '') +
      '<br>管理员在 <code>assets/js/config.js</code> 填好 <code>SUPABASE_URL</code> 与 <code>SUPABASE_ANON_KEY</code> 后，' +
      '本页会切换为<b>云端实时模式</b>，保存即全组可见。' +
      (issueUrl ? '<br>临时发布办法：点 <a href="' + issueUrl + '" target="_blank" rel="noopener">🚀 去 GitHub 发布</a>（1–2 分钟自动更新）。' : '') +
      '</div>';
  }

  return {
    ready: ready, onStatus: onStatus, statusBanner: statusBanner,
    list: list, upsert: upsert, remove: remove, hydrate: hydrate,
    configured: configured, TABLES: TABLES,
    get mode() { return state.mode; },
    get reason() { return state.reason; }
  };
})();
