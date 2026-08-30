# 课题组科研与学生培养管理平台（第一版原型）

> 适用对象：高校科研课题组（零编程基础）
> 技术栈：**纯静态网站**（HTML + CSS + JavaScript），无需后端、无需数据库、手机电脑都能用。
> 第一版目标：先把网站**运行起来**，让组内成员**立刻能用**，后续再逐步升级。

---

## 一、网站目录结构

```
/workspace
├── index.html                  # 首页（欢迎区 + 8 个入口 + 最近更新/提醒/资源/链接）
├── assets/                     # 资源目录
│   ├── css/
│   │   └── style.css           # 全站统一样式（科研蓝主题，已做手机自适应）
│   └── js/
│       ├── config.js           # ⭐ 全站配置：课题组名称、导航菜单、首页卡片、搜索配置
│       ├── app.js              # ⭐ 共用脚本：顶部导航注入、全站搜索、首页卡片、通用函数
│       └── data/               # ⭐ 示例数据（以后在这里替换/增加内容）
│           ├── projects.js     # 项目
│           ├── methods.js      # 实验方法 / SOP
│           ├── samples.js      # 样品
│           ├── datasets.js     # 数据索引
│           ├── expenses.js     # 报账记录 + 报账流程
│           ├── meetings.js     # 组会
│           ├── students.js     # 学生培养
│           ├── members.js      # 成员 + 成果
│           └── resources.js    # 学习资源
├── pages/                      # 各功能页面
│   ├── projects.html           # 项目列表
│   ├── project-detail.html     # 项目详情（?id=xxx）
│   ├── methods.html            # 实验方法列表
│   ├── method-detail.html      # SOP 详情（?id=xxx）
│   ├── samples.html            # 样品列表（可按项目/位置筛选 + 库存预警）
│   ├── sample-detail.html      # 样品详情（?id=xxx，含二维码占位按钮）
│   ├── datasets.html           # 数据管理（索引 + 跳转链接）
│   ├── expenses.html           # 报账与采购（流程 + 记录 + 统计）
│   ├── meetings.html           # 组会（日历 + 历史 + 行动事项）
│   ├── students.html           # 学生培养（时间轴 + 到期提醒）
│   ├── members.html            # 成员信息
│   ├── achievements.html       # 研究成果
│   └── resources.html          # 学习资源
├── api/README.md               # API 接口设计（含 JSON 示例，为未来预留）
└── docs/                       # （可选）你自己的图片、说明等
```

**你日常只需要关心三处：**
1. `assets/js/config.js` —— 改课题组名称、菜单、首页卡片。
2. `assets/js/data/*.js` —— 改/加示例内容（项目、样品、方法…）。
3. `pages/*.html` —— 页面布局（一般不改，除非要加新模块）。

---

## 二、信息架构（网站地图）

```
首页
├── 项目管理（列表 → 详情）
│     关联：实验方法 / 样品 / 数据 / 报账 / 成果
├── 实验方法 / SOP（列表 + 分类筛选 + 搜索 → 详情）
│     详情含：操作步骤 / 关键注意事项(高亮) / 常见问题 / 版本时间轴
├── 样品管理（列表 + 按项目/位置筛选 + 库存预警 → 详情）
│     详情含：位置链 / 库存进度条 / 二维码占位按钮(预留扫码)
├── 数据管理（索引 + 搜索 → 跳转原始数据/分析/图表）
├── 报账与采购（流程说明 + 报账记录 + 费用统计）
├── 组会安排与记录（日历 + 历史 + 行动事项 Action Items）
├── 学生培养（列表 + 培养时间轴 + 到期提醒）
├── 成员与研究成果（成员卡片 / 成果表格，可按年份·类型·项目筛选）
└── 学习资源（按分类筛选，按需取用）
```

全站统一元素：顶部**课题组名称 + 导航 + 搜索框**；每个页面有**面包屑、页面标题、简介、搜索/筛选、返回首页**。

---

## 三、数据模型设计（核心字段一览）

所有数据都是 `window.DATA.xxx = [ {...}, {...} ]` 形式的数组，每条是一个对象（记录）。
下面是各模块的**关键字段**（与页面一一对应）：

| 模块 | 数据名 | 关键字段 |
|------|--------|----------|
| 项目 | `projects` | id, name, leader, members, source, code, start, end, budget, status, stage, progress, goal, okr, monthlyProgress, nextPlan, risks, relatedMethods/Samples/Datasets/Expenses/Achievements |
| 实验方法 | `methods` | id, name, category, applicableExperiments, applicableProjects, author, version, updated, purpose, materials, instruments, steps, keyParams, notes, commonErrors, failureCases, tips, references, attachments, videoUrl, versionHistory |
| 样品 | `samples` | id, code, name, type, source, project, owner, prepDate, storage, building, room, fridge, layer, box, location, total, remain, unit, status, lastUser, lastUse, remark, qr |
| 数据 | `datasets` | id, name, project, experiment, date, material, treatment, replicate, variables, operator, instrument, raw_data_url, clean_data_url, analysis_url, figure_url, note, version, updated, storage_url, api_endpoint, external_id |
| 报账 | `expenses` + `expenseFlows` | id, date, reporter, project, category, amount, purpose, invoiceStatus, complete, status, submitDate, doneDate, remark ／ 流程：type, materials, faq, note, template |
| 组会 | `meetings` | id, date, place, host, reporter, topic, project, pptUrl, docUrl, progress, problems, discussion, advice, actions[{task,owner,due,check}] |
| 学生培养 | `students` | id, name, studentId, type, enroll, join, tutor, research, project, expectGrad, stages[{name,plan,actual,status,materials,materialUrl,advice,done,note}] |
| 成员 | `members` | id, name, role, join, grad, research, project, skills, help, contact, seat, status, after |
| 成果 | `achievements` | id, type, title, authors, corresponding, journal, year, doi, zone, if, project, students, paperUrl, pdfUrl |
| 学习资源 | `resources` | id, title, category, intro, forWho, when, minutes, url, recommend |

**预留的第三方/接口字段（写在数据对象里即可）：**
`external_url` · `document_url` · `storage_url` · `api_endpoint` · `external_id`

---

## 四、作为零基础用户，下一步怎么做？

**第 1 步：先直接双击打开看效果（最简单，不用装任何软件）**
1. 打开本文件夹，找到 `index.html`。
2. 双击它，会用默认浏览器打开。
3. 顶部有课题组名称、导航、搜索框；点“进入”可浏览各模块。
> 说明：因为数据写在 `.js` 文件里（不是读远程文件），所以**双击就能用**，不需要启动服务器。

**第 2 步：改成你们课题组自己的内容**
1. 打开 `assets/js/config.js`，把 `groupName`（课题组名称）、`siteName`（网站名称）改成你们自己的。
2. 打开 `assets/js/data/` 下的各个 `.js`，把里面的示例内容替换成真实信息（照着现有格式改文字即可，不要删掉引号和外层结构）。

**第 3 步：让组内同学也能访问（部署，见第五节）**
推荐先用 **GitHub Pages**（免费、最简单），把整个文件夹上传即可。

---

## 五、如何部署（推荐：GitHub Pages，零基础最友好）

> 为什么推荐 GitHub Pages：免费、不用买服务器、不用命令行也能完成、自动生成网址、手机电脑都能访问。

**方式 A：完全不用命令行（网页操作，推荐）**
1. 注册并登录 https://github.com （用邮箱即可）。
2. 点击右上角 **“+” → New repository（新建仓库）**，名字随便起，例如 `lab-portal`，勾选 **Public（公开）**，点 Create。
3. 进入仓库后，点击 **“Add file” → “Upload files”**，把本文件夹里的**所有内容**（index.html、assets、pages 等）拖进去上传，写个说明（如“第一版”），点 **Commit changes**。
4. 进入仓库 **Settings → Pages**，Source 选 **“Deploy from a branch”**，Branch 选 **main / master**，文件夹选 **/ (root)**，保存。
5. 等 1–2 分钟，页面会显示一个网址，类似 `https://你的用户名.github.io/lab-portal/`，这就是全组的访问地址。

**方式 B：用 Vercel / Cloudflare Pages（也可，但需要绑定 GitHub 或命令行，略复杂）**
- 思路相同：把代码推送到 GitHub 后，在 Vercel/Cloudflare Pages 选择该仓库“一键部署”即可，无需额外配置。

> 注意：第一版所有数据在本地 `.js` 文件里，任何人打开网站都能看到。如果**财务、联系方式、学生个人信息**需要保密，请等后续加入“权限/登录”版本再部署为公开站；或先只在内网/小范围分享。

---

## 六、以后怎么接入第三方服务？

第一版用“链接跳转”实现，将来可平滑升级为“嵌入式/自动同步”：

| 想接入 | 第一版（现在） | 未来升级方式 |
|--------|----------------|--------------|
| 飞书多维表格 | 在 `config.js` 的“快速链接”或数据 `external_url` 里填表格地址，点击跳转 | 用飞书开放 API 拉取数据，渲染到本网站（替换 `data/*.js` 为接口返回） |
| 腾讯文档 / 飞书文档 | 数据对象里的 `document_url` 填文档链接，页面提供“打开文档”按钮 | 嵌入 iframe（`<iframe src="文档链接">`）直接内联显示 |
| OneDrive / 腾讯微云 | `storage_url` 填分享链接，点“打开原始数据”跳转 | 通过对应 API 或共享链接直接预览/下载 |
| 学校服务器 / NAS | `raw_data_url` 填内网/外部访问地址 | 同局域网或通过 VPN/反向代理访问 |
| 对象存储 OSS/COS/S3 | `figure_url`/`raw_data_url` 填对象 URL | 配置私有桶 + 签名 URL，或 CDN 加速 |

**升级路线（建议顺序）：**
1. 先用链接 + iframe 把第三方内容“接进来”（改数据里的 url 字段即可）。
2. 内容多了、要多人协同编辑时，把 `data/*.js` 换成**飞书多维表格 / Airtable / Notion** 的 API 数据（见 `api/README.md`）。
3. 需要权限、提醒、二维码时，再引入轻量后端或 Serverless（如 Cloudflare Workers / Vercel Functions）。

---

## 七、权限设计（第一版暂不实装，但已在架构中预留）

未来角色与权限范围（写代码时按此设计）：
- **管理员**：查看/编辑全部信息。
- **负责人 / PI**：查看全部；编辑项目、组会、学生培养；审核报账。
- **普通成员 / 学生**：查看组内公开内容；编辑自己负责的数据与记录。
- **访客**：仅查看对外公开的资源与成果。

> 财务信息、联系方式、学生个人信息未来需做权限控制，第一版请先不要部署含敏感信息的公开站。

---

## 八、全站搜索说明

首页/各页顶部搜索框基于**本地数据**即时搜索（项目名称、成员、实验方法、样品编号、数据名称、组会主题、成果、学习资源）。
搜索覆盖范围在 `assets/js/config.js` 的 `SEARCH_CONFIG` 中配置，想加新模块搜索，照格式加一项即可。

---

## 九、后续升级路线图（1 天原型 → 1–2 周实用 → 逐步智能）

- **Day 1**：运行静态原型，浏览全部页面。
- **1–2 周**：替换示例为真实数据，组内开始使用；用链接接入飞书/腾讯文档/NAS。
- **下一步**：Excel/飞书表格导入 → API 自动同步 → 二维码扫码 → 提醒通知 → 权限登录 → 统计图表。

---

## 十、访问权限（站内密码门 · 轻量防护）

第一版默认是公开的 GitHub Pages。若只想让组内人查看，已内置一个**访问口令门**：

1. 改口令：编辑 `assets/js/config.js` 里的 `window.SITE_PASSWORD`（默认 `lab2024`）。
2. 上传到 GitHub 后，全站生效：打开网站先看到"请输入访问口令"，输对才显示内容。
3. 把口令通过微信群发给组内成员即可；外人不知道口令就看不到。
4. 同一浏览器标签内输过一次后，翻看其他页面无需重输（关闭标签后重新要求）。

> ⚠️ **安全说明**：这是"挡君子不挡小人"的轻量方案，口令在浏览器本地校验，懂技术的人可绕过。
> 因此**不要把财务金额、私人手机号、学生隐私等机密放进网站**。
> 需要"精确到某个人能否进入、可单独加人/踢人"的正式权限，请用 **Cloudflare Access**（免费额度 50 人）：
> 把仓库部署到 Cloudflare Pages，开启 Access 策略，允许指定邮箱（或 `@学校域名`）登录即可，详见 Cloudflare 官方文档。
