/* member-overrides.js —— 成员的全组级增删改（管理员维护）
 *
 * 工作方式（与 achievement-overrides.js 相同）：
 * 1. 组员在「成员」页点「＋ 添加成员」新增，或对成员卡片点「编辑 / 删除」，
 *    修改先保存在本人浏览器（仅本机可见）。
 * 2. 组员点「导出我添加的修改（JSON）」，把弹窗里的全部内容发给管理员。
 * 3. 管理员用弹窗内容【整体覆盖】本文件，上传 GitHub 后全组可见。
 *
 * 常用字段：id / name / role(教师|博士后|博士生|硕士生|本科生) / grade(如 2025级)
 *           category(如 硕士、全日制专业学位硕士) / studentNo(学号) / research(研究方向)
 *           fieldSite(试验地) / seat(工位) / status(在校状态：在籍在校|不在籍在校|不在籍不在校)
 *           contact(邮箱) / phone(手机) / wechat(微信)
 * 隐私提醒：手机号、邮箱等会公开展示，请确认成员本人同意后再录入。
 */
window.DATA = window.DATA || {};

window.DATA.memberOverrides = [
  // 示例（正式使用时可删除注释）：
  // { id: "M046", name: "张三", role: "硕士生", grade: "2026级", category: "硕士",
  //   studentNo: "20260500123", research: "", fieldSite: "", seat: "",
  //   status: "在籍在校", contact: "", phone: "", wechat: "" }
];

window.DATA.memberDeletions = [
  // "M003",
];

// 合并到 window.DATA.members（本文件必须在 members.js 之后加载）
(function () {
  var list = window.DATA.members = window.DATA.members || [];
  (window.DATA.memberOverrides || []).forEach(function (p) {
    if (!p || !p.id) return;
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], p);
    else list.push(p);
  });
  var del = window.DATA.memberDeletions || [];
  if (del.length) {
    window.DATA.members = list.filter(function (m) { return del.indexOf(m.id) < 0; });
  }
})();
