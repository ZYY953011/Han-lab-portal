/* ============================================================
 * 成员月度计划 —— 全站级覆盖文件（管理员维护）
 * ------------------------------------------------------------
 * 组员在本机添加/修改/删除的计划先保存在其浏览器里，点「导出计划（JSON）」
 * 发给管理员后，管理员把内容整体覆盖到本文件的 planOverrides / planDeletions
 * 并上传 GitHub，全组即可见。
 *
 * 合并规则：
 *   1. planOverrides 里的条目按 id 覆盖/追加到 window.DATA.plans；
 *   2. planDeletions 里列出的 id 会被隐藏（数据不删，误删可恢复）。
 *
 * 条目字段说明：
 *   id          唯一编号（MP-xxx）
 *   name        成员姓名
 *   month       月份，如 "2026-10"
 *   content     计划内容
 *   status      "draft"=草稿 | "final"=已定稿（定稿后本人不可再随意改删）
 *   finalAt     定稿时间（ISO 字符串）
 *   revising    true=定稿后申请修改待管理员确认；reviseReason=修改原因；revisedAt=申请时间
 *   done        ""| "done"=已完成 | "partial"=部分完成 | "none"=未完成
 *   doneNote    完成情况说明；doneBy=填写人；doneAt=填写时间
 * ============================================================ */
window.DATA = window.DATA || {};
window.DATA.plans = window.DATA.plans || [];
window.DATA.planOverrides = [];
window.DATA.planDeletions = [];

(function () {
  var list = window.DATA.plans;
  (window.DATA.planOverrides || []).forEach(function (p) {
    if (!p || !p.id) return;
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], p);
    else list.push(p);
  });
  var del = window.DATA.planDeletions || [];
  if (del.length) {
    window.DATA.plans = list.filter(function (x) { return del.indexOf(x.id) < 0; });
  }
})();
