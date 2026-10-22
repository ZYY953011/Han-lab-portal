/* photo-helper.js —— 通用「多照片」组件（压缩上传 + 缩略图列表 + 大图查看器）
 * 依赖：window.SUPABASE_URL / window.SUPABASE_ANON_KEY
 * 用法：
 *   PH.attach({ inputId, listId, hintId, bucket, max, getState, setState, render })
 *   PH.uploadBlob(blob, bucket) -> Promise<公开URL>
 *   PH.showViewer(urls, idx)
 * 版本与全站一致（?v= 由页面引用处带） */
(function () {
  function parsePhotos(v){
    try {
      var arr = typeof v === "string" ? JSON.parse(v) : v;
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (u) { return typeof u === "string" && u.indexOf("http") === 0; });
    } catch (e) { return []; }
  }

  function compressImage(file, maxDim, quality){
    maxDim = maxDim || 1000; quality = quality || 0.8;
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (blob) {
          if (blob) resolve(blob); else reject(new Error("图片压缩失败"));
        }, "image/jpeg", quality);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("图片读取失败")); };
      img.src = url;
    });
  }

  function supabaseBase(){
    return (window.SUPABASE_URL || "").trim()
      .replace(/\/+$/, "").replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  }

  function uploadBlob(blob, bucket){
    var base = supabaseBase(), key = (window.SUPABASE_ANON_KEY || "").trim();
    if (!base || !key) return Promise.reject(new Error("未连接云端，照片无法上传"));
    var path = "photos/" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
    var isJwt = key.indexOf("eyJ") === 0;
    var headers = { "apikey": key, "Content-Type": "image/jpeg", "x-upsert": "true" };
    if (isJwt) headers["Authorization"] = "Bearer " + key;
    return fetch(base + "/storage/v1/object/" + bucket + "/" + path, {
      method: "POST", headers: headers, body: blob
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) {
        var msg = "照片上传失败(" + r.status + ") " + String(t).slice(0, 140);
        if (r.status === 400 || r.status === 403) {
          msg += " —— 常见原因：config.js 里的 SUPABASE_ANON_KEY 填错或不完整，请到 Supabase 控制台复制完整密钥。";
        }
        throw new Error(msg);
      });
      return base + "/storage/v1/object/public/" + bucket + "/" + path;
    });
  }

  /* ---------- 大图查看器（惰性创建，全站单例） ---------- */
  var viewerEl = null, viewerList = [], viewerIdx = 0;
  function ensureViewer(){
    if (viewerEl) return;
    viewerEl = document.createElement("div");
    viewerEl.id = "phViewer";
    viewerEl.style.cssText = "position:fixed; inset:0; z-index:99999; background:rgba(10,20,30,.9); display:none; align-items:center; justify-content:center; flex-direction:column;";
    viewerEl.innerHTML =
      '<div style="position:absolute; top:14px; right:18px; display:flex; gap:10px; align-items:center;">' +
        '<span id="phViewerCount" style="color:#fff; font-size:14px;"></span>' +
        '<button id="phViewerClose" style="background:none; border:none; color:#fff; font-size:26px; cursor:pointer;">✕</button>' +
      '</div>' +
      '<button id="phViewerPrev" style="position:absolute; left:16px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.15); border:none; color:#fff; font-size:30px; width:48px; height:48px; border-radius:50%; cursor:pointer;">‹</button>' +
      '<img id="phViewerImg" style="max-width:88vw; max-height:82vh; border-radius:8px; box-shadow:0 8px 40px rgba(0,0,0,.5);" alt="照片大图">' +
      '<button id="phViewerNext" style="position:absolute; right:16px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.15); border:none; color:#fff; font-size:30px; width:48px; height:48px; border-radius:50%; cursor:pointer;">›</button>';
    document.body.appendChild(viewerEl);
    viewerEl.addEventListener("click", function (e) { if (e.target === viewerEl) hideViewer(); });
    document.getElementById("phViewerClose").onclick = hideViewer;
    document.getElementById("phViewerPrev").onclick = function () { stepViewer(-1); };
    document.getElementById("phViewerNext").onclick = function () { stepViewer(1); };
  }
  function renderViewer(){
    document.getElementById("phViewerImg").src = viewerList[viewerIdx];
    document.getElementById("phViewerCount").textContent = (viewerIdx + 1) + " / " + viewerList.length;
  }
  function stepViewer(d){
    if (!viewerList.length) return;
    viewerIdx = (viewerIdx + d + viewerList.length) % viewerList.length;
    renderViewer();
  }
  function hideViewer(){ viewerEl.style.display = "none"; }
  function showViewer(list, idx){
    ensureViewer();
    viewerList = list || []; viewerIdx = Math.max(0, Math.min(idx || 0, viewerList.length - 1));
    renderViewer();
    viewerEl.style.display = "flex";
  }

  /* ---------- 弹窗照片区绑定 ---------- */
  /* opts: { inputId, listId, hintId, bucket, max, get():string[], set(arr) } */
  function attach(opts){
    var input = document.getElementById(opts.inputId);
    var list = document.getElementById(opts.listId);
    var hint = document.getElementById(opts.hintId);
    var bucket = opts.bucket, max = opts.max || 4;

    function render(){
      var arr = opts.get();
      list.innerHTML = arr.map(function (u, i) {
        return '<div style="position:relative; display:inline-block;">' +
          '<img src="' + u + '" data-i="' + i + '" loading="lazy" style="width:76px; height:76px; object-fit:cover; border-radius:8px; border:1px solid var(--border); cursor:zoom-in;">' +
          '<button type="button" data-del="' + i + '" style="position:absolute; top:-6px; right:-6px; width:20px; height:20px; border-radius:50%; border:none; background:#d64541; color:#fff; font-size:12px; cursor:pointer; line-height:1;">✕</button>' +
          '</div>';
      }).join("");
      if (hint) hint.textContent = arr.length ? (arr.length + " / " + max + " 张") : "";
      Array.prototype.forEach.call(list.querySelectorAll("img"), function (img) {
        img.onclick = function () { showViewer(opts.get(), Number(img.dataset.i)); };
      });
      Array.prototype.forEach.call(list.querySelectorAll("button[data-del]"), function (btn) {
        btn.onclick = function () {
          var arr2 = opts.get(); arr2.splice(Number(btn.dataset.del), 1);
          opts.set(arr2); render();
        };
      });
    }

    var busy = false;
    input.addEventListener("change", function () {
      var files = Array.prototype.slice.call(input.files || []);
      input.value = "";
      if (!files.length) return;
      var arr = opts.get();
      if (arr.length >= max) { alert("最多 " + max + " 张照片，先移除再添加。"); return; }
      if (busy) return;
      busy = true;
      var room = max - arr.length;
      var pick = files.slice(0, room);
      if (files.length > room) alert("最多 " + max + " 张，本次只添加前 " + room + " 张。");
      var fails = [];
      var chain = Promise.resolve();
      pick.forEach(function (f) {
        chain = chain.then(function () {
          return compressImage(f).then(function (blob) { return uploadBlob(blob, bucket); }).then(function (url) {
            arr.push(url); opts.set(arr); render();
          }).catch(function (e) { fails.push(f.name + "：" + e.message); });
        });
      });
      chain.then(function () {
        busy = false;
        if (fails.length) alert("部分照片上传失败：\n" + fails.join("\n"));
      });
    });

    render();
    return { render: render };
  }

  window.PH = {
    parsePhotos: parsePhotos,
    compressImage: compressImage,
    uploadBlob: uploadBlob,
    showViewer: showViewer,
    attach: attach
  };
})();
