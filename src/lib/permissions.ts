import { Role } from "@prisma/client"
import { prisma } from "./prisma"

// 是否為 ADMIN（完整 CRUD 權限）
export function isAdminRole(role: Role): boolean {
  return role === Role.ADMIN
}

// 可進後台的角色
const adminAccessRoles: Role[] = [
  Role.ADMIN,
  Role.EXECUTIVE_DIRECTOR,
  Role.REGIONAL_DIRECTOR,
  Role.DIRECTOR_CONSULTANT,
  Role.AMBASSADOR,
]

// 是否可進入後台（ADMIN + 4 個領導角色）
export function canAccessAdmin(role: Role): boolean {
  return adminAccessRoles.includes(role)
}

// 可看全部分會的角色
const allChaptersRoles: Role[] = [
  Role.ADMIN,
  Role.EXECUTIVE_DIRECTOR,
  Role.REGIONAL_DIRECTOR,
]

// 是否可看到全部分會（ADMIN / 執行董事 / 區域董事）
export function canSeeAllChapters(role: Role): boolean {
  return allChaptersRoles.includes(role)
}

// 需要多選分會的角色
const managedChapterRoles: Role[] = [
  Role.DIRECTOR_CONSULTANT,
  Role.AMBASSADOR,
]

// 是否需要多選分會（董事顧問 / 大使）
export function needsManagedChapters(role: Role): boolean {
  return managedChapterRoles.includes(role)
}

// 取得可見分會 ID 清單（null 表示全部可見）
export async function getVisibleChapterIds(
  userId: string,
  role: Role
): Promise<string[] | null> {
  if (canSeeAllChapters(role)) {
    return null // null = 全部可見
  }

  if (needsManagedChapters(role)) {
    const managed = await prisma.memberChapter.findMany({
      where: { memberId: userId },
      select: { chapterId: true },
    })
    return managed.map((m) => m.chapterId)
  }

  // MEMBER / CHAPTER_LEADER 不該呼叫這個函式
  return []
}
