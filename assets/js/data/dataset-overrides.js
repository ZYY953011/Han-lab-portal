/* ============================================================
 * 数据文件夹登记 —— 全站级覆盖文件（管理员 / 自动合并维护）
 * ------------------------------------------------------------
 * 一行 = 一个试验地的数据文件夹入口。
 *
 * 字段：
 *   id        唯一编号（D001、D002…）
 *   site      试验地名称
 *   uploader  上传人 / 登记人
 *   date      上传时间（YYYY-MM-DD）
 *   url       数据文件夹链接（飞书云盘文件夹）
 *   note      备注
 *
 * 合并规则：datasetOverrides 按 id 覆盖/追加；datasetDeletions 里的 id 被隐藏。
 * 生成方式：① 组员在数据管理页导出后由管理员合并；② GitHub Issue 模板自动合并。
 * ============================================================ */
window.DATA = window.DATA || {};
window.DATA.datasetFolders = window.DATA.datasetFolders || [];
window.DATA.datasetOverrides = [];
window.DATA.datasetDeletions = [];

(function () {
  var list = window.DATA.datasetFolders;
  (window.DATA.datasetOverrides || []).forEach(function (p) {
    if (!p || !p.id) return;
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = Object.assign({}, list[i], p);
    else list.push(p);
  });
  var del = window.DATA.datasetDeletions || [];
  if (del.length) {
    window.DATA.datasetFolders = list.filter(function (x) { return del.indexOf(x.id) < 0; });
  }
})();
