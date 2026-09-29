/* project-overrides.js —— 管理员合并「网页弹窗添加的项目」
 * 说明：这个文件和 project-materials.js 类似，专门用来合并通过项目列表页
 * 「＋ 添加项目」弹窗临时保存、再导出 JSON 的项目。
 *
 * 使用方法：
 * 1. 组员/管理员在项目列表页点「＋ 添加项目」，填写后保存（仅本机可见）。
 * 2. 点「导出我添加的项目（JSON）」，复制弹窗里的 JSON 数组。
 * 3. 把数组内容贴到下面的 window.DATA.projectOverrides 中。
 * 4. 上传 GitHub 后全组即可看到。
 *
 * 注意：
 * - 如果 projectOverrides 里的项目 id 与 projects.js 中重复，会覆盖原有项目。
 * - 所有字段都可缺省，但建议至少填写 id、name、leader、status。
 */
window.DATA = window.DATA || {};
window.DATA.projectOverrides = [
  // 示例（正式使用前删除）：
  // {
  //   id: "P3",
  //   name: "示例新项目",
  //   shortName: "示例项目",
  //   leader: "张叶叶",
  //   members: ["张叶叶", "王静蕾"],
  //   source: "国家自然科学基金",
  //   code: "NSFC-2026-EXAMPLE",
  //   fiscalCode: "NSFC-2026-EXAMPLE-01",
  //   start: "2026-01",
  //   end: "2028-12",
  //   budget: "30 万元",
  //   status: "准备中",
  //   stage: "项目启动与方案设计",
  //   progress: 0,
  //   goal: "项目目标摘要",
  //   okr: ["O：目标 KR：关键结果"],
  //   monthlyProgress: "（待填写）",
  //   nextPlan: "（待填写）",
  //   risks: "（待填写）",
  //   setup: "（待补充）",
  //   design: "（待补充）",
  //   pinned: false,
  //   projectFolderUrl: "",
  //   materials: [],
  //   relatedMethods: [],
  //   relatedSamples: [],
  //   relatedDatasets: [],
  //   relatedExpenses: [],
  //   relatedAchievements: []
  // }
];

(function () {
  var overrides = window.DATA.projectOverrides || [];
  var projects = window.DATA.projects || [];
  overrides.forEach(function (p) {
    if (!p || !p.id) return;
    var idx = projects.findIndex(function (x) { return x.id === p.id; });
    if (idx >= 0) {
      // 覆盖：保留原项目已有字段，再用 overrides 里的字段覆盖
      projects[idx] = Object.assign({}, projects[idx], p);
    } else {
      projects.push(p);
    }
  });
})();
