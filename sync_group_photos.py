#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_group_photos.py —— 把飞书云盘文件夹里的合照同步到网站首页轮播

作用
    读取飞书云盘某个文件夹里的图片 → 下载到 assets/images/group/ →
    生成首页读取的照片清单 assets/data/group-photos.json。
    配好 GitHub Actions 后每天自动跑一次：以后你只管往飞书文件夹里丢照片，
    首页轮播第二天就会自动出现新照片，不用再碰 GitHub 和代码。

用法
    # 1) 先试跑（只打印将要做的事，不写任何文件）
    export FEISHU_APP_ID="cli_xxxxxxxx"
    export FEISHU_APP_SECRET="xxxxxxxx"
    export FEISHU_FOLDER_TOKEN="fldcnxxxxxxxx"     # 云盘文件夹链接最后一段
    python3 sync_group_photos.py --dry-run

    # 2) 确认无误后真正同步
    python3 sync_group_photos.py

    # 3) 挂 GitHub Actions 每天自动跑：见 .github/workflows/sync-group-photos.yml

配置一次即可的三件事
    ① 飞书开放平台（open.feishu.cn）创建「企业自建应用」，开通云盘权限：
       drive:file、drive:file:readonly（权限通过后记得发布版本、申请线上生效）
    ② 在飞书云盘把目标文件夹「… → 添加协作者」，把刚建的应用加进去
       （不加的话应用读不到这个文件夹里的文件）
    ③ GitHub 仓库 Settings → Secrets and variables → Actions → New repository secret，
       添加 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_FOLDER_TOKEN 三个值

注意
    - 飞书个人版（my.feishu.cn）无法创建自建应用，需要用学校/单位的飞书企业版。
    - 一旦启用本同步，飞书文件夹就是首页照片的唯一来源；
      原来的照片（如 photo-1.jpg）请也上传到该文件夹，说明文字自动取图片文件名。
    - 本脚本未含任何密钥，密钥只从环境变量读取，切勿写进代码或提交到仓库。
"""

import os
import re
import sys
import json
import time
import argparse
import mimetypes

import requests

# ---------- 可按需调整的默认值 ----------
OUT_DIR = "assets/images/group"          # 图片保存目录
MANIFEST = "assets/data/group-photos.json"  # 首页读取的照片清单
FILE_PREFIX = "gp-"                      # 同步下来的图片文件名前缀（便于识别与清理）
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"}
MAX_WIDTH = 1600                         # 超过此宽度自动压缩，避免仓库过大
JPEG_QUALITY = 85
API_BASE = "https://open.feishu.cn/open-apis"


def env(name):
    v = os.environ.get(name, "").strip()
    if not v:
        sys.exit(f"缺少环境变量 {name}（本地跑请先 export；GitHub Actions 请在仓库 Secrets 里配置）")
    return v


def tenant_token(app_id, app_secret):
    """换取 tenant_access_token（应用级令牌，切勿泄露）"""
    r = requests.post(f"{API_BASE}/auth/v3/tenant_access_token/internal",
                      json={"app_id": app_id, "app_secret": app_secret}, timeout=20)
    r.raise_for_status()
    d = r.json()
    if d.get("code") != 0:
        sys.exit(f"获取令牌失败：code={d.get('code')} msg={d.get('msg')}\n"
                 f"  → 常见原因：凭据填错、应用未启用、或权限版本未发布")
    return d["tenant_access_token"]


def list_images(token, folder_token):
    """列出文件夹里所有图片文件（分页拉取）"""
    headers = {"Authorization": "Bearer " + token}
    out, page_token = [], None
    while True:
        params = {"folder_token": folder_token, "page_size": 200}
        if page_token:
            params["page_token"] = page_token
        r = requests.get(f"{API_BASE}/drive/v1/files", headers=headers, params=params, timeout=30)
        r.raise_for_status()
        d = r.json()
        if d.get("code") != 0:
            sys.exit(f"读取文件夹失败：code={d.get('code')} msg={d.get('msg')}\n"
                     f"  → 常见原因：文件夹未把应用加为协作者，或 folder_token 不对")
        data = d.get("data", {}) or {}
        for f in data.get("files", []) or []:
            name = f.get("name", "")
            ext = os.path.splitext(name)[1].lower()
            # type 为 file 且扩展名是图片；飞书文档/表格等会被自动跳过
            if ext in IMG_EXT:
                out.append({"token": f.get("token"), "name": name, "ext": ext})
        if data.get("has_more") and data.get("next_page_token"):
            page_token = data["next_page_token"]
        else:
            break
    return out


def download(token, file_token):
    """下载文件二进制内容"""
    headers = {"Authorization": "Bearer " + token}
    r = requests.get(f"{API_BASE}/drive/v1/files/{file_token}/download",
                     headers=headers, timeout=120)
    r.raise_for_status()
    # 若返回的是 JSON 说明调用失败（该接口成功时直接返回二进制）
    ctype = r.headers.get("Content-Type", "")
    if "application/json" in ctype:
        try:
            d = r.json()
            sys.exit(f"下载文件失败：code={d.get('code')} msg={d.get('msg')}")
        except Exception:
            pass
    return r.content


def save_image(raw, path):
    """保存并按需压缩（有 Pillow 时压缩，无则原样保存）"""
    try:
        from PIL import Image
        import io
        img = Image.open(io.BytesIO(raw))
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        if img.width > MAX_WIDTH:
            h = int(img.height * MAX_WIDTH / img.width)
            img = img.resize((MAX_WIDTH, h), Image.LANCZOS)
        img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)
        return True
    except Exception as e:      # 没有 Pillow 或不是标准图片：原样落盘
        print(f"  （未压缩，原因：{e}）")
        with open(path, "wb") as f:
            f.write(raw)
        return False


def main():
    ap = argparse.ArgumentParser(description="同步飞书云盘合照到网站首页轮播")
    ap.add_argument("--dry-run", action="store_true", help="只打印计划，不写文件")
    ap.add_argument("--prune", action="store_true",
                    help=f"删除本地已不在飞书文件夹里的 {FILE_PREFIX}*.jpg（默认保留）")
    args = ap.parse_args()

    app_id, app_secret = env("FEISHU_APP_ID"), env("FEISHU_APP_SECRET")
    folder_token = env("FEISHU_FOLDER_TOKEN")

    print("① 登录飞书开放平台…")
    token = tenant_token(app_id, app_secret)

    print("② 读取云盘文件夹里的图片…")
    files = list_images(token, folder_token)
    print(f"   找到 {len(files)} 张图片")
    if not files:
        print("   没有图片，结束（不会覆盖已有清单）。"
              "若文件夹里确实有图，多半是没把应用加为该文件夹的协作者。")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)

    stamp = time.strftime("%Y%m%d%H%M")
    photos, kept = [], set()
    for f in files:
        name = f["name"]
        ext = ".jpg"                                  # 统一存为 jpg，路径最稳
        fname = f"{FILE_PREFIX}{f['token'][:10]}{ext}"
        rel = f"{OUT_DIR}/{fname}".replace("\\", "/")
        caption = os.path.splitext(name)[0]           # 说明文字 = 图片文件名
        print(f"   - {name} → {rel}")
        if not args.dry_run:
            raw = download(token, f["token"])
            save_image(raw, os.path.join(OUT_DIR, fname))
        kept.add(fname)
        photos.append({"src": rel, "caption": caption, "v": stamp})

    photos.sort(key=lambda p: p["caption"])

    # 清理本地已删除的照片
    if args.prune and not args.dry_run:
        for fn in os.listdir(OUT_DIR):
            if fn.startswith(FILE_PREFIX) and fn not in kept:
                os.remove(os.path.join(OUT_DIR, fn))
                print(f"   已清理：{fn}")

    manifest = {"updated": time.strftime("%Y-%m-%d %H:%M:%S"),
                "source": "feishu-drive", "photos": photos}
    print("③ 生成照片清单：" + MANIFEST)
    if args.dry_run:
        print(json.dumps(manifest, ensure_ascii=False, indent=2))
        print("\n（--dry-run 试跑结束，未写入任何文件）")
        return
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"完成：{len(photos)} 张照片已同步。提交推送后首页轮播即会更新。")


if __name__ == "__main__":
    main()
