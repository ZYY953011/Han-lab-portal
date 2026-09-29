/* student-materials.js —— 学生培养资料（飞书云盘链接 + 多版本材料）
 *
 * 说明：
 * 1. 本文件在 students.js 之后加载，会把这里配置的链接/材料合并到对应成员的培养时间轴中。
 * 2. 每个成员ID（如 M001）对应 members.js 中的 id。
 * 3. 每个阶段可配置：
 *    - feishu：飞书云盘文件/文件夹分享链接（点击「去飞书查看/上传」按钮跳转）。
 *    - materials：该阶段的多版本材料数组，每项 { version, title, url, date, note }。
 *    - plan / actual / status / done / note / advice：阶段时间状态（可选，会覆盖自动生成值）。
 * 4. 如果某个成员在自动生成阶段中没有某个节点（如博士后没有「开题」），
 *    这里配置该阶段后会自动追加到时间轴。
 * 5. 请把下面的占位链接 PASTE_FEISHU_LINK_xxx 替换为真实飞书分享链接。
 */
window.DATA = window.DATA || {};
window.DATA.studentMaterials = {
  // 张叶叶（M001）：博士后，此处展示其博士阶段资料作为参考模板
  "M001": {
    type: "博士后（博士阶段资料）",
    tutor: "",
    stages: {
      "开题": {
        plan: "",
        actual: "",
        status: "已完成",
        done: true,
        feishu: "PASTE_FEISHU_LINK_张叶叶_开题",
        note: "博士阶段开题资料，供参考",
        materials: [
          // 示例：若该阶段有多个版本材料，可继续添加
          // { version: "v1", title: "开题报告", url: "https://my.feishu.cn/file/xxx", date: "", note: "" }
        ]
      },
      "中期考核": {
        plan: "",
        actual: "",
        status: "已完成",
        done: true,
        feishu: "PASTE_FEISHU_LINK_张叶叶_中期考核",
        note: "博士阶段中期考核资料，供参考",
        materials: []
      },
      "预答辩": {
        plan: "",
        actual: "",
        status: "已完成",
        done: true,
        feishu: "PASTE_FEISHU_LINK_张叶叶_预答辩",
        note: "博士阶段预答辩资料，供参考",
        materials: []
      },
      "毕业答辩": {
        plan: "",
        actual: "",
        status: "已完成",
        done: true,
        feishu: "PASTE_FEISHU_LINK_张叶叶_毕业答辩",
        note: "博士阶段毕业答辩资料，供参考",
        materials: []
      }
    }
  },

  // 刘世举（M017）：2021级博士，已毕业
  "M017": {
    tutor: "",
    stages: {
      "开题": {
        feishu: "PASTE_FEISHU_LINK_刘世举_开题",
        note: "",
        materials: []
      },
      "中期考核": {
        feishu: "PASTE_FEISHU_LINK_刘世举_中期考核",
        note: "",
        materials: []
      },
      "预答辩": {
        feishu: "PASTE_FEISHU_LINK_刘世举_预答辩",
        note: "",
        materials: []
      },
      "毕业答辩": {
        feishu: "PASTE_FEISHU_LINK_刘世举_毕业答辩",
        note: "",
        materials: []
      }
    }
  }
};

// 管理员手动覆盖某位同学的阶段状态（可选）
// 用法：在对应成员 ID 下写入 stages，字段会覆盖自动生成的值。
// 常用字段：plan（计划年月）、actual（实际完成年月）、status（已完成/准备中/未开始）、
//          done（true/false）、note（备注）。
// 页面上也支持管理员/组员实时手动设置（保存到本机浏览器，可导出合并到此文件）。
window.DATA.studentStageOverrides = {
  // 刘钺（M018）：2022 级博士，延迟毕业。自动推算的 2026-06 答辩已过期会被误判为已毕业，
  // 这里按"开题、中期已完成，目前准备预答辩"重置，管理员可在页面上再微调。
  "M018": {
    stages: {
      "开题": { status: "已完成", actual: "2023-05", done: true },
      "中期考核": { status: "已完成", actual: "2024-05", done: true },
      "预答辩": { status: "准备中", plan: "2026-10", done: false, note: "延迟毕业，进度由管理员维护" },
      "毕业答辩": { status: "未开始", plan: "2027-06", done: false },
      "学位材料": { status: "未开始", plan: "2027-06", done: false },
      "毕业": { status: "未开始", plan: "2027-06", done: false }
    }
  }
  // 王煜（M035）为 2026 级专项计划，可手动置为"未开始"并加备注：
  // "M035": { stages: { "开题": { status: "未开始", plan: "2026-12", note: "2026 级专项计划" } } }
};

// 将配置合并到 window.DATA.students
(function () {
  var students = window.DATA.students || [];
  var materials = window.DATA.studentMaterials || {};
  var overrides = window.DATA.studentStageOverrides || {};

  // 先合并材料与导师信息
  Object.keys(materials).forEach(function (id) {
    var s = students.find(function (x) { return x.id === id; });
    if (!s) return;
    var ov = materials[id];

    if (ov.degree) s.degree = ov.degree;
    if (ov.type) s.type = ov.type;
    if (ov.expectGrad) s.expectGrad = ov.expectGrad;
    if (ov.tutor !== undefined) s.tutor = ov.tutor;

    if (ov.stages) {
      Object.keys(ov.stages).forEach(function (stageName) {
        var stage = s.stages.find(function (st) { return st.name === stageName; });
        if (!stage) {
          stage = { name: stageName, plan: "", actual: "", status: "未开始", materials: [], feishu: "", advice: "", done: false, note: "" };
          s.stages.push(stage);
        }
        var sov = ov.stages[stageName];
        Object.keys(sov).forEach(function (k) {
          stage[k] = sov[k];
        });
      });
    }
  });

  // 再应用阶段状态覆盖
  Object.keys(overrides).forEach(function (id) {
    var s = students.find(function (x) { return x.id === id; });
    if (!s) return;
    var ov = overrides[id];

    if (ov.tutor !== undefined) s.tutor = ov.tutor;
    if (ov.note !== undefined) s.note = ov.note;

    if (ov.stages) {
      Object.keys(ov.stages).forEach(function (stageName) {
        var stage = s.stages.find(function (st) { return st.name === stageName; });
        if (!stage) {
          stage = { name: stageName, plan: "", actual: "", status: "未开始", materials: [], feishu: "", advice: "", done: false, note: "" };
          s.stages.push(stage);
        }
        var sov = ov.stages[stageName];
        Object.keys(sov).forEach(function (k) {
          stage[k] = sov[k];
        });
      });
    }
  });
})();
