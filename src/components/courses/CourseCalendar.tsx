"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  XIcon,
  ArrowRightIcon,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string | null
  date: string
  startTime: string
  endTime: string
  location: string
  type: {
    code: string
    name: string
    color: string | null
    longDescription?: string | null
    pricingInfo?: string | null
  }
}

interface CourseCalendarProps {
  courses: Course[]
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]
const MONTHS = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月"
]

export function CourseCalendar({ courses }: CourseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 取得當月第一天和最後一天
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)

  // 取得當月第一天是星期幾
  const firstDayWeekday = firstDayOfMonth.getDay()

  // 取得當月天數
  const daysInMonth = lastDayOfMonth.getDate()

  // 建立日曆格子
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []

    // 前面的空白格
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null)
    }

    // 當月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }, [firstDayWeekday, daysInMonth])

  // 建立日期對應課程的 Map
  const coursesByDate = useMemo(() => {
    const map = new Map<string, Course[]>()

    courses.forEach((course) => {
      const courseDate = new Date(course.date)
      if (
        courseDate.getFullYear() === year &&
        courseDate.getMonth() === month
      ) {
        const dateKey = courseDate.getDate().toString()
        if (!map.has(dateKey)) {
          map.set(dateKey, [])
        }
        map.get(dateKey)!.push(course)
      }
    })

    return map
  }, [courses, year, month])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isToday = (day: number) =>
    new Date().getFullYear() === year &&
    new Date().getMonth() === month &&
    new Date().getDate() === day

  const isPastDay = (day: number) => {
    const d = new Date(year, month, day)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  // 點擊背景關閉 modal
  useEffect(() => {
    if (!selectedCourse) return

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSelectedCourse(null)
      }
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCourse(null)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [selectedCourse])

  const formatCourseDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0]/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#0F172A]">
              {year} 年 {MONTHS[month]}
            </h2>
            <Button variant="outline" size="sm" onClick={goToToday}>
              今天
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-[#E2E8F0]/60">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`px-2 py-3 text-center text-sm font-medium ${
                index === 0 ? "text-[#DC2626]" : index === 6 ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const coursesOnDay = day ? coursesByDate.get(day.toString()) || [] : []
            const weekday = index % 7

            return (
              <div
                key={index}
                className={`min-h-[120px] border-b border-r border-[#E2E8F0]/60 p-2 ${
                  day === null ? "bg-[#F8FAFC]" : ""
                } ${weekday === 6 ? "border-r-0" : ""}`}
              >
                {day !== null && (
                  <>
                    {/* Date Number */}
                    <div
                      className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1 ${
                        isToday(day)
                          ? "bg-[#DC2626] text-white"
                          : weekday === 0
                          ? "text-[#DC2626]"
                          : weekday === 6
                          ? "text-[#2563EB]"
                          : "text-[#0F172A]"
                      }`}
                    >
                      {day}
                    </div>

                    {/* Courses on this day */}
                    <div className="space-y-1">
                      {coursesOnDay.slice(0, 3).map((course) => {
                        const past = isPastDay(day)
                        return (
                          <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="block w-full text-left"
                          >
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium truncate transition-opacity cursor-pointer ${
                                past ? "opacity-40" : "hover:opacity-80"
                              }`}
                              style={{
                                backgroundColor: past
                                  ? "#F1F5F9"
                                  : `${course.type.color || "#3B82F6"}15`,
                                color: past
                                  ? "#94A3B8"
                                  : course.type.color || "#3B82F6",
                                borderLeft: `3px solid ${
                                  past ? "#CBD5E1" : course.type.color || "#3B82F6"
                                }`,
                              }}
                              title={`${course.title} (${course.startTime}-${course.endTime})`}
                            >
                              {course.type.name}
                            </div>
                          </button>
                        )
                      })}
                      {coursesOnDay.length > 3 && (
                        <div className="text-xs text-[#64748B] px-1">
                          +{coursesOnDay.length - 3} 更多
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="px-6 py-4 border-t border-[#E2E8F0]/60 bg-[#F8FAFC]">
          <div className="flex flex-wrap gap-4">
            {Array.from(new Set(courses.map((c) => JSON.stringify({ code: c.type.code, name: c.type.name, color: c.type.color }))))
              .map((str) => JSON.parse(str))
              .slice(0, 6)
              .map((type: { code: string; name: string; color: string | null }) => (
                <div key={type.code} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: type.color || "#3B82F6" }}
                  />
                  <span className="text-xs text-[#64748B]">
                    {type.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* 頂部色條 */}
            <div
              className="h-2"
              style={{ backgroundColor: selectedCourse.type.color || "#3B82F6" }}
            />

            {/* 關閉按鈕 */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F1F5F9] transition-colors text-[#64748B] hover:text-[#0F172A]"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="p-6">
              {/* 類型標籤 */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  backgroundColor: `${selectedCourse.type.color}15`,
                  color: selectedCourse.type.color || "#0F172A",
                }}
              >
                {selectedCourse.type.code} · {selectedCourse.type.name}
              </span>

              {/* 標題 */}
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">
                {selectedCourse.title}
              </h3>

              {/* 基本資訊 */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <CalendarIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                  <span>{formatCourseDate(selectedCourse.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <ClockIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                  <span>{selectedCourse.startTime} - {selectedCourse.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#64748B]">
                  <MapPinIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                  <span>{selectedCourse.location}</span>
                </div>
              </div>

              {/* 課程介紹摘要 */}
              {selectedCourse.type.longDescription && (
                <div className="mb-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                  <p className="text-sm text-[#334155] leading-relaxed line-clamp-3">
                    {selectedCourse.type.longDescription}
                  </p>
                </div>
              )}

              {/* 費用 */}
              {selectedCourse.type.pricingInfo && (
                <div className="mb-5 px-4 py-2.5 rounded-xl bg-[#FFFBEB] border border-[#D4AF37]/20">
                  <p className="text-sm font-medium text-[#92400E]">
                    費用：{selectedCourse.type.pricingInfo}
                  </p>
                </div>
              )}

              {/* 按鈕 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
                >
                  關閉
                </button>
                <Link
                  href={`/courses/${selectedCourse.id}`}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0F172A] hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2"
                >
                  查看詳情
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
