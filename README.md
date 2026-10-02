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
| 项目 | `projects` | id, name, **shortName**, leader, members, source, code, **fiscalCode**, start, end, budget, status, stage, progress, **pinned**, goal, okr, monthlyProgress, nextPlan, risks, **setup**, **design**, projectFolderUrl, materials[{name,url,uploader,note,date}], relatedMethods/Samples/Datasets/Expenses/Achievements |
| 实验方法 | `methods` | id, name, category, applicableExperiments, applicableProjects, author, version, updated, purpose, materials, instruments, steps, keyParams, notes, commonErrors, failureCases, tips, references, attachments, videoUrl, versionHistory |
| 样品 | `samples` | id, code, name, type, source, project, owner, prepDate, storage, building, room, fridge, layer, box, location, total, remain, unit, status, lastUser, lastUse, remark, qr |
| 数据 | `datasets` | id, name, project, experiment, date, material, treatment, replicate, variables, operator, instrument, raw_data_url, clean_data_url, analysis_url, figure_url, note, version, updated, storage_url, api_endpoint, external_id |
| 报账 | `expenses` + `expenseFlows` | id, date, reporter, project, category, amount, purpose, invoiceStatus, complete, status, submitDate, doneDate, remark ／ 流程：type, materials, faq, note, template |
| 组会 | `meetings` | id, date, place, host, reporter, topic, project, pptUrl, docUrl, progress, problems, discussion, advice, actions[{task,owner,due,check}] |
| 学生培养 | `students` | id, name, studentId, type, enroll, join, tutor, research, project, expectGrad, stages[{name,plan,actual,status,materials,materialUrl,advice,done,note}] |
| 成员 | `members` | id, name, role, join, grad, research, project, skills, help, contact, seat, status, after |
| 成果 | `achievements` | id, type, title, authors, corresponding, journal, year, doi, zone, if, project, students, paperUrl, pdfUrl |
| 学习资源 | `resources` | id, title, category, intro, forWho, when, minutes, url, recommend |
| 日常用工具 | `tools` | id, category, name, url, desc, addedBy（category 取值见 config.js 的 TOOL_CATEGORIES） |

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

## 六、项目资料上传与批量入库

项目详情页使用单一资料表，按「名称 / 上传人 / 更新时间 / 备注」展示所有资料，结构简单、类似飞书云盘文件列表。更新时间随保存自动填充，方便接手项目的学生按时间倒序快速找到历史资料。

### 添加项目的两种方式

#### 方式 A：网页弹窗添加/编辑（最快捷，推荐）
1. 打开「项目管理」页，点工具栏「＋ 添加项目」。
2. 填写项目编号、名称、简称、负责人、参与人、来源、项目编号、财务编号、起止年月、经费、状态、阶段、进度。
3. 保存后新项目即时出现在列表中（仅本机可见）。
4. 点「导出我添加的项目（JSON）」，把 JSON 数组贴入 `assets/js/data/project-overrides.js` 的 `window.DATA.projectOverrides` 中，上传 GitHub 后全组可见。
5. 每张项目卡片上都有「编辑」按钮，可打开弹窗修改已有项目（不会丢失 goal/okr/实验设置等已有字段）。

#### 方式 B：Excel 模板批量入库（多个项目，推荐）
1. 运行 `python3 build_templates.py`，生成 `信息收集模板/01-项目信息表.xlsx`。
2. 在「项目信息」sheet 每行填一个项目（含项目简称、财务编号、是否必读、实验设置等）；在「项目资料」sheet 按行填写每条资料（含项目编号、类别、是否必读、链接）。
3. 运行 `python3 build_projects.py` 自动生成 `assets/js/data/projects.js`。
4. 如需先预览/校验，运行 `python3 build_projects.py --check` 只解析不写入。

### 上传资料的三种方式

#### 方式 1：飞书项目文件夹（最常用，门槛低）
1. 在飞书云盘为每个项目建一个子文件夹，复制分享链接填到项目的 `projectFolderUrl`（Excel 或弹窗均可）。
2. 若暂时没为每个项目单独建文件夹，系统会 fallback 到 `config.js` 的全局 `PROJECT_MATERIALS_FOLDER`。
3. 组员点「📤 上传到飞书资料夹」直接拖文件/文件夹进去。
4. 上传后在详情页资料表顶部填写文件名、上传人、备注、飞书链接，点保存登记。

#### 方式 2：网页表单临时登记（个人先记、再导出）
1. 项目详情页资料表顶部直接填写名称、上传人、备注、飞书链接。
2. 保存时自动填充当前时间作为「更新时间」。
3. 每条资料右侧有「编辑 / 删除」按钮，可随时修改或删除自己保存的资料。
4. 信息先存在当前浏览器（换设备或清缓存会丢失）。
5. 管理员点「导出我添加的资料（JSON）」，把 JSON 贴入 `assets/js/data/project-materials.js` 的 `projectMaterialOverrides` 中，全组即可见。

#### 方式 3：Excel 模板批量登记（已有大量资料时）
与「添加项目」的 Excel 方式共用同一张表：在「项目资料」sheet 一行一条资料（类别列可留空），运行 `python3 build_projects.py` 即可合并到 `projects.js`。

## 六·补、首页合照背景轮播

1. 把合照放到 `assets/images/group/` 目录（如 `photo-2.jpg`）。
2. 打开 `assets/js/config.js`，在 `window.GROUP_PHOTOS` 中按 `{ src, caption }` 格式增删一行，caption 为照片说明（显示在右下角小标签，可留空）。
3. 首页顶部欢迎区会把这些合照**轮流作为背景**展示：每 5 秒自动切换、鼠标悬停暂停、点圆点可跳到某张、点击照片可放大查看。
4. 照片本体按原始比例完整显示（`object-fit: contain`，**不裁切人脸**），模糊放大版填充整块背景避免露白边；左侧压暗保证白色文字可读。
5. 某张图片还没上传时轮播会自动跳过，不影响其他照片。手机端自动改为照片铺满做背景、文字移到下方。

> 提示：也可以直接复制 `projects.js` 中已有项目对象，改 `id` 和字段，适合会改代码的管理员。

> 去重说明（2025-10 更新）：本地弹窗项目与全站数据现在由 `app.js` 的 `mergeLocalProjects()` 统一合并——id 相同视为同一项目（本地字段优先）；名称相同视为同一项目的本地草稿，只补全全站缺省字段，不再出现两张同名卡片；项目详情页也会先执行合并，本地添加的项目点「查看详情」不再显示空白。

---

## 七、以后怎么接入第三方服务？

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

## 八、权限设计（第一版暂不实装，但已在架构中预留）

未来角色与权限范围（写代码时按此设计）：
- **管理员**：查看/编辑全部信息。
- **负责人 / PI**：查看全部；编辑项目、组会、学生培养；审核报账。
- **普通成员 / 学生**：查看组内公开内容；编辑自己负责的数据与记录。
- **访客**：仅查看对外公开的资源与成果。

> 财务信息、联系方式、学生个人信息未来需做权限控制，第一版请先不要部署含敏感信息的公开站。

---

## 九、全站搜索说明

首页/各页顶部搜索框基于**本地数据**即时搜索（项目名称、成员、实验方法、样品编号、数据名称、组会主题、成果、学习资源）。
搜索覆盖范围在 `assets/js/config.js` 的 `SEARCH_CONFIG` 中配置，想加新模块搜索，照格式加一项即可。

---

## 十、后续升级路线图（1 天原型 → 1–2 周实用 → 逐步智能）

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

---

## 十一、让首页合照自动跟随飞书云盘文件夹更新（进阶，可选项）

网站是纯静态站，页面本身不能读取你的飞书云盘；要实现"往飞书文件夹丢照片 → 首页自动换新"，
做法是让 **GitHub Actions 定时跑一个同步脚本**：脚本用飞书开放平台 API 读取文件夹里的图片，
下载到 `assets/images/group/`，生成首页读取的清单 `assets/data/group-photos.json`，
提交后 GitHub Pages 自动重新发布。

```
飞书云盘文件夹 ──(每天定时)──> sync_group_photos.py ──> 图片 + 照片清单 ──> GitHub Pages 首页轮播
```

### 一次性配置（约 15 分钟）

1. **建飞书自建应用**：打开 [open.feishu.cn](https://open.feishu.cn) → 开发者后台 → 创建企业自建应用
   → 权限管理勾选云盘权限 `drive:file`、`drive:file:readonly` → 创建版本并申请发布、等待管理员通过。
   > 注意：**飞书个人版（my.feishu.cn）不能创建自建应用**，需要学校/单位的飞书企业版。
2. **把文件夹共享给应用**：在飞书云盘打开目标文件夹 → 「…」→ 添加协作者 → 搜索并添加刚建的应用
   （不加这一步，应用读不到文件夹内容）。复制文件夹链接，最后一段 `fldcn…` 就是 folder token。
3. **配置 GitHub 密钥**：仓库 Settings → Secrets and variables → Actions → New repository secret，
   添加三项：`FEISHU_APP_ID`（cli_ 开头）、`FEISHU_APP_SECRET`、`FEISHU_FOLDER_TOKEN`（fldcn 开头）。

### 使用与验证

- 自动：`.github/workflows/sync-group-photos.yml` 每天北京时间 10:17 跑一次（改 cron 可换时间）。
- 手动：仓库 Actions 页 → 「同步飞书合照到首页」→ Run workflow，立即跑一次看效果。
- 本地试跑：`python3 sync_group_photos.py --dry-run`（只打印不写文件），确认后去掉参数真跑。
- 照片说明文字自动取**图片文件名**（如 `2025年秋光合影.jpg` → 显示"2025年秋光合影"）。

### 读取优先级与回退

首页按此顺序取照片：① `assets/data/group-photos.json`（同步生成）
→ ② `config.js` 的 `window.GROUP_PHOTOS`（手工维护）。清单不存在或为空时自动回退，
所以**没配置同步、或同步失败，网站都不会白屏**。启用同步后，飞书文件夹即首页照片的唯一来源，
原来的 `photo-1.jpg` 等请一并上传到该文件夹。

> 安全提醒：密钥只从环境变量读取（本地 export / GitHub Secrets），**不要写进代码或提交到仓库**。

---

## 十二、成果与成员的网页端增删改（本机草稿 + 管理员合并）

「研究成果」页和「成员」页都内置了与「项目管理」页相同的维护模式，日常更新不用改代码：

### 组员日常操作（30 秒）
1. 发表了新文章 / 新同学入组 → 打开对应页面点 **「＋ 添加成果」/「＋ 添加成员」**，填表保存。
   - 新文章标题建议按 `作者_期刊名_年份` 填写（如 `韩娟_Field Crops Research_2026`），统计栏的 SCI/中文会自动识别；
     也可在弹窗「语言」里直接指定。
   - 成果弹窗里可「关联成员」，文章/获奖会同步显示在该成员的卡片上。
   - 新成员填好「在校状态」（在籍在校 = 在读），成员页和统计栏自动更新。
2. 信息有变动（如换了工位、论文正式见刊）→ 点条目上的 **「编辑」** 直接改。
3. 需要**删除**（如录错了）→ 点 **「删除」**，确认即可。
4. 以上修改**先保存在本人浏览器，仅本机可见**。点工具栏 **「导出我添加的修改（JSON）」**，
   复制弹窗里的全部内容，发给管理员（微信群即可）。

### 管理员合并（1 分钟）
1. 把组员发来的内容**整体覆盖**对应文件（成果 → `assets/js/data/achievement-overrides.js`，
   成员 → `assets/js/data/member-overrides.js`，项目 → `assets/js/data/project-overrides.js`）。
2. 上传到 GitHub（网页端 Add file → Upload files → 替换同名文件，或 git push）。
3. 等 1–2 分钟 Pages 更新，全组即可见，统计栏数字自动跟着变。

### 说明与注意
- 两页的统计栏（论文数、SCI/中文、学位论文、获奖项数、在读/已毕业人次等）都按合并后的数据**实时计算**，无需手工维护。
- 多人同时导出时，管理员把几份内容里的数组**合并去重**（按 id）再覆盖即可；id 冲突时后合并的覆盖先合并的。
- 删除只是"隐藏"（记录 id），数据仍在原文件里，误删可随时恢复。
- 隐私提醒：成员页手机号、邮箱公开可见，录入前请征得本人同意。

---

## 十三、仪器设备及耗材台账

「仪器耗材」页（首页第 4 张入口卡 / 导航「仪器耗材」）是组内的仪器设备与耗材保管台账：
有什么、有多少、放在哪、谁登记、说明书在哪，一目了然。

### 页面结构
- **统计栏**（4 项，按台账实时计算）：仪器设备（台/件）、耗材种类、存放位置（处）、需关注（状态为需采购/偏少/维修中/已报废的条目数）。
- **两张独立表格**：
  - 仪器设备表：名称、型号/规格、品牌/厂家、数量、存放位置、购置/登记人、购置日期、状态、**说明书/材料链接**（飞书等外链，点「查看/下载」新窗口打开）、备注、操作。
  - 耗材表：名称、规格（如 50mL 尖底）、品牌/厂家、**剩余数量**、存放位置、购置/登记人、购置日期、状态、说明书/材料链接、备注、操作。
- 顶部支持：按名称/型号/品牌/位置/登记人/备注搜索，按位置、状态筛选，按名称/位置/购置日期/状态排序。

### 组员日常操作（与成果/成员页同一套）
1. 购入新仪器、新到耗材 → 点 **「＋ 添加条目」**，填表保存（名称与存放位置必填）。
   类别选「仪器设备」进仪器表，选「耗材」进耗材表。
2. 电子说明书：把飞书等分享链接粘到弹窗「说明书/购置材料链接」一栏，表格里即出现可点击的「查看/下载」。
3. 耗材用掉一部分 → 点「编辑」改「剩余数量」；快见底时把状态改为「需采购」，统计栏「需关注」会自动亮出提醒。
4. 修改先保存在本人浏览器，点 **「导出我添加的修改（JSON）」** 发给管理员。

### 管理员合并
组员发来的 JSON **整体覆盖** `assets/js/data/equipment-overrides.js` → 上传 GitHub → 等 Pages 更新即全组可见。
（与成果/成员/项目同流程，overrides 文件共 4 个，全部放 `assets/js/data/` 下。）

### 字段建议
- 存放位置写具体（如 `农科楼 311 室 3 号柜`），统计栏「存放位置（处）」按整列去重计算。
- 仪器状态：在用 / 借用中 / 维修中 / 闲置 / 已报废；耗材状态：充足 / 偏少 / 需采购。
- 备注可写校准周期、提醒阈值（如“低于 100 支提醒补货”）、外借规则等。
