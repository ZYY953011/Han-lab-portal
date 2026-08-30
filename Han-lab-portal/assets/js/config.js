/* =========================================================
 * config.js —— 全站共用配置文件（零基础也能改）
 * 说明：只改这个文件，就能改课题组名称、导航菜单等。
 * ========================================================= */

// 课题组基本信息（请改成你们自己的）
window.SITE = {
  groupName: "作物生理生态与产量形成课题组",   // 课题组名称
  siteName: "课题组科研与学生培养管理平台",     // 网站名称
  slogan: "信息找得到 · 过程可追踪 · 经验能继承 · 资源可共享",
  // 顶部欢迎语（首页使用）
  welcome: "欢迎进入课题组科研与学生培养管理平台。这里集中管理项目、实验、样品、数据、报账、组会、学生培养与研究成果。",
};

/* 顶部导航菜单
 * name = 显示文字，file = 对应的页面文件（放在 pages/ 目录下）
 * 想加菜单：照着下面复制一行即可。
 */
window.NAV = [
  { name: "首页",       file: "../index.html" },
  { name: "项目",       file: "projects.html" },
  { name: "实验方法",   file: "methods.html" },
  { name: "样品",       file: "samples.html" },
  { name: "数据",       file: "datasets.html" },
  { name: "报账",       file: "expenses.html" },
  { name: "组会",       file: "meetings.html" },
  { name: "学生培养",   file: "students.html" },
  { name: "成员",       file: "members.html" },
  { name: "成果",       file: "achievements.html" },
  { name: "学习资源",   file: "resources.html" },
];

/* 首页 8 个常用入口卡片
 * icon 是 emoji 图标（可直接替换），file 是跳转页面
 */
window.HOME_CARDS = [
  { icon: "📋", name: "项目管理",     desc: "组里有哪些项目、谁负责、做到哪一步",  file: "projects.html" },
  { icon: "🧪", name: "实验方法",     desc: "可继承、可追踪版本的 SOP 实验方法库", desc2: "", file: "methods.html" },
  { icon: "🧫", name: "样品管理",     desc: "样品在哪里、属于哪个项目、还剩多少",  file: "samples.html" },
  { icon: "📊", name: "数据管理",     desc: "只存索引与链接，原始数据在服务器/云盘", file: "datasets.html" },
  { icon: "💰", name: "报账与采购",   desc: "报账流程说明 + 报账记录与费用统计",    file: "expenses.html" },
  { icon: "🗓️", name: "组会安排与记录", desc: "组会日历、历史记录与行动事项跟踪",  file: "meetings.html" },
  { icon: "🎓", name: "学生培养",     desc: "从入组到毕业全过程培养时间轴",        file: "students.html" },
  { icon: "👥", name: "成员与研究成果", desc: "成员信息 + 论文专利等成果展示",      file: "achievements.html" },
];

/* 全站搜索配置：告诉搜索功能去哪些模块找、用哪个字段做标题
 * key   = window.DATA 里的数据名
 * title = 显示的标题字段
 * url   = 点击后跳转的详情页
 * param = 详情页用哪个参数接收 id（例如 project-detail.html?id=xxx）
 * 想让搜索覆盖新模块，照此增加一项即可。
 */
window.SEARCH_CONFIG = [
  { key: "projects",      title: "name",    sub: "leader",    url: "project-detail.html",  param: "id", typeName: "项目" },
  { key: "methods",       title: "name",    sub: "category",  url: "method-detail.html",   param: "id", typeName: "实验方法" },
  { key: "samples",       title: "name",    sub: "code",      url: "sample-detail.html",   param: "id", typeName: "样品" },
  { key: "datasets",      title: "name",    sub: "project",   url: "datasets.html",        param: "",  typeName: "数据" },
  { key: "expenses",      title: "purpose", sub: "category",  url: "expenses.html",        param: "",  typeName: "报账" },
  { key: "meetings",      title: "topic",   sub: "reporter",  url: "meetings.html",        param: "",  typeName: "组会" },
  { key: "students",      title: "name",    sub: "research",  url: "students.html",        param: "",  typeName: "学生" },
  { key: "members",       title: "name",    sub: "role",      url: "members.html",         param: "",  typeName: "成员" },
  { key: "achievements",  title: "title",   sub: "type",      url: "achievements.html",    param: "",  typeName: "成果" },
  { key: "resources",     title: "title",   sub: "category",  url: "resources.html",       param: "",  typeName: "学习资源" },
];
