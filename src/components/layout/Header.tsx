"use client"

import { useState, useEffect } from "react"
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
  CheckIcon,
  CompassIcon,
} from "lucide-react"

// ============================================================
// Language Configuration
// ============================================================
const languages = [
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "la", name: "Latina", flag: "🏛️" },
] as const

type LangCode = typeof languages[number]["code"]

// ============================================================
// Translations
// ============================================================
const headerTranslations: Record<LangCode, {
  brand: string
  tagline: string
  nav: { home: string; courses: string; guide: string; myCourses: string; admin: string }
  auth: { login: string; logout: string; profile: string }
}> = {
  "zh-TW": {
    brand: "BNI 新北市西B區",
    tagline: "卓越源於連結",
    nav: { home: "首頁", courses: "課程總覽", guide: "會員指引", myCourses: "我的課程", admin: "管理後台" },
    auth: { login: "登入", logout: "登出", profile: "個人資料" },
  },
  en: {
    brand: "BNI Xinbei West B",
    tagline: "Excellence Through Connection",
    nav: { home: "Home", courses: "Courses", guide: "Guide", myCourses: "My Courses", admin: "Admin" },
    auth: { login: "Sign In", logout: "Sign Out", profile: "Profile" },
  },
  ja: {
    brand: "BNI 新北市西B",
    tagline: "つながりから卓越へ",
    nav: { home: "ホーム", courses: "コース", guide: "ガイド", myCourses: "マイコース", admin: "管理" },
    auth: { login: "ログイン", logout: "ログアウト", profile: "プロフィール" },
  },
  ko: {
    brand: "BNI 신베이 서B",
    tagline: "연결에서 탁월함으로",
    nav: { home: "홈", courses: "코스", guide: "가이드", myCourses: "내 코스", admin: "관리자" },
    auth: { login: "로그인", logout: "로그아웃", profile: "프로필" },
  },
  la: {
    brand: "BNI Novum Taipeum",
    tagline: "Per Nexum ad Excellentiam",
    nav: { home: "Domus", courses: "Cursus", guide: "Index", myCourses: "Mei Cursus", admin: "Administratio" },
    auth: { login: "Intrare", logout: "Exire", profile: "Profilus" },
  },
}

// ============================================================
// Header Component
// ============================================================
export function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<LangCode>("zh-TW")
  const [isScrolled, setIsScrolled] = useState(false)

  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load saved language preference
  useEffect(() => {
    const saved = localStorage.getItem("bni-locale") as LangCode
    if (saved && languages.some(l => l.code === saved)) {
      setCurrentLang(saved)
    }
  }, [])

  // Save language preference
  const handleLanguageChange = (lang: LangCode) => {
    setCurrentLang(lang)
    localStorage.setItem("bni-locale", lang)
  }

  const t = headerTranslations[currentLang]
  const isAdmin = session?.user?.role === "ADMIN"
  const isAdminPage = pathname?.startsWith("/admin")

  // Don't show header on admin pages (they have their own layout)
  if (isAdminPage) return null

  const navItems = [
    { href: "/", label: t.nav.home, icon: BookOpenIcon },
    { href: "/courses", label: t.nav.courses, icon: CalendarIcon },
    { href: "/guide", label: t.nav.guide, icon: CompassIcon },
    ...(session ? [{ href: "/my", label: t.nav.myCourses, icon: UserIcon }] : []),
    ...(isAdmin ? [{ href: "/admin", label: t.nav.admin, icon: LayoutDashboardIcon }] : []),
  ]

  return (
    <header
      className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-white/80 backdrop-blur-sm"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Mark */}
            <div className="relative w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-[#D4AF37]">B</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
            </div>
            {/* Brand Text */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-[#0F172A] tracking-tight">
                {t.brand}
              </h1>
              <p className="text-xs text-[#64748B] -mt-0.5">
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
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-[#0F172A] text-white shadow-md"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <GlobeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">
                    {languages.find(l => l.code === currentLang)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {currentLang === lang.code && (
                      <CheckIcon className="h-4 w-4 text-[#D4AF37]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-[#F1F5F9] animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-[#F1F5F9]">
                    <div className="w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center ring-2 ring-[#D4AF37]/20">
                      <span className="text-sm font-semibold text-[#D4AF37]">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-[#0F172A]">
                      {session.user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-3 border-b border-border">
                    <p className="font-semibold text-[#0F172A]">{session.user?.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{session.user?.email}</p>
                    {session.user?.chapterName && (
                      <p className="text-xs text-[#D4AF37] mt-1">{session.user.chapterName}</p>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/my" className="cursor-pointer">
                      <CalendarIcon className="h-4 w-4 mr-2 text-[#64748B]" />
                      {t.nav.myCourses}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2 text-[#64748B]" />
                      {t.auth.profile}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboardIcon className="h-4 w-4 mr-2 text-[#64748B]" />
                        {t.nav.admin}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[#DC2626] focus:text-[#DC2626] cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    {t.auth.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="btn-navy text-sm px-5">
                  {t.auth.login}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-[#F1F5F9]"
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
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? "bg-[#0F172A] text-white"
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Language Selector */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="px-4 text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
                Language
              </p>
              <div className="grid grid-cols-2 gap-2 px-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code)
                      setMobileMenuOpen(false)
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                      ${currentLang === lang.code
                        ? "bg-[#0F172A] text-white"
                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                      }
                    `}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
