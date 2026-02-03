import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CourseStatus, Role } from "@prisma/client"
import { isAdmin } from "@/lib/permissions"

// GET /api/courses - 取得課程列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const status = searchParams.get("status") as CourseStatus | null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: Record<string, unknown> = {}

    // 預設只顯示已發布的課程
    if (status) {
      where.status = status
    } else {
      where.status = CourseStatus.PUBLISHED
    }

    // 課程類型篩選
    if (type) {
      where.type = { code: type }
    }

    // 日期篩選
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        (where.date as Record<string, Date>).gte = new Date(dateFrom)
      }
      if (dateTo) {
        (where.date as Record<string, Date>).lte = new Date(dateTo)
      }
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          type: true,
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: { date: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.course.count({ where }),
    ])

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

// POST /api/courses - 新增課程 (Admin only)
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
    const {
      title,
      description,
      bannerUrl,
      typeId,
      date,
      startTime,
      endTime,
      location,
      address,
      capacity,
      deadline,
      status = CourseStatus.DRAFT,
    } = body

    const course = await prisma.course.create({
      data: {
        title,
        description,
        bannerUrl: bannerUrl || null,
        typeId,
        date: new Date(date),
        startTime,
        endTime,
        location,
        address,
        capacity,
        deadline: deadline ? new Date(deadline) : null,
        status,
      },
      include: {
        type: true,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
