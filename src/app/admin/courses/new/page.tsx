import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { CourseForm } from "@/components/courses/CourseForm"
import { ArrowLeftIcon } from "lucide-react"

export default async function NewCoursePage() {
  const courseTypes = await prisma.courseType.findMany({
    orderBy: { code: "asc" },
  })

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
        <h1 className="text-3xl font-bold text-gray-900">新增課程</h1>
        <p className="text-muted-foreground mt-1">
          建立新的培訓課程
        </p>
      </div>

      <CourseForm courseTypes={courseTypes} />
    </div>
  )
}
