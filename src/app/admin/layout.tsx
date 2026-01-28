import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { canAccessAdmin } from "@/lib/permissions"
import { Role } from "@prisma/client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !canAccessAdmin(session.user.role as Role)) {
    redirect("/")
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  )
}
