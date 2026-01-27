import Link from "next/link"
import {
  BookOpenIcon,
  UsersIcon,
  SparklesIcon,
  TrendingUpIcon,
  AwardIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  GraduationCapIcon,
  HandshakeIcon,
  MicIcon,
  TargetIcon,
  CrownIcon,
  RocketIcon,
  UserPlusIcon,
  CalendarIcon,
  LightbulbIcon,
  HeartHandshakeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseAdvisor } from "@/components/guide/CourseAdvisor"

// 會員類型資料
const memberTypes = [
  {
    id: "new-member",
    icon: UserPlusIcon,
    title: "新會員",
    subtitle: "入會 0-3 個月",
    description: "剛加入 BNI 的夥伴，正在熟悉系統運作與建立人脈基礎",
    color: "#059669",
    bgColor: "#059669",
    characteristics: [
      "剛完成入會審核",
      "正在認識分會夥伴",
      "需要快速了解 BNI 系統",
      "開始進行第一輪一對一",
    ],
    recommendedCourses: [
      { code: "MSP", name: "初階 MSP 成功會員培訓", priority: "必修" },
      { code: "121", name: "一對一工作坊", priority: "推薦" },
    ],
  },
  {
    id: "regular-member",
    icon: UsersIcon,
    title: "一般會員",
    subtitle: "入會 3-12 個月",
    description: "已熟悉基本運作，正在累積引薦經驗與深化人脈關係",
    color: "#2563EB",
    bgColor: "#2563EB",
    characteristics: [
      "已完成初階 MSP",
      "有穩定的一對一習慣",
      "開始給出與收到引薦",
      "了解分會文化與運作",
    ],
    recommendedCourses: [
      { code: "REF", name: "引薦工作坊", priority: "推薦" },
      { code: "PRES", name: "簡報技巧工作坊", priority: "推薦" },
    ],
  },
  {
    id: "senior-member",
    icon: StarIcon,
    title: "資深會員",
    subtitle: "入會 1 年以上",
    description: "經驗豐富的會員，能熟練運用 BNI 系統創造商機",
    color: "#7C3AED",
    bgColor: "#7C3AED",
    characteristics: [
      "有穩定的引薦成績",
      "建立多個 Power Team",
      "協助新會員融入",
      "考慮擔任領導職務",
    ],
    recommendedCourses: [
      { code: "PT", name: "Power Team 工作坊", priority: "推薦" },
      { code: "ADV", name: "進階引薦策略", priority: "推薦" },
      { code: "LT", name: "領導團隊培訓（預備）", priority: "選修" },
    ],
  },
  {
    id: "leadership",
    icon: CrownIcon,
    title: "領導團隊",
    subtitle: "分會幹部成員",
    description: "擔任分會主席、副主席、秘書財務、協調人等職務",
    color: "#D4AF37",
    bgColor: "#D4AF37",
    characteristics: [
      "主席：主持例會與領導團隊",
      "副主席：管理出席與委員會",
      "秘書財務：財務與行政管理",
      "協調人：教育、導師、成長",
    ],
    recommendedCourses: [
      { code: "LT", name: "期初領導團隊培訓", priority: "必修" },
      { code: "DNA", name: "DNA 分會營運培訓", priority: "必修" },
      { code: "M1", name: "M1 董事培訓", priority: "進階" },
    ],
  },
]

// 課程類型資料
const courseCategories = [
  {
    id: "foundation",
    title: "基礎培訓",
    subtitle: "Foundation Training",
    icon: BookOpenIcon,
    color: "#059669",
    description: "新會員必修課程，快速掌握 BNI 系統運作",
    courses: [
      {
        code: "MSP",
        name: "初階 MSP 成功會員培訓",
        duration: "3 小時",
        description: "了解 BNI 核心價值、系統運作、五大基本功",
        topics: ["BNI 核心價值 Givers Gain", "如何成功使用 BNI", "出席的重要性", "每週簡報技巧", "一對一的價值"],
        suitable: "新會員（入會 3 個月內必修）",
      },
    ],
  },
  {
    id: "skills",
    title: "技能工作坊",
    subtitle: "Skill Workshops",
    icon: LightbulbIcon,
    color: "#2563EB",
    description: "提升特定技能，強化引薦與人脈經營能力",
    courses: [
      {
        code: "121",
        name: "一對一工作坊",
        duration: "2 小時",
        description: "掌握一對一訪談技巧，建立深度信任關係",
        topics: ["一對一流程", "八種主題訪談", "GAINS 表格運用", "VCP 關係建立", "訪談效率提升"],
        suitable: "所有會員，特別推薦新會員",
      },
      {
        code: "REF",
        name: "引薦工作坊",
        duration: "2 小時",
        description: "學習給予與收到高品質引薦的方法",
        topics: ["分會成長循環", "三種引薦類型", "年度引薦目標", "引薦流程方法", "實務練習"],
        suitable: "完成初階 MSP 的會員",
      },
      {
        code: "PRES",
        name: "簡報技巧工作坊",
        duration: "2 小時",
        description: "提升每週簡報與主題簡報的表達力",
        topics: ["30/60 秒簡報結構", "主題簡報設計", "說故事技巧", "視覺輔助運用", "克服緊張技巧"],
        suitable: "所有會員",
      },
      {
        code: "PT",
        name: "Power Team 工作坊",
        duration: "2 小時",
        description: "建立產業鏈合作，創造倍數成長",
        topics: ["Power Team 概念", "產業鏈分析", "合作團隊建立", "共同行銷策略", "案例分享"],
        suitable: "入會 6 個月以上會員",
      },
    ],
  },
  {
    id: "leadership",
    title: "領導培訓",
    subtitle: "Leadership Training",
    icon: AwardIcon,
    color: "#D4AF37",
    description: "分會幹部專屬培訓，提升領導與營運能力",
    courses: [
      {
        code: "LT",
        name: "期初領導團隊培訓",
        duration: "3 小時",
        description: "領導團隊使命、角色定位與職務分工",
        topics: ["領導團隊使命", "各職務角色", "分會營運要點", "團隊協作方法", "問題解決流程"],
        suitable: "新任領導團隊成員（必修）",
      },
      {
        code: "DNA",
        name: "DNA 分會營運培訓",
        duration: "半天",
        description: "深度學習分會營運與成長策略",
        topics: ["分會健康指標", "會員維繫策略", "來賓轉換技巧", "分會文化建立", "問題診斷處理"],
        suitable: "領導團隊成員",
      },
      {
        code: "M1",
        name: "M1 用夢想建立團隊",
        duration: "1 天",
        description: "BNI 最高階培訓，學習壯大分會團隊",
        topics: ["分會願景建立", "團隊招募策略", "文化塑造方法", "領導力提升", "成功案例研討"],
        suitable: "分會董事顧問推薦、組隊參加",
      },
      {
        code: "M2",
        name: "M2 用團隊實現夢想",
        duration: "1 天",
        description: "學習營運分會，讓分會自轉運作",
        topics: ["分會自轉機制", "人才培育系統", "營運效率提升", "傳承與交接", "持續成長策略"],
        suitable: "完成 M1 的分會團隊",
      },
    ],
  },
]

// 學習路徑
const learningPaths = [
  {
    title: "新會員入門路徑",
    timeline: "入會前 3 個月",
    icon: RocketIcon,
    color: "#059669",
    steps: [
      { month: "第 1 個月", action: "完成初階 MSP", icon: BookOpenIcon },
      { month: "第 2 個月", action: "參加一對一工作坊", icon: HandshakeIcon },
      { month: "第 3 個月", action: "完成 8 場一對一", icon: CheckCircleIcon },
    ],
  },
  {
    title: "進階成長路徑",
    timeline: "入會 3-12 個月",
    icon: TrendingUpIcon,
    color: "#2563EB",
    steps: [
      { month: "第 4-6 月", action: "引薦工作坊 + 一對一工作坊", icon: TargetIcon },
      { month: "第 7-9 月", action: "簡報工作坊 + Power Team", icon: MicIcon },
      { month: "第 10-12 月", action: "建立穩定引薦循環", icon: SparklesIcon },
    ],
  },
  {
    title: "領導力發展路徑",
    timeline: "入會 1 年以上",
    icon: CrownIcon,
    color: "#D4AF37",
    steps: [
      { month: "預備期", action: "領導團隊培訓", icon: GraduationCapIcon },
      { month: "任職期", action: "DNA 培訓 + 實務運作", icon: AwardIcon },
      { month: "進階期", action: "M1/M2 董事培訓", icon: StarIcon },
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#2563EB]/10 blur-3xl" />
        </div>

        <div className="relative container-wide py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <GraduationCapIcon className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-sm font-medium text-white/90">會員學習指引</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              找到適合你的
              <span className="block mt-2 text-[#D4AF37]">培訓</span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              不論你是剛加入的新會員，還是資深的領導團隊成員，BNI 都有完整的培訓系統幫助你成長。
              了解你的會員階段，找到最適合的學習路徑。
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button variant="gold" size="lg" className="!text-[#0F172A]">
                  <CalendarIcon className="h-4 w-4 text-[#0F172A]" />
                  瀏覽培訓
                </Button>
              </Link>
              <a href="#member-types">
                <Button variant="outline" size="lg" className="border-white/30 text-[#0F172A] bg-white/90 hover:bg-transparent hover:text-white transition-colors">
                  我是哪種會員？
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Member Types Section */}
      <section id="member-types" className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-4">
            <UsersIcon className="h-4 w-4" />
            <span>會員類型</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
            你是哪種會員？
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            點擊下方卡片，了解你目前的會員階段與推薦的培訓課程
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {memberTypes.map((type) => {
            const Icon = type.icon
            return (
              <div
                key={type.id}
                className="group relative bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Color Bar */}
                <div
                  className="h-2"
                  style={{ backgroundColor: type.color }}
                />

                <div className="p-6">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${type.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: type.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                    {type.title}
                  </h3>
                  <p className="text-sm text-[#64748B] mb-3">{type.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                    {type.description}
                  </p>

                  {/* Characteristics */}
                  <div className="space-y-2 mb-4">
                    {type.characteristics.slice(0, 3).map((char, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[#64748B]">
                        <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: type.color }} />
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Courses */}
                  <div className="pt-4 border-t border-[#E2E8F0]/60">
                    <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
                      推薦課程
                    </p>
                    <div className="space-y-2">
                      {type.recommendedCourses.map((course) => (
                        <div
                          key={course.code}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: course.priority === "必修" ? `${type.color}15` : course.priority === "推薦" ? "#F1F5F9" : "#FAFBFC",
                              color: course.priority === "必修" ? type.color : "#64748B",
                            }}
                          >
                            {course.priority}
                          </span>
                          <span className="text-sm text-[#0F172A]">{course.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* AI Course Advisor Section */}
      <section className="bg-gradient-to-b from-[#FAFBFC] to-white">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-4">
                <SparklesIcon className="h-4 w-4" />
                <span>智慧推薦</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
                不確定該上什麼課？
              </h2>
              <p className="text-[#64748B]">
                告訴小助手你的情況，讓 AI 幫你找到最適合的培訓課程
              </p>
            </div>

            <CourseAdvisor />
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="bg-white border-y border-[#E2E8F0]">
        <div className="container-wide py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-4">
              <TrendingUpIcon className="h-4 w-4" />
              <span>學習路徑</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
              循序漸進的成長之路
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">
              BNI 建議的學習時程，幫助你有系統地提升能力
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path) => {
              const PathIcon = path.icon
              return (
                <div key={path.title} className="relative">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${path.color}15` }}
                    >
                      <PathIcon className="h-5 w-5" style={{ color: path.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">{path.title}</h3>
                      <p className="text-sm text-[#64748B]">{path.timeline}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4">
                    {path.steps.map((step, i) => {
                      const StepIcon = step.icon
                      return (
                        <div key={i} className="flex items-start gap-4">
                          <div className="relative flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${path.color}15` }}
                            >
                              <StepIcon className="h-4 w-4" style={{ color: path.color }} />
                            </div>
                            {i < path.steps.length - 1 && (
                              <div
                                className="w-0.5 h-8 mt-2"
                                style={{ backgroundColor: `${path.color}30` }}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-sm font-medium" style={{ color: path.color }}>
                              {step.month}
                            </p>
                            <p className="text-[#0F172A]">{step.action}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section id="courses" className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-4">
            <BookOpenIcon className="h-4 w-4" />
            <span>培訓課程</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
            完整的培訓體系
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            從基礎到進階，從技能到領導，BNI 提供完整的學習資源
          </p>
        </div>

        <div className="space-y-12">
          {courseCategories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <CategoryIcon className="h-6 w-6" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0F172A]">{category.title}</h3>
                    <p className="text-sm text-[#64748B]">{category.subtitle}</p>
                  </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {category.courses.map((course) => (
                    <div
                      key={course.code}
                      className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm p-6 hover:shadow-md transition-all"
                    >
                      {/* Course Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-2"
                            style={{
                              backgroundColor: `${category.color}15`,
                              color: category.color,
                            }}
                          >
                            {course.code}
                          </span>
                          <h4 className="text-lg font-semibold text-[#0F172A]">{course.name}</h4>
                        </div>
                        <span className="text-sm text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-lg">
                          {course.duration}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[#64748B] text-sm mb-4 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Topics */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
                          課程主題
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {course.topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-xs px-2 py-1 bg-[#F8FAFC] text-[#64748B] rounded-md"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Suitable For */}
                      <div className="pt-4 border-t border-[#E2E8F0]/60">
                        <div className="flex items-center gap-2 text-sm">
                          <UsersIcon className="h-4 w-4 text-[#64748B]" />
                          <span className="text-[#64748B]">適合對象：</span>
                          <span className="text-[#0F172A] font-medium">{course.suitable}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* BNI Core Values Section */}
      <section className="bg-[#0F172A]">
        <div className="container-wide py-16 md:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-4">
              <HeartHandshakeIcon className="h-4 w-4" />
              <span>核心理念</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
              Givers Gain® — 付出者收穫
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              BNI 的核心價值是「付出者收穫」。當你幫助別人成功，你也會獲得成功。
              透過培訓，你將學會如何更有效地幫助夥伴，同時也讓自己的事業成長。
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { title: "出席", subtitle: "Attendance", icon: CalendarIcon },
              { title: "培訓", subtitle: "Training", icon: GraduationCapIcon },
              { title: "一對一", subtitle: "One-to-One", icon: HandshakeIcon },
              { title: "邀請來賓", subtitle: "Visitors", icon: UserPlusIcon },
              { title: "引薦", subtitle: "Referrals", icon: TargetIcon },
            ].map((item) => {
              const ItemIcon = item.icon
              return (
                <div
                  key={item.title}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <ItemIcon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.subtitle}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-wide py-16 md:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5C55C] p-8 md:p-12">
          <div className="relative text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">
              準備好開始學習了嗎？
            </h2>
            <p className="text-[#0F172A]/80 mb-8 max-w-xl mx-auto">
              瀏覽即將開課的培訓，立即報名，開始你的成長之旅
            </p>
            <Link href="/courses">
              <Button size="lg" className="bg-[#0F172A] text-white hover:bg-[#1E293B]">
                瀏覽所有培訓
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
