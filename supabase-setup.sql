-- ============================================================
-- 课题组管理平台 · Supabase 建表脚本
-- ------------------------------------------------------------
-- 用法：Supabase 项目 → SQL Editor → 新建查询 → 整段粘贴 → Run
-- 执行一次即可。重复执行不会报错（都用了 IF NOT EXISTS / OR REPLACE）。
--
-- 表结构对应网站的五个"高频栏目"，保存后全组立即可见。
-- 低频栏目（项目、成果、成员）仍走 GitHub Issue 发布流程。
-- ============================================================

-- ---------- 1. 组会通知 ----------
create table if not exists public.lab_meetings (
  id           text primary key,
  date         text,
  time         text,
  place        text,
  reporter     text,
  topic        text,
  "pptUrl"     text,
  "docUrl"     text,
  "publishDate" text,
  publisher    text,
  updated_at   timestamptz default now()
);

-- ---------- 2. 成员月度计划 ----------
create table if not exists public.lab_plans (
  id            text primary key,
  name          text,
  month         text,
  content       text,
  status        text default 'draft',
  "finalAt"     text,
  revising      boolean default false,
  "reviseReason" text,
  "revisedAt"   text,
  done          text,
  "doneNote"    text,
  "doneBy"      text,
  "doneAt"      text,
  updated_at    timestamptz default now()
);

-- ---------- 3. 经费支出登记 ----------
create table if not exists public.lab_expenses (
  id           text primary key,
  "projectId"  text,
  date         text,
  cat          text,
  item         text,
  amount       numeric,
  person       text,
  receipt      text,
  note         text,
  updated_at   timestamptz default now()
);

-- ---------- 4. 仪器设备与耗材 ----------
create table if not exists public.lab_equipment (
  id             text primary key,
  category       text,
  name           text,
  model          text,
  brand          text,
  qty            numeric,
  unit           text,
  location       text,
  keeper         text,
  "purchaseDate" text,
  price          numeric,
  status         text,
  url            text,
  note           text,
  updated_at     timestamptz default now()
);

-- ---------- 5. 数据文件夹登记 ----------
create table if not exists public.lab_datasets (
  id         text primary key,
  site       text,
  uploader   text,
  date       text,
  url        text,
  note       text,
  updated_at timestamptz default now()
);

-- ============================================================
-- 行级安全策略（RLS）
-- ------------------------------------------------------------
-- 说明：本网站是"组内轻量平台"，匿名密钥（anon key）就公开在网页里，
-- 因此这里开放"匿名可读写"。它挡不住有心人，适合"非本组人别乱改"的场景。
-- 若需要更严的权限（例如只允许组员邮箱登录后才能写），
-- 可在 Supabase 里开启 Auth 并把下面的 anon 策略改为 authenticated。
-- ============================================================

alter table public.lab_meetings  enable row level security;
alter table public.lab_plans     enable row level security;
alter table public.lab_expenses  enable row level security;
alter table public.lab_equipment enable row level security;
alter table public.lab_datasets  enable row level security;

-- 允许匿名读取（网站展示用）
drop policy if exists "lab_meetings_read"  on public.lab_meetings;
drop policy if exists "lab_plans_read"     on public.lab_plans;
drop policy if exists "lab_expenses_read"  on public.lab_expenses;
drop policy if exists "lab_equipment_read" on public.lab_equipment;
drop policy if exists "lab_datasets_read"  on public.lab_datasets;

create policy "lab_meetings_read"  on public.lab_meetings  for select using (true);
create policy "lab_plans_read"     on public.lab_plans     for select using (true);
create policy "lab_expenses_read"  on public.lab_expenses  for select using (true);
create policy "lab_equipment_read" on public.lab_equipment for select using (true);
create policy "lab_datasets_read"  on public.lab_datasets  for select using (true);

-- 允许匿名写入（组员在网页上保存用）
drop policy if exists "lab_meetings_write"  on public.lab_meetings;
drop policy if exists "lab_plans_write"     on public.lab_plans;
drop policy if exists "lab_expenses_write"  on public.lab_expenses;
drop policy if exists "lab_equipment_write" on public.lab_equipment;
drop policy if exists "lab_datasets_write"  on public.lab_datasets;

create policy "lab_meetings_write"  on public.lab_meetings  for insert with check (true);
create policy "lab_plans_write"     on public.lab_plans     for insert with check (true);
create policy "lab_expenses_write"  on public.lab_expenses  for insert with check (true);
create policy "lab_equipment_write" on public.lab_equipment for insert with check (true);
create policy "lab_datasets_write"  on public.lab_datasets  for insert with check (true);

-- 允许匿名更新（编辑已有记录）
drop policy if exists "lab_meetings_update"  on public.lab_meetings;
drop policy if exists "lab_plans_update"     on public.lab_plans;
drop policy if exists "lab_expenses_update"  on public.lab_expenses;
drop policy if exists "lab_equipment_update" on public.lab_equipment;
drop policy if exists "lab_datasets_update"  on public.lab_datasets;

create policy "lab_meetings_update"  on public.lab_meetings  for update using (true);
create policy "lab_plans_update"     on public.lab_plans     for update using (true);
create policy "lab_expenses_update"  on public.lab_expenses  for update using (true);
create policy "lab_equipment_update" on public.lab_equipment for update using (true);
create policy "lab_datasets_update"  on public.lab_datasets  for update using (true);

-- 允许匿名删除（在网页上删除记录）
drop policy if exists "lab_meetings_delete"  on public.lab_meetings;
drop policy if exists "lab_plans_delete"     on public.lab_plans;
drop policy if exists "lab_expenses_delete"  on public.lab_expenses;
drop policy if exists "lab_equipment_delete" on public.lab_equipment;
drop policy if exists "lab_datasets_delete"  on public.lab_datasets;

create policy "lab_meetings_delete"  on public.lab_meetings  for delete using (true);
create policy "lab_plans_delete"     on public.lab_plans     for delete using (true);
create policy "lab_expenses_delete"  on public.lab_expenses  for delete using (true);
create policy "lab_equipment_delete" on public.lab_equipment for delete using (true);
create policy "lab_datasets_delete"  on public.lab_datasets  for delete using (true);

-- ---------- 完成 ----------
-- 执行完上面的语句后，回到 Project Settings → API，
-- 复制 Project URL 与 anon public key，填进 assets/js/config.js 即可。
