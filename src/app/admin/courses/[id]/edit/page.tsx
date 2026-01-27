import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { CourseForm } from "@/components/courses/CourseForm"
import { ArrowLeftIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params

  const [course, courseTypes] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
    }),
    prisma.courseType.findMany({
      orderBy: { code: "asc" },
    }),
  ])

  if (!course) {
    notFound()
  }

  // 轉換資料格式
  const initialData = {
    id: course.id,
    title: course.title,
    description: course.description || "",
    bannerUrl: course.bannerUrl || "",
    typeId: course.typeId,
    date: course.date.toISOString().split("T")[0],
    startTime: course.startTime,
    endTime: course.endTime,
    location: course.location,
    address: course.address || "",
    capacity: course.capacity?.toString() || "",
    deadline: course.deadline ? course.deadline.toISOString().split("T")[0] : "",
    status: course.status,
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/courses"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        返回課程列表
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">編輯課程</h1>
        <p className="text-muted-foreground mt-1">
          修改課程資訊
        </p>
      </div>

      <CourseForm
        courseTypes={courseTypes}
        initialData={initialData}
        isEditing
      />
    </div>
  )
}
