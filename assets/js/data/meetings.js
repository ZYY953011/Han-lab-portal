/* meetings.js —— 组会安排与记录（示例）
 * 目标：让组会成为连续积累，而非汇报后消失。
 */
window.DATA = window.DATA || {};
window.DATA.meetings = [
  {
    id: "MT-2024-03-22",
    date: "2024-03-22",
    place: "农科楼 B308",
    host: "张明远",
    reporter: "陈思",
    topic: "小麦抗旱转录组进展与候选基因汇报",
    project: "P1",
    pptUrl: "https://docs.example.com/mt0322_ppt",
    docUrl: "https://docs.example.com/mt0322_note",
    progress: "完成转录组分析，筛选出 12 个候选抗旱基因。",
    problems: "转基因材料构建周期长，预计延误 1 个月。",
    discussion: "讨论优先验证 Top3 候选基因，分配任务。",
    advice: "老师建议先补 VIGS 验证，降低风险；注意表型与表达一致性。",
    actions: [
      { task: "完成 Top3 基因 VIGS 载体构建", owner: "赵磊", due: "2024-04-10", check: "2024-04-12" },
      { task: "补充干旱表型拍照存档", owner: "陈思", due: "2024-04-05", check: "2024-04-08" },
    ],
  },
  {
    id: "MT-2024-03-15",
    date: "2024-03-15",
    place: "农科楼 B308",
    host: "张明远",
    reporter: "刘洋",
    topic: "玉米密植示范方测产汇报",
    project: "P1",
    pptUrl: "https://docs.example.com/mt0315_ppt",
    docUrl: "",
    progress: "3 个示范基地完成测产，平均增产 9.6%。",
    problems: "个别县数据汇总延迟。",
    discussion: "确定结题材料分工。",
    advice: "老师要求突出增产机制分析。",
    actions: [
      { task: "提交结题报告初稿", owner: "王芳", due: "2024-03-30", check: "2024-04-01" },
      { task: "催齐示范县数据", owner: "刘洋", due: "2024-03-25", check: "2024-03-28" },
    ],
  },
  {
    id: "MT-2024-03-08",
    date: "2024-03-08",
    place: "农科楼 B308",
    host: "李文",
    reporter: "周婷",
    topic: "水稻高温胁迫荧光数据汇报",
    project: "P1",
    pptUrl: "",
    docUrl: "https://docs.example.com/mt0308_note",
    progress: "完成高温处理取样与荧光测定。",
    problems: "气候室档期紧张。",
    discussion: "优化取样时间点。",
    advice: "李老师建议增加恢复期取样。",
    actions: [
      { task: "补恢复期 24h 样品", owner: "周婷", due: "2024-03-20", check: "2024-03-22" },
    ],
  },
];
