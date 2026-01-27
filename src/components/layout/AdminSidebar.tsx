"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  UsersIcon,
  BuildingIcon,
  BarChart3Icon,
  ArrowLeftIcon,
} from "lucide-react"

const menuItems = [
  {
    title: "總覽",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "課程管理",
    href: "/admin/courses",
    icon: BookOpenIcon,
  },
  {
    title: "會員管理",
    href: "/admin/members",
    icon: UsersIcon,
  },
  {
    title: "分會管理",
    href: "/admin/chapters",
    icon: BuildingIcon,
  },
  {
    title: "統計報表",
    href: "/admin/stats",
    icon: BarChart3Icon,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回前台
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
