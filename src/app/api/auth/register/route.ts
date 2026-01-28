import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// 允許自行註冊的角色
const allowedRoles: Role[] = [
  "MEMBER",
  "AMBASSADOR",
  "DIRECTOR_CONSULTANT",
  "REGIONAL_DIRECTOR",
  "EXECUTIVE_DIRECTOR",
]

// POST /api/auth/register - 會員自助註冊
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, chapterInput, profession, role = "MEMBER", managedChapterIds = [] } = body

    // 驗證必填欄位
    if (!name || !email || !phone || !profession) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
        { status: 400 }
      )
    }

    // 驗證角色
    if (!allowedRoles.includes(role as Role)) {
      return NextResponse.json(
        { error: "無效的角色選擇" },
        { status: 400 }
      )
    }

    // 一般會員 / 分會幹部需要所屬分會
    const needsSingleChapter = !["DIRECTOR_CONSULTANT", "AMBASSADOR", "REGIONAL_DIRECTOR", "EXECUTIVE_DIRECTOR"].includes(role)
    if (needsSingleChapter && !chapterInput) {
      return NextResponse.json(
        { error: "請填寫所屬分會" },
        { status: 400 }
      )
    }

    // 董事顧問 / 大使需要選擇負責分會
    const needsManagedChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"].includes(role)
    if (needsManagedChapters && (!Array.isArray(managedChapterIds) || managedChapterIds.length === 0)) {
      return NextResponse.json(
        { error: "請至少選擇一個負責分會" },
        { status: 400 }
      )
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "請輸入有效的 Email 格式" },
        { status: 400 }
      )
    }

    // 檢查 Email 是否已存在
    const existingMember = await prisma.member.findUnique({
      where: { email },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "此 Email 已被註冊，請使用其他 Email 或直接登入" },
        { status: 400 }
      )
    }

    // 嘗試自動匹配分會（一般會員）
    let matchedChapterId: string | null = null
    if (needsSingleChapter && chapterInput) {
      const matchedChapter = await prisma.chapter.findFirst({
        where: {
          OR: [
            { displayName: chapterInput },
            { name: chapterInput },
            { displayName: { contains: chapterInput } },
            { name: { contains: chapterInput } },
          ],
          isActive: true,
        },
      })
      matchedChapterId = matchedChapter?.id || null
    }

    // 建立會員 + MemberChapter（如需要）
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        chapterId: matchedChapterId,
        chapterName: chapterInput || null,
        profession,
        role: role as Role,
        isActive: true,
        ...(needsManagedChapters && managedChapterIds.length > 0
          ? {
              managedChapters: {
                create: managedChapterIds.map((chapterId: string) => ({
                  chapterId,
                })),
              },
            }
          : {}),
      },
      include: {
        chapter: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        managedChapters: {
          include: {
            chapter: {
              select: { id: true, displayName: true },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "註冊成功！請使用此 Email 登入。",
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role,
          chapterName: member.chapterName,
          chapter: member.chapter,
          managedChapters: member.managedChapters,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registering member:", error)
    return NextResponse.json(
      { error: "註冊失敗，請稍後再試" },
      { status: 500 }
    )
  }
}
