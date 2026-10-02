/* achievement-overrides.js —— 成果的全组级增删改（管理员维护）
 *
 * 工作方式（与 project-overrides.js 相同）：
 * 1. 组员在「研究成果」页点「＋ 添加成果」新增，或对已有条目点「编辑 / 删除」，
 *    修改先保存在本人浏览器（仅本机可见）。
 * 2. 组员点「导出我添加的修改（JSON）」，把弹窗里的全部内容发给管理员。
 * 3. 管理员用弹窗内容【整体覆盖】本文件，上传 GitHub 后全组可见。
 *
 * 字段说明：
 * - achievementOverrides：新增或修改的成果（整条对象，按 id 覆盖合并）
 *   常用字段：id / type(期刊·会议论文|学位论文|获奖|专利|软著|基金) / title / authors(数组)
 *             journal(期刊/来源) / year / zone(分区/IF) / url(链接) / project(所属项目)
 *             relatedMember(关联成员id，如 M002，填了会显示在该成员卡片上)
 *             lang(可选，"SCI" 或 "中文"，手工指定语言，否则按期刊名自动判断)
 * - achievementDeletions：要隐藏的成果 id 数组（如 ["A003"]）
 */
window.DATA = window.DATA || {};

window.DATA.achievementOverrides = [
  // 示例（正式使用时可删除注释）：
  // { id: "A082", type: "期刊/会议论文", title: "韩娟_Field Crops Research_2026",
  //   authors: ["韩娟"], journal: "", year: "2026", zone: "", url: "",
  //   project: "P2", relatedMember: "M001", lang: "SCI", note: "" }
];

window.DATA.achievementDeletions = [
  // "A003",
];

// 合并到 window.DATA.achievements（本文件必须在 members.js 之后加载）
(function () {
  var list = window.DATA.achievements = window.DATA.achievements || [];
  (window.DATA.achievementOverrides || []).forEach(function (p) {
    if (!p || !p.id) return;
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], p);
    else list.push(p);
  });
  var del = window.DATA.achievementDeletions || [];
  if (del.length) {
    window.DATA.achievements = list.filter(function (a) { return del.indexOf(a.id) < 0; });
  }
})();
