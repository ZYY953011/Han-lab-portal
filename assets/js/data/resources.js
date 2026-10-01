/* resources.js —— 学习资源库
 * 设计原则：需要的时候能快速找到，平时不被过量信息干扰。
 * 组员可在「学习资源」页直接添加新的资源或分类，点「导出」后交给管理员合并即可。
 */
window.DATA = window.DATA || {};
window.DATA.resources = [
  /* —— 入组必读 —— */
  {
    id: "R1",
    title: "新成员入组必读",
    category: "入组必读",
    intro: "以终为始；多思考，杜绝“表面努力”；先自己尝试解决再求助；不提倡熬夜，重视效率与结果。",
    forWho: "新入组研究生/本科生",
    when: "入组第一周",
    minutes: 10,
    url: "",
    recommend: "★★★★★"
  },

  /* —— 文献检索与管理 —— */
  {
    id: "R2",
    title: "Google 学术",
    category: "文献检索与管理",
    intro: "（自行解决镜像问题）",
    forWho: "所有成员",
    when: "随时",
    minutes: 5,
    url: "https://scholar.google.com/",
    recommend: "★★★★★"
  },
  {
    id: "R3",
    title: "Web of Science",
    category: "文献检索与管理",
    intro: "主题词、被引追踪、引文报告。",
    forWho: "所有成员",
    when: "开题前",
    minutes: 25,
    url: "https://www.webofscience.com/wos/alldb/basic-search",
    recommend: "★★★★★"
  },
  {
    id: "R4",
    title: "百度学术",
    category: "文献检索与管理",
    intro: "中文文献与部分英文文献检索。",
    forWho: "所有成员",
    when: "随时",
    minutes: 5,
    url: "https://xueshu.baidu.com/",
    recommend: "★★★★"
  },
  {
    id: "R5",
    title: "中国知网 CNKI",
    category: "文献检索与管理",
    intro: "中文期刊、博硕士论文检索。",
    forWho: "所有成员",
    when: "随时",
    minutes: 5,
    url: "https://www.cnki.net/",
    recommend: "★★★★"
  },
  {
    id: "R6",
    title: "科研通 ableSci",
    category: "文献检索与管理",
    intro: "学校未购买电子资源时的其他渠道。",
    forWho: "所有成员",
    when: "找不到全文时",
    minutes: 5,
    url: "https://www.ablesci.com/",
    recommend: "★★★★"
  },
  {
    id: "R7",
    title: "EndNote",
    category: "文献检索与管理",
    intro: "文献管理软件下载与说明。",
    forWho: "需要文献管理者",
    when: "入组时",
    minutes: 20,
    url: "https://support.clarivate.com/Endnote/s/article/Download-EndNote?language=zh_CN",
    recommend: "★★★★"
  },
  {
    id: "R8",
    title: "Zotero",
    category: "文献检索与管理",
    intro: "免费开源文献管理，插件配置、分组、与 Word 联动。",
    forWho: "所有成员",
    when: "入组一月内",
    minutes: 18,
    url: "https://www.zotero.org/",
    recommend: "★★★★★"
  },
  {
    id: "R9",
    title: "AMiner 文献追踪",
    category: "文献检索与管理",
    intro: "文献追踪与学术画像。",
    forWho: "所有成员",
    when: "开题后",
    minutes: 10,
    url: "https://www.aminer.org/login?callback=/user/center",
    recommend: "★★★★"
  },

  /* —— 翻译与润色 —— */
  {
    id: "R10",
    title: "DeepL 翻译",
    category: "翻译与润色",
    intro: "中英文翻译。",
    forWho: "所有成员",
    when: "写作时",
    minutes: 5,
    url: "https://www.deepl.com/zh/translator",
    recommend: "★★★★★"
  },
  {
    id: "R11",
    title: "Grammarly",
    category: "翻译与润色",
    intro: "英文语法检查与论文润色。",
    forWho: "写英文论文者",
    when: "英文写作阶段",
    minutes: 10,
    url: "https://app.grammarly.com/",
    recommend: "★★★★★"
  },
  {
    id: "R12",
    title: "Ginger",
    category: "翻译与润色",
    intro: "英文写作润色工具。",
    forWho: "写英文论文者",
    when: "英文写作阶段",
    minutes: 10,
    url: "https://www.gingersoftware.com/",
    recommend: "★★★"
  },
  {
    id: "R13",
    title: "Wordtune",
    category: "翻译与润色",
    intro: "英文句子改写与润色。",
    forWho: "写英文论文者",
    when: "英文写作阶段",
    minutes: 10,
    url: "https://www.wordtune.com/",
    recommend: "★★★"
  },
  {
    id: "R14",
    title: "QuillBot",
    category: "翻译与润色",
    intro: "英文改写与润色。",
    forWho: "写英文论文者",
    when: "英文写作阶段",
    minutes: 10,
    url: "https://quillbot.com/",
    recommend: "★★★"
  },

  /* —— 科研绘图 —— */
  {
    id: "R15",
    title: "Google 图片",
    category: "科研绘图",
    intro: "学术图片搜索。",
    forWho: "所有成员",
    when: "找图时",
    minutes: 5,
    url: "https://images.google.com/",
    recommend: "★★★★"
  },
  {
    id: "R16",
    title: "中国知网图片",
    category: "科研绘图",
    intro: "中文文献配图检索。",
    forWho: "所有成员",
    when: "找图时",
    minutes: 5,
    url: "https://image.cnki.net/",
    recommend: "★★★"
  },
  {
    id: "R17",
    title: "Openi",
    category: "科研绘图",
    intro: "医学/生命科学学术图片搜索。",
    forWho: "所有成员",
    when: "找图时",
    minutes: 5,
    url: "https://openi.nlm.nih.gov/",
    recommend: "★★★"
  },
  {
    id: "R18",
    title: "BioRender",
    category: "科研绘图",
    intro: "学术概念图绘制。",
    forWho: "需要画图者",
    when: "写作前",
    minutes: 15,
    url: "https://app.biorender.com/user/signin",
    recommend: "★★★★"
  },

  /* —— 数据分析 —— */
  {
    id: "R19",
    title: "R 语言",
    category: "数据分析",
    intro: "强烈建议用 R 做数据分析和绘图；后期试验数据按 R 格式记录，图表指导也用 R。请自行学习。",
    forWho: "需做数据分析者",
    when: "数据回收后",
    minutes: 60,
    url: "https://www.r-project.org/",
    recommend: "★★★★★"
  },

  /* —— 写作与投稿 —— */
  {
    id: "R20",
    title: "LetPub 期刊分区查询",
    category: "写作与投稿",
    intro: "期刊分区查询。",
    forWho: "准备投稿者",
    when: "选刊时",
    minutes: 10,
    url: "https://www.letpub.com.cn/",
    recommend: "★★★★★"
  },
  {
    id: "R21",
    title: "文献规范写作自查清单",
    category: "写作与投稿",
    intro: "提交科研写作类材料前自查这些问题。",
    forWho: "写论文者",
    when: "提交前",
    minutes: 10,
    url: "https://j0d6rlk0b6j.feishu.cn/wiki/QSWdwfjwSiZEF0kyMxocVw8Enjf",
    recommend: "★★★★★"
  },

  /* —— 学术报告 —— */
  {
    id: "R22",
    title: "蔻享学术",
    category: "学术报告",
    intro: "本领域学术报告回放。",
    forWho: "所有成员",
    when: "空闲时",
    minutes: 30,
    url: "https://www.koushare.com/lives/room/",
    recommend: "★★★★"
  },

  /* —— 报账指南（保留） —— */
  {
    id: "R23",
    title: "报账材料清单与流程",
    category: "报账指南",
    intro: "各类报销所需材料与模板。",
    forWho: "所有成员",
    when: "需要报账时",
    minutes: 15,
    url: "https://docs.example.com/res/expense",
    recommend: "★★★★★"
  },
];
