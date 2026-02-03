import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DownloadIcon, TrendingUpIcon, UsersIcon, CalendarIcon, EyeIcon } from "lucide-react"
import { Role } from "@prisma/client"
import { canAccessAdmin, getVisibleChapterIds } from "@/lib/permissions"

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !canAccessAdmin(session.user.role as Role)) {
    redirect("/")
  }

  // 獲取可見分會 ID
  const visibleChapterIds = await getVisibleChapterIds(
    session.user.id,
    session.user.role as Role,
    session.user.chapterId
  )

  // 是否有權限限制
  const hasPermissionFilter = visibleChapterIds !== null

  // 建立分會過濾條件
  const chapterFilter = visibleChapterIds !== null
    ? { id: { in: visibleChapterIds } }
    : {}

  // 建立會員過濾條件（根據分會）
  const memberFilter = visibleChapterIds !== null
    ? { chapterId: { in: visibleChapterIds } }
    : {}

  // 取得各分會統計（過濾可見分會）
  const chapterStats = await prisma.chapter.findMany({
    where: {
      isActive: true,
      ...chapterFilter,
    },
    include: {
      _count: {
        select: {
          members: { where: { isActive: true } },
        },
      },
      members: {
        where: { isActive: true },
        include: {
          _count: {
            select: {
              registrations: { where: { status: "REGISTERED" } },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  // 計算各分會報名總次數
  const chapterRegistrations = chapterStats.map((chapter) => {
    const totalRegistrations = chapter.members.reduce(
      (sum, member) => sum + member._count.registrations,
      0
    )
    const avgRegistrations =
      chapter._count.members > 0
        ? (totalRegistrations / chapter._count.members).toFixed(1)
        : "0"

    return {
      id: chapter.id,
      name: chapter.displayName,
      memberCount: chapter._count.members,
      totalRegistrations,
      avgRegistrations,
    }
  })

  // 取得課程統計（報名根據可見會員過濾）
  const courseStats = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      date: { gte: new Date(new Date().getFullYear(), 0, 1) }, // 今年的課程
    },
    include: {
      type: true,
      _count: {
        select: {
          registrations: {
            where: {
              status: "REGISTERED",
              ...(visibleChapterIds !== null && {
                member: { chapterId: { in: visibleChapterIds } },
              }),
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
    take: 10,
  })

  // 總統計（過濾可見分會/會員）
  const [totalMembers, totalRegistrations, totalCourses] = await Promise.all([
    prisma.member.count({
      where: {
        isActive: true,
        ...memberFilter,
      },
    }),
    prisma.registration.count({
      where: {
        status: "REGISTERED",
        ...(visibleChapterIds !== null && {
          member: { chapterId: { in: visibleChapterIds } },
        }),
      },
    }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
  ])

  // 各課程類型統計（報名根據可見會員過濾）
  const typeStats = await prisma.courseType.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
      courses: {
        include: {
          _count: {
            select: {
              registrations: {
                where: {
                  status: "REGISTERED",
                  ...(visibleChapterIds !== null && {
                    member: { chapterId: { in: visibleChapterIds } },
                  }),
                },
              },
            },
          },
        },
      },
    },
  })

  const typeRegistrations = typeStats.map((type) => {
    const totalRegs = type.courses.reduce(
      (sum, course) => sum + course._count.registrations,
      0
    )
    return {
      code: type.code,
      name: type.name,
      color: type.color,
      courseCount: type._count.courses,
      registrations: totalRegs,
    }
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">統計報表</h1>
          <p className="text-muted-foreground mt-1">
            查看課程與會員參與統計
          </p>
          {/* 權限提示 */}
          {hasPermissionFilter && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <EyeIcon className="h-4 w-4" />
              <span>
                僅顯示您負責分會的統計資料
                {visibleChapterIds && visibleChapterIds.length > 0
                  ? `（${visibleChapterIds.length} 個分會）`
                  : ""}
              </span>
            </div>
          )}
        </div>
        <Button variant="outline">
          <DownloadIcon className="h-4 w-4 mr-2" />
          匯出報表
        </Button>
      </div>

      {/* 總覽統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {hasPermissionFilter ? "可見會員數" : "總會員數"}
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              來自 {chapterStats.length} 個分會
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {hasPermissionFilter ? "可見報名人次" : "總報名人次"}
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              平均每人 {totalMembers > 0 ? (totalRegistrations / totalMembers).toFixed(1) : 0} 次
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已發布課程</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              平均每課程 {totalCourses > 0 ? (totalRegistrations / totalCourses).toFixed(0) : 0} 人
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 各課程類型統計 */}
        <Card>
          <CardHeader>
            <CardTitle>課程類型統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeRegistrations.map((type) => (
                <div key={type.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      style={{ backgroundColor: type.color || "#3B82F6" }}
                      className="text-white"
                    >
                      {type.code}
                    </Badge>
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{type.registrations} 人次</p>
                    <p className="text-xs text-muted-foreground">
                      {type.courseCount} 個課程
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 近期課程報名 */}
        <Card>
          <CardHeader>
            <CardTitle>近期課程報名</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseStats.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(course.date).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {course._count.registrations} 人
                  </Badge>
                </div>
              ))}
              {courseStats.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  今年尚無課程
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 各分會參與統計 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hasPermissionFilter ? "負責分會參與統計" : "各分會參與統計"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chapterRegistrations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>分會</TableHead>
                  <TableHead className="text-center">會員人數</TableHead>
                  <TableHead className="text-center">報名人次</TableHead>
                  <TableHead className="text-center">平均報名次數</TableHead>
                  <TableHead className="text-center">參與度</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chapterRegistrations
                  .sort((a, b) => b.totalRegistrations - a.totalRegistrations)
                  .map((chapter, index) => {
                    const maxRegs = Math.max(
                      ...chapterRegistrations.map((c) => c.totalRegistrations)
                    )
                    const percentage =
                      maxRegs > 0
                        ? Math.round((chapter.totalRegistrations / maxRegs) * 100)
                        : 0

                    return (
                      <TableRow key={chapter.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : "bg-amber-600"
                                }`}
                              >
                                {index + 1}
                              </span>
                            )}
                            {chapter.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {chapter.memberCount}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {chapter.totalRegistrations}
                        </TableCell>
                        <TableCell className="text-center">
                          {chapter.avgRegistrations}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-red-500 h-full rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-10">
                              {percentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              無可見分會資料
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
