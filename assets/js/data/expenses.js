/* expenses.js —— 报账与采购（示例）
 * 含两部分：流程说明（flows）+ 报账记录（records）
 *
 * 【费用大类】与【飞书表格】的费用大类是同一套：
 *   1) 差旅报销
 *   2) 三助报销（学生实际垫付、无发票）
 *   3) 自购实验材料费（需学院备案）
 *   4) 工人报销（对公转账，校外劳务）
 *   5) 校内转账（纯水、检索费等，学校发票）
 *   6) 校外教师劳务费（答辩评审费）
 *
 * 想加新类别：①在这里加一项  ②在飞书表格里加单选项即可。
 */
window.DATA = window.DATA || {};
window.DATA.expenses = [
  {
    id: "E1",
    date: "2024-03-02",
    reporter: "赵磊",
    project: "P1",
    category: "自购实验材料费",
    amount: 8600,
    purpose: "Trizol、引物、试剂盒等耗材（已获学院备案）",
    invoiceStatus: "已开票",
    complete: "齐全",
    status: "已报销",
    submitDate: "2024-03-05",
    doneDate: "2024-03-20",
    remark: "学院备案编号 X-2024-007。",
  },
  {
    id: "E2",
    date: "2024-03-10",
    reporter: "陈思",
    project: "P1",
    category: "差旅报销",
    amount: 3200,
    purpose: "赴杨凌参加学术会议（含高铁与住宿）",
    invoiceStatus: "已开票",
    complete: "齐全",
    status: "审核中",
    submitDate: "2024-03-12",
    doneDate: "",
    remark: "—",
  },
  {
    id: "E3",
    date: "2024-02-20",
    reporter: "刘洋",
    project: "P2",
    category: "工人报销",
    amount: 1500,
    purpose: "示范方测产临时用工（校外工人）对公转账",
    invoiceStatus: "不需发票",
    complete: "齐全",
    status: "已报销",
    submitDate: "2024-02-25",
    doneDate: "2024-03-08",
    remark: "工人签字确认。",
  },
  {
    id: "E4",
    date: "2024-03-15",
    reporter: "王芳",
    project: "P4",
    category: "三助报销",
    amount: 280,
    purpose: "买药（无发票，编号 11）",
    invoiceStatus: "无发票",
    complete: "齐全",
    status: "待提交",
    submitDate: "",
    doneDate: "",
    remark: "—",
  },
  {
    id: "E5",
    date: "2024-03-18",
    reporter: "周婷",
    project: "P3",
    category: "校内转账",
    amount: 86,
    purpose: "图书馆检索费",
    invoiceStatus: "已开票",
    complete: "齐全",
    status: "待提交",
    submitDate: "",
    doneDate: "",
    remark: "—",
  },
];

/* 报账流程说明：每类需要的材料、常见问题、注意事项、流程路径
 * 飞书表格里"费用大类"字段的选项就是这里的 type
 */
window.DATA.expenseFlows = [
  {
    type: "差旅报销",
    materials: ["车票/机票", "住宿发票", "出差审批单", "行程单"],
    faq: ["同城一般不报；打车需附行程单；优先公交地铁。"],
    note: "出差前需线上审批；票据 30 天内提交审核；个人垫付。",
    template: "#",
  },
  {
    type: "三助报销",
    materials: ["花费明细（注明用途）", "无发票说明", "学生签字"],
    faq: ["学生实际垫付、无发票的实验材料/工具/小额支出；通过三助岗位报销。"],
    note: "审核通过后由下单人走三助发放流程；需学生签字确认。",
    template: "#",
  },
  {
    type: "自购实验材料费",
    materials: ["发票（学校抬头）", "自购明细", "学院自购备案证明", "收货验货证明"],
    faq: ["必须先经学院自购备案审批，否则不能下单报账。"],
    note: "流程最长：审核通过 → 下单人向学院申请自购备案 → 拿到备案与验货证明 → 下报销单 → 财务室报账 → 导师审核。",
    template: "#",
  },
  {
    type: "工人报销",
    materials: ["劳务发放表（工人签字）", "身份证号", "工作量与工时记录", "银行账号"],
    faq: ["校外工人劳务必须对公转账；按工时/工作量计算。"],
    note: "需工人本人签字确认；提前核对银行账户信息。",
    template: "#",
  },
  {
    type: "校内转账",
    materials: ["校内发票/单据", "校内转账说明"],
    faq: ["图书馆检索费、纯水购买等学校有正式发票的项目，可直接走校内转账。"],
    note: "提交后由下单人直接对公转账，无需额外备案。",
    template: "#",
  },
  {
    type: "校外教师劳务费",
    materials: ["劳务发放表（教师签字）", "身份证号", "银行卡号", "答辩/评审通知"],
    faq: ["校外教师（答辩评审专家等）按次计酬。"],
    note: "需提前报批；个人所得税由学校代扣。",
    template: "#",
  },
];