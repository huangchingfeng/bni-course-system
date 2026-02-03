import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { canAccessAdmin, isAdmin, canViewMember } from "@/lib/permissions"
import { logUpdateMember, logDeleteMember } from "@/lib/audit"

// GET /api/members/[id] - 取得單一會員
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canAccessAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // 檢查是否有權限查看此會員
    const hasAccess = await canViewMember(
      session.user.id,
      session.user.role as Role,
      session.user.chapterId || null,
      id
    )

    if (!hasAccess) {
      return NextResponse.json(
        { error: "無權限查看此會員" },
        { status: 403 }
      )
    }

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        chapter: {
          select: {
            id: true,
            displayName: true,
          },
        },
        registrations: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                date: true,
                type: {
                  select: {
                    code: true,
                    color: true,
                  },
                },
              },
            },
          },
          orderBy: {
            course: {
              date: "desc",
            },
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

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error("Error fetching member:", error)
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    )
  }
}

// PATCH /api/members/[id] - 更新會員
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, email, phone, chapterId, role, isActive, managedChapterIds } = body

    // 檢查會員是否存在
    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: {
        managedChapters: {
          select: { chapterId: true },
        },
      },
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    // 記錄舊資料（用於日誌）
    const oldData = {
      name: existingMember.name,
      email: existingMember.email,
      phone: existingMember.phone,
      chapterId: existingMember.chapterId,
      role: existingMember.role,
      isActive: existingMember.isActive,
      managedChapterIds: existingMember.managedChapters.map((mc) => mc.chapterId),
    }

    // 如果 Email 有變更，檢查是否重複
    if (email && email !== existingMember.email) {
      const emailExists = await prisma.member.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "此 Email 已被使用" },
          { status: 400 }
        )
      }
    }

    // 更新 managedChapters（如有提供）
    if (Array.isArray(managedChapterIds)) {
      // 先刪除舊的
      await prisma.memberChapter.deleteMany({
        where: { memberId: id },
      })
      // 再建立新的
      if (managedChapterIds.length > 0) {
        await prisma.memberChapter.createMany({
          data: managedChapterIds.map((chapterId: string) => ({
            memberId: id,
            chapterId,
          })),
        })
      }
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        email,
        phone: phone || null,
        chapterId,
        role: role as Role,
        isActive,
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

    // 記錄操作日誌
    const newData = {
      name,
      email,
      phone,
      chapterId,
      role,
      isActive,
      managedChapterIds: managedChapterIds || oldData.managedChapterIds,
    }

    await logUpdateMember(
      {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
      },
      member.id,
      member.name,
      oldData,
      newData
    )

    return NextResponse.json(member)
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    )
  }
}

// DELETE /api/members/[id] - 刪除會員
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !isAdmin(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // 取得會員名稱（用於日誌）
    const member = await prisma.member.findUnique({
      where: { id },
      select: { name: true },
    })

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    // 軟刪除：設定 isActive = false
    await prisma.member.update({
      where: { id },
      data: { isActive: false },
    })

    // 記錄操作日誌
    await logDeleteMember(
      {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
      },
      id,
      member.name
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    )
  }
}
