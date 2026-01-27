import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"

// GET /api/members - 取得會員列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const members = await prisma.member.findMany({
      include: {
        chapter: {
          select: {
            id: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            registrations: {
              where: { status: "REGISTERED" },
            },
          },
        },
      },
      orderBy: [
        { chapter: { name: "asc" } },
        { name: "asc" },
      ],
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    )
  }
}

// POST /api/members - 新增會員
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, chapterId, role = "MEMBER" } = body

    // 檢查 Email 是否已存在
    const existingMember = await prisma.member.findUnique({
      where: { email },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "此 Email 已被使用" },
        { status: 400 }
      )
    }

    // 檢查分會是否存在
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      return NextResponse.json(
        { error: "分會不存在" },
        { status: 400 }
      )
    }

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone: phone || null,
        chapterId,
        role: role as Role,
      },
      include: {
        chapter: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    )
  }
}
