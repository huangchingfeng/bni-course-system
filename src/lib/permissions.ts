import { Role } from "@prisma/client"
import { prisma } from "./prisma"

// ============================================
// 角色層級定義
// ============================================

// 角色層級（數字越大權限越高）
export const ROLE_LEVELS: Record<Role, number> = {
  [Role.MEMBER]: 0,
  [Role.MENTOR_COORDINATOR]: 1,
  [Role.EVENT_COORDINATOR]: 1,
  [Role.CHAPTER_LEADER]: 1,
  [Role.AMBASSADOR]: 2,
  [Role.DIRECTOR_CONSULTANT]: 2,
  [Role.REGIONAL_DIRECTOR]: 3,
  [Role.EXECUTIVE_DIRECTOR]: 3,
  [Role.ADMIN]: 4,
}

// 角色中文名稱
export const ROLE_LABELS: Record<Role, string> = {
  [Role.MEMBER]: "一般會員",
  [Role.MENTOR_COORDINATOR]: "導師協調員",
  [Role.EVENT_COORDINATOR]: "活動協調員",
  [Role.CHAPTER_LEADER]: "分會幹部",
  [Role.AMBASSADOR]: "大使",
  [Role.DIRECTOR_CONSULTANT]: "董事顧問",
  [Role.REGIONAL_DIRECTOR]: "區域董事",
  [Role.EXECUTIVE_DIRECTOR]: "執行董事",
  [Role.ADMIN]: "管理員",
}

// 角色顏色（用於 Badge）
export const ROLE_COLORS: Record<Role, string> = {
  [Role.MEMBER]: "bg-gray-100 text-gray-700",
  [Role.MENTOR_COORDINATOR]: "bg-teal-100 text-teal-700",
  [Role.EVENT_COORDINATOR]: "bg-cyan-100 text-cyan-700",
  [Role.CHAPTER_LEADER]: "bg-blue-100 text-blue-700",
  [Role.AMBASSADOR]: "bg-green-100 text-green-700",
  [Role.DIRECTOR_CONSULTANT]: "bg-purple-100 text-purple-700",
  [Role.REGIONAL_DIRECTOR]: "bg-orange-100 text-orange-700",
  [Role.EXECUTIVE_DIRECTOR]: "bg-amber-100 text-amber-700",
  [Role.ADMIN]: "bg-red-100 text-red-700",
}

// ============================================
// 基本權限檢查
// ============================================

// 是否為 ADMIN（完整 CRUD 權限）
export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN
}

// 別名：向後兼容
export const isAdminRole = isAdmin

// 可進後台的角色（層級 >= 1）
const adminAccessRoles: Role[] = [
  Role.ADMIN,
  Role.EXECUTIVE_DIRECTOR,
  Role.REGIONAL_DIRECTOR,
  Role.DIRECTOR_CONSULTANT,
  Role.AMBASSADOR,
  Role.MENTOR_COORDINATOR,
  Role.EVENT_COORDINATOR,
]

// 是否可進入後台
export function canAccessAdmin(role: Role): boolean {
  return adminAccessRoles.includes(role)
}

// 可看全部分會的角色（層級 >= 3）
const allChaptersRoles: Role[] = [
  Role.ADMIN,
  Role.EXECUTIVE_DIRECTOR,
  Role.REGIONAL_DIRECTOR,
]

// 是否可看到全部分會
export function canSeeAllChapters(role: Role): boolean {
  return allChaptersRoles.includes(role)
}

// 需要多選分會的角色（董事顧問/大使）
const managedChapterRoles: Role[] = [
  Role.DIRECTOR_CONSULTANT,
  Role.AMBASSADOR,
]

// 是否需要多選分會
export function needsManagedChapters(role: Role): boolean {
  return managedChapterRoles.includes(role)
}

// 只能看自己分會的角色（協調員）
const ownChapterOnlyRoles: Role[] = [
  Role.MENTOR_COORDINATOR,
  Role.EVENT_COORDINATOR,
  Role.CHAPTER_LEADER,
]

// 是否只能看自己分會
export function canOnlySeeOwnChapter(role: Role): boolean {
  return ownChapterOnlyRoles.includes(role)
}

// ============================================
// 資料範圍權限
// ============================================

export type ChapterAccess = {
  type: "all" | "managed" | "own" | "none"
  chapterIds: string[]
}

// 取得使用者可見的分會範圍
export async function getChapterAccess(
  userId: string,
  role: Role,
  ownChapterId?: string | null
): Promise<ChapterAccess> {
  // ADMIN / 執董 / 區董：看全部
  if (canSeeAllChapters(role)) {
    return { type: "all", chapterIds: [] }
  }

  // 董事顧問 / 大使：看負責的分會
  if (needsManagedChapters(role)) {
    const managed = await prisma.memberChapter.findMany({
      where: { memberId: userId },
      select: { chapterId: true },
    })
    const chapterIds = managed.map((m) => m.chapterId)
    return { type: "managed", chapterIds }
  }

  // 協調員：看自己的分會
  if (canOnlySeeOwnChapter(role) && ownChapterId) {
    return { type: "own", chapterIds: [ownChapterId] }
  }

  // 一般會員：無權限
  return { type: "none", chapterIds: [] }
}

// 取得可見分會 ID 清單（null 表示全部可見）
export async function getVisibleChapterIds(
  userId: string,
  role: Role,
  ownChapterId?: string | null
): Promise<string[] | null> {
  const access = await getChapterAccess(userId, role, ownChapterId)

  if (access.type === "all") {
    return null // null = 全部可見
  }

  return access.chapterIds
}

// ============================================
// 操作權限檢查
// ============================================

// 是否可編輯資料（只有 ADMIN 可以）
export function canEdit(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可新增課程
export function canCreateCourse(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可編輯課程
export function canEditCourse(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可刪除課程
export function canDeleteCourse(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可新增會員
export function canCreateMember(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可編輯會員
export function canEditMember(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可變更權限
export function canChangePermissions(role: Role): boolean {
  return role === Role.ADMIN
}

// 是否可查看操作日誌
export function canViewAuditLogs(role: Role): boolean {
  return role === Role.ADMIN
}

// ============================================
// 資料過濾輔助函式
// ============================================

// 建立會員查詢的 where 條件
export async function buildMemberWhereClause(
  userId: string,
  role: Role,
  ownChapterId?: string | null
): Promise<object> {
  const chapterIds = await getVisibleChapterIds(userId, role, ownChapterId)

  if (chapterIds === null) {
    return {} // 全部可見，不加過濾
  }

  if (chapterIds.length === 0) {
    return { id: "none" } // 無權限，回傳空結果
  }

  return {
    chapterId: { in: chapterIds },
  }
}

// 建立報名查詢的 where 條件（依會員分會過濾）
export async function buildRegistrationWhereClause(
  userId: string,
  role: Role,
  ownChapterId?: string | null
): Promise<object> {
  const chapterIds = await getVisibleChapterIds(userId, role, ownChapterId)

  if (chapterIds === null) {
    return {} // 全部可見
  }

  if (chapterIds.length === 0) {
    return { id: "none" } // 無權限
  }

  return {
    member: {
      chapterId: { in: chapterIds },
    },
  }
}

// ============================================
// 側邊欄選單權限
// ============================================

export type MenuItem = {
  key: string
  label: string
  href: string
  icon: string
}

// 根據角色取得可見選單
export function getVisibleMenuItems(role: Role): MenuItem[] {
  const allMenus: MenuItem[] = [
    { key: "dashboard", label: "儀表板", href: "/admin", icon: "LayoutDashboard" },
    { key: "courses", label: "課程管理", href: "/admin/courses", icon: "BookOpen" },
    { key: "training", label: "培訓管理", href: "/admin/training", icon: "ClipboardList" },
    { key: "members", label: "會員管理", href: "/admin/members", icon: "Users" },
    { key: "chapters", label: "分會管理", href: "/admin/chapters", icon: "Building" },
    { key: "stats", label: "統計報表", href: "/admin/stats", icon: "TrendingUp" },
    { key: "permissions", label: "權限管理", href: "/admin/permissions", icon: "Shield" },
    { key: "logs", label: "操作日誌", href: "/admin/logs", icon: "FileText" },
  ]

  // ADMIN：全部可見
  if (role === Role.ADMIN) {
    return allMenus
  }

  // 執董 / 區董：不含課程管理、分會管理、權限管理、操作日誌
  if (role === Role.EXECUTIVE_DIRECTOR || role === Role.REGIONAL_DIRECTOR) {
    return allMenus.filter((m) =>
      ["dashboard", "training", "members", "stats"].includes(m.key)
    )
  }

  // 董顧 / 大使 / 協調員：儀表板、培訓管理、會員管理、統計報表
  return allMenus.filter((m) =>
    ["dashboard", "training", "members", "stats"].includes(m.key)
  )
}

// ============================================
// 權限檢查：是否可查看特定會員
// ============================================

export async function canViewMember(
  userId: string,
  role: Role,
  ownChapterId: string | null,
  targetMemberId: string
): Promise<boolean> {
  // ADMIN / 執董 / 區董：全部可見
  if (canSeeAllChapters(role)) {
    return true
  }

  const chapterIds = await getVisibleChapterIds(userId, role, ownChapterId)

  if (!chapterIds || chapterIds.length === 0) {
    return false
  }

  const targetMember = await prisma.member.findUnique({
    where: { id: targetMemberId },
    select: { chapterId: true },
  })

  if (!targetMember?.chapterId) {
    return false
  }

  return chapterIds.includes(targetMember.chapterId)
}
