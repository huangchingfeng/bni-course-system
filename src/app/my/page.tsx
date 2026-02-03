import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ExternalLinkIcon,
  TrendingUpIcon,
  AwardIcon,
  BookOpenIcon,
} from "lucide-react"
import { RegistrationStatus } from "@prisma/client"

// 狀態中文對照
const statusLabels: Record<RegistrationStatus, string> = {
  REGISTERED: "已報名",
  CANCELLED: "已取消",
  ATTENDED: "已出席",
  NO_SHOW: "未出席",
}

const statusColors: Record<RegistrationStatus, string> = {
  REGISTERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-700",
  ATTENDED: "bg-blue-100 text-blue-700",
  NO_SHOW: "bg-red-100 text-red-700",
}

export default async function MyRegistrationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/my")
  }

  const registrations = await prisma.registration.findMany({
    where: {
      memberId: session.user.id,
    },
    include: {
      course: {
        include: { type: true },
      },
    },
    orderBy: {
      course: {
        date: "desc",
      },
    },
  })

  // 分類：即將到來 vs 過去的課程
  const now = new Date()
  const upcomingRegistrations = registrations.filter(
    (r) => new Date(r.course.date) >= now && r.status === "REGISTERED"
  )
  const pastRegistrations = registrations.filter(
    (r) => new Date(r.course.date) < now || r.status !== "REGISTERED"
  )

  // 計算培訓統計
  const completedRegistrations = registrations.filter(
    (r) =>
      new Date(r.course.date) < now &&
      (r.status === "REGISTERED" || r.status === "ATTENDED")
  )

  // 按課程類型統計
  const typeStats = completedRegistrations.reduce(
    (acc, reg) => {
      const typeCode = reg.course.type.code
      if (!acc[typeCode]) {
        acc[typeCode] = {
          code: typeCode,
          name: reg.course.type.name,
          color: reg.course.type.color,
          count: 0,
        }
      }
      acc[typeCode].count += 1
      return acc
    },
    {} as Record<string, { code: string; name: string; color: string | null; count: number }>
  )

  const typeStatsArray = Object.values(typeStats).sort((a, b) => b.count - a.count)

  // 計算今年參訓次數
  const currentYear = now.getFullYear()
  const thisYearCount = completedRegistrations.filter(
    (r) => new Date(r.course.date).getFullYear() === currentYear
  ).length

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">我的培訓紀錄</h1>
        <p className="text-muted-foreground mt-2">
          查看您的課程報名與培訓歷程
        </p>
      </div>

      {/* 培訓統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">累計培訓次數</CardTitle>
            <AwardIcon className="h-4 w-4 text-[#D4AF37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRegistrations.length}</div>
            <p className="text-xs text-muted-foreground">
              {thisYearCount > 0 ? `今年參加 ${thisYearCount} 次` : "持續學習中"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即將參加</CardTitle>
            <CalendarIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingRegistrations.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingRegistrations.length > 0
                ? "積極參與培訓"
                : "瀏覽更多課程"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">課程類型</CardTitle>
            <BookOpenIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeStatsArray.length}</div>
            <p className="text-xs text-muted-foreground">
              涵蓋不同培訓類型
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 課程類型統計（如有歷史紀錄） */}
      {typeStatsArray.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4" />
              培訓類型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {typeStatsArray.map((type) => (
                <div
                  key={type.code}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <Badge
                    style={{ backgroundColor: type.color || "#3B82F6" }}
                    className="text-white"
                  >
                    {type.code}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{type.name}</span>
                  <span className="font-semibold">{type.count} 次</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            即將參加 ({upcomingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            歷史紀錄 ({pastRegistrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingRegistrations.length > 0 ? (
            <div className="space-y-4">
              {upcomingRegistrations.map((reg) => (
                <RegistrationCard key={reg.id} registration={reg} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">尚無即將參加的課程</h3>
                <p className="text-muted-foreground mb-4">
                  瀏覽課程列表，找到感興趣的培訓報名參加
                </p>
                <Link href="/courses">
                  <Button>瀏覽課程</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastRegistrations.length > 0 ? (
            <div className="space-y-4">
              {pastRegistrations.map((reg) => (
                <RegistrationCard key={reg.id} registration={reg} showStatus />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">尚無歷史報名紀錄</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RegistrationCardProps {
  registration: {
    id: string
    status: RegistrationStatus
    course: {
      id: string
      title: string
      date: Date
      startTime: string
      endTime: string
      location: string
      type: {
        code: string
        name: string
        color: string | null
      }
    }
  }
  showStatus?: boolean
}

function RegistrationCard({ registration, showStatus }: RegistrationCardProps) {
  const courseDate = new Date(registration.course.date)
  const formattedDate = courseDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge
              style={{ backgroundColor: registration.course.type.color || "#3B82F6" }}
              className="text-white"
            >
              {registration.course.type.code}
            </Badge>
            {showStatus && (
              <Badge variant="secondary" className={statusColors[registration.status]}>
                {statusLabels[registration.status]}
              </Badge>
            )}
          </div>
          <Link href={`/courses/${registration.course.id}`}>
            <Button variant="ghost" size="sm">
              <ExternalLinkIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardTitle className="text-lg">
          {registration.course.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span>{registration.course.startTime} - {registration.course.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{registration.course.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
