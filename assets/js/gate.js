/* =========================================================
 * gate.js —— 网站访问口令（轻量防护）
 * 作用：只有知道口令的人才能查看网站内容。
 * 改口令：见 assets/js/config.js 里的 window.SITE_PASSWORD
 *
 * 重要说明（请务必读）：
 * 这是“挡君子不挡小人”的轻量方案，口令在浏览器本地校验，
 * 懂技术的人理论上可以绕过。因此：
 *   - 适合“非本组人别随便看”的日常场景；
 *   - 不要把财务金额、私人手机号、学生隐私等机密放进网站。
 * 若需要“精确到某个人能否进入、可单独收回权限”，
 * 请改用 Cloudflare Access（见 README 权限章节）。
 * ========================================================= */
(function () {
  var KEY = "gate_unlocked";

  /* 用 localStorage（而不是 sessionStorage）：
   * —— 同一浏览器（同一网址来源）里，只要输过一次口令，
   *    不论开几个标签页、关掉重开，都不再要求输入。
   * 说明：存储按“浏览器+网址”保存，所以换电脑/换浏览器
   * 仍需要重新输入一次（这是纯前端方案能做到的极限，
   * 要跨设备统一权限请用 README 里的 Cloudflare Access）。 */
  function unlocked() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function setUnlocked() {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
  }

  // 公共电脑用完，点这个按钮可清除口令、重新锁屏
  function addLogoutBtn() {
    var b = document.createElement("button");
    b.textContent = "退出访问";
    b.title = "清除本机口令（公共电脑用完请点）";
    b.style.cssText =
      "position:fixed;right:14px;bottom:14px;z-index:99998;padding:7px 12px;" +
      "border:none;border-radius:8px;background:rgba(31,79,121,.85);color:#fff;" +
      "font-size:13px;cursor:pointer;font-family:inherit;";
    b.onclick = function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    };
    document.body.appendChild(b);
  }

  // 口令哈希（优先 SHA-256；本地 file:// 等非安全环境降级为普通哈希）
  function hashStr(str) {
    if (window.crypto && window.crypto.subtle) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
        .then(function (buf) {
          return Array.prototype.map.call(new Uint8Array(buf), function (b) {
            return b.toString(16).padStart(2, "0");
          }).join("");
        });
    }
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return Promise.resolve(h.toString(16));
  }

  function buildOverlay() {
    var ov = document.createElement("div");
    ov.id = "gate-overlay";
    ov.innerHTML =
      '<div class="gate-box">' +
        '<div class="gate-logo">🔒</div>' +
        '<div class="gate-title">课题组管理平台</div>' +
        '<div class="gate-sub">本网站仅限课题组内部访问，请输入访问口令</div>' +
        '<input id="gate-pwd" class="gate-input" type="password" placeholder="访问口令" autocomplete="off">' +
        '<button id="gate-btn" class="gate-btn">进入</button>' +
        '<div id="gate-err" class="gate-err"></div>' +
      '</div>';
    document.body.appendChild(ov);

    var input = document.getElementById("gate-pwd");
    var btn = document.getElementById("gate-btn");
    var err = document.getElementById("gate-err");
    input.focus();

    function tryUnlock() {
      var val = input.value;
      if (!val) { err.textContent = "请输入口令"; return; }
      Promise.all([hashStr(val), hashStr(window.SITE_PASSWORD || "lab2024")])
        .then(function (r) {
          if (r[0] === r[1]) {
            setUnlocked();
            document.documentElement.classList.remove("gate-locked");
            if (ov.parentNode) ov.parentNode.removeChild(ov);
            addLogoutBtn();
          } else {
            err.textContent = "口令错误，请重试";
            input.value = "";
            input.focus();
          }
        });
    }
    btn.addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") tryUnlock(); });
  }

  // 脚本位于 </body> 前，此时 DOM 已就绪
  if (unlocked()) {
    document.documentElement.classList.remove("gate-locked");
    addLogoutBtn();
  } else {
    buildOverlay();
  }
})();
