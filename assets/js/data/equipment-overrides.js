/* equipment-overrides.js —— 仪器耗材台账的全组级增删改（管理员维护）
 *
 * 工作方式（与 achievement-overrides.js / member-overrides.js 相同）：
 * 1. 组员在「仪器耗材」页点「＋ 添加条目」新增，或对条目点「编辑 / 删除」，
 *    修改先保存在本人浏览器（仅本机可见）。
 * 2. 组员点「导出我添加的修改（JSON）」，把弹窗里的全部内容发给管理员。
 * 3. 管理员用弹窗内容【整体覆盖】本文件，上传 GitHub 后全组可见。
 *
 * 字段说明见 ../assets/js/data/equipment.js 顶部注释。
 */
window.DATA = window.DATA || {};

window.DATA.equipmentOverrides = [
  // 示例（正式使用时可删除注释）：
  // { id:"E010", category:"耗材", name:"滤膜", model:"0.45 μm / 47 mm", brand:"Whatman",
  //   qty:"200", unit:"片", location:"农科楼 311 室 2 号柜", keeper:"张三",
  //   purchaseDate:"2025-10", price:"", status:"充足", url:"", note:"" },
];

window.DATA.equipmentDeletions = [
  // "E003",
];

// 合并到 window.DATA.equipment（本文件必须在 equipment.js 之后加载）
(function () {
  var list = window.DATA.equipment = window.DATA.equipment || [];
  (window.DATA.equipmentOverrides || []).forEach(function (p) {
    if (!p || !p.id) return;
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], p);
    else list.push(p);
  });
  var del = window.DATA.equipmentDeletions || [];
  if (del.length) {
    window.DATA.equipment = list.filter(function (e) { return del.indexOf(e.id) < 0; });
  }
})();
