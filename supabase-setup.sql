-- ============================================================
-- 课题组管理平台 · Supabase 建表脚本
-- ------------------------------------------------------------
-- 用法：Supabase 项目 → SQL Editor → 新建查询 → 整段粘贴 → Run
-- 执行一次即可。重复执行不会报错（都用了 IF NOT EXISTS / OR REPLACE）。
--
-- 网站全部 13 个动态栏目的数据表：组会、计划、报账、仪器耗材、数据、项目、
-- 实验方法、样品、提醒、学生培养、成员、成果、学习资源。保存后全组实时可见。
-- 整段可重复执行（幂等）：已存在的表/策略会先删后建，不会动数据行。
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

-- ============================================================
-- 【第二轮新增】项目 / 实验方法 / 样品 三张云端表（全站实时化）
-- ------------------------------------------------------------
-- 设计说明：这三类数据字段多且含嵌套（数组、对象），因此采用
--   「常用标量列（方便在表格编辑器里看） + data jsonb（完整数据快照）」
-- 的存法。网站读取时自动把 data 展开成完整对象，页面代码无需感知。
-- 重复执行不会报错。
-- ============================================================

-- ---------- 6. 项目 ----------
create table if not exists public.lab_projects (
  id           text primary key,
  name         text,
  "shortName"  text,
  leader       text,
  source       text,
  code         text,
  "fiscalCode" text,
  start        text,
  "end"        text,
  budget       text,
  status       text,
  stage        text,
  progress     numeric,
  pinned       boolean default false,
  members      jsonb default '[]'::jsonb,
  data         jsonb default '{}'::jsonb,
  updated_at   timestamptz default now()
);

-- ---------- 7. 实验方法 / SOP ----------
create table if not exists public.lab_methods (
  id         text primary key,
  name       text,
  category   text,
  author     text,
  version    text,
  updated    text,
  "sopUrl"   text,
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- 8. 样品 ----------
create table if not exists public.lab_samples (
  id       text primary key,
  name     text,
  type     text,
  project  text,
  owner    text,
  location text,
  remain   numeric,
  total    numeric,
  unit     text,
  status   text,
  data     jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- 新表同样开启行级安全并放行组内读写 ----------
alter table public.lab_projects enable row level security;
alter table public.lab_methods  enable row level security;
alter table public.lab_samples  enable row level security;

drop policy if exists "lab_projects_read"   on public.lab_projects;
drop policy if exists "lab_projects_insert" on public.lab_projects;
drop policy if exists "lab_projects_update" on public.lab_projects;
drop policy if exists "lab_projects_delete" on public.lab_projects;

create policy "lab_projects_read"   on public.lab_projects for select using (true);
create policy "lab_projects_insert" on public.lab_projects for insert with check (true);
create policy "lab_projects_update" on public.lab_projects for update using (true);
create policy "lab_projects_delete" on public.lab_projects for delete using (true);

drop policy if exists "lab_methods_read"   on public.lab_methods;
drop policy if exists "lab_methods_insert" on public.lab_methods;
drop policy if exists "lab_methods_update" on public.lab_methods;
drop policy if exists "lab_methods_delete" on public.lab_methods;

create policy "lab_methods_read"   on public.lab_methods for select using (true);
create policy "lab_methods_insert" on public.lab_methods for insert with check (true);
create policy "lab_methods_update" on public.lab_methods for update using (true);
create policy "lab_methods_delete" on public.lab_methods for delete using (true);

drop policy if exists "lab_samples_read"   on public.lab_samples;
drop policy if exists "lab_samples_insert" on public.lab_samples;
drop policy if exists "lab_samples_update" on public.lab_samples;
drop policy if exists "lab_samples_delete" on public.lab_samples;

create policy "lab_samples_read"   on public.lab_samples for select using (true);
create policy "lab_samples_insert" on public.lab_samples for insert with check (true);
create policy "lab_samples_update" on public.lab_samples for update using (true);
create policy "lab_samples_delete" on public.lab_samples for delete using (true);

-- ---------- 9. 首页提醒（手动添加的部分） ----------
create table if not exists public.lab_reminders (
  id         text primary key,
  title      text,
  date       text,
  note       text,
  link       text,
  source     text default 'manual',
  updated_at timestamptz default now()
);

alter table public.lab_reminders enable row level security;

drop policy if exists "lab_reminders_read"   on public.lab_reminders;
drop policy if exists "lab_reminders_insert" on public.lab_reminders;
drop policy if exists "lab_reminders_update" on public.lab_reminders;
drop policy if exists "lab_reminders_delete" on public.lab_reminders;

create policy "lab_reminders_read"   on public.lab_reminders for select using (true);
create policy "lab_reminders_insert" on public.lab_reminders for insert with check (true);
create policy "lab_reminders_update" on public.lab_reminders for update using (true);
create policy "lab_reminders_delete" on public.lab_reminders for delete using (true);

-- ---------- 10. 学生培养（阶段状态与培养材料，全组实时共享） ----------
create table if not exists public.lab_students (
  id       text primary key,
  name     text,
  type     text,
  tutor    text,
  enroll   text,
  data     jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.lab_students enable row level security;

drop policy if exists "lab_students_read"   on public.lab_students;
drop policy if exists "lab_students_insert" on public.lab_students;
drop policy if exists "lab_students_update" on public.lab_students;
drop policy if exists "lab_students_delete" on public.lab_students;

create policy "lab_students_read"   on public.lab_students for select using (true);
create policy "lab_students_insert" on public.lab_students for insert with check (true);
create policy "lab_students_update" on public.lab_students for update using (true);
create policy "lab_students_delete" on public.lab_students for delete using (true);

-- ---------- 11. 组内成员（名片信息，全组实时共享） ----------
create table if not exists public.lab_members (
  id         text primary key,
  name       text,
  role       text,
  status     text,
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.lab_members enable row level security;

drop policy if exists "lab_members_read"   on public.lab_members;
drop policy if exists "lab_members_insert" on public.lab_members;
drop policy if exists "lab_members_update" on public.lab_members;
drop policy if exists "lab_members_delete" on public.lab_members;

create policy "lab_members_read"   on public.lab_members for select using (true);
create policy "lab_members_insert" on public.lab_members for insert with check (true);
create policy "lab_members_update" on public.lab_members for update using (true);
create policy "lab_members_delete" on public.lab_members for delete using (true);

-- ---------- 12. 研究成果（论文/获奖/专利等，全组实时共享） ----------
create table if not exists public.lab_achievements (
  id         text primary key,
  title      text,
  type       text,
  year       text,
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.lab_achievements enable row level security;

drop policy if exists "lab_achievements_read"   on public.lab_achievements;
drop policy if exists "lab_achievements_insert" on public.lab_achievements;
drop policy if exists "lab_achievements_update" on public.lab_achievements;
drop policy if exists "lab_achievements_delete" on public.lab_achievements;

create policy "lab_achievements_read"   on public.lab_achievements for select using (true);
create policy "lab_achievements_insert" on public.lab_achievements for insert with check (true);
create policy "lab_achievements_update" on public.lab_achievements for update using (true);
create policy "lab_achievements_delete" on public.lab_achievements for delete using (true);

-- ---------- 13. 学习资源（全组实时共享） ----------
create table if not exists public.lab_resources (
  id         text primary key,
  title      text,
  category   text,
  data       jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.lab_resources enable row level security;

drop policy if exists "lab_resources_read"   on public.lab_resources;
drop policy if exists "lab_resources_insert" on public.lab_resources;
drop policy if exists "lab_resources_update" on public.lab_resources;
drop policy if exists "lab_resources_delete" on public.lab_resources;

create policy "lab_resources_read"   on public.lab_resources for select using (true);
create policy "lab_resources_insert" on public.lab_resources for insert with check (true);
create policy "lab_resources_update" on public.lab_resources for update using (true);
create policy "lab_resources_delete" on public.lab_resources for delete using (true);
