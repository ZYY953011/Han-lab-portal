/* project-materials.js —— 项目资料链接集中维护
 *
 * 说明：
 * 1. 本文件在 projects.js 之后加载，会把 projectMaterialOverrides 中的资料
 *    合并到对应项目的 materials 数组里。
 * 2. 每个项目 ID（如 P1）对应 projects.js 中的 id。
 * 3. 每项资料结构：{ name, url, uploader, note, date }。
 *    category / type / pinned 字段为旧版保留，新版详情页已统一为单列表，
 *    不再按分类展示，也不再渲染「必读」区，因此这些字段可留空或删除。
 * 4. 建议把真实飞书链接维护在这里，而不是直接改 projects.js；
 *    这样以后更新资料时，只需修改本文件，降低出错概率。
 * 5. 页面上的添加资料表单会把临时资料存入浏览器 localStorage，
 *    组员可导出 JSON，管理员把 JSON 贴到下面的 projectMaterialOverrides 对应项目下即可全组可见。
 */
window.DATA = window.DATA || {};

// 管理员手动维护的项目正式资料（推荐把飞书链接写到这里）
window.DATA.projectMaterialOverrides = {
  // "P1": [
  //   { name: "项目申请书", category: "proposal", type: "PDF", date: "2026-12", uploader: "张叶叶", url: "https://my.feishu.cn/file/xxx", note: "" },
  //   { name: "2027 年度进展报告", category: "annual", type: "DOCX", date: "2027-12", uploader: "张叶叶", url: "https://my.feishu.cn/file/yyy", note: "" },
  // ],
};

// 将配置合并到 window.DATA.projects
(function () {
  var projects = window.DATA.projects || [];
  var overrides = window.DATA.projectMaterialOverrides || {};

  Object.keys(overrides).forEach(function (id) {
    var p = projects.find(function (x) { return x.id === id; });
    if (!p) return;
    if (!p.materials) p.materials = [];
    var items = overrides[id] || [];
    items.forEach(function (item) {
      // 避免重复合并（按 name+category+date 去重）
      var exists = p.materials.some(function (m) {
        return m.name === item.name && m.category === item.category && m.date === item.date;
      });
      if (!exists) p.materials.push(item);
    });
  });
})();
