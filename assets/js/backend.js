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
  /* ---------- 表名映射：页面用的逻辑名 → 数据库表名与字段 ----------
   * full: true 表示该表用「常用标量列 + data jsonb 完整快照」存法，
   *       读取时自动把 data 展开成完整对象，写入时自动把整对象塞进 data。 */
  var TABLES = {
    meetings:  { table: "lab_meetings",  fields: ["id","date","time","place","reporter","topic","pptUrl","docUrl","publishDate","publisher"] },
    plans:     { table: "lab_plans",     fields: ["id","name","month","content","status","finalAt","revising","reviseReason","revisedAt","done","doneNote","doneBy","doneAt"] },
    expenses:  { table: "lab_expenses",  fields: ["id","projectId","date","cat","item","amount","person","receipt","note"] },
    equipment: { table: "lab_equipment", fields: ["id","category","name","model","brand","qty","unit","location","keeper","purchaseDate","price","status","url","note"] },
    datasets:  { table: "lab_datasets",  fields: ["id","site","uploader","date","url","note"] },
    projects:  { table: "lab_projects", full: true, fields: ["id","name","shortName","leader","source","code","fiscalCode","start","end","budget","status","stage","progress","pinned","members"] },
    methods:   { table: "lab_methods",  full: true, fields: ["id","name","category","author","version","updated","sopUrl"] },
    samples:   { table: "lab_samples",  full: true, fields: ["id","name","type","project","owner","location","remain","total","unit","status"] },
    students:  { table: "lab_students", full: true, fields: ["id","name","type","tutor","enroll"] },
    members:   { table: "lab_members",  full: true, fields: ["id","name","role","status"] },
    achievements: { table: "lab_achievements", full: true, fields: ["id","title","type","year"] },
    resources: { table: "lab_resources", full: true, fields: ["id","title","category"] },
    expguide:  { table: "lab_expense_guides", full: true, fields: ["id","title","kind","sort"] },
    reminders: { table: "lab_reminders", fields: ["id","title","date","note","link","source"] }
  };

  var state = { mode: "local", checked: false, reason: "", listeners: [] };

  function cfg() {
    /* 容错处理：不管你填的是——
     *   https://xxx.supabase.co                    （标准 Project URL）
     *   https://xxx.supabase.co/                   （结尾带斜杠）
     *   https://xxx.supabase.co/rest/v1            （Data API 页复制的完整 API URL）
     *   https://xxx.supabase.co/rest/v1/           （完整 API URL 再带斜杠）
     * 都自动归一成纯域名，避免拼接出 /rest/v1/rest/v1 之类的错误地址。
     * key 也自动去掉首尾空格（复制粘贴常带不可见空格/换行）。 */
    var u = (window.SUPABASE_URL || "").trim()
      .replace(/\/+$/, "")            // 去结尾斜杠
      .replace(/\/rest\/v1\/?$/i, "") // 去结尾的 /rest/v1（如有）
      .replace(/\/+$/, "");           // 再去一次可能残留的斜杠
    return { url: u, key: (window.SUPABASE_ANON_KEY || "").trim() };
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
    var probe = function () {
      return fetch(c.url + "/rest/v1/" + TABLES.meetings.table + "?select=id&limit=1", {
        headers: { "apikey": c.key, "Authorization": "Bearer " + c.key }
      });
    };
    /* 探测失败自动重试一次（手机/校园网首次访问常因网络抖动误判为断网） */
    return probe().catch(function () {
      return new Promise(function (res) { setTimeout(res, 900); }).then(probe);
    }).then(function (r) {
      state.checked = true;
      if (r && r.ok) {
        setMode("cloud", "");
        /* 云端模式：全站隐藏「导出/发布」按钮与「仅本机可见」提示条——
           保存即全组可见，这些过渡期工具不再需要，避免干扰组员。 */
        try {
          var st = document.createElement("style");
          st.id = "db-cloud-hide";
          st.textContent = ".local-only-btn,.local-draft-bar{display:none!important;}";
          document.head.appendChild(st);
        } catch (e) {}
        return "cloud";
      }
      setMode("local", "云端返回 " + (r ? r.status : "无响应") + "，已回退到本机模式");
      return "local";
    }).catch(function (e) {
      state.checked = true;
      setMode("local", "连接云端失败（" + e.message + "），已回退到本机模式——也可能是网络波动，刷新页面可重试");
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
    if (def && def.full) {
      /* full 模式：白名单标量列 + 整对象存进 data jsonb（完整快照，嵌套字段都在） */
      def.fields.forEach(function (k) {
        if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
      });
      out.data = obj;
    } else {
      (def ? def.fields : Object.keys(obj)).forEach(function (k) {
        if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
      });
    }
    return out;
  }

  /* full 表的行 → 完整业务对象（data 快照打底，标量列覆盖最新值） */
  function unpackItem(which, row) {
    var def = TABLES[which];
    if (!def || !def.full || !row || typeof row !== "object") return row;
    var obj = Object.assign({}, row.data || {});
    def.fields.forEach(function (k) { if (row[k] !== undefined && row[k] !== null) obj[k] = row[k]; });
    delete obj.data; delete obj.updated_at;
    return obj;
  }
  function unpackRows(which, rows) {
    return (rows || []).map(function (r) { return unpackItem(which, r); });
  }

  /* ---------- 本地草稿回退实现（与原有逻辑一致） ---------- */
  var LOCAL_KEY = {
    meetings: "meeting-local", plans: "plan-items", expenses: "exp-local",
    equipment: "equip-items", datasets: "ds-items",
    projects: "proj-projects", methods: "method-local", samples: "sample-local",
    reminders: "remind-local", members: "member-items", achievements: "achv-items",
    resources: "resource-local", expguide: "expguide-local"
  };
  var LOCAL_DEL = {
    meetings: "meeting-deleted", plans: "plan-deleted", expenses: "exp-deleted",
    equipment: "equip-deleted", datasets: "ds-deleted",
    projects: "proj-deleted", methods: "method-deleted", samples: "sample-deleted",
    reminders: "remind-deleted", members: "member-deleted", achievements: "achv-deleted",
    resources: "resource-deleted", expguide: "expguide-deleted"
  };
  function lget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ============================================================
   * 自动迁移（首次连上云端时，把本机的东西搬上去，用户零操作）：
   *   1) applyLocalDeletes：本机删除过的条目 → 从云端删掉（防止“删过的复活”）
   *   2) seedIfEmpty      ：云端表为空 → 把网页自带数据（js + overrides）种入云端
   *   3) migrateLocalDrafts：本机草稿（此前“只保存在这台电脑”的修改）→ 逐条上传合并
   * 全部按 id 幂等，重复执行/多台电脑同时执行都安全。
   * ============================================================ */
  function applyLocalDeletes(which) {
    var dels = lget(LOCAL_DEL[which], []);
    if (!dels.length) return Promise.resolve(0);
    var c = cfg();
    return Promise.all(dels.map(function (id) {
      return fetch(c.url + "/rest/v1/" + TABLES[which].table + "?id=eq." + encodeURIComponent(id), {
        method: "DELETE", headers: headers()
      }).catch(function () {});   // 单条失败不阻断
    })).then(function () {
      lset(LOCAL_DEL[which], []);  // 应用过就清空，下次不再重复删
      return dels.length;
    });
  }

  function seedIfEmpty(which, snapshot, skipIds) {
    var mark = lget("db-seeded-" + which, false);
    if (mark) return Promise.resolve(0);
    var c = cfg();
    return fetch(c.url + "/rest/v1/" + TABLES[which].table + "?select=id&limit=1", { headers: headers() })
      .then(function (r) { return r.json(); })
      .then(function (probe) {
        if (Array.isArray(probe) && probe.length) { lset("db-seeded-" + which, true); return 0; } // 云端已有数据，不种
        var items = (Array.isArray(snapshot) ? snapshot : []).filter(function (x) {
          return x && x.id && (skipIds || []).indexOf(x.id) < 0;
        });
        if (!items.length) { lset("db-seeded-" + which, true); return 0; }
        var body = items.map(function (x) { return clean(which, x); });
        return fetch(c.url + "/rest/v1/" + TABLES[which].table, {
          method: "POST", headers: headers({ "Prefer": "resolution=merge-duplicates" }),
          body: JSON.stringify(body)
        }).then(function (r) {
          if (r.ok) { lset("db-seeded-" + which, true); return items.length; }
          return 0;
        });
      }).catch(function () { return 0; });
  }

  /* 老记录无 id 时生成"内容哈希 id"：同一条记录无论在哪台电脑、重试多少次，
   * 生成的 id 都相同 → upsert 按 id 合并，不会在云端越堆越多。 */
  function stableId(which, d) {
    var s = which + "|" + JSON.stringify(d, function (k, v) { return k === "id" ? undefined : v; });
    var h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; }
    return "IMP" + h.toString(36);
  }

  function migrateLocalDrafts(which) {
    var drafts = lget(LOCAL_KEY[which], []);
    if (!drafts.length) return Promise.resolve(0);
    /* 老版本存下的记录可能没有 id（早期纯静态站不强制）：没有 id 就按内容生成稳定 id，
       否则上传时因缺少主键必然失败、且一直无声重试。 */
    drafts = drafts.map(function (d) {
      if (d && !d.id) d.id = stableId(which, d);
      return d;
    });
    lset(LOCAL_KEY[which], drafts);
    return Promise.all(drafts.map(function (d) {
      return fetch(cfg().url + "/rest/v1/" + TABLES[which].table + "?on_conflict=id", {
        method: "POST", headers: headers({ "Prefer": "resolution=merge-duplicates" }),
        body: JSON.stringify(clean(which, d))
      }).then(function (r) { return r.ok ? r : null; }).catch(function () { return null; });
    })).then(function (results) {
      var ok = results.filter(Boolean).length;
      if (ok === drafts.length) {
        // 全部成功：原键内容移入备份键（留底），原键清空，下次不再重复传
        lset(LOCAL_KEY[which] + "-migrated-backup", drafts);
        lset(LOCAL_KEY[which], []);
      } else if (drafts.length) {
        // 有失败：明确提示（此前是完全静默，用户只会觉得"同步没生效"）
        try {
          var el = document.createElement("div");
          el.style.cssText = "position:fixed; top:12px; left:50%; transform:translateX(-50%); z-index:9999;" +
            "background:#fdf0db; color:#8a5a00; border:1px solid #ecd9a8; border-left:4px solid #d99a2b;" +
            "border-radius:10px; padding:10px 18px; font-size:14px; box-shadow:0 4px 16px rgba(0,0,0,.12); max-width:86vw;";
          el.innerHTML = "⚠ 自动同步：本机 <b>" + (drafts.length - ok) + "</b> 条记录上传未成功（已保留在本机，" +
            "刷新页面会自动重试；若反复出现，请检查网络后按 Ctrl+F5 强制刷新）";
          document.body.appendChild(el);
          setTimeout(function () { el.style.transition = "opacity .6s"; el.style.opacity = "0"; }, 8000);
          setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 8800);
        } catch (e) {}
      }
      return ok;
    });
  }

  /* 一键"把本机所有未同步内容搬上云端"：依次对每个栏目执行完整迁移管线。
   * 供管理页救援面板与红条重试按钮使用；按 id 幂等，重复执行安全。 */
  function migrateAll() {
    var jobs = Object.keys(TABLES).map(function (which) {
      var dataKey = which;   // hydrate 里 seedIfEmpty 用的 window.DATA 键与逻辑名一致
      return hydrate(which, dataKey).catch(function () { return null; });
    });
    return Promise.all(jobs);
  }

  function migrateToast(n, seedN, delN) {
    if (!n && !seedN && !delN) return;
    try {
      var el = document.createElement("div");
      el.style.cssText = "position:fixed; top:12px; left:50%; transform:translateX(-50%); z-index:9999;" +
        "background:#eaf7ef; color:#1d5e36; border:1px solid #bfe3cd; border-left:4px solid #2e9e5b;" +
        "border-radius:10px; padding:10px 18px; font-size:14px; box-shadow:0 4px 16px rgba(0,0,0,.12); max-width:86vw;";
      var parts = [];
      if (n) parts.push("已自动把本机 <b>" + n + "</b> 条修改上传合并到云端");
      if (seedN) parts.push("已把网页原有 <b>" + seedN + "</b> 条数据同步进云端");
      if (delN) parts.push("已应用你之前的 <b>" + delN + "</b> 条删除");
      el.innerHTML = "✅ " + parts.join("；") + "（本提示几秒后自动消失）";
      document.body.appendChild(el);
      setTimeout(function () { el.style.transition = "opacity .6s"; el.style.opacity = "0"; }, 6000);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 6800);
    } catch (e) {}
  }

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
      var first = (rows && rows[0]) || obj;
      return { mode: "cloud", item: unpackItem(which, first) };
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

  /* ---------- 一次性拉取某个栏目并覆盖到 window.DATA ----------
   * 云端模式下自动完成（每台电脑只需一次，用户零操作）：
   *   应用本机删除 → 空表时种入网页自带数据 → 上传合并本机草稿 → 重新拉取并覆盖 */
  function hydrate(which, dataKey) {
    return list(which).then(function (rows) {
      if (state.mode !== "cloud" || !Array.isArray(rows)) return rows;
      var snapshot = (window.DATA && window.DATA[dataKey]) || null;  // 覆盖前的仓库数据快照
      var pendingDels = lget(LOCAL_DEL[which], []);                  // 先读出删除记录（应用后会被清空）

      return applyLocalDeletes(which).then(function (delN) {
        return seedIfEmpty(which, snapshot, pendingDels).then(function (seedN) {
          return migrateLocalDrafts(which).then(function (migN) {
            migrateToast(migN, seedN, delN);
            return list(which);
          });
        });
      }).then(function (rows2) {
        if (Array.isArray(rows2)) {
          window.DATA = window.DATA || {};
          window.DATA[dataKey] = unpackRows(which, rows2);
        }
        return window.DATA[dataKey];
      });
    });
  }

  /* ---------- 状态提示条（页面可调用） ----------
   * 云端模式：返回空（页面干净，不显示任何技术性横幅——保存即全组可见，无需提醒）。
   * 本机模式：保留黄色警告（此时提示是必要的，否则组员会误以为全组可见）。 */
  function statusBanner() {
    if (!state.checked) return "";
    if (state.mode === "cloud") return "";
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
    migrateAll: migrateAll, configured: configured, TABLES: TABLES,
    get mode() { return state.mode; },
    get reason() { return state.reason; }
  };
})();
