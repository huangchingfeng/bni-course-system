import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusIcon, PencilIcon, EyeIcon, UsersIcon, ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react"
import { CourseStatus } from "@prisma/client"

const statusLabels: Record<CourseStatus, string> = {
  DRAFT: "草稿",
  PUBLISHED: "已發布",
  CLOSED: "已截止",
  CANCELLED: "已取消",
}

const statusColors: Record<CourseStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
}

type SortField = "title" | "type" | "date" | "registrations" | "status"
type SortOrder = "asc" | "desc"

function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
}: {
  label: string
  field: SortField
  currentSort: SortField
  currentOrder: SortOrder
}) {
  const isActive = currentSort === field
  const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc"

  return (
    <Link
      href={`/admin/courses?sort=${field}&order=${nextOrder}`}
      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
    >
      {label}
      {isActive ? (
        currentOrder === "asc" ? (
          <ArrowUpIcon className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownIcon className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDownIcon className="h-3.5 w-3.5 text-gray-400" />
      )}
    </Link>
  )
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>
}) {
  const params = await searchParams
  const sortField = (params.sort || "date") as SortField
  const sortOrder = (params.order || "desc") as SortOrder

  // 建立 Prisma orderBy
  const orderBy: Record<string, unknown> = {}
  switch (sortField) {
    case "title":
      orderBy.title = sortOrder
      break
    case "type":
      orderBy.type = { code: sortOrder }
      break
    case "date":
      orderBy.date = sortOrder
      break
    case "registrations":
      orderBy.registrations = { _count: sortOrder }
      break
    case "status":
      orderBy.status = sortOrder
      break
    default:
      orderBy.date = "desc"
  }

  const courses = await prisma.course.findMany({
    include: {
      type: true,
      _count: {
        select: {
          registrations: {
            where: { status: "REGISTERED" },
          },
        },
      },
    },
    orderBy,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">課程管理</h1>
          <p className="text-muted-foreground mt-1">
            共 {courses.length} 個課程
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            新增課程
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="課程名稱" field="title" currentSort={sortField} currentOrder={sortOrder} />
              </TableHead>
              <TableHead>
                <SortHeader label="類型" field="type" currentSort={sortField} currentOrder={sortOrder} />
              </TableHead>
              <TableHead>
                <SortHeader label="日期" field="date" currentSort={sortField} currentOrder={sortOrder} />
              </TableHead>
              <TableHead>時間</TableHead>
              <TableHead>地點</TableHead>
              <TableHead className="text-center">
                <SortHeader label="報名人數" field="registrations" currentSort={sortField} currentOrder={sortOrder} />
              </TableHead>
              <TableHead>
                <SortHeader label="狀態" field="status" currentSort={sortField} currentOrder={sortOrder} />
              </TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium max-w-[200px]">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="hover:underline"
                    >
                      {course.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{ backgroundColor: course.type.color || "#3B82F6" }}
                      className="text-white"
                    >
                      {course.type.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(course.date).toLocaleDateString("zh-TW")}
                  </TableCell>
                  <TableCell>
                    {course.startTime} - {course.endTime}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {course.location}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={course.capacity && course._count.registrations >= course.capacity ? "text-red-600 font-medium" : ""}>
                      {course._count.registrations}
                    </span>
                    {course.capacity && (
                      <span className="text-muted-foreground"> / {course.capacity}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[course.status]}
                    >
                      {statusLabels[course.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" title="查看報名名單">
                          <UsersIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.id}`}>
                        <Button variant="ghost" size="sm" title="前台預覽">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button variant="ghost" size="sm" title="編輯">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <p className="text-muted-foreground mb-4">尚無課程資料</p>
                  <Link href="/admin/courses/new">
                    <Button>建立第一個課程</Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
