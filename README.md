# BNI 新北市西B區 課程報名系統

一站式課程報名平台，取代 Google 表單，提供會員友善的課程搜尋與報名體驗。

## 功能特色

### 前台功能
- **一鍵報名** - 登入後不需重複填寫資料，點一下就完成報名
- **課程搜尋** - 依類型、日期快速篩選課程
- **報名管理** - 查看自己的報名紀錄，輕鬆取消報名
- **LINE 登入** - 使用 LINE 帳號快速登入

### 後台功能 (管理員)
- **儀表板** - 總覽統計數據、最近報名記錄
- **課程管理** - 新增、編輯、刪除課程，查看報名名單
- **會員管理** - 新增、編輯會員，設定權限
- **分會管理** - 管理各分會資料
- **統計報表** - 各分會參與率、課程類型統計

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **資料庫**: PostgreSQL + Prisma ORM
- **認證**: NextAuth.js (LINE Login)
- **UI**: Tailwind CSS + shadcn/ui
- **部署**: Vercel + Supabase/NeonDB

## 快速開始

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`，並填入實際的設定值：

```bash
cp .env.example .env
```

必要的環境變數：
- `DATABASE_URL` - PostgreSQL 資料庫連線字串
- `NEXTAUTH_URL` - 應用程式 URL
- `NEXTAUTH_SECRET` - NextAuth 加密金鑰
- `LINE_CLIENT_ID` - LINE Login Channel ID
- `LINE_CLIENT_SECRET` - LINE Login Channel Secret

### 3. 初始化資料庫

```bash
# 推送 Schema 到資料庫
npm run db:push

# 執行種子資料 (建立分會、課程類型、管理員帳號)
npm run db:seed
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 管理員帳號

執行種子資料後，可使用以下帳號登入：

| 角色 | Email | 說明 |
|------|-------|------|
| 管理員 | ai@autolab.cloud | 可管理所有課程和會員 |

登入方式：在登入頁面輸入 Email 即可（開發模式）

## 專案結構

```
bni-course-system/
├── prisma/
│   ├── schema.prisma         # 資料庫 Schema
│   └── seed.ts               # 種子資料
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx      # 首頁
│   │   │   ├── courses/      # 課程列表、詳情
│   │   │   └── login/        # 登入頁面
│   │   ├── my/               # 我的報名
│   │   ├── admin/            # 後台管理
│   │   │   ├── page.tsx      # 儀表板
│   │   │   ├── courses/      # 課程管理
│   │   │   ├── members/      # 會員管理
│   │   │   ├── chapters/     # 分會管理
│   │   │   └── stats/        # 統計報表
│   │   └── api/              # API Routes
│   │       ├── auth/         # 認證 API
│   │       ├── courses/      # 課程 API
│   │       ├── members/      # 會員 API
│   │       ├── chapters/     # 分會 API
│   │       └── registrations/ # 報名 API
│   ├── components/
│   │   ├── ui/               # shadcn/ui 元件
│   │   ├── courses/          # 課程元件
│   │   ├── layout/           # 版面元件
│   │   └── registrations/    # 報名元件
│   ├── lib/
│   │   ├── prisma.ts         # Prisma Client
│   │   ├── auth.ts           # NextAuth 設定
│   │   └── utils.ts          # 共用工具
│   └── types/                # TypeScript 型別
└── public/                   # 靜態檔案
```

## API 端點

### 課程
- `GET /api/courses` - 取得課程列表
- `POST /api/courses` - 新增課程 (Admin)
- `GET /api/courses/[id]` - 取得課程詳情
- `PATCH /api/courses/[id]` - 更新課程 (Admin)
- `DELETE /api/courses/[id]` - 刪除課程 (Admin)

### 報名
- `GET /api/registrations` - 取得我的報名
- `POST /api/registrations` - 報名課程
- `DELETE /api/registrations?id=xxx` - 取消報名

### 會員
- `GET /api/members` - 取得會員列表 (Admin)
- `POST /api/members` - 新增會員 (Admin)
- `GET /api/members/[id]` - 取得會員詳情 (Admin)
- `PATCH /api/members/[id]` - 更新會員 (Admin)

### 分會
- `GET /api/chapters` - 取得分會列表
- `POST /api/chapters` - 新增分會 (Admin)

## 常用命令

```bash
# 開發
npm run dev         # 啟動開發伺服器

# 資料庫
npm run db:push     # 推送 Schema 到資料庫
npm run db:migrate  # 執行資料庫遷移
npm run db:studio   # 開啟 Prisma Studio
npm run db:seed     # 執行種子資料

# 建置
npm run build       # 建置生產版本
npm run start       # 啟動生產伺服器

# 程式碼品質
npm run lint        # 執行 ESLint
```

## 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署完成！

### 資料庫設定 (Supabase)

1. 建立 Supabase 專案
2. 在 Settings > Database 取得連線字串
3. 設定 `DATABASE_URL` 環境變數
4. 執行 `npm run db:push` 同步 Schema
5. 執行 `npm run db:seed` 建立初始資料

## 授權

MIT License
