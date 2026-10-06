/* =========================================================
 * config.js —— 全站共用配置文件（零基础也能改）
 * 说明：只改这个文件，就能改课题组名称、导航菜单等。
 * ========================================================= */

// 课题组基本信息（请改成你们自己的）
window.SITE = {
  groupName: "旱区高效农作制度与农田生态创新团队",   // 课题组名称
  siteName: "课题组科研与学生培养管理平台",     // 网站名称
  slogan: "信息找得到 · 过程可追踪 · 经验能继承 · 资源可共享",
  // 顶部欢迎语（首页使用）
  welcome: "欢迎进入课题组科研与学生培养管理平台。这里集中管理项目、实验、样品、数据、报账、组会、学生培养与研究成果。",
};

/* 网站访问口令（站内密码门）
 * 改这一行即可改口令；改完上传到 GitHub 后全站生效。
 * 注意：这是轻量防护，懂技术的人可绕过，请勿把机密放进网站。
 * 需要“精确到人、可单独收回权限”请用 Cloudflare Access（见 README）。
 */
window.SITE_PASSWORD = "lab2024";

/* 分区口令（可选；留空 "" 表示不设限，任何人进站后都能看）
 * 用途：只想让「负责该项目的成员」看到项目资料链接、或只想让被授权的人看到试验地文件夹链接时，
 *      给对应区域加一道口令，组员输一次后本机记住（换电脑要再输一次）。
 * 重要：这是**轻量过滤**，不是真正的权限——懂技术的人可以绕过。
 *      真正的“精确到人、可随时收回”的权限，请把资料本体放在**飞书云盘**里按人授权（见 README 权限章节），
 *      网站只放链接入口，没被授权的人点开飞书会提示无权限。
 */
window.AREA_PASSWORDS = {
  projectFiles: "",   // 项目详情页的「项目资料」区（填了才启用，如 "P2026"）
  dataFolders:  ""    // 数据管理页的「试验地云盘文件夹」区
};

/* GitHub 仓库地址（用于生成「去 GitHub 发布」按钮链接）
 * 填成你们仓库，如 "https://github.com/yourname/han-lab-portal"；留空则不显示该按钮。
 * 组员点该按钮 → New Issue → 选模板填写 → 提交，1-2 分钟网站自动更新（不需要管理员）。
 */
window.REPO_URL = "";

/* ============================================================
 * 云端实时数据库（Supabase）—— 让“保存后全组立即可见”真正实现
 * ------------------------------------------------------------
 * 留空时：网站使用原来的「本机草稿 + 导出/Issue 发布」模式，功能正常，只是需要发布。
 * 填好后：组员在网页上保存 → 数据直接写入云端 → 全组刷新即可见（和学院官网体验一致），
 *         不再需要管理员合并、也不需要等 GitHub 构建。
 *
 * 配置步骤（只有管理员做一次，约 5 分钟，详见 README 十九章）：
 *   1. 用邮箱注册 https://supabase.com（免费，不用信用卡）；
 *   2. 新建项目（区域可选 Singapore / Tokyo，国内访问较快）；
 *   3. 打开项目 → SQL Editor → 把 README 里的建表 SQL 整段执行一次；
 *   4. 打开 Project Settings → API，复制「Project URL」和「anon public」两个值，
 *      分别填到下面两行，上传到 GitHub 即可。
 *
 * 安全说明：anon key 是设计为可公开在网页里的密钥，真正的权限由数据库的
 * RLS（行级安全策略）控制；建表 SQL 里已按“本组内部可读写”配置。
 * 请勿放入机密数据（财务明细、身份证号等）——本网站是轻量内部平台。
 */
window.SUPABASE_URL = "https://ouxiungckdloyjwryiud.supabase.co";       // Project URL。Data API 页复制的完整 API URL（带 /rest/v1）直接填也没关系，网站会自动纠正
window.SUPABASE_ANON_KEY = "sb_publishable_nPW25nStPCAeIT2n7zrXUw_b_gNS0Is";  // API Keys 页的 Publishable key（sb_publishable_ 开头），点复制按钮拿完整值

// 网站版本号：每次更新代码后把这里的值 +0.1（或改日期），页脚会显示。
// 用途：打开网站看页脚版本，即可确认 GitHub 上的新代码已生效（排查"改了没反应"时先看这里）。
window.SITE_VERSION = "v3.7";

/* 一键发布链接：优先用 Issue 模板选择页（最省事），没有就用新建 Issue 页 */
window.ISSUE_NEW_URL = function () {
  if (!window.REPO_URL) return "";
  var base = window.REPO_URL.replace(/\/+$/, "");
  return base + "/issues/new/choose";
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
  { name: "仪器耗材",   file: "equipment.html" },
  { name: "数据",       file: "datasets.html" },
  { name: "报账",       file: "expenses.html" },
  { name: "组会",       file: "meetings.html" },
  { name: "学生培养",   file: "students.html" },
  { name: "成员",       file: "members.html" },
  { name: "成果",       file: "achievements.html" },
  { name: "学习资源",   file: "resources.html" },
  // 「管理合并」页面已从导航移除（云端实时模式下不再需要管理员手动合并）。
  // 管理员如需访问，直接打开网址：你的域名/admin.html
];

/* 首页 9 个常用入口卡片（3 列布局，正好排成 3×3；想加第 10 个也照格式加一行即可）
 * icon 是 emoji 图标（可直接替换），file 是跳转页面
 */
window.HOME_CARDS = [
  { icon: "📋", name: "项目管理",     desc: "组里有哪些项目、谁负责、做到哪一步",  file: "projects.html" },
  { icon: "🧪", name: "实验方法",     desc: "可继承、可追踪版本的 SOP 实验方法库", desc2: "", file: "methods.html" },
  { icon: "🧫", name: "样品管理",     desc: "样品在哪里、属于哪个项目、还剩多少",  file: "samples.html" },
  { icon: "🔧", name: "仪器耗材",     desc: "仪器设备与耗材台账：在哪、谁登记、说明书在哪", file: "equipment.html" },
  { icon: "📊", name: "数据管理",     desc: "只存索引与链接，原始数据在服务器/云盘", file: "datasets.html" },
  { icon: "💰", name: "报账与采购",   desc: "报账流程说明 + 报账记录与费用统计",    file: "expenses.html" },
  { icon: "🗓️", name: "组会安排与记录", desc: "组会日历、历史记录与行动事项跟踪",  file: "meetings.html" },
  { icon: "🎓", name: "学生培养",     desc: "从入组到毕业全过程培养时间轴",        file: "students.html" },
  { icon: "👥", name: "成员与研究成果", desc: "成员信息 + 论文专利等成果展示",      file: "achievements.html" },
];

/* 首页背景轮播（课题组合照，每 5 秒自动切换，鼠标悬停暂停，点击可放大）
 * src     = 图片路径（建议把图片统一放在 assets/images/group/ 目录下）
 * caption = 照片说明，显示在右下角小标签上（可留空 ""）
 * 加照片：把图片放进 assets/images/group/，再照格式加一行即可，无需改代码。
 * 若某张图片还没上传，轮播会自动跳过它，不影响其他照片显示。
 */
window.GROUP_PHOTOS = [
  { src: "assets/images/group/photo-1.jpg", caption: "课题组毕业季合影" },
  { src: "assets/images/group/photo-2.jpg", caption: "毕业季 · 农学院前合影" },
  { src: "assets/images/group/photo-3.jpg", caption: "课题组大合影" },
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
  { key: "equipment",     title: "name",    sub: "location",  url: "equipment.html",       param: "",  typeName: "仪器耗材" },
  { key: "datasets",      title: "name",    sub: "project",   url: "datasets.html",        param: "",  typeName: "数据" },
  { key: "expenses",      title: "purpose", sub: "category",  url: "expenses.html",        param: "",  typeName: "报账" },
  { key: "meetings",      title: "topic",   sub: "reporter",  url: "meetings.html",        param: "",  typeName: "组会" },
  { key: "students",      title: "name",    sub: "research",  url: "students.html",        param: "",  typeName: "学生" },
  { key: "members",       title: "name",    sub: "role",      url: "members.html",         param: "",  typeName: "成员" },
  { key: "achievements",  title: "title",   sub: "type",      url: "achievements.html",    param: "",  typeName: "成果" },
  { key: "resources",     title: "title",   sub: "category",  url: "resources.html",       param: "",  typeName: "学习资源" },
];

/* 首页「快速链接」配置（自己改！想加就照格式加一行，想删就删一行）
 * t = 显示文字；u = 点击打开的网址。
 * 下面目前是**占位示例**，建议逐步换成你们组真正在用的系统链接，例如：
 *   { t: "飞书云盘（课题组文件）", u: "https://xxx.feishu.cn/drive/folder/xxxx" },
 *   { t: "学校财务处报账系统",     u: "https://cwc.nwafu.edu.cn/" },
 * 改完上传到 GitHub 全站生效；后期随时可再改，不影响其他功能。
 */
window.QUICK_LINKS = [
  { t: "飞书多维表格（项目看板）", u: "https://www.feishu.cn/" },
  { t: "腾讯文档（共享文档）",     u: "https://docs.qq.com/" },
  { t: "学校 NAS 数据服务器",      u: "https://nas.example.edu.cn/" },
  { t: "OneDrive 课题组空间",      u: "https://onedrive.live.com/" },
  { t: "对象存储 OSS（原始数据）", u: "https://www.aliyun.com/product/oss" },
];

/* 报账模块接入：飞书多维表格（或腾讯文档/Airtable）链接
 * 用法：报账页顶部会有两个按钮——
 *   - 在线提交报账 -> EXPENSE_FORM_URL（你建好的飞书“提交”视图/表单）
 *   - 查看当前周期全部记录 -> EXPENSE_VIEW_URL（你分享给全组的视图）
 * 现在先填占位的 https 链接，等你建好飞书表格后，
 * 把下面两个值换成真实链接即可（上传到 GitHub 后全站生效）。
 * ========================================================= */
window.EXPENSE_FORM_URL = "https://my.feishu.cn/wiki/PZoSwAUDqi7mVDk3V9ocaiTGnzf?table=tblNhs3TiapsXbHr&view=vewMnc0ole";   // 飞书报账明细表（组员打开后筛选"报销人=自己"，可直接新增/上传凭证）
window.EXPENSE_VIEW_URL  = "https://my.feishu.cn/wiki/PZoSwAUDqi7mVDk3V9ocaiTGnzf?table=tblNhs3TiapsXbHr&view=vewMnc0ole";   // 飞书报账明细表（所有人看全量）

/* =========================================================
 * 项目实验资料库（飞书云空间文件夹链接）
 * 用法：项目详情页底部有「📤 上传新资料」按钮 → 跳到这个飞书文件夹
 *   - 建议在飞书云空间建一个"项目实验资料"总文件夹，下面按项目名建子文件夹
 *   - 子文件夹里再按 PPT / 实验方案 / 讨论记录 分类
 *   - 上传后，把文件信息登记到 assets/js/data/projects.js 里对应项目的 materials 数组
 * 填好后这里的按钮才会工作；空着则按钮点了没反应。
 * ========================================================= */
window.PROJECT_MATERIALS_FOLDER = "https://my.feishu.cn/drive/folder/BmabfxTa8lur81dlQa8cwNkPnmf";   // 飞书云盘「项目实验资料」文件夹（组员共享·可编辑），点项目页「上传新资料」按钮跳到这里

