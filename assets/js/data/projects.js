/* projects.js —— 项目数据
 * 字段说明见 README「数据模型设计」，所有 id 必须唯一。
 * 关联字段（relatedMethods / relatedSamples 等）填的是对应数据的 id。
 * 现已支持多项目；新增项目请按 P1/P2 格式在数组中追加对象。
 *
 * 项目资料（materials）说明：
 * - 新版详情页使用单一资料表，字段为：{ name, url, uploader, note, date }。
 * - category / type / pinned 为旧版保留字段，现可省略。
 * - 真实项目资料链接建议维护在 project-materials.js 的 projectMaterialOverrides 中，
 *   方便管理员统一更新，而不用每次重写 projects.js。
 */
window.DATA = window.DATA || {};
window.DATA.projects = [
  {
    id: "P1",
    name: "生物炭老化过程中炭际微域环境调控麦田N2O减排效应的微生物机制",
    shortName: "生物炭老化调控麦田N2O减排",
    leader: "张叶叶",
    members: ["张叶叶", "王静蕾", "师雅琪"],
    source: "国家自然科学基金",
    code: "NSFC-2026-32603147",
    fiscalCode: "NSFC-2026-32603147-01",
    start: "2027-01",
    end: "2029-12",
    budget: "30 万元",
    status: "进行中",
    stage: "项目启动与方案设计",
    progress: 5,
    pinned: true,
    goal: "揭示生物炭老化导致麦田N2O减排效应变化的微生物驱动机制，识别炭际微域环境随老化年限的演变规律与关键非生物因子。",
    okr: [
      "O：明确老化时序特征  KR：识别相比新鲜生物炭减排保氮效应显著衰退的老化年限，阐明炭物理结构与表面化学性质变化规律",
      "O：揭示关键非生物因子  KR：明确驱动老化生物炭N2O减排效应变化的关键炭际土壤性质（氮浓度、酸碱性）演变特征",
      "O：阐明微生物机制  KR：明晰炭际与非炭际土壤N2O排放强度差异，揭示关键氮转化微生物定殖与表达活性变化",
    ],
    monthlyProgress: "（待填写：每月进展）",
    nextPlan: "（待填写：下一步计划）",
    risks: "（待填写：主要风险与应对）",
    setup: "（待补充：实验初始设置——实验室设备、田间/温室场地、关键材料等）",
    design: "（待补充：实验布置细节——小区设计、处理梯度、重复数、测定指标等）",
    projectFolderUrl: "",
    materials: [],
    relatedMethods: [],
    relatedSamples: [],
    relatedDatasets: [],
    relatedExpenses: [],
    relatedAchievements: [],
  },

  /* P2 为示例项目，用于验证多项目列表与详情页效果。
   * 后续添加真实项目时，可复制 P1 或 P2 的结构，修改 id 与字段即可。 */
  {
    id: "P2",
    name: "秸秆还田对麦田温室气体排放的影响及微生物调控机制",
    shortName: "秸秆还田与温室气体",
    leader: "张叶叶",
    members: ["张叶叶", "刘世举", "王静蕾"],
    source: "陕西省自然科学基金",
    code: "SNSF-2025-JM-5678",
    fiscalCode: "SNSF-2025-XM-002",
    start: "2025-01",
    end: "2027-12",
    budget: "10 万元",
    status: "进行中",
    stage: "年度进展总结",
    progress: 45,
    pinned: false,
    goal: "明确秸秆还田模式下麦田温室气体排放的微生物调控机制，评估不同还田量与还田年限对土壤碳氮周转的影响。",
    okr: [
      "O：厘清排放规律  KR：测定不同秸秆还田量下 N2O、CH4、CO2 排放通量，建立排放动态模型",
      "O：识别功能微生物  KR：解析关键产甲烷菌、反硝化菌群落结构及其对还田量的响应",
      "O：提出调控建议  KR：结合田间数据给出减碳增汇的秸秆还田管理建议",
    ],
    monthlyProgress: "（待填写：每月进展）",
    nextPlan: "（待填写：下一步计划）",
    risks: "（待填写：主要风险与应对）",
    setup: "（待补充：实验初始设置）",
    design: "（待补充：实验布置细节）",
    projectFolderUrl: "",
    materials: [
      { name: "项目申报书", category: "proposal", type: "PDF", date: "2024-10", uploader: "张叶叶", url: "", note: "申请书终稿" },
      { name: "2025 年度进展报告", category: "annual", type: "DOCX", date: "2025-12", uploader: "刘世举", url: "", note: "年度汇报材料" },
      { name: "田间气体采样 SOP", category: "experiment", type: "DOCX", date: "2025-03", uploader: "王静蕾", url: "", note: "静态箱法操作细则" },
    ],
    relatedMethods: [],
    relatedSamples: [],
    relatedDatasets: [],
    relatedExpenses: [],
    relatedAchievements: [],
  },
];
