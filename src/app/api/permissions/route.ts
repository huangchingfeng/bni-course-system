import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { isAdmin, ROLE_LABELS, canAccessAdmin } from "@/lib/permissions"
import { logPermissionChange } from "@/lib/audit"

// GET /api/permissions - 取得所有有權限的會員列表
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 取得所有非 MEMBER 角色的會員
    const members = await prisma.member.findMany({
      where: {
        role: { not: Role.MEMBER },
        isActive: true,
      },
      include: {
        chapter: {
          select: {
            id: true,
            displayName: true,
          },
        },
        managedChapters: {
          include: {
            chapter: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { role: "desc" },
        { name: "asc" },
      ],
    })

    // 格式化資料
    const formattedMembers = members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      roleLabel: ROLE_LABELS[member.role],
      chapter: member.chapter,
      managedChapters: member.managedChapters.map((mc) => mc.chapter),
    }))

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 }
    )
  }
}

// POST /api/permissions - 新增管理員（將現有會員升級為管理角色）
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
    const { memberId, role, managedChapterIds = [] } = body

    if (!memberId || !role) {
      return NextResponse.json(
        { error: "缺少必要欄位" },
        { status: 400 }
      )
    }

    // 檢查會員是否存在
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        managedChapters: {
          select: { chapterId: true },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "會員不存在" },
        { status: 404 }
      )
    }

    // 驗證角色是否有效
    if (!Object.values(Role).includes(role as Role)) {
      return NextResponse.json(
        { error: "無效的角色" },
        { status: 400 }
      )
    }

    // 檢查是否可進後台的角色
    if (!canAccessAdmin(role as Role) && role !== Role.MEMBER) {
      return NextResponse.json(
        { error: "無效的管理角色" },
        { status: 400 }
      )
    }

    // 記錄舊資料
    const oldChapterIds = member.managedChapters.map((mc) => mc.chapterId)

    // 取得分會名稱（用於日誌）
    const chapters = await prisma.chapter.findMany({
      where: {
        id: {
          in: [...oldChapterIds, ...managedChapterIds],
        },
      },
      select: { id: true, displayName: true },
    })

    const chapterMap = new Map(chapters.map((c) => [c.id, c.displayName]))

    // 更新 managedChapters
    const needsManagedChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"].includes(role)

    if (needsManagedChapters) {
      // 先刪除舊的
      await prisma.memberChapter.deleteMany({
        where: { memberId },
      })
      // 再建立新的
      if (managedChapterIds.length > 0) {
        await prisma.memberChapter.createMany({
          data: managedChapterIds.map((chapterId: string) => ({
            memberId,
            chapterId,
          })),
        })
      }
    } else {
      // 非董顧/大使，清空 managedChapters
      await prisma.memberChapter.deleteMany({
        where: { memberId },
      })
    }

    // 更新角色
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: { role: role as Role },
      include: {
        chapter: {
          select: {
            id: true,
            displayName: true,
          },
        },
        managedChapters: {
          include: {
            chapter: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    })

    // 記錄操作日誌
    await logPermissionChange(
      {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
      },
      memberId,
      member.name,
      {
        oldRole: member.role,
        newRole: role as Role,
        oldChapterIds,
        newChapterIds: needsManagedChapters ? managedChapterIds : [],
        oldChapterNames: oldChapterIds.map((id) => chapterMap.get(id) || id),
        newChapterNames: needsManagedChapters
          ? managedChapterIds.map((id: string) => chapterMap.get(id) || id)
          : [],
      }
    )

    return NextResponse.json({
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      role: updatedMember.role,
      roleLabel: ROLE_LABELS[updatedMember.role],
      chapter: updatedMember.chapter,
      managedChapters: updatedMember.managedChapters.map((mc) => mc.chapter),
    })
  } catch (error) {
    console.error("Error updating permissions:", error)
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 }
    )
  }
}

// DELETE /api/permissions - 移除管理權限（降為一般會員）
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")

    if (!memberId) {
      return NextResponse.json(
        { error: "缺少會員 ID" },
        { status: 400 }
      )
    }

    // 檢查會員是否存在
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        managedChapters: {
          include: {
            chapter: {
              select: { displayName: true },
            },
          },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: "會員不存在" },
        { status: 404 }
      )
    }

    // 不能移除自己的權限
    if (memberId === session.user.id) {
      return NextResponse.json(
        { error: "無法移除自己的權限" },
        { status: 400 }
      )
    }

    // 清空 managedChapters
    await prisma.memberChapter.deleteMany({
      where: { memberId },
    })

    // 降為一般會員
    await prisma.member.update({
      where: { id: memberId },
      data: { role: Role.MEMBER },
    })

    // 記錄操作日誌
    await logPermissionChange(
      {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
      },
      memberId,
      member.name,
      {
        oldRole: member.role,
        newRole: Role.MEMBER,
        oldChapterIds: member.managedChapters.map((mc) => mc.chapterId),
        newChapterIds: [],
        oldChapterNames: member.managedChapters.map(
          (mc) => mc.chapter.displayName
        ),
        newChapterNames: [],
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing permissions:", error)
    return NextResponse.json(
      { error: "Failed to remove permissions" },
      { status: 500 }
    )
  }
}
