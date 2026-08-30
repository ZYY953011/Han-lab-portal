/* resources.js —— 学习资源库（示例）
 * 设计原则：需要时能快速找到，平时不被过量信息干扰。
 */
window.DATA = window.DATA || {};
window.DATA.resources = [
  { id: "R1",  title: "新生入组手册（必读）",        category: "新生入门", intro: "课题组规矩、安全、常用账号与日常流程。", forWho: "新入组研究生/本科生", when: "入组第一周", minutes: 20, url: "https://docs.example.com/res/freshman", recommend: "★★★★★" },
  { id: "R2",  title: "Web of Science 文献检索教程", category: "文献检索", intro: "主题词、被引追踪、引文报告用法。", forWho: "所有成员", when: "开题前", minutes: 25, url: "https://docs.example.com/res/wos", recommend: "★★★★★" },
  { id: "R3",  title: "Zotero 文献管理实战",         category: "文献管理", intro: "插件配置、分组、与 Word 联动。", forWho: "所有成员", when: "入组一月内", minutes: 18, url: "https://docs.example.com/res/zotero", recommend: "★★★★" },
  { id: "R4",  title: "田间试验设计基础",            category: "实验设计", intro: "随机区组、重复、处理设置。", forWho: "做田间试验者", when: "方案设计阶段", minutes: 30, url: "https://docs.example.com/res/expdesign", recommend: "★★★★" },
  { id: "R5",  title: "R 语言数据分析入门",          category: "R / Python", intro: "数据清洗、ggplot2 绘图。", forWho: "需做数据分析者", when: "数据回收后", minutes: 45, url: "https://docs.example.com/res/r_basic", recommend: "★★★★★" },
  { id: "R6",  title: "Python 数据处理（pandas）",     category: "R / Python", intro: "用 pandas 处理表格与批量统计。", forWho: "偏好 Python 者", when: "数据回收后", minutes: 40, url: "https://docs.example.com/res/py_pandas", recommend: "★★★★" },
  { id: "R7",  title: "科研图表配色与排版",          category: "图表制作", intro: "配色原则、字体、分辨率导出。", forWho: "制图阶段", when: "论文写作前", minutes: 15, url: "https://docs.example.com/res/figure", recommend: "★★★★★" },
  { id: "R8",  title: "中文科技论文写作结构",        category: "论文写作", intro: "IMRaD 结构、各部分写法。", forWho: "写论文者", when: "写作阶段", minutes: 35, url: "https://docs.example.com/res/writing", recommend: "★★★★" },
  { id: "R9",  title: "学术英语写作常用句式",        category: "英文写作", intro: "结果、讨论常用句型与衔接。", forWho: "投英文期刊者", when: "英文写作阶段", minutes: 30, url: "https://docs.example.com/res/academic_en", recommend: "★★★★" },
  { id: "R10", title: "SCI 期刊投稿流程与 Cover Letter", category: "投稿",   intro: "选刊、投稿系统、回复审稿意见。", forWho: "准备投稿者", when: "成稿后", minutes: 25, url: "https://docs.example.com/res/submission", recommend: "★★★★★" },
  { id: "R11", title: "国家自然科学基金申请书要点",   category: "基金申请", intro: "立项依据、研究内容撰写技巧。", forWho: "青年教师/博士生", when: "基金申报季", minutes: 40, url: "https://docs.example.com/res/nsfc", recommend: "★★★★" },
  { id: "R12", title: "开题报告撰写指南",            category: "开题",     intro: "研究背景、内容、创新点写法。", forWho: "硕士生/博士生", when: "开题前 1 月", minutes: 20, url: "https://docs.example.com/res/proposal", recommend: "★★★★★" },
  { id: "R13", title: "中期考核 PPT 模板与要点",      category: "中期",     intro: "进展汇报结构、常见问题。", forWho: "进入中期的同学", when: "中期前 2 周", minutes: 15, url: "https://docs.example.com/res/midterm", recommend: "★★★★" },
  { id: "R14", title: "毕业答辩 PPT 与问答准备",      category: "毕业答辩", intro: "答辩逻辑、可能的提问。", forWho: "毕业年级", when: "答辩前 1 月", minutes: 25, url: "https://docs.example.com/res/defense", recommend: "★★★★★" },
  { id: "R15", title: "报账材料清单与流程",          category: "报账指南", intro: "各类报销所需材料与模板。", forWho: "所有成员", when: "需要报账时", minutes: 15, url: "https://docs.example.com/res/expense", recommend: "★★★★★" },
  { id: "R16", title: "常用科研软件下载与安装",       category: "常用软件下载", intro: "Zotero、R、Origin、EndNote 等。", forWho: "所有成员", when: "入组时", minutes: 20, url: "https://docs.example.com/res/software", recommend: "★★★★" },
];
