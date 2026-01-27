"use client"

import Link from "next/link"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "lucide-react"

interface CourseType {
  id: string
  code: string
  name: string
  color: string | null
}

interface Course {
  id: string
  title: string
  description: string | null
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number | null
  type: CourseType
  _count: {
    registrations: number
  }
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const courseDate = new Date(course.date)
  const formattedDate = courseDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  })

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block h-full"
    >
      <div className="relative h-full bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D4AF37]/30 hover:-translate-y-1">
        {/* Color Bar */}
        <div
          className="h-1.5"
          style={{ backgroundColor: course.type.color || "#0F172A" }}
        />

        <div className="p-6">
          {/* Header: Badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{
                backgroundColor: `${course.type.color}15`,
                color: course.type.color || "#0F172A",
              }}
            >
              {course.type.code}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#0F172A] leading-snug mb-4 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
            {course.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-3 text-sm text-[#64748B]">
              <CalendarIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#64748B]">
              <ClockIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
              <span>{course.startTime} - {course.endTime}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#64748B]">
              <MapPinIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
              <span className="line-clamp-1">{course.location}</span>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-[#E2E8F0]/60">
            <span className="inline-flex items-center text-sm font-medium text-[#0F172A] group-hover:text-[#D4AF37] transition-colors">
              查看詳情
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
