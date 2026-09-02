/* members.js —— 成员与研究成果（示例）
 * 含两部分：members（成员）+ achievements（成果）
 */
window.DATA = window.DATA || {};
window.DATA.members = [
  {
    id: "MB1", name: "韩娟", role: "教师", join: "2008-03", grad: "",
    research: "旱区水肥高效利用", project: "P1", skills: ["课题设计", "栽培生理", "论文指导"],
    help: "可指导试验设计、论文框架与投稿", contact: "hjepost@nwsuaf.edu.cn", seat: "南校区农科楼831；南校区研究生院226",
    status: "在职", after: "",
    employeeNo: "2008114835", studentNo: "", phone: "15029021911", Office phone: "029-87080157",
  },
  {
    id: "MB2", name: "张叶叶", role: "博士后", join: "2018-09", grad: "",
    research: "农田生态", project: "P1", skills: ["农田碳氮循环", "数据分析"],
    help: "可协助微生物数据分析、气体交换测定", contact: "zhangyeye8296@nwafu.efu.cn", seat: "农科楼841",
    status: "在职", after: "",
    employeeNo: "2025130069", studentNo: "", phone: "17392448296", wechat: "OHYE-3011",
  },
  {
    id: "MB3", name: "王芳", role: "讲师", join: "2020-07", grad: "",
    research: "大豆固氮与栽培", project: "P1", skills: ["田间试验", "统计"],
    help: "可协助田间设计", contact: "wangf@univ.edu.cn", seat: "农科楼 B406",
    status: "在职", after: "",
  },
  {
    id: "MB4", name: "赵磊", role: "博士生", join: "2022-09", grad: "2025-06（预计）",
    research: "小麦抗旱基因克隆", project: "P1", skills: ["分子生物学", "qPCR", "载体构建"],
    help: "可带教 RNA 提取与 qPCR", contact: "zhaol@stu.edu.cn", seat: "实验楼 C210",
    status: "在读", after: "",
  },
  {
    id: "MB5", name: "陈思", role: "博士生", join: "2021-09", grad: "2025-06（预计）",
    research: "小麦抗旱机制", project: "P1", skills: ["转录组", "光合测定", "R 绘图"],
    help: "可协助转录组分析与绘图", contact: "chens@stu.edu.cn", seat: "实验楼 C211",
    status: "在读", after: "",
  },
  {
    id: "MB6", name: "周婷", role: "硕士生", join: "2023-09", grad: "2026-06（预计）",
    research: "水稻高温胁迫", project: "P1", skills: ["荧光测定", "文献调研"],
    help: "可协助基础测定", contact: "zhout@stu.edu.cn", seat: "实验楼 C212",
    status: "在读", after: "",
  },
  {
    id: "MB7", name: "刘洋", role: "硕士生", join: "2020-09", grad: "2024-06",
    research: "玉米密植栽培", project: "P1", skills: ["田间测产", "示范管理"],
    help: "已毕业，可远程答疑", contact: "liuy@alumni.edu.cn", seat: "—",
    status: "已毕业", after: "某农业科技公司 农艺师",
  },
  {
    id: "MB8", name: "孙浩", role: "本科生", join: "2023-03", grad: "2025-06（预计）",
    research: "玉米栽培辅助", project: "P1", skills: ["田间协助", "数据录入"],
    help: "可协助田间取样", contact: "sunh@stu.edu.cn", seat: "农科楼 B108",
    status: "在读", after: "",
  },
];

window.DATA.achievements = [
  {
    id: "A1", type: "论文", title: "TaNAC67 调控小麦抗旱性的分子机制",
    authors: ["陈思", "赵磊", "张明远"], corresponding: "张明远",
    journal: "Journal of Experimental Botany", year: 2024, doi: "10.1093/jxb/abcd123",
    zone: "一区", if: 6.9, project: "P1", students: ["陈思"],
    paperUrl: "https://doi.org/10.1093/jxb/abcd123", pdfUrl: "https://docs.example.com/pdf/a1",
  },
  {
    id: "A2", type: "论文", title: "黄淮海玉米密植增产机理研究",
    authors: ["王芳", "刘洋", "张明远"], corresponding: "张明远",
    journal: "作物学报", year: 2023, doi: "10.3724/SP.J.1006.2023.xxxx",
    zone: "中文核心", if: 0, project: "P1", students: ["刘洋"],
    paperUrl: "https://doi.org/10.3724/SP.J.1006.2023.xxxx", pdfUrl: "https://docs.example.com/pdf/a2",
  },
  {
    id: "A3", type: "专利", title: "一种小麦抗旱相关基因及其应用",
    authors: ["张明远", "陈思"], corresponding: "张明远",
    journal: "国家发明专利", year: 2024, doi: "", zone: "专利", if: 0, project: "P1",
    students: ["陈思"], paperUrl: "", pdfUrl: "https://docs.example.com/patent/a3",
  },
  {
    id: "A4", type: "软件著作权", title: "作物表型数据分析系统 V1.0",
    authors: ["赵磊"], corresponding: "赵磊",
    journal: "软著", year: 2023, doi: "", zone: "软著", if: 0, project: "P1",
    students: ["赵磊"], paperUrl: "", pdfUrl: "https://docs.example.com/sc/a4",
  },
  {
    id: "A5", type: "获奖", title: "省级科技进步二等奖（玉米高产栽培）",
    authors: ["张明远", "王芳", "刘洋"], corresponding: "张明远",
    journal: "省级奖励", year: 2023, doi: "", zone: "获奖", if: 0, project: "P1",
    students: ["刘洋"], paperUrl: "", pdfUrl: "",
  },
  {
    id: "A6", type: "基金", title: "国家自然科学基金面上项目（小麦抗旱）",
    authors: ["张明远"], corresponding: "张明远",
    journal: "NSFC", year: 2022, doi: "", zone: "基金", if: 0, project: "P1",
    students: [], paperUrl: "", pdfUrl: "",
  },
];
