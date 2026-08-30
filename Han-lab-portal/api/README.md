# API 接口设计（预留，第一版暂不使用）

> 目的：第一版是纯静态网站，不使用 API。但数据结构已按“未来可平滑切换为 API”设计，
> 所有 `assets/js/data/*.js` 里的对象，未来都可以由后端接口返回，**前端渲染逻辑基本不用改**。

---

## 一、设计约定

- 基础地址（BASE）：`https://你的域名/api`
- 数据格式：JSON，`UTF-8`，字段命名用**小驼峰**或**下划线**（与现有数据对象一致即可）。
- 查询参数：列表接口支持 `?project=P1&status=进行中&keyword=xxx&page=1&size=20`。
- 预留跨系统字段（写在每条记录里）：
  - `external_url`：第三方页面地址（飞书/腾讯文档等）
  - `document_url`：文档地址
  - `storage_url`：文件存储位置（NAS/OSS/S3 等）
  - `api_endpoint`：本记录对应的 API 路径
  - `external_id`：在外部系统（如飞书表格）中的记录 ID
- 角色权限（未来加登录后使用）：`admin / pi / member / guest`，详见主 README。

---

## 二、接口清单

### 1. 项目 Projects
```
GET /api/projects            # 项目列表（支持筛选）
GET /api/projects/:id        # 项目详情
```
示例（GET /api/projects/P1）：
```json
{
  "id": "P1",
  "name": "小麦抗旱基因挖掘与分子机制研究",
  "leader": "张明远 教授",
  "members": ["张明远", "李文", "赵磊", "陈思"],
  "source": "国家自然科学基金面上项目",
  "code": "NSFC-32171800",
  "start": "2022-01",
  "end": "2025-12",
  "budget": "60 万元",
  "status": "进行中",
  "stage": "基因功能验证",
  "progress": 72,
  "goal": "挖掘 2–3 个小麦抗旱主效基因，解析其调控网络。",
  "okr": ["O：完成抗旱资源筛选 KR：鉴定 50 份抗旱种质"],
  "monthlyProgress": "本月完成抗旱转录组第 3 批取样。",
  "nextPlan": "下月开展候选基因 VIGS 验证实验。",
  "risks": "转基因材料构建周期较长，需提前预约。",
  "relatedMethods": ["M1", "M2", "M5"],
  "relatedSamples": ["S1", "S2", "S3"],
  "relatedDatasets": ["D1", "D2"],
  "relatedExpenses": ["E1", "E2"],
  "relatedAchievements": ["A1"],
  "external_url": "https://feishu.example.com/base/projects/P1",
  "api_endpoint": "/api/projects/P1",
  "external_id": "FS-PROJ-001"
}
```

### 2. 实验方法 Methods（SOP）
```
GET /api/methods
GET /api/methods/:id
```
示例（GET /api/methods/M1）：
```json
{
  "id": "M1",
  "name": "小麦叶片光合速率测定（LI-6400）",
  "category": "生理指标",
  "applicableExperiments": "逆境生理、光合特性评价",
  "applicableProjects": "P1, P3",
  "author": "陈思",
  "version": "v2.1",
  "updated": "2024-03-12",
  "purpose": "测定小麦叶片净光合速率（Pn）等参数。",
  "materials": ["小麦旗叶", "蒸馏水", "夹叶器"],
  "instruments": ["LI-6400 便携式光合仪"],
  "steps": ["开机预热 30 分钟…", "选取健康旗叶…"],
  "keyParams": ["光强 1200", "温度 25℃"],
  "notes": ["测定前叶片须适应光强 10 分钟。"],
  "commonErrors": ["叶室遮光不均导致 Pn 偏低。"],
  "failureCases": ["2023-07 一批数据异常已作废重测。"],
  "tips": ["长期测定建议固定同一操作人员。"],
  "references": ["Long S P, et al. 2009."],
  "attachments": [{"name": "光合测定记录表.xlsx", "url": "https://docs.example.com/pn_record"}],
  "videoUrl": "https://video.example.com/li6400_demo",
  "versionHistory": [
    {"ver": "v2.1", "date": "2024-03-12", "who": "陈思", "note": "补充高温天注意事项"}
  ],
  "external_url": "https://feishu.example.com/base/methods/M1"
}
```

### 3. 样品 Samples
```
GET /api/samples
GET /api/samples/:id
```
示例：
```json
{
  "id": "S1",
  "code": "WH-2024-001",
  "name": "小麦抗旱种质种子",
  "type": "种子",
  "source": "种质资源库引种",
  "project": "P1",
  "owner": "陈思",
  "prepDate": "2024-01-10",
  "storage": "4℃ 干燥",
  "building": "农科楼", "room": "B205 种子室",
  "fridge": "种子柜 A", "layer": "第 2 层", "box": "盒 07",
  "location": "种子柜 A / 第 2 层 / 盒 07",
  "total": 500, "remain": 120, "unit": "粒",
  "status": "在库",
  "lastUser": "陈思", "lastUse": "2024-03-08",
  "remark": "含 50 份抗旱与对照种质。",
  "qr": "QR-S1",
  "storage_url": "nas://group/seeds/S1"
}
```

### 4. 数据 Datasets
```
GET /api/datasets
GET /api/datasets/:id
```
示例：
```json
{
  "id": "D1",
  "name": "小麦抗旱转录组原始测序数据",
  "project": "P1",
  "experiment": "抗旱转录组",
  "date": "2024-03-05",
  "material": "小麦旗叶",
  "treatment": "PEG 模拟干旱 0/6/12/24 h",
  "replicate": "3 生物学重复",
  "variables": "基因表达量（FPKM）",
  "operator": "赵磊",
  "instrument": "Illumina NovaSeq",
  "raw_data_url": "https://nas.example.edu.cn/share/xm/rnaseq_raw",
  "clean_data_url": "https://nas.example.edu.cn/share/xm/rnaseq_clean",
  "analysis_url": "https://github.com/group/xm_rnaseq",
  "figure_url": "https://nas.example.edu.cn/share/xm/figures/pca.png",
  "note": "原始 fastq 约 120 GB，存于学校 NAS。",
  "version": "v1.0", "updated": "2024-03-15",
  "storage_url": "nas://group/xm/rnaseq",
  "api_endpoint": "/api/datasets/D1",
  "external_id": "NAS-XM-001"
}
```

### 5. 报账 Expenses
```
GET /api/expenses
GET /api/expenses/:id
```
示例：
```json
{
  "id": "E1",
  "date": "2024-03-02",
  "reporter": "赵磊",
  "project": "P1",
  "category": "材料采购",
  "amount": 8600,
  "purpose": "Trizol、引物、试剂盒等耗材",
  "invoiceStatus": "已开票",
  "complete": "齐全",
  "status": "已报销",
  "submitDate": "2024-03-05",
  "doneDate": "2024-03-20",
  "remark": "国库集中支付。"
}
```

### 6. 组会 Meetings
```
GET /api/meetings
GET /api/meetings/:id
```
示例：
```json
{
  "id": "MT-2024-03-22",
  "date": "2024-03-22",
  "place": "农科楼 B308",
  "host": "张明远",
  "reporter": "陈思",
  "topic": "小麦抗旱转录组进展与候选基因汇报",
  "project": "P1",
  "pptUrl": "https://docs.example.com/mt0322_ppt",
  "docUrl": "https://docs.example.com/mt0322_note",
  "progress": "完成转录组分析，筛选出 12 个候选抗旱基因。",
  "problems": "转基因材料构建周期长。",
  "discussion": "讨论优先验证 Top3 候选基因。",
  "advice": "老师建议先补 VIGS 验证。",
  "actions": [
    {"task": "完成 Top3 基因 VIGS 载体构建", "owner": "赵磊", "due": "2024-04-10", "check": "2024-04-12"}
  ]
}
```

### 7. 学生 Students
```
GET /api/students
GET /api/students/:id
```
示例：
```json
{
  "id": "ST1",
  "name": "陈思",
  "studentId": "2021110023",
  "type": "博士生",
  "enroll": "2021-09", "join": "2021-10",
  "tutor": "张明远",
  "research": "小麦抗旱基因功能解析",
  "project": "P1",
  "expectGrad": "2025-06",
  "stages": [
    {"name": "开题", "plan": "2022-12", "actual": "2022-12", "status": "已完成",
     "materials": ["开题报告"], "materialUrl": "https://docs.example.com/ks_chen", "advice": "选题可行", "done": true, "note": ""}
  ]
}
```

### 8. 成员 Members
```
GET /api/members
GET /api/members/:id
```
示例：
```json
{
  "id": "MB1", "name": "张明远", "role": "教师",
  "join": "2015-03", "grad": "",
  "research": "作物生理生态与产量形成", "project": "P1, P2",
  "skills": ["课题设计", "栽培生理"], "help": "可指导实验设计、论文框架",
  "contact": "zhangmy@univ.edu.cn", "seat": "农科楼 B402",
  "status": "在职", "after": ""
}
```

### 9. 成果 Achievements
```
GET /api/achievements
GET /api/achievements/:id
```
示例：
```json
{
  "id": "A1", "type": "论文", "title": "TaNAC67 调控小麦抗旱性的分子机制",
  "authors": ["陈思", "赵磊", "张明远"], "corresponding": "张明远",
  "journal": "Journal of Experimental Botany", "year": 2024,
  "doi": "10.1093/jxb/abcd123", "zone": "一区", "if": 6.9,
  "project": "P1", "students": ["陈思"],
  "paperUrl": "https://doi.org/10.1093/jxb/abcd123",
  "pdfUrl": "https://docs.example.com/pdf/a1"
}
```

---

## 三、未来可增加的写接口（第二阶段）

```
POST /api/samples     # 新增样品（扫码登记后写入）
POST /api/expenses    # 提交报账记录
POST /api/meetings    # 提交组会记录与行动事项
PUT  /api/methods/:id # 更新 SOP 并自动生成版本历史
```

---

## 四、从“本地 JS 数据”切换到“API”的大致做法

1. 后端按上面结构提供 JSON 接口。
2. 在 `assets/js/app.js` 或各页面里，把 `window.DATA.xxx = [...]` 的读取，
   改为 `fetch('/api/xxx').then(r=>r.json())`，渲染逻辑几乎不变。
3. 列表页的筛选/搜索，可改为把条件拼到查询参数（如 `?project=P1&status=进行中`）。
4. 第三方表格（飞书/Airtable/Notion）可视为“数据源”，用它们的 API 作为 `/api/*` 的后端实现。

> 这样第一版的页面与样式可以**完全保留**，只是数据来源从“本地文件”换成“接口”，风险最低。
