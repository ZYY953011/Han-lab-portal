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

// 将配置合并到 window.DATA.students
(function () {
  var students = window.DATA.students || [];
  var materials = window.DATA.studentMaterials || {};

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
})();
