/* students.js —— 学生培养（从 members.js 自动生成）
 * 覆盖入组 → 毕业全过程，每个节点含计划/实际日期与状态。
 * 培养阶段固定顺序见 window.DATA.studentStages。
 *
 * 计划时间依据西北农林科技大学农学院实际培养节奏：
 *   - 硕士（3年制，含学术型与专业学位）：入学后第二年（第三学期）开题，
 *     第 3 年 4 月预答辩、6 月毕业答辩；中期考核学术型第 4 学期末、专业学位第 5 学期末。
 *   - 博士（4年制）：第 2 学期结束前（5 月）开题，
 *     第 4 学期末（5 月）中期考核，第 8 学期 4 月预答辩、6 月答辩。
 *
 * 管理员如需覆盖某位同学的阶段状态，请在 student-materials.js 中
 * 对应成员的 stages 下写入 { plan, actual, status, done, note }。
 */
window.DATA = window.DATA || {};
window.DATA.studentStages = ["入组", "培养计划", "开题", "中期考核", "预答辩", "毕业答辩", "学位材料", "毕业"];

(function () {
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  // 从 studentNo 或 grade 解析入学年份
  function enrollYear(m) {
    if (m.studentNo && /^\d{4}/.test(m.studentNo)) {
      return parseInt(m.studentNo.slice(0, 4), 10);
    }
    if (m.grade && /(\d{4})级/.test(m.grade)) {
      return parseInt(m.grade.match(/(\d{4})级/)[1], 10);
    }
    return new Date().getFullYear();
  }

  // 判断学位类型与学制
  function degreeInfo(m) {
    var cat = (m.category || "") + " " + (m.role || "");
    if (cat.indexOf("博士后") !== -1) return { type: "博士后", degree: "postdoc", years: 2, label: "博士后" };
    if (cat.indexOf("博士") !== -1) return { type: "博士生", degree: "phd", years: 4, label: "博士" };
    if (cat.indexOf("硕士") !== -1) return { type: "硕士生", degree: "master", years: 3, label: "硕士", isPro: cat.indexOf("专业学位") !== -1 };
    return { type: "硕士生", degree: "master", years: 3, label: "硕士", isPro: false };
  }

  // 比较年月字符串 "YYYY-MM" 与当前日期
  function isPast(plan) {
    if (!plan) return false;
    var today = new Date();
    var p = new Date(plan + "-01");
    return today >= p;
  }

  // 计划月份已完整度过（下个月 1 号及以后）视为已完成
  function isFarPast(plan) {
    if (!plan) return false;
    var today = new Date();
    var p = new Date(plan + "-01");
    p.setMonth(p.getMonth() + 1);
    return today >= p;
  }

  // 生成某个学生的培养阶段
  function estimateStages(m) {
    var info = degreeInfo(m);
    var Y = enrollYear(m);
    var years = info.years;
    var expectGrad = (Y + years) + "-06";
    var today = new Date();
    var gradDate = new Date(expectGrad + "-01");
    gradDate.setMonth(gradDate.getMonth() + 1); // 毕业月过完视为已毕业

    // 已不在籍或已过预计毕业时间，整段培养视为已完成
    var allDone = (m.status === "不在籍不在校") || (today >= gradDate);

    var stages = [];

    if (info.degree === "postdoc") {
      stages = [
        { name: "入组", plan: Y + "-10", actual: Y + "-10", status: "已完成", materials: [], feishu: "", advice: "", done: true, note: "" },
        { name: "出站", plan: (Y + 2) + "-06", actual: "", status: allDone ? "已完成" : (isPast((Y + 2) + "-06") ? "准备中" : "未开始"), materials: [], feishu: "", advice: "", done: allDone, note: "" }
      ];
      return stages;
    }

    var proposalPlan, midPlan, preDefPlan, defensePlan;
    if (info.degree === "phd") {
      proposalPlan = (Y + 1) + "-05";
      midPlan = (Y + 2) + "-05";
      preDefPlan = (Y + 4) + "-04";
      defensePlan = (Y + 4) + "-06";
    } else {
      // 硕士：入学后第二年（第三学期）开题，第三年答辩；
      // 中期考核统一在第 5 学期末（入学后第 2 年 12 月）
      proposalPlan = (Y + 1) + "-09";
      midPlan = (Y + 2) + "-12";
      preDefPlan = (Y + 3) + "-04";
      defensePlan = (Y + 3) + "-06";
    }

    var base = [
      { name: "入组", plan: Y + "-10" },
      { name: "培养计划", plan: Y + "-12" },
      { name: "开题", plan: proposalPlan },
      { name: "中期考核", plan: midPlan },
      { name: "预答辩", plan: preDefPlan },
      { name: "毕业答辩", plan: defensePlan },
      { name: "学位材料", plan: defensePlan },
      { name: "毕业", plan: defensePlan }
    ];

    base.forEach(function (st, idx) {
      // 入组、培养计划默认已完成；计划月份已完整度过的节点也视为已完成
      var done = allDone || (idx <= 1) || isFarPast(st.plan);
      var status = done ? "已完成" : (isPast(st.plan) ? "准备中" : "未开始");
      stages.push({
        name: st.name,
        plan: st.plan,
        actual: done ? st.plan : "",
        status: status,
        materials: [],
        feishu: "",
        advice: "",
        done: done,
        note: ""
      });
    });

    return stages;
  }

  // 从 members 生成学生培养记录
  function buildStudents() {
    var members = window.DATA.members || [];
    return members.map(function (m) {
      var info = degreeInfo(m);
      var Y = enrollYear(m);
      var expectGrad = info.degree === "postdoc" ? (Y + 2) + "-06" : (Y + info.years) + "-06";
      return {
        id: m.id,
        name: m.name,
        studentId: m.studentNo || "",
        type: info.type,
        degree: info.degree,
        enroll: Y + "-09",
        join: Y + "-10",
        tutor: "", // members.js 暂无导师字段，后续可通过 student-materials.js 补充
        research: m.research || "",
        project: m.project || "P1",
        expectGrad: expectGrad,
        status: m.status || "",
        stages: estimateStages(m)
      };
    });
  }

  window.DATA.students = buildStudents();
})();
