import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react"

export default async function AdminDashboardPage() {
  // 取得統計數據
  const [
    totalCourses,
    publishedCourses,
    totalMembers,
    totalChapters,
    totalRegistrations,
    upcomingCourses,
    recentRegistrations,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.member.count({ where: { isActive: true } }),
    prisma.chapter.count({ where: { isActive: true } }),
    prisma.registration.count({ where: { status: "REGISTERED" } }),
    prisma.course.count({
      where: {
        status: "PUBLISHED",
        date: { gte: new Date() },
      },
    }),
    prisma.registration.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: { status: "REGISTERED" },
      include: {
        member: {
          select: {
            name: true,
            chapterName: true,
            chapter: { select: { displayName: true } },
          },
        },
        course: {
          select: { title: true, date: true },
        },
      },
    }),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">儀表板</h1>
          <p className="text-muted-foreground mt-1">
            歡迎回來！這是系統總覽
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            新增課程
          </Button>
        </Link>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">總課程數</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {publishedCourses} 個已發布 · {upcomingCourses} 個即將舉行
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">會員人數</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              來自 {totalChapters} 個分會
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">報名人次</CardTitle>
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              累計報名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即將舉行</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCourses}</div>
            <p className="text-xs text-muted-foreground">
              個課程
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近報名 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>最近報名</CardTitle>
            <Link href="/admin/stats">
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {recentRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{reg.member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reg.member.chapter?.displayName || reg.member.chapterName || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm truncate max-w-[200px]">
                        {reg.course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(reg.createdAt).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                尚無報名紀錄
              </p>
            )}
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/courses/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <PlusIcon className="h-4 w-4 mr-2" />
                新增課程
              </Button>
            </Link>
            <Link href="/admin/members?action=new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <UsersIcon className="h-4 w-4 mr-2" />
                新增會員
              </Button>
            </Link>
            <Link href="/admin/stats" className="block">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUpIcon className="h-4 w-4 mr-2" />
                查看統計報表
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
