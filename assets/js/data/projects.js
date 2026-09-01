/* projects.js —— 项目数据
 * 字段说明见“数据模型设计”，所有 id 必须唯一。
 * 关联字段（relatedMethods / relatedSamples 等）填的是对应数据的 id。
 * 目前仅 1 个真实项目；其他模块的示例数据（样品/数据/报账/成果等）后续替换为真实内容即可。
 */
window.DATA = window.DATA || {};
window.DATA.projects = [
  {
    id: "P1",
    name: "生物炭老化过程中炭际微域环境调控麦田N2O减排效应的微生物机制",
    leader: "张叶叶",
    members: ["张叶叶", "王静蕾", "师雅琪"],
    source: "国家自然科学基金",
    code: "NSFC-2026-32603147",
    start: "2027-01",
    end: "2029-12",
    budget: "30 万元",
    status: "进行中",
    stage: "项目启动与方案设计",
    progress: 5,
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
    materials: [
      { name: "项目申请书 / 立项汇报", type: "PPT", date: "2026-12", uploader: "张叶叶", url: "" },
    ],
    relatedMethods: [],
    relatedSamples: [],
    relatedDatasets: [],
    relatedExpenses: [],
    relatedAchievements: [],
  },
];
