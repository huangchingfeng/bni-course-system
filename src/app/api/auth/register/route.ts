import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/auth/register - 會員自助註冊
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, chapterInput, profession } = body

    // 驗證必填欄位
    if (!name || !email || !phone || !chapterInput || !profession) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
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

    // 嘗試自動匹配分會
    // 先用 displayName 精確匹配，再用 name 匹配，最後用模糊匹配
    let matchedChapter = await prisma.chapter.findFirst({
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

    // 建立會員
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        chapterId: matchedChapter?.id || null,  // 匹配到則填入，否則為 null
        chapterName: chapterInput,               // 永遠存用戶輸入的文字
        profession,
        role: "MEMBER",
        isActive: true,
      },
      include: {
        chapter: {
          select: {
            id: true,
            name: true,
            displayName: true,
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
          chapterName: member.chapterName,
          chapter: member.chapter,
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
