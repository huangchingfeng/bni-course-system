import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeftIcon,
  PencilIcon,
  DownloadIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react"
import { CourseStatus, RegistrationStatus } from "@prisma/client"

interface PageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<CourseStatus, string> = {
  DRAFT: "草稿",
  PUBLISHED: "已發布",
  CLOSED: "已截止",
  CANCELLED: "已取消",
}

const regStatusLabels: Record<RegistrationStatus, string> = {
  REGISTERED: "已報名",
  CANCELLED: "已取消",
  ATTENDED: "已出席",
  NO_SHOW: "未出席",
}

export default async function AdminCourseDetailPage({ params }: PageProps) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      type: true,
      registrations: {
        include: {
          member: {
            include: {
              chapter: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!course) {
    notFound()
  }

  const registeredCount = course.registrations.filter(
    (r) => r.status === "REGISTERED"
  ).length

  const courseDate = new Date(course.date)
  const formattedDate = courseDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  // 按分會統計
  const chapterStats = course.registrations
    .filter((r) => r.status === "REGISTERED")
    .reduce((acc, reg) => {
      const chapterName = reg.member.chapter?.displayName || reg.member.chapterName || "未知分會"
      acc[chapterName] = (acc[chapterName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          返回課程列表
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${id}/edit`}>
            <Button variant="outline">
              <PencilIcon className="h-4 w-4 mr-2" />
              編輯課程
            </Button>
          </Link>
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            匯出名單
          </Button>
        </div>
      </div>

      {/* 課程資訊 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    style={{ backgroundColor: course.type.color || "#3B82F6" }}
                    className="text-white mb-2"
                  >
                    {course.type.code} - {course.type.name}
                  </Badge>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {statusLabels[course.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{course.startTime} - {course.endTime}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{course.location}</span>
                  {course.address && (
                    <span className="text-muted-foreground">({course.address})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {registeredCount} 人報名
                    {course.capacity && ` / ${course.capacity} 人上限`}
                  </span>
                </div>
              </div>
              {course.description && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {course.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 分會統計 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">各分會報名統計</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(chapterStats).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(chapterStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([chapter, count]) => (
                    <div
                      key={chapter}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm">{chapter}</span>
                      <Badge variant="secondary">{count} 人</Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                尚無報名
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 報名名單 */}
      <Card>
        <CardHeader>
          <CardTitle>報名名單 ({registeredCount} 人)</CardTitle>
        </CardHeader>
        <CardContent>
          {course.registrations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>分會</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>電話</TableHead>
                  <TableHead>報名時間</TableHead>
                  <TableHead>狀態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.registrations.map((reg, index) => (
                  <TableRow
                    key={reg.id}
                    className={reg.status !== "REGISTERED" ? "opacity-50" : ""}
                  >
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {reg.member.name}
                    </TableCell>
                    <TableCell>{reg.member.chapter?.displayName || reg.member.chapterName || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {reg.member.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {reg.member.phone || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(reg.createdAt).toLocaleString("zh-TW")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={reg.status === "REGISTERED" ? "default" : "secondary"}
                      >
                        {regStatusLabels[reg.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              尚無報名紀錄
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
