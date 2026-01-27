import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CourseStatus, RegistrationStatus } from "@prisma/client"

// POST /api/registrations - 報名課程
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    // 檢查課程是否存在且可報名
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "課程不存在" },
        { status: 404 }
      )
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      return NextResponse.json(
        { error: "此課程目前不開放報名" },
        { status: 400 }
      )
    }

    // 檢查報名截止日
    if (course.deadline && new Date() > course.deadline) {
      return NextResponse.json(
        { error: "已超過報名截止日" },
        { status: 400 }
      )
    }

    // 檢查人數上限
    if (course.capacity && course._count.registrations >= course.capacity) {
      return NextResponse.json(
        { error: "報名人數已滿" },
        { status: 400 }
      )
    }

    // 檢查是否已報名
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        memberId_courseId: {
          memberId: session.user.id,
          courseId,
        },
      },
    })

    if (existingRegistration) {
      if (existingRegistration.status === RegistrationStatus.REGISTERED) {
        return NextResponse.json(
          { error: "您已報名此課程" },
          { status: 400 }
        )
      }

      // 如果之前取消過，重新報名
      const registration = await prisma.registration.update({
        where: { id: existingRegistration.id },
        data: { status: RegistrationStatus.REGISTERED },
        include: {
          course: {
            include: { type: true },
          },
        },
      })

      return NextResponse.json(registration, { status: 200 })
    }

    // 建立新報名
    const registration = await prisma.registration.create({
      data: {
        memberId: session.user.id,
        courseId,
      },
      include: {
        course: {
          include: { type: true },
        },
      },
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("Error creating registration:", error)
    return NextResponse.json(
      { error: "報名失敗，請稍後再試" },
      { status: 500 }
    )
  }
}

// GET /api/registrations - 取得我的報名紀錄
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const registrations = await prisma.registration.findMany({
      where: {
        memberId: session.user.id,
      },
      include: {
        course: {
          include: { type: true },
        },
      },
      orderBy: {
        course: {
          date: "desc",
        },
      },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json(
      { error: "取得報名紀錄失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/registrations - 取消報名
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get("id")

    if (!registrationId) {
      return NextResponse.json(
        { error: "缺少報名 ID" },
        { status: 400 }
      )
    }

    // 檢查報名紀錄是否存在且屬於當前用戶
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { course: true },
    })

    if (!registration) {
      return NextResponse.json(
        { error: "報名紀錄不存在" },
        { status: 404 }
      )
    }

    if (registration.memberId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限取消此報名" },
        { status: 403 }
      )
    }

    // 檢查課程是否已經開始
    if (new Date() > registration.course.date) {
      return NextResponse.json(
        { error: "課程已開始，無法取消報名" },
        { status: 400 }
      )
    }

    // 更新報名狀態為已取消
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CANCELLED },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error cancelling registration:", error)
    return NextResponse.json(
      { error: "取消報名失敗" },
      { status: 500 }
    )
  }
}
