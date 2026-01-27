# 資料庫設定指南

本指南說明如何設定 NeonDB 作為專案的 PostgreSQL 資料庫。

## 選擇 NeonDB 的原因

| 項目 | NeonDB | Supabase |
|------|--------|----------|
| 免費額度 | 512MB + 無限制專案 | 500MB + 2 個專案 |
| 設定難度 | 簡單 (專注資料庫) | 中等 (包含 Auth 等功能) |
| 連線速度 | 快速 | 快速 |
| Serverless | ✅ | ✅ |

## Step 1: 建立 NeonDB 帳號

1. 前往 [NeonDB](https://neon.tech)
2. 點擊「Sign Up」使用 GitHub 或 Email 註冊
3. 註冊完成後會自動建立一個專案

## Step 2: 建立資料庫

1. 在 NeonDB Dashboard，點擊「Create a New Project」
2. 填寫資訊：
   - **Project name**: `bni-course-system`
   - **Postgres version**: 選擇最新版本（如 16）
   - **Region**: 選擇 `Asia Pacific (Singapore)` 最接近台灣
3. 點擊「Create Project」

## Step 3: 取得連線字串

1. 專案建立後，在 Dashboard 可以看到「Connection Details」
2. 複製 **Connection string** (格式如下)：

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

例如：
```
postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## Step 4: 更新 .env 檔案

打開專案根目錄的 `.env` 檔案，將 `DATABASE_URL` 替換為你的連線字串：

```env
# 資料庫連線 - NeonDB
DATABASE_URL="postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="UcaBR0O/FZ21ZfdB4iT98V1jASsP+S4KJ52Qft68z4g="

# LINE Login（之後再設定）
LINE_CLIENT_ID="your-line-channel-id"
LINE_CLIENT_SECRET="your-line-channel-secret"
```

## Step 5: 初始化資料庫

在終端機執行以下命令：

```bash
# 1. 推送 Schema 到資料庫
npm run db:push

# 2. 執行種子資料（建立分會、課程、管理員）
npm run db:seed
```

成功後會看到：
```
✓ 建立 12 個分會
✓ 建立 9 個課程類型
✓ 建立管理員帳號：ai@autolab.cloud
✓ 建立 78 個課程

📊 2026 年新北市西B區華字輩培訓計劃表
--------------------------------------------------
MSP 成功會員培訓:     10 場
1對1工作坊:           6 場
引薦工作坊:           6 場
PT工作坊:             6 場
簡報工作坊:           6 場
組聚培訓:            24 場
LTnA 八大會議:        8 場
領導團隊培訓:         4 場
DnA 實體聚會:         8 場
--------------------------------------------------
總計:                78 場

👤 管理員帳號: ai@autolab.cloud
```

## Step 6: 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往：
- 前台：http://localhost:3000
- 後台：http://localhost:3000/admin

## 驗證資料庫

可以使用 Prisma Studio 查看資料庫內容：

```bash
npm run db:studio
```

會自動開啟瀏覽器，可以看到所有資料表和資料。

---

## 常見問題

### Q: 出現「Cannot find module '@prisma/client'」錯誤

執行：
```bash
npx prisma generate
```

### Q: 出現「P1001: Can't reach database server」錯誤

1. 確認 DATABASE_URL 正確
2. 確認 NeonDB 專案沒有被暫停（免費版會自動休眠）
3. 在 NeonDB Dashboard 點擊「Wake」喚醒資料庫

### Q: 想重設資料庫

```bash
# 清空資料庫並重新建立
npx prisma db push --force-reset

# 重新執行種子資料
npm run db:seed
```

---

## 下一步

資料庫設定完成後，你可以：
1. 設定 LINE Login（參考 `docs/LINE_LOGIN_SETUP.md`）
2. 部署到 Vercel
3. 開始新增會員和測試報名功能
