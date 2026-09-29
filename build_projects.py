# -*- coding: utf-8 -*-
"""
从「信息收集模板/01-项目信息表.xlsx」生成 projects.js
用法：
    python3 build_projects.py              # 重新生成 assets/js/data/projects.js
    python3 build_projects.py --check      # 只解析打印，不写入文件

Excel 结构：
- 第 1 个 sheet「项目信息」：每个项目一行，第 1-4 行为标题/说明/表头/示例，数据从第 5 行开始。
- 第 2 个 sheet「项目资料」：每条资料一行，按「项目编号」归并到对应项目的 materials。
"""
import os
import sys
import json
from openpyxl import load_workbook

TEMPLATE = "/workspace/信息收集模板/01-项目信息表.xlsx"
OUT = "/workspace/assets/js/data/projects.js"

CATEGORY_MAP = {
    "申报立项": "proposal", "立项": "proposal", "申请书": "proposal", "任务书": "proposal",
    "年度报告": "annual", "年度": "annual",
    "中期考核": "midterm", "中期": "midterm",
    "结题验收": "final", "结题": "final", "验收": "final",
    "技术/进展报告": "report", "进展报告": "report", "技术报告": "report", "报告": "report",
    "经费财务": "finance", "财务": "finance", "经费": "finance",
    "实验资料": "experiment", "实验": "experiment", "PPT": "experiment", "原始记录": "experiment",
}


def split_cell(val, sep=","):
    if val is None:
        return []
    s = str(val).strip()
    if not s:
        return []
    return [x.strip() for x in s.split(sep) if x.strip()]


def to_int(val):
    try:
        return int(float(val))
    except Exception:
        return 0


def normalize_category(val):
    if val is None:
        return "experiment"
    key = str(val).strip()
    return CATEGORY_MAP.get(key, "experiment")


def load_projects():
    wb = load_workbook(TEMPLATE, data_only=True)
    ws = wb["项目信息"]

    # 表头在第 3 行，标题行 1/2，示例行 4，数据从 5 开始
    headers = [cell.value for cell in ws[3]]
    col_idx = {h: i for i, h in enumerate(headers) if h}

    projects = []
    for row in ws.iter_rows(min_row=5, values_only=True):
        if not row or not row[0]:
            continue
        pid = str(row[0]).strip()
        if not pid or pid.startswith("（") or pid.startswith("项"):
            continue

        pinned_val = str(row[col_idx.get("是否必读", 24)] or "").strip()
        p = {
            "id": pid,
            "name": str(row[col_idx.get("项目名称", 1)] or "").strip(),
            "shortName": str(row[col_idx.get("项目简称", 25)] or "").strip(),
            "leader": str(row[col_idx.get("项目负责人", 2)] or "").strip(),
            "members": split_cell(row[col_idx.get("参与成员", 3)]),
            "source": str(row[col_idx.get("项目来源", 4)] or "").strip(),
            "code": str(row[col_idx.get("项目外部编号", 5)] or "").strip(),
            "fiscalCode": str(row[col_idx.get("财务编号", 6)] or "").strip(),
            "start": str(row[col_idx.get("起始时间", 8)] or "").strip(),
            "end": str(row[col_idx.get("结束时间", 9)] or "").strip(),
            "budget": str(row[col_idx.get("经费", 10)] or "").strip(),
            "status": str(row[col_idx.get("当前状态", 11)] or "").strip(),
            "stage": str(row[col_idx.get("当前阶段", 12)] or "").strip(),
            "progress": to_int(row[col_idx.get("进度百分比", 13)]),
            "goal": str(row[col_idx.get("项目目标", 14)] or "").strip(),
            "okr": [x.strip() for x in str(row[col_idx.get("OKR", 15)] or "").split("\n") if x.strip()],
            "monthlyProgress": str(row[col_idx.get("本月进展", 16)] or "").strip() or "（待填写：每月进展）",
            "nextPlan": str(row[col_idx.get("下一步计划", 17)] or "").strip() or "（待填写：下一步计划）",
            "risks": str(row[col_idx.get("风险和问题", 18)] or "").strip() or "（待填写：主要风险与应对）",
            "setup": str(row[col_idx.get("实验初始设置", 26)] or "").strip() or "（待补充：实验初始设置——实验室设备、田间/温室场地、关键材料等）",
            "design": str(row[col_idx.get("实验布置细节", 27)] or "").strip() or "（待补充：实验布置细节——小区设计、处理梯度、重复数、测定指标等）",
            "pinned": pinned_val in ("是", "true", "True", "TRUE", "1"),
            "projectFolderUrl": str(row[col_idx.get("项目飞书文件夹链接", 7)] or "").strip(),
            "materials": [],
            "relatedMethods": split_cell(row[col_idx.get("关联实验方法ID", 19)]),
            "relatedSamples": split_cell(row[col_idx.get("关联样品ID", 20)]),
            "relatedDatasets": split_cell(row[col_idx.get("关联数据ID", 21)]),
            "relatedExpenses": split_cell(row[col_idx.get("关联报账ID", 22)]),
            "relatedAchievements": split_cell(row[col_idx.get("关联成果ID", 23)]),
        }
        if not p["shortName"]:
            p.pop("shortName")
        # 空数组/null 统一为空数组
        for k in ["relatedMethods", "relatedSamples", "relatedDatasets", "relatedExpenses", "relatedAchievements"]:
            if p[k] is None:
                p[k] = []
        projects.append(p)

    # 读取项目资料 sheet
    if "项目资料" in wb.sheetnames:
        ws2 = wb["项目资料"]
        headers2 = [cell.value for cell in ws2[3]]
        col_idx2 = {h: i for i, h in enumerate(headers2) if h}

        for row in ws2.iter_rows(min_row=5, values_only=True):
            if not row or not row[0]:
                continue
            pid = str(row[0]).strip()
            if not pid:
                continue

            pinned_val2 = str(row[col_idx2.get("是否必读", 8)] or "").strip()
            item = {
                "name": str(row[col_idx2.get("资料名称", 1)] or "").strip(),
                "category": normalize_category(row[col_idx2.get("类别", 2)]),
                "type": str(row[col_idx2.get("类型", 3)] or "").strip() or "—",
                "date": str(row[col_idx2.get("日期", 4)] or "").strip(),
                "uploader": str(row[col_idx2.get("上传人", 5)] or "").strip() or "—",
                "url": str(row[col_idx2.get("链接", 6)] or "").strip(),
                "note": str(row[col_idx2.get("备注", 7)] or "").strip(),
                "pinned": pinned_val2 in ("是", "true", "True", "TRUE", "1"),
            }
            if not item["name"]:
                continue

            proj = next((p for p in projects if p["id"] == pid), None)
            if proj:
                proj["materials"].append(item)

    return projects


def write_projects_js(projects):
    header = """/* projects.js —— 项目数据
 * 字段说明见 README「数据模型设计」，所有 id 必须唯一。
 * 关联字段（relatedMethods / relatedSamples 等）填的是对应数据的 id。
 * 本文件由 build_projects.py 从「信息收集模板/01-项目信息表.xlsx」自动生成，
 * 也可手动在数组中追加项目对象。
 *
 * 项目资料（materials）说明：
 * - 每项必须包含 category 字段，取值来自 config.js 的 PROJECT_ARCHIVE_CATEGORIES：
 *   proposal(申报立项) / annual(年度报告) / midterm(中期考核) / final(结题验收)
 *   / report(技术/进展报告) / finance(经费财务) / experiment(实验资料)
 * - 若缺少 category 或 category 无法识别，页面会自动归到「实验资料」。
 * - 真实项目资料链接建议维护在 project-materials.js 的 projectMaterialOverrides 中，
 *   方便管理员统一更新，而不用每次重写 projects.js。
 */
window.DATA = window.DATA || {};
window.DATA.projects = """

    footer = """;
"""

    # 保留 PROJECT_ARCHIVE_CATEGORIES 顺序，使 materials 在 JSON 中看起来有序
    content = json.dumps(projects, ensure_ascii=False, indent=2)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + content + footer)
    print("已生成:", OUT)


def validate(projects):
    errors = []
    seen_ids = set()
    valid_status = {"准备中", "进行中", "暂停", "结题中", "已结题"}
    valid_categories = set(CATEGORY_MAP.keys()) | {"proposal", "annual", "midterm", "final", "report", "finance", "experiment"}

    for p in projects:
        pid = p.get("id", "")
        if not pid:
            errors.append("发现空项目编号")
            continue
        if pid in seen_ids:
            errors.append(f"重复项目编号: {pid}")
        seen_ids.add(pid)

        for field in ("name", "leader", "status"):
            if not p.get(field):
                errors.append(f"{pid}: 必填字段「{field}」为空")

        if p.get("status") and p["status"] not in valid_status:
            errors.append(f"{pid}: 未知状态「{p['status']}」，可选：准备中/进行中/暂停/结题中/已结题")

        for m in p.get("materials", []):
            cat = m.get("category", "")
            if cat not in valid_categories:
                errors.append(f"{pid}: 资料「{m.get('name', '')}」的类别「{cat}」无法识别，已归到「实验资料」")

    return errors


def main():
    projects = load_projects()
    errors = validate(projects)

    print(f"解析到项目数: {len(projects)}")
    total_mats = sum(len(p["materials"]) for p in projects)
    print(f"解析到项目资料数: {total_mats}")
    print("\n项目清单:")
    for p in projects:
        short = p.get("shortName", "")
        pinned = "必读" if p.get("pinned") else ""
        print(f"  {p['id']}: {p['name'][:30]}{'...' if len(p['name'])>30 else ''} | 资料={len(p['materials'])} {pinned} {short}")

    if errors:
        print("\n校验问题:")
        for e in errors:
            print(f"  ⚠ {e}")
    else:
        print("\n校验通过，无重复 id、无缺失必填字段")

    if "--check" in sys.argv:
        print("\n--check 模式：不写入文件")
        return

    write_projects_js(projects)


if __name__ == "__main__":
    main()
