组会分组管理功能修改说明

需要替换网站中的两个文件：

1. pages/meetings.html
2. assets/js/backend.js

新增功能：
- 组会页面增加“组会分组管理”
- 每组必须指定 1 名在籍在校博士生
- 每组至少选择 1 名在籍在校硕士生
- 支持新增、编辑、删除分组
- 同一成员默认不能重复加入多个组
- 数据保存在现有 Supabase lab_notices 表中，固定记录 ID：meeting-groups
- 不需要新增数据库表
- 云端模式下保存后全组可见
- backend.js 补齐 notices 本地回退键

部署：
把这两个文件上传并覆盖服务器上的同路径文件，然后浏览器 Ctrl+F5 强制刷新。
