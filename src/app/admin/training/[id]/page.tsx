import { notFound } from "next/navigation"
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
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  BuildingIcon,
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrainingDetailPage({ params }: PageProps) {
  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      type: true,
      registrations: {
        where: { status: "REGISTERED" },
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

  const registeredCount = course.registrations.length

  const courseDate = new Date(course.date)
  const formattedDate = courseDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  const isPast = courseDate < new Date()

  // 按分會統計
  const chapterStats = course.registrations.reduce(
    (acc, reg) => {
      const chapterName =
        reg.member.chapter?.displayName || reg.member.chapterName || "未知分會"
      if (!acc[chapterName]) {
        acc[chapterName] = { count: 0, members: [] as string[] }
      }
      acc[chapterName].count += 1
      acc[chapterName].members.push(reg.member.name)
      return acc
    },
    {} as Record<string, { count: number; members: string[] }>
  )

  const chapterCount = Object.keys(chapterStats).length

  return (
    <div className="p-8">
      {/* 返回 */}
      <Link
        href="/admin/training"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        返回培訓管理
      </Link>

      {/* 課程資訊頭部 */}
      <div className="bg-white rounded-xl border overflow-hidden mb-6">
        <div
          className="h-2"
          style={{ backgroundColor: course.type.color || "#3B82F6" }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge
                style={{ backgroundColor: course.type.color || "#3B82F6" }}
                className="text-white mb-2"
              >
                {course.type.code} · {course.type.name}
              </Badge>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
            </div>
            {isPast && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                已結束
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              <span>
                {course.startTime} - {course.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <span>
                {registeredCount} 人報名
                {course.capacity && ` / ${course.capacity} 上限`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-muted-foreground">參加人數</span>
          </div>
          <p className="text-3xl font-bold">{registeredCount}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-2">
            <BuildingIcon className="h-4 w-4 text-[#2563EB]" />
            <span className="text-sm text-muted-foreground">參加分會數</span>
          </div>
          <p className="text-3xl font-bold">{chapterCount}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-2">
            <UsersIcon className="h-4 w-4 text-[#059669]" />
            <span className="text-sm text-muted-foreground">平均每分會</span>
          </div>
          <p className="text-3xl font-bold">
            {chapterCount > 0
              ? (registeredCount / chapterCount).toFixed(1)
              : 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 參加者名單 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-[#D4AF37]" />
                參加者名單（{registeredCount} 人）
              </h2>
            </div>
            {course.registrations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>分會</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>報名時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.registrations.map((reg, index) => (
                    <TableRow key={reg.id}>
                      <TableCell className="text-muted-foreground font-mono">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {reg.member.name}
                      </TableCell>
                      <TableCell>
                        {reg.member.chapter?.displayName ||
                          reg.member.chapterName ||
                          "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {reg.member.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(reg.createdAt).toLocaleDateString("zh-TW")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                尚無人報名
              </div>
            )}
          </div>
        </div>

        {/* 分會統計 */}
        <div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BuildingIcon className="h-5 w-5 text-[#2563EB]" />
                分會分佈（{chapterCount} 個分會）
              </h2>
            </div>
            {chapterCount > 0 ? (
              <div className="divide-y">
                {Object.entries(chapterStats)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([chapter, data]) => (
                    <div key={chapter} className="px-6 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{chapter}</span>
                        <Badge variant="secondary">{data.count} 人</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.members.join("、")}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                尚無報名資料
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
