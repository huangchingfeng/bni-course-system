import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { pushTextMessage } from "@/lib/line"
import { CourseStatus, RegistrationStatus } from "@prisma/client"

// 查詢指定天數後的培訓
async function getCoursesOnDate(targetDate: Date) {
  // 取當天 00:00 ~ 23:59
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      type: true,
      registrations: {
        where: { status: RegistrationStatus.REGISTERED },
        include: {
          member: {
            include: { chapter: true },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  })
}

// 格式化日期為台灣格式
function formatDate(date: Date): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const w = weekdays[date.getDay()]
  return `${y}/${m}/${d}（${w}）`
}

// 組裝單一課程的通知訊息
function buildCourseMessage(
  course: Awaited<ReturnType<typeof getCoursesOnDate>>[number],
  daysLabel: string
): string {
  const registrations = course.registrations
  const totalCount = registrations.length

  // 依分會分組
  const byChapter = new Map<string, string[]>()
  for (const reg of registrations) {
    const chapterName = reg.member.chapter?.name || reg.member.chapterName || "未知分會"
    if (!byChapter.has(chapterName)) {
      byChapter.set(chapterName, [])
    }
    byChapter.get(chapterName)!.push(reg.member.name)
  }

  const chapterCount = byChapter.size

  // 基本資訊
  const lines: string[] = [
    `📋 培訓通知｜${daysLabel}`,
    "",
    `🎓 ${course.title}`,
    `📅 ${formatDate(course.date)} ${course.startTime}-${course.endTime}`,
    `📍 ${course.location}${course.address ? ` (${course.address})` : ""}`,
    "",
    `👥 目前報名：${totalCount} 人`,
  ]

  if (chapterCount > 0) {
    lines.push(`🏢 來自 ${chapterCount} 個分會`)
  }

  // 報名名單
  if (totalCount > 0) {
    lines.push("")
    lines.push("📝 報名名單：")
    for (const [chapter, names] of byChapter) {
      lines.push(`• ${chapter}：${names.join("、")}`)
    }
  } else {
    lines.push("")
    lines.push("⚠️ 目前尚無人報名")
  }

  // 報名連結
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bninwb.autolab.cloud"
  lines.push("")
  lines.push(`👉 報名連結：${baseUrl}/courses/${course.id}`)

  return lines.join("\n")
}

// GET /api/cron/training-notify - 定時培訓通知
export async function GET(request: NextRequest) {
  try {
    // 驗證 cron secret（Vercel Cron 會帶 Authorization header）
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = process.env.LINE_GROUP_ID
    if (!groupId) {
      return NextResponse.json({ error: "LINE_GROUP_ID is not defined" }, { status: 500 })
    }

    // 計算目標日期（台灣時區 UTC+8）
    const now = new Date()
    const taiwanOffset = 8 * 60 * 60 * 1000
    const taiwanNow = new Date(now.getTime() + taiwanOffset)

    const checkDays = [
      { days: 1, label: "距離 1 天" },
      { days: 3, label: "距離 3 天" },
      { days: 7, label: "距離 7 天" },
    ]

    const sentMessages: string[] = []

    for (const { days, label } of checkDays) {
      const targetDate = new Date(taiwanNow)
      targetDate.setDate(targetDate.getDate() + days)

      const courses = await getCoursesOnDate(targetDate)

      for (const course of courses) {
        const message = buildCourseMessage(course, label)
        await pushTextMessage(groupId, message)
        sentMessages.push(`${label}: ${course.title}`)
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentMessages.length,
      messages: sentMessages,
    })
  } catch (error) {
    console.error("Training notify error:", error)
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    )
  }
}
