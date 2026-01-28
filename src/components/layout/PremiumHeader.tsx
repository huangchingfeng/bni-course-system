"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GlobeIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  CalendarIcon,
} from "lucide-react"

// Language options
const languages = [
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "la", name: "Latina", flag: "🏛️" },
]

// Translations for header
const headerTranslations = {
  "zh-TW": {
    brand: "BNI 新北市西B區",
    tagline: "卓越源於連結",
    nav: { home: "首頁", courses: "課程總覽", myCourses: "我的課程", admin: "管理後台" },
    auth: { login: "登入", logout: "登出", profile: "個人資料" },
  },
  en: {
    brand: "BNI Xinbei West B",
    tagline: "Excellence Through Connection",
    nav: { home: "Home", courses: "Courses", myCourses: "My Courses", admin: "Admin" },
    auth: { login: "Sign In", logout: "Sign Out", profile: "Profile" },
  },
  ja: {
    brand: "BNI 新北市西B",
    tagline: "つながりから卓越へ",
    nav: { home: "ホーム", courses: "コース", myCourses: "マイコース", admin: "管理" },
    auth: { login: "ログイン", logout: "ログアウト", profile: "プロフィール" },
  },
  ko: {
    brand: "BNI 신베이 서B",
    tagline: "연결에서 탁월함으로",
    nav: { home: "홈", courses: "코스", myCourses: "내 코스", admin: "관리자" },
    auth: { login: "로그인", logout: "로그아웃", profile: "프로필" },
  },
  la: {
    brand: "BNI Novum Taipeum",
    tagline: "Per Nexum ad Excellentiam",
    nav: { home: "Domus", courses: "Cursus", myCourses: "Mei Cursus", admin: "Administratio" },
    auth: { login: "Intrare", logout: "Exire", profile: "Profilus" },
  },
}

type LangCode = keyof typeof headerTranslations

export function PremiumHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<LangCode>("zh-TW")

  const t = headerTranslations[currentLang]
  const adminRoles = ["ADMIN", "EXECUTIVE_DIRECTOR", "REGIONAL_DIRECTOR", "DIRECTOR_CONSULTANT", "AMBASSADOR"]
  const canAccessAdminPanel = session?.user?.role ? adminRoles.includes(session.user.role) : false
  const isAdminPage = pathname?.startsWith("/admin")

  // Don't show header on admin pages (they have their own layout)
  if (isAdminPage) return null

  const navItems = [
    { href: "/", label: t.nav.home, icon: BookOpenIcon },
    { href: "/courses", label: t.nav.courses, icon: CalendarIcon },
    ...(session ? [{ href: "/my", label: t.nav.myCourses, icon: UserIcon }] : []),
    ...(canAccessAdminPanel ? [{ href: "/admin", label: t.nav.admin, icon: LayoutDashboardIcon }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Mark */}
            <div className="relative w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold text-[#D4AF37]">B</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
            </div>
            {/* Brand Text */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                {t.brand}
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-[#0F172A] text-white"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <GlobeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">
                    {languages.find(l => l.code === currentLang)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code as LangCode)}
                    className={currentLang === lang.code ? "bg-muted" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <span className="text-sm font-medium text-[#D4AF37]">
                        {session.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {session.user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/my" className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {t.auth.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    {t.auth.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="btn-navy text-sm">
                  {t.auth.login}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive
                        ? "bg-[#0F172A] text-white"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
