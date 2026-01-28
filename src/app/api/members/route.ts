import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { canAccessAdmin, isAdminRole, getVisibleChapterIds } from "@/lib/permissions"

// GET /api/members - 取得會員列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canAccessAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 根據角色過濾可見分會
    const visibleChapterIds = await getVisibleChapterIds(
      session.user.id,
      session.user.role as Role
    )

    const where: Record<string, unknown> = {}
    if (visibleChapterIds !== null) {
      where.chapterId = { in: visibleChapterIds }
    }

    const members = await prisma.member.findMany({
      where,
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

    if (!session || !isAdminRole(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, chapterId, role = "MEMBER", managedChapterIds = [] } = body

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

    // 檢查分會是否存在（如有提供）
    if (chapterId) {
      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
      })

      if (!chapter) {
        return NextResponse.json(
          { error: "分會不存在" },
          { status: 400 }
        )
      }
    }

    const needsManagedChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"].includes(role)

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone: phone || null,
        chapterId: chapterId || null,
        role: role as Role,
        ...(needsManagedChapters && managedChapterIds.length > 0
          ? {
              managedChapters: {
                create: managedChapterIds.map((id: string) => ({
                  chapterId: id,
                })),
              },
            }
          : {}),
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
