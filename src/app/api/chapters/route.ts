import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { isAdmin } from "@/lib/permissions"

// GET /api/chapters - 取得分會列表
export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            members: {
              where: { isActive: true },
            },
          },
        },
      },
    })

    return NextResponse.json(chapters)
  } catch (error) {
    console.error("Error fetching chapters:", error)
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    )
  }
}

// POST /api/chapters - 新增分會 (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, displayName } = body

    // 檢查分會名稱是否已存在
    const existingChapter = await prisma.chapter.findUnique({
      where: { name },
    })

    if (existingChapter) {
      return NextResponse.json(
        { error: "此分會名稱已存在" },
        { status: 400 }
      )
    }

    const chapter = await prisma.chapter.create({
      data: {
        name,
        displayName: displayName || `${name}分會`,
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error("Error creating chapter:", error)
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    )
  }
}
