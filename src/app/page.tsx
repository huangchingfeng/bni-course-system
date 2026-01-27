import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { CourseCard } from "@/components/courses/CourseCard"
import { Button } from "@/components/ui/button"
import {
  ArrowRightIcon,
  CalendarIcon,
  UsersIcon,
  GlobeIcon,
  SparklesIcon,
  HandshakeIcon,
  TargetIcon,
  TrendingUpIcon,
  GraduationCapIcon,
  MapPinIcon,
} from "lucide-react"
import { CourseStatus } from "@prisma/client"

// 新北市西B區華字輩分會列表（2025年12月資料）
const chapters = [
  "華one", "華冠", "華創育", "華地產", "華橋",
  "華聯", "華路", "華旅", "華綠", "華軍",
  "華豐", "華榮", "華網", "華心", "華醫",
  "華億", "華餐飲", "華泰", "華資", "華晁",
]

// 培訓核心價值
const coreValues = [
  {
    icon: GraduationCapIcon,
    title: "深入了解 BNI 系統",
    description: "透過系統化培訓，全面認識 BNI 的運作方式與核心理念，讓你更有效地運用這個平台。",
    color: "#DC2626",
  },
  {
    icon: HandshakeIcon,
    title: "連結不同分會夥伴",
    description: "培訓是跨分會交流的最佳機會，認識來自華字輩各分會的優秀夥伴，拓展你的人脈網絡。",
    color: "#2563EB",
  },
  {
    icon: TargetIcon,
    title: "打造你的 Power Team",
    description: "學習如何在分會內建立產業鏈合作團隊，創造倍數成長的引薦效益。",
    color: "#059669",
  },
  {
    icon: GlobeIcon,
    title: "引薦國際化",
    description: "透過進階培訓，學習對接全世界各國的 BNI 夥伴，讓你的生意版圖走向國際。",
    color: "#7C3AED",
  },
]

export default async function HomePage() {
  // 取得即將舉行的課程（最多 6 個）
  const upcomingCourses = await prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      date: {
        gte: new Date(),
      },
    },
    include: {
      type: true,
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { date: "asc" },
    take: 6,
  })

  // 取得統計數據
  const [totalCourses, totalMembers, totalRegistrations] = await Promise.all([
    prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
    prisma.member.count({ where: { isActive: true } }),
    prisma.registration.count({ where: { status: "REGISTERED" } }),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#991B1B] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-black/10 blur-3xl" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <MapPinIcon className="h-4 w-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">新北市西B區 · 華字輩聯合培訓</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              透過培訓
              <span className="block mt-2 text-white/90">成為更好的 BNI 夥伴</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              一站式培訓報名平台，輕鬆瀏覽、快速報名。
              <br className="hidden sm:block" />
              登入後一鍵完成報名，不用重複填寫資料。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white !text-[#0F172A] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  瀏覽培訓
                  <ArrowRightIcon className="h-4 w-4 ml-2 text-[#0F172A]" />
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-[#0F172A] bg-white/90 hover:bg-transparent hover:text-white transition-colors backdrop-blur-sm"
                >
                  會員學習指引
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">{totalCourses}</div>
                  <div className="text-sm text-white/70 mt-1">開放培訓</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">{chapters.length}</div>
                  <div className="text-sm text-white/70 mt-1">合作分會</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white">{totalRegistrations}</div>
                  <div className="text-sm text-white/70 mt-1">累計報名</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 text-[#DC2626] text-sm font-medium mb-4">
              <SparklesIcon className="h-4 w-4" />
              <span>培訓的價值</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-4">
              為什麼要參加培訓？
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
              培訓不只是學習，更是拓展人脈、提升能力的最佳途徑
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {coreValues.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="group p-6 lg:p-8 rounded-2xl bg-[#FAFBFC] border border-[#E2E8F0]/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${value.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: value.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-[#64748B] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-16 md:py-20 bg-[#FAFBFC] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#DC2626] text-sm font-medium mb-4">
              <UsersIcon className="h-4 w-4" />
              <span>合作分會</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
              新北市西B區華字輩分會
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              {chapters.length} 個分會共同學習、共同成長
            </p>
          </div>

          {/* Chapter Tags */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter}
                className="px-5 py-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-sm text-[#0F172A] font-medium hover:border-[#DC2626]/30 hover:shadow-md transition-all duration-200"
              >
                {chapter}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Courses Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[#DC2626] text-sm font-medium mb-4">
                <CalendarIcon className="h-4 w-4" />
                <span>即將開課</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                即將舉行的培訓
              </h2>
              <p className="text-[#64748B] mt-2">
                快來報名參加，提升您的專業能力
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="gap-2">
                查看全部培訓
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Courses Grid */}
          {upcomingCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    date: course.date.toISOString(),
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FAFBFC] rounded-2xl border border-[#E2E8F0]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                <CalendarIcon className="h-8 w-8 text-[#94A3B8]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                目前沒有開放報名的培訓
              </h3>
              <p className="text-[#64748B]">
                請稍後再來查看，或聯繫管理員了解更多資訊
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-6">
              <TrendingUpIcon className="h-4 w-4" />
              <span>開始你的學習之旅</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6">
              準備好成為更好的 BNI 夥伴了嗎？
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              瀏覽即將開課的培訓，立即報名，
              <br className="hidden sm:block" />
              開始你的成長之旅
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button variant="gold" size="lg" className="w-full sm:w-auto !text-[#0F172A]">
                  <CalendarIcon className="h-4 w-4 text-[#0F172A]" />
                  瀏覽所有培訓
                </Button>
              </Link>
              <Link href="/guide">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  了解會員指引
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#0F172A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#0F172A]">B</span>
                </div>
                <span className="font-semibold text-white">BNI 新北市西B區</span>
              </div>
              <p className="text-sm text-white/50">
                華字輩聯合培訓報名系統
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/50">
              <Link href="/courses" className="hover:text-white transition-colors">
                培訓總覽
              </Link>
              <Link href="/guide" className="hover:text-white transition-colors">
                會員指引
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                登入
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/40">
            &copy; {new Date().getFullYear()} BNI 新北市西B區. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
