import { PrismaClient, CourseStatus, Role } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import * as dotenv from "dotenv"

// 載入環境變數
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("開始建立種子資料...")

  // 建立分會（華字輩 20 個分會）
  const chapters = [
    { name: "華one", displayName: "華one分會" },
    { name: "華冠", displayName: "華冠分會" },
    { name: "華創育", displayName: "華創育分會" },
    { name: "華地產", displayName: "華地產分會" },
    { name: "華橋", displayName: "華橋分會" },
    { name: "華聯", displayName: "華聯分會" },
    { name: "華路", displayName: "華路分會" },
    { name: "華旅", displayName: "華旅分會" },
    { name: "華綠", displayName: "華綠分會" },
    { name: "華軍", displayName: "華軍分會" },
    { name: "華豐", displayName: "華豐分會" },
    { name: "華榮", displayName: "華榮分會" },
    { name: "華網", displayName: "華網分會" },
    { name: "華心", displayName: "華心分會" },
    { name: "華醫", displayName: "華醫分會" },
    { name: "華億", displayName: "華億分會" },
    { name: "華餐飲", displayName: "華餐飲分會" },
    { name: "華泰", displayName: "華泰分會" },
    { name: "華資", displayName: "華資分會" },
    { name: "華晁", displayName: "華晁分會" },
  ]

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { name: chapter.name },
      update: {},
      create: {
        ...chapter,
        region: "新北市西B區 Xinbei City West B",
      },
    })
  }
  console.log(`✓ 建立 ${chapters.length} 個分會`)

  // 建立課程類型
  const courseTypes = [
    {
      code: "MSP",
      name: "成功會員培訓",
      description: "MSP 成功會員培訓，適合所有會員參加",
      longDescription: "MSP（Member Success Program）成功會員培訓是 BNI 最核心的會員教育課程。透過系統化的培訓內容，幫助會員深入了解 BNI 的引薦行銷方法論，掌握建立信任、創造引薦的關鍵技巧。無論您是新加入的會員還是資深成員，MSP 都能幫助您重新檢視並提升引薦能力，讓您在 BNI 的參與更加有效、更有收穫。",
      pricingInfo: "線上課程，免費",
      color: "#3B82F6", // 藍色
    },
    {
      code: "1ON1",
      name: "1對1工作坊",
      description: "學習如何進行有效的 1對1 會議",
      longDescription: "1對1 工作坊專注於提升會員之間一對一深度交流的能力。在 BNI 中，1對1 是建立互信關係的基礎，也是產生高品質引薦的關鍵。本工作坊將教授如何有效規劃 1對1 會議、如何深入了解彼此的業務需求、如何在會後持續跟進，讓每一次 1對1 都能創造最大價值。",
      pricingInfo: "實體 600 元｜線上第一次免費，之後 400 元",
      color: "#8B5CF6", // 紫色
    },
    {
      code: "REFERRAL",
      name: "引薦工作坊",
      description: "提升引薦技巧與策略",
      longDescription: "引薦工作坊是提升引薦質量與數量的實戰培訓。透過深入理解引薦的本質，學習如何辨識引薦機會、如何精準傳達夥伴的價值主張、如何建立系統化的引薦流程。本課程結合大量實例演練，幫助您從「偶爾給出引薦」進化為「持續創造高品質引薦」的引薦高手。",
      pricingInfo: "實體 600 元｜線上第一次免費，之後 400 元",
      color: "#EC4899", // 粉色
    },
    {
      code: "PT",
      name: "PT工作坊",
      description: "Power Team 菁英團隊培訓",
      longDescription: "Power Team（PT）工作坊聚焦於如何組建並運作高效能的菁英團隊。PT 是 BNI 分會中由互補產業組成的小組，透過更緊密的合作產生更多引薦。本工作坊將教您如何辨識最佳 PT 夥伴、如何定期運作 PT 會議、如何透過團隊協作倍增業績，讓您的 BNI 經驗提升到全新層次。",
      pricingInfo: "實體 600 元｜線上第一次免費，之後 400 元",
      color: "#F59E0B", // 橘色
    },
    {
      code: "PRESENTATION",
      name: "簡報工作坊",
      description: "提升簡報與表達能力",
      longDescription: "簡報工作坊專為提升會員在分會中的簡報表達能力而設計。從每週 60 秒的商業簡報，到 10 分鐘的主要簡報，本課程涵蓋簡報結構設計、說故事技巧、臨場表達訓練等實用內容。透過反覆練習與講師回饋，幫助您在每次上台時都能精準傳達業務價值，吸引更多引薦機會。",
      pricingInfo: "實體 600 元｜線上第一次免費，之後 400 元",
      color: "#10B981", // 綠色
    },
    {
      code: "CHAPTER",
      name: "組聚培訓",
      description: "分會組聚相關培訓",
      longDescription: "跨分會組聚培訓是新北市西B區華字輩獨有的學習交流活動。透過跨分會的互動，讓不同分會的會員彼此認識、分享經驗，並學習各分會的成功做法。每次組聚培訓都有不同主題，涵蓋 BNI 核心能力與經營技巧，是拓展人脈、提升能力的絕佳機會。",
      pricingInfo: "線上舉行，免費",
      color: "#6366F1", // 靛藍色
    },
    {
      code: "LTNA",
      name: "LTnA 八大會議",
      description: "領導團隊八大會議",
      color: "#EF4444", // 紅色
    },
    {
      code: "LEADERSHIP",
      name: "領導團隊培訓",
      description: "領導團隊實體培訓課程",
      color: "#DC2626", // 深紅色
    },
    {
      code: "DNA",
      name: "DnA 實體聚會",
      description: "Director and Ambassador 實體聚會",
      color: "#7C3AED", // 紫羅蘭色
    },
  ]

  for (const type of courseTypes) {
    await prisma.courseType.upsert({
      where: { code: type.code },
      update: type,
      create: type,
    })
  }
  console.log(`✓ 建立 ${courseTypes.length} 個課程類型`)

  // 取得華榮分會 ID（用於管理員）
  const huarongChapter = await prisma.chapter.findUnique({
    where: { name: "華榮" },
  })

  if (!huarongChapter) {
    throw new Error("找不到華榮分會")
  }

  // 建立管理員帳號
  await prisma.member.upsert({
    where: { email: "ai@autolab.cloud" },
    update: {},
    create: {
      email: "ai@autolab.cloud",
      name: "系統管理員",
      role: Role.ADMIN,
      chapterId: huarongChapter.id,
    },
  })
  console.log("✓ 建立管理員帳號：ai@autolab.cloud")

  // 取得課程類型 ID
  const types = await prisma.courseType.findMany()
  const typeMap = Object.fromEntries(types.map((t) => [t.code, t.id]))

  // ============================================
  // 2026 年新北市西B區華字輩培訓課程
  // ============================================

  const courses = [
    // ========== MSP 成功會員培訓 (10場) ==========
    // 週一 19:30-22:00 線上
    { title: "MSP 成功會員培訓 (1月)", typeId: typeMap.MSP, date: "2026-01-19", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (3月)", typeId: typeMap.MSP, date: "2026-03-02", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (4月)", typeId: typeMap.MSP, date: "2026-04-06", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (5月)", typeId: typeMap.MSP, date: "2026-05-18", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (6月)", typeId: typeMap.MSP, date: "2026-06-29", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (8月)", typeId: typeMap.MSP, date: "2026-08-10", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (9月)", typeId: typeMap.MSP, date: "2026-09-21", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (10月)", typeId: typeMap.MSP, date: "2026-10-14", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (11月)", typeId: typeMap.MSP, date: "2026-11-02", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "MSP 成功會員培訓 (12月)", typeId: typeMap.MSP, date: "2026-12-14", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },

    // ========== 1對1工作坊 (6場) ==========
    // 週一 19:30-22:00，紅底為實體
    { title: "1對1工作坊 (2月) 【實體】", typeId: typeMap["1ON1"], date: "2026-02-02", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "1對1工作坊 (4月)", typeId: typeMap["1ON1"], date: "2026-04-13", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "1對1工作坊 (6月)", typeId: typeMap["1ON1"], date: "2026-06-01", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "1對1工作坊 (8月) 【實體】", typeId: typeMap["1ON1"], date: "2026-08-03", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "1對1工作坊 (10月)", typeId: typeMap["1ON1"], date: "2026-10-05", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "1對1工作坊 (12月)", typeId: typeMap["1ON1"], date: "2026-12-07", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },

    // ========== 引薦工作坊 (6場) ==========
    // 週一 19:30-22:00，紅底為實體
    { title: "引薦工作坊 (1月)", typeId: typeMap.REFERRAL, date: "2026-01-05", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "引薦工作坊 (3月)", typeId: typeMap.REFERRAL, date: "2026-03-16", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "引薦工作坊 (5月) 【實體】", typeId: typeMap.REFERRAL, date: "2026-05-04", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "引薦工作坊 (7月)", typeId: typeMap.REFERRAL, date: "2026-07-13", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "引薦工作坊 (9月)", typeId: typeMap.REFERRAL, date: "2026-09-14", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "引薦工作坊 (11月) 【實體】", typeId: typeMap.REFERRAL, date: "2026-11-16", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },

    // ========== PT工作坊 (6場) ==========
    // 週一 19:30-22:00，紅底為實體
    { title: "PT工作坊 (1月)", typeId: typeMap.PT, date: "2026-01-26", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "PT工作坊 (3月) 【實體】", typeId: typeMap.PT, date: "2026-03-30", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "PT工作坊 (6月)", typeId: typeMap.PT, date: "2026-06-15", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "PT工作坊 (8月)", typeId: typeMap.PT, date: "2026-08-17", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "PT工作坊 (10月) 【實體】", typeId: typeMap.PT, date: "2026-10-19", startTime: "19:30", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "PT工作坊 (11月)", typeId: typeMap.PT, date: "2026-11-30", startTime: "19:30", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },

    // ========== 簡報工作坊 (6場) ==========
    // 週三 20:00-22:00，紅底為實體
    { title: "簡報工作坊 (2月)", typeId: typeMap.PRESENTATION, date: "2026-02-04", startTime: "20:00", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "簡報工作坊 (4月)", typeId: typeMap.PRESENTATION, date: "2026-04-15", startTime: "20:00", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "簡報工作坊 (6月) 【實體】", typeId: typeMap.PRESENTATION, date: "2026-06-03", startTime: "20:00", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "簡報工作坊 (8月)", typeId: typeMap.PRESENTATION, date: "2026-08-05", startTime: "20:00", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "簡報工作坊 (10月)", typeId: typeMap.PRESENTATION, date: "2026-10-07", startTime: "20:00", endTime: "22:00", location: "線上課程 (Zoom)", isOnline: true },
    { title: "簡報工作坊 (12月) 【實體】", typeId: typeMap.PRESENTATION, date: "2026-12-09", startTime: "20:00", endTime: "22:00", location: "實體課程 (地點待定)", isOnline: false },

    // ========== 組聚培訓 (24場) ==========
    // 週一 20:00-21:30 線上（部分週三）
    { title: "組聚培訓 (1/12)", typeId: typeMap.CHAPTER, date: "2026-01-12", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (1/28)", typeId: typeMap.CHAPTER, date: "2026-01-28", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (2/9)", typeId: typeMap.CHAPTER, date: "2026-02-09", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (2/23)", typeId: typeMap.CHAPTER, date: "2026-02-23", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (3/9)", typeId: typeMap.CHAPTER, date: "2026-03-09", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (3/23)", typeId: typeMap.CHAPTER, date: "2026-03-23", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (4/20)", typeId: typeMap.CHAPTER, date: "2026-04-20", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (4/27)", typeId: typeMap.CHAPTER, date: "2026-04-27", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (5/11)", typeId: typeMap.CHAPTER, date: "2026-05-11", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (5/25)", typeId: typeMap.CHAPTER, date: "2026-05-25", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (6/8)", typeId: typeMap.CHAPTER, date: "2026-06-08", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (6/22)", typeId: typeMap.CHAPTER, date: "2026-06-22", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (7/6)", typeId: typeMap.CHAPTER, date: "2026-07-06", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (7/20)", typeId: typeMap.CHAPTER, date: "2026-07-20", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (8/12)", typeId: typeMap.CHAPTER, date: "2026-08-12", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (8/24)", typeId: typeMap.CHAPTER, date: "2026-08-24", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (9/7)", typeId: typeMap.CHAPTER, date: "2026-09-07", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (9/23)", typeId: typeMap.CHAPTER, date: "2026-09-23", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (10/12)", typeId: typeMap.CHAPTER, date: "2026-10-12", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (10/26)", typeId: typeMap.CHAPTER, date: "2026-10-26", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (11/9)", typeId: typeMap.CHAPTER, date: "2026-11-09", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (11/23)", typeId: typeMap.CHAPTER, date: "2026-11-23", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (12/16)", typeId: typeMap.CHAPTER, date: "2026-12-16", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },
    { title: "組聚培訓 (12/28)", typeId: typeMap.CHAPTER, date: "2026-12-28", startTime: "20:00", endTime: "21:30", location: "線上課程 (Zoom)", isOnline: true },

    // ========== LTnA 八大會議 (8場) ==========
    // 週二 15:30-17:00
    { title: "LTnA 八大會議 (1月)", typeId: typeMap.LTNA, date: "2026-01-13", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (2月)", typeId: typeMap.LTNA, date: "2026-02-10", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (4月)", typeId: typeMap.LTNA, date: "2026-04-14", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (5月)", typeId: typeMap.LTNA, date: "2026-05-12", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (7月)", typeId: typeMap.LTNA, date: "2026-07-14", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (8月)", typeId: typeMap.LTNA, date: "2026-08-11", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (10月)", typeId: typeMap.LTNA, date: "2026-10-13", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },
    { title: "LTnA 八大會議 (11月)", typeId: typeMap.LTNA, date: "2026-11-10", startTime: "15:30", endTime: "17:00", location: "線上會議", isOnline: true },

    // ========== 領導團隊培訓 (4場) ==========
    // 週三 09:30-17:00 實體
    { title: "領導團隊培訓 (Q1) 【實體】", typeId: typeMap.LEADERSHIP, date: "2026-03-09", startTime: "09:30", endTime: "17:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "領導團隊培訓 (Q2) 【實體】", typeId: typeMap.LEADERSHIP, date: "2026-06-01", startTime: "09:30", endTime: "17:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "領導團隊培訓 (Q3) 【實體】", typeId: typeMap.LEADERSHIP, date: "2026-09-07", startTime: "09:30", endTime: "17:00", location: "實體課程 (地點待定)", isOnline: false },
    { title: "領導團隊培訓 (Q4) 【實體】", typeId: typeMap.LEADERSHIP, date: "2026-12-07", startTime: "09:30", endTime: "17:00", location: "實體課程 (地點待定)", isOnline: false },

    // ========== DnA 實體聚會 (8場) ==========
    // 週三 12:00-16:30 實體
    { title: "DnA 實體聚會 (1月)", typeId: typeMap.DNA, date: "2026-01-07", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (2月)", typeId: typeMap.DNA, date: "2026-02-04", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (4月)", typeId: typeMap.DNA, date: "2026-04-01", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (5月)", typeId: typeMap.DNA, date: "2026-05-06", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (7月)", typeId: typeMap.DNA, date: "2026-07-01", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (8月)", typeId: typeMap.DNA, date: "2026-08-05", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (10月)", typeId: typeMap.DNA, date: "2026-10-07", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
    { title: "DnA 實體聚會 (11月)", typeId: typeMap.DNA, date: "2026-11-04", startTime: "12:00", endTime: "16:30", location: "實體聚會 (地點待定)", isOnline: false },
  ]

  // 建立所有課程
  let createdCount = 0
  for (const course of courses) {
    const { isOnline, ...courseData } = course
    await prisma.course.create({
      data: {
        ...courseData,
        date: new Date(courseData.date),
        description: isOnline
          ? "線上課程，將於課前發送會議連結。"
          : "實體課程，地點確認後將另行通知。",
        status: CourseStatus.PUBLISHED,
      },
    })
    createdCount++
  }

  console.log(`✓ 建立 ${createdCount} 個課程`)

  console.log("\n" + "=".repeat(50))
  console.log("✅ 種子資料建立完成！")
  console.log("=".repeat(50))
  console.log("\n📊 2026 年新北市西B區華字輩培訓計劃表")
  console.log("-".repeat(50))
  console.log("MSP 成功會員培訓:     10 場")
  console.log("1對1工作坊:           6 場")
  console.log("引薦工作坊:           6 場")
  console.log("PT工作坊:             6 場")
  console.log("簡報工作坊:           6 場")
  console.log("組聚培訓:            24 場")
  console.log("LTnA 八大會議:        8 場")
  console.log("領導團隊培訓:         4 場")
  console.log("DnA 實體聚會:         8 場")
  console.log("-".repeat(50))
  console.log(`總計:                ${createdCount} 場`)
  console.log("\n👤 管理員帳號: ai@autolab.cloud")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
