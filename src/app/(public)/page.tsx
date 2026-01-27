import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { CourseStatus } from "@prisma/client"
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightIcon,
  SparklesIcon,
  TrendingUpIcon,
  AwardIcon,
  GlobeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

async function getHomePageData() {
  const [upcomingCourses, courseCount, memberCount, chapterCount] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        date: { gte: new Date() },
      },
      include: {
        type: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { date: "asc" },
      take: 6,
    }),
    prisma.course.count({
      where: { status: CourseStatus.PUBLISHED },
    }),
    prisma.member.count({
      where: { isActive: true },
    }),
    prisma.chapter.count({
      where: { isActive: true },
    }),
  ])

  return { upcomingCourses, courseCount, memberCount, chapterCount }
}

export default async function HomePage() {
  const { upcomingCourses, courseCount, memberCount, chapterCount } = await getHomePageData()

  return (
    <div className="min-h-screen">
      {/* ============================================================
          Hero Section - Premium Design
          ============================================================ */}
      <section className="relative hero-gradient hero-pattern overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-[#1E40AF]/10 blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative container-wide py-20 sm:py-28 md:py-36 lg:py-44">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-10 animate-fade-in-up">
              <SparklesIcon className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-white/90 tracking-wide">
                2026 培訓課程現已開放報名
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up delay-100 tracking-tight">
              <span className="block leading-[1.1]">專業培訓</span>
              <span
                className="block mt-3 leading-[1.1]"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #E5C55C 50%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                卓越成長
              </span>
            </h1>

            {/* Tagline */}
            <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
              <p className="text-lg sm:text-xl text-white/85 mb-4 leading-relaxed">
                探索 BNI 新北市西B區的精選培訓課程
              </p>
              <p className="text-sm text-white/60 font-light tracking-widest leading-relaxed">
                Excellence Through Connection · つながりから卓越へ
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> · </span>
                연결에서 탁월함으로 · Per Nexum ad Excellentiam
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 animate-fade-in-up delay-300">
              <Link href="/courses">
                <Button className="btn-gold text-base px-8 py-4 h-auto group tracking-wide">
                  瀏覽課程
                  <ArrowRightIcon className="ml-2.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-base px-8 py-4 h-auto border-white/30 text-white hover:bg-white/10 hover:text-white tracking-wide"
                >
                  立即登入
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="var(--background)"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================
          Stats Section
          ============================================================ */}
      <section className="section-padding -mt-1">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {[
              { value: courseCount, label: "培訓課程", labelEn: "Courses", icon: CalendarIcon },
              { value: memberCount || "500+", label: "活躍會員", labelEn: "Members", icon: UsersIcon },
              { value: chapterCount, label: "分會", labelEn: "Chapters", icon: GlobeIcon },
              { value: "10K+", label: "年度引薦", labelEn: "Referrals", icon: TrendingUpIcon },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="card-premium p-5 sm:p-6 lg:p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0F172A]/5 mb-4 sm:mb-5">
                  <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#0F172A]" />
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                  {stat.label}
                  <span className="block text-xs sm:text-sm opacity-60 mt-0.5">{stat.labelEn}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Featured Courses Section
          ============================================================ */}
      <section className="section-padding">
        <div className="container-wide">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-12 lg:mb-14">
            <div>
              <div className="inline-flex items-center gap-2.5 text-[#D4AF37] text-sm font-medium mb-4 tracking-wide">
                <AwardIcon className="h-4 w-4" />
                <span>精選課程 Featured Courses</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                即將開課
              </h2>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg leading-relaxed">
                為您推薦最適合的培訓課程
              </p>
            </div>
            <Link
              href="/courses"
              className="mt-6 md:mt-0 inline-flex items-center gap-2.5 text-[#0F172A] font-medium hover:text-[#D4AF37] transition-colors group"
            >
              <span className="tracking-wide">查看全部課程</span>
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Course Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {upcomingCourses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group card-premium overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Type Banner */}
                <div
                  className="h-1.5 sm:h-2"
                  style={{ backgroundColor: course.type.color || "#0F172A" }}
                />

                <div className="p-5 sm:p-6 lg:p-7">
                  {/* Type Badge */}
                  <div
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-4 sm:mb-5 tracking-wide"
                    style={{
                      backgroundColor: `${course.type.color || "#3B82F6"}15`,
                      color: course.type.color || "#3B82F6",
                    }}
                  >
                    {course.type.name}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-4 sm:mb-5 leading-snug tracking-tight">
                    {course.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="space-y-2.5 sm:space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                      <span className="leading-relaxed">
                        {new Date(course.date).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClockIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                      <span>{course.startTime} - {course.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-4 w-4 text-[#D4AF37] flex-shrink-0" />
                      <span className="line-clamp-1">{course.location}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>{course._count.registrations} 人已報名</span>
                    </div>
                    <span className="text-sm font-medium text-[#0F172A] group-hover:text-[#D4AF37] transition-colors tracking-wide">
                      查看詳情 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA Section
          ============================================================ */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl hero-gradient hero-pattern">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
            </div>

            <div className="relative px-6 py-14 sm:px-10 sm:py-16 md:px-16 md:py-20 lg:px-20 lg:py-24 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight leading-tight max-w-2xl mx-auto">
                準備好開始您的學習之旅了嗎？
              </h2>
              <p className="text-white/75 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                加入 BNI 新北市西B區，與數百位優秀企業家一同成長，拓展您的商業網絡
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                <Link href="/courses">
                  <Button className="btn-gold text-base px-8 py-4 h-auto tracking-wide">
                    立即瀏覽課程
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-base px-8 py-4 h-auto border-white/30 text-white hover:bg-white/10 hover:text-white tracking-wide"
                  >
                    登入會員
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          Footer
          ============================================================ */}
      <footer className="border-t border-border bg-card">
        <div className="container-wide py-10 sm:py-12 lg:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0F172A] flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">B</span>
              </div>
              <div>
                <p className="font-semibold text-foreground tracking-tight">BNI 新北市西B區</p>
                <p className="text-sm text-muted-foreground mt-0.5">卓越源於連結</p>
              </div>
            </div>

            {/* Tagline in all languages */}
            <div className="text-center text-sm text-muted-foreground leading-relaxed tracking-wide">
              <p>Excellence Through Connection · つながりから卓越へ</p>
              <p className="mt-1">연결에서 탁월함으로 · Per Nexum ad Excellentiam</p>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground tracking-wide">
              © 2026 BNI Xinbei West B
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
