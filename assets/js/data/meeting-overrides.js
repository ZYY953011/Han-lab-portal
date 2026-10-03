/* ============================================================
 * 组会 —— 全站级覆盖文件（管理员维护）
 * ------------------------------------------------------------
 * 组员在本机添加/修改/删除的组会先保存在其浏览器里，点「导出我添加的组会（JSON）」
 * 发给管理员后，管理员把内容整体覆盖到本文件的 meetingOverrides / meetingDeletions
 * 并上传 GitHub，全组即可见。
 *
 * 合并规则：
 *   1. meetingOverrides 里的条目按 id 覆盖/追加到 window.DATA.meetings；
 *   2. meetingDeletions 里列出的 id 会被隐藏（数据不删，误删可恢复）。
 * ============================================================ */
window.DATA = window.DATA || {};
window.DATA.meetings = window.DATA.meetings || [];
window.DATA.meetingOverrides = [];
window.DATA.meetingDeletions = [];

(function () {
  var list = window.DATA.meetings;
  (window.DATA.meetingOverrides || []).forEach(function (m) {
    if (!m || !m.id) return;
    var i = list.findIndex(function (x) { return x.id === m.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], m);
    else list.push(m);
  });
  var del = window.DATA.meetingDeletions || [];
  if (del.length) {
    window.DATA.meetings = list.filter(function (x) { return del.indexOf(x.id) < 0; });
  }
})();
