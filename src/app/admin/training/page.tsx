import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  UsersIcon,
  BuildingIcon,
  CalendarIcon,
  ClipboardListIcon,
  ChevronRightIcon,
} from "lucide-react"

export default async function AdminTrainingPage() {
  const courses = await prisma.course.findMany({
    include: {
      type: true,
      registrations: {
        where: { status: "REGISTERED" },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              chapterName: true,
              chapter: {
                select: { displayName: true },
              },
            },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  })

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  // 統計
  const totalRegistrations = courses.reduce(
    (sum, c) => sum + c.registrations.length,
    0
  )
  const upcomingCourses = courses.filter((c) => new Date(c.date) >= now)
  const pastCourses = courses.filter((c) => new Date(c.date) < now)

  // 計算分會數
  const getChapterCount = (
    registrations: typeof courses[0]["registrations"]
  ) => {
    const chapters = new Set(
      registrations.map(
        (r) => r.member.chapter?.displayName || r.member.chapterName || "未知"
      )
    )
    return chapters.size
  }

  return (
    <div className="p-8">
      {/* 標題 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#0F172A]">
            <ClipboardListIcon className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">培訓管理</h1>
        </div>
        <p className="text-muted-foreground">
          查看每場培訓的參加人數、分會分佈與詳細名單
        </p>
      </div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">總培訓場次</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{courses.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            即將舉行 {upcomingCourses.length} 場
          </p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">總報名人次</span>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{totalRegistrations}</p>
          <p className="text-xs text-muted-foreground mt-1">
            平均每場{" "}
            {courses.length > 0
              ? (totalRegistrations / courses.length).toFixed(1)
              : 0}{" "}
            人
          </p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">已結束場次</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{pastCourses.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">即將舉行</span>
            <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <p className="text-2xl font-bold text-[#D4AF37]">
            {upcomingCourses.length}
          </p>
        </div>
      </div>

      {/* 即將舉行 */}
      {upcomingCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            即將舉行的培訓
          </h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>培訓名稱</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <UsersIcon className="h-3.5 w-3.5" />
                      參加人數
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <BuildingIcon className="h-3.5 w-3.5" />
                      分會數
                    </div>
                  </TableHead>
                  <TableHead className="text-right">詳情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium max-w-[250px]">
                      <Link
                        href={`/admin/training/${course.id}`}
                        className="hover:underline hover:text-[#D4AF37]"
                      >
                        {course.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: course.type.color || "#3B82F6",
                        }}
                        className="text-white"
                      >
                        {course.type.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(course.date).toLocaleDateString("zh-TW", {
                        month: "numeric",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.startTime}-{course.endTime}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">
                        {course.registrations.length}
                      </span>
                      {course.capacity && (
                        <span className="text-muted-foreground">
                          {" "}
                          / {course.capacity}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">
                        {getChapterCount(course.registrations)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/training/${course.id}`}>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground hover:text-foreground inline" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* 已結束 */}
      {pastCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            已結束的培訓
          </h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>培訓名稱</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <UsersIcon className="h-3.5 w-3.5" />
                      參加人數
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <BuildingIcon className="h-3.5 w-3.5" />
                      分會數
                    </div>
                  </TableHead>
                  <TableHead className="text-right">詳情</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastCourses
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((course) => (
                    <TableRow
                      key={course.id}
                      className="hover:bg-gray-50 opacity-70"
                    >
                      <TableCell className="font-medium max-w-[250px]">
                        <Link
                          href={`/admin/training/${course.id}`}
                          className="hover:underline"
                        >
                          {course.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: course.type.color || "#3B82F6",
                          }}
                          className="text-white"
                        >
                          {course.type.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(course.date).toLocaleDateString("zh-TW", {
                          month: "numeric",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {course.registrations.length}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {getChapterCount(course.registrations)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/training/${course.id}`}>
                          <ChevronRightIcon className="h-4 w-4 text-muted-foreground hover:text-foreground inline" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
