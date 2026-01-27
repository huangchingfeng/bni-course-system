import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { RegisterButton } from "@/components/registrations/RegisterButton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  UserIcon,
  InfoIcon,
  ListIcon,
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const course = await prisma.course.findUnique({
    where: { id },
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
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: { registrations: true },
      },
    },
  })

  if (!course) {
    notFound()
  }

  // 檢查當前用戶是否已報名
  let userRegistration = null
  if (session) {
    userRegistration = await prisma.registration.findUnique({
      where: {
        memberId_courseId: {
          memberId: session.user.id,
          courseId: id,
        },
      },
    })
  }

  const isRegistered = userRegistration?.status === "REGISTERED"
  const isFull = course.capacity !== null && course._count.registrations >= course.capacity
  const isDeadlinePassed = course.deadline ? new Date() > course.deadline : false

  const courseDate = new Date(course.date)
  const formattedDate = courseDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container-wide py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            返回課程列表
          </Link>
        </div>
      </div>

      {/* Banner Section */}
      {course.bannerUrl && (
        <div className="bg-[#0F172A]">
          <div className="container-wide">
            <div className="relative aspect-[3/1] md:aspect-[4/1] overflow-hidden">
              <img
                src={course.bannerUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container-wide py-10 md:py-14">
          <div className="max-w-3xl">
            {/* Type Badge */}
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{
                backgroundColor: `${course.type.color}15`,
                color: course.type.color || "#0F172A",
              }}
            >
              {course.type.code} · {course.type.name}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-[#64748B]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-[#D4AF37]" />
                <span>{course.startTime} - {course.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-[#D4AF37]" />
                <span>{course.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-wide py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E2E8F0]/60 bg-[#F8FAFC]/50">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5 text-[#D4AF37]" />
                  <h2 className="text-lg font-semibold text-[#0F172A]">課程資訊</h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#F1F5F9]">
                    <CalendarIcon className="h-5 w-5 text-[#64748B]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">日期</p>
                    <p className="font-medium text-[#0F172A]">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#F1F5F9]">
                    <ClockIcon className="h-5 w-5 text-[#64748B]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">時間</p>
                    <p className="font-medium text-[#0F172A]">{course.startTime} - {course.endTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#F1F5F9]">
                    <MapPinIcon className="h-5 w-5 text-[#64748B]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B] mb-1">地點</p>
                    <p className="font-medium text-[#0F172A]">{course.location}</p>
                    {course.address && (
                      <p className="text-sm text-[#64748B] mt-1">{course.address}</p>
                    )}
                  </div>
                </div>


                {course.deadline && (
                  <div className="pt-4 border-t border-[#E2E8F0]/60">
                    <p className="text-sm text-[#64748B]">
                      報名截止：
                      <span className={isDeadlinePassed ? "text-[#DC2626]" : "text-[#0F172A] font-medium"}>
                        {new Date(course.deadline).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {isDeadlinePassed && " (已截止)"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 課程介紹 (from CourseType) */}
            {course.type.longDescription && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E2E8F0]/60 bg-[#F8FAFC]/50">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-[#D4AF37]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">課程介紹</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm max-w-none text-[#334155] leading-relaxed">
                    {course.type.longDescription.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                  {course.type.pricingInfo && (
                    <div className="mt-5 p-4 rounded-xl bg-[#FFFBEB] border border-[#D4AF37]/20">
                      <p className="text-sm font-medium text-[#92400E]">
                        費用：{course.type.pricingInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Description */}
            {course.description && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E2E8F0]/60 bg-[#F8FAFC]/50">
                  <div className="flex items-center gap-2">
                    <ListIcon className="h-5 w-5 text-[#D4AF37]" />
                    <h2 className="text-lg font-semibold text-[#0F172A]">課程說明</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm max-w-none text-[#334155] leading-relaxed">
                    {course.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Registration List (Admin/Leader only) */}
            {session?.user.role !== "MEMBER" && course.registrations.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E2E8F0]/60 bg-[#F8FAFC]/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-[#D4AF37]" />
                      <h2 className="text-lg font-semibold text-[#0F172A]">報名名單</h2>
                    </div>
                    <Badge variant="secondary">{course.registrations.length} 人</Badge>
                  </div>
                </div>
                <div className="divide-y divide-[#E2E8F0]/60">
                  {course.registrations.map((reg, index) => (
                    <div key={reg.member.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-sm font-medium text-[#D4AF37]">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-[#0F172A]">{reg.member.name}</p>
                          <p className="text-sm text-[#64748B]">{reg.member.chapter?.displayName || reg.member.chapterName || "-"}</p>
                        </div>
                      </div>
                      <CheckCircleIcon className="h-5 w-5 text-[#059669]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
              {/* Header */}
              <div
                className="h-2"
                style={{ backgroundColor: course.type.color || "#0F172A" }}
              />
              <div className="px-6 py-5 border-b border-[#E2E8F0]/60">
                <h2 className="text-lg font-semibold text-[#0F172A]">報名此課程</h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {session ? (
                  <>
                    {/* User Info */}
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#D4AF37]">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{session.user.name}</p>
                          <p className="text-sm text-[#64748B]">{session.user.chapterName}</p>
                        </div>
                      </div>
                      {isRegistered && (
                        <div className="flex items-center gap-2 text-sm text-[#059669]">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>您已報名此課程</span>
                        </div>
                      )}
                    </div>

                    {/* Status Messages */}
                    {isDeadlinePassed && !isRegistered && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#D97706]/5 border border-[#D97706]/20">
                        <AlertCircleIcon className="h-5 w-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[#D97706]">報名已截止</p>
                          <p className="text-sm text-[#D97706]/80 mt-1">
                            此課程的報名期限已過
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-[#64748B]" />
                    </div>
                    <p className="text-[#64748B] mb-1">請先登入以報名此課程</p>
                    <p className="text-sm text-[#94A3B8]">
                      登入後即可一鍵報名
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <RegisterButton
                    courseId={id}
                    isRegistered={isRegistered}
                    registrationId={userRegistration?.id}
                    isFull={isFull}
                    isDeadlinePassed={isDeadlinePassed}
                  />

                  {!session && (
                    <Link href="/login" className="block">
                      <Button variant="gold" className="w-full">
                        登入報名
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
