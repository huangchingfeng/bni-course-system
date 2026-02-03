import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { isAdmin } from "@/lib/permissions"

// GET /api/courses/[id] - 取得單一課程詳情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        type: true,
        registrations: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
                chapter: {
                  select: {
                    id: true,
                    displayName: true,
                  },
                },
              },
            },
          },
          where: {
            status: "REGISTERED",
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    )
  }
}

// PATCH /api/courses/[id] - 更新課程 (Admin only)
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

    // 如果有日期欄位，轉換成 Date 物件
    if (body.date) {
      body.date = new Date(body.date)
    }
    if (body.deadline) {
      body.deadline = new Date(body.deadline)
    }

    const course = await prisma.course.update({
      where: { id },
      data: body,
      include: {
        type: true,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - 刪除課程 (Admin only)
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

    // 先刪除相關的報名紀錄
    await prisma.registration.deleteMany({
      where: { courseId: id },
    })

    // 再刪除課程
    await prisma.course.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    )
  }
}
