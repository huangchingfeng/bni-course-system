"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  BookOpenIcon,
  UsersIcon,
  BuildingIcon,
  BarChart3Icon,
  ClipboardListIcon,
  ArrowLeftIcon,
  ShieldIcon,
  FileTextIcon,
} from "lucide-react"

interface MenuItem {
  title: string
  href: string
  icon: typeof LayoutDashboardIcon
  adminOnly?: boolean
}

const allMenuItems: MenuItem[] = [
  {
    title: "總覽",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "培訓管理",
    href: "/admin/training",
    icon: ClipboardListIcon,
  },
  {
    title: "課程管理",
    href: "/admin/courses",
    icon: BookOpenIcon,
    adminOnly: true,
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
    adminOnly: true,
  },
  {
    title: "統計報表",
    href: "/admin/stats",
    icon: BarChart3Icon,
  },
  {
    title: "權限管理",
    href: "/admin/permissions",
    icon: ShieldIcon,
    adminOnly: true,
  },
  {
    title: "操作日誌",
    href: "/admin/logs",
    icon: FileTextIcon,
    adminOnly: true,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  // ADMIN 看到全部菜單，其他領導角色只看到非 adminOnly 的項目
  const menuItems = isAdmin
    ? allMenuItems
    : allMenuItems.filter((item) => !item.adminOnly)

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

        {/* 角色標示 */}
        {!isAdmin && session?.user?.role && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700 font-medium">唯讀模式</p>
          </div>
        )}

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
