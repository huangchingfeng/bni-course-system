import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { CourseCard } from "@/components/courses/CourseCard"
import { CourseFilter } from "@/components/courses/CourseFilter"
import { CourseCalendar } from "@/components/courses/CourseCalendar"
import { ViewToggle } from "@/components/courses/ViewToggle"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseStatus } from "@prisma/client"
import Link from "next/link"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  SparklesIcon,
} from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    type?: string
    dateFrom?: string
    dateTo?: string
    page?: string
    view?: "list" | "calendar"
  }>
}

function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0]/60 p-6 space-y-4">
          <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

async function CourseList({
  type,
  dateFrom,
  dateTo,
  page = 1,
}: {
  type?: string
  dateFrom?: string
  dateTo?: string
  page?: number
}) {
  const limit = 9
  const where: Record<string, unknown> = {
    status: CourseStatus.PUBLISHED,
  }

  if (type) {
    where.type = { code: type }
  }

  // 列表模式預設只顯示今天及之後的課程
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (dateFrom || dateTo) {
    where.date = {}
    if (dateFrom) {
      (where.date as Record<string, Date>).gte = new Date(dateFrom)
    } else {
      (where.date as Record<string, Date>).gte = today
    }
    if (dateTo) {
      (where.date as Record<string, Date>).lte = new Date(dateTo)
    }
  } else {
    where.date = { gte: today }
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

  const totalPages = Math.ceil(total / limit)

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]/60">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
          <BookOpenIcon className="w-8 h-8 text-[#64748B]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">沒有找到課程</h3>
        <p className="text-[#64748B]">目前沒有符合條件的課程，請調整篩選條件</p>
      </div>
    )
  }

  // 建立分頁連結的 query string
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    params.set("page", pageNum.toString())
    return `/courses?${params.toString()}`
  }

  return (
    <>
      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#64748B]">
          共找到 <span className="font-semibold text-[#0F172A]">{total}</span> 個培訓
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-[#64748B]">
            第 {page} / {totalPages} 頁
          </p>
        )}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={{
              ...course,
              date: course.date.toISOString(),
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}>
              <Button variant="outline" size="default">
                <ChevronLeftIcon className="h-4 w-4" />
                上一頁
              </Button>
            </Link>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <Link key={pageNum} href={buildPageUrl(pageNum)}>
                  <Button
                    variant={page === pageNum ? "default" : "ghost"}
                    size="sm"
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                </Link>
              )
            })}
          </div>

          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)}>
              <Button variant="outline" size="default">
                下一頁
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}

// 取得所有課程供行事曆使用
async function CalendarView({ type }: { type?: string }) {
  const where: Record<string, unknown> = {
    status: CourseStatus.PUBLISHED,
  }

  if (type) {
    where.type = { code: type }
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      type: true,
    },
    orderBy: { date: "asc" },
  })

  const formattedCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    date: course.date.toISOString(),
    startTime: course.startTime,
    endTime: course.endTime,
    location: course.location,
    type: {
      code: course.type.code,
      name: course.type.name,
      color: course.type.color,
      longDescription: course.type.longDescription,
      pricingInfo: course.type.pricingInfo,
    },
  }))

  return <CourseCalendar courses={formattedCourses} />
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const view = params.view || "list"

  // 取得課程類型供篩選用
  const courseTypes = await prisma.courseType.findMany({
    orderBy: { code: "asc" },
  })

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container-wide py-10 md:py-14">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#0F172A]">
                <BookOpenIcon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                  培訓總覽
                </h1>
                <p className="text-[#64748B] mt-2 leading-relaxed">
                  瀏覽所有開放報名的培訓，找到適合您的學習機會
                </p>
              </div>
            </div>
            <Suspense fallback={null}>
              <ViewToggle currentView={view} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide py-8 md:py-10">
        {/* Filter - 只在列表模式顯示完整篩選 */}
        {view === "list" && (
          <Suspense fallback={
            <div className="h-24 bg-white rounded-2xl border border-[#E2E8F0]/60 animate-pulse mb-8" />
          }>
            <CourseFilter courseTypes={courseTypes} />
          </Suspense>
        )}

        {/* 行事曆模式顯示簡單的類型篩選 */}
        {view === "calendar" && (
          <Suspense fallback={
            <div className="h-12 bg-white rounded-xl border border-[#E2E8F0]/60 animate-pulse mb-6" />
          }>
            <CourseFilter courseTypes={courseTypes} calendarMode />
          </Suspense>
        )}

        {/* Course List or Calendar */}
        {view === "list" ? (
          <Suspense fallback={<CourseListSkeleton />}>
            <CourseList
              type={params.type}
              dateFrom={params.dateFrom}
              dateTo={params.dateTo}
              page={page}
            />
          </Suspense>
        ) : (
          <Suspense fallback={
            <div className="h-[600px] bg-white rounded-2xl border border-[#E2E8F0]/60 animate-pulse" />
          }>
            <CalendarView type={params.type} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
