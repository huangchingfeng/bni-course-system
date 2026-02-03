import { AuditAction } from "@prisma/client"
import { prisma } from "./prisma"
import { ROLE_LABELS } from "./permissions"
import { Role } from "@prisma/client"

// ============================================
// 操作日誌記錄工具
// ============================================

export type AuditUser = {
  id: string
  email: string
  name?: string | null
}

export type AuditLogInput = {
  user: AuditUser
  action: AuditAction
  targetType: string
  targetId?: string | null
  targetName?: string | null
  changes?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}

// 記錄操作日誌
export async function logAudit(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.user.id,
        userEmail: input.user.email,
        userName: input.user.name,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        targetName: input.targetName,
        changes: input.changes,
        metadata: input.metadata,
      },
    })
  } catch (error) {
    // 日誌記錄失敗不應影響主要操作
    console.error("Failed to log audit:", error)
  }
}

// ============================================
// 特定操作的日誌記錄函式
// ============================================

// 記錄登入
export async function logLogin(user: AuditUser, metadata?: Record<string, unknown>) {
  await logAudit({
    user,
    action: AuditAction.LOGIN,
    targetType: "Session",
    targetId: user.id,
    targetName: user.name || user.email,
    metadata,
  })
}

// 記錄登出
export async function logLogout(user: AuditUser) {
  await logAudit({
    user,
    action: AuditAction.LOGOUT,
    targetType: "Session",
    targetId: user.id,
    targetName: user.name || user.email,
  })
}

// 記錄新增會員
export async function logCreateMember(
  user: AuditUser,
  memberId: string,
  memberName: string,
  memberData: Record<string, unknown>
) {
  await logAudit({
    user,
    action: AuditAction.CREATE,
    targetType: "Member",
    targetId: memberId,
    targetName: memberName,
    changes: { created: memberData },
  })
}

// 記錄編輯會員
export async function logUpdateMember(
  user: AuditUser,
  memberId: string,
  memberName: string,
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
) {
  // 只記錄有變更的欄位
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  for (const key of Object.keys(newData)) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        from: oldData[key],
        to: newData[key],
      }
    }
  }

  if (Object.keys(changes).length === 0) {
    return // 沒有變更，不記錄
  }

  await logAudit({
    user,
    action: AuditAction.UPDATE,
    targetType: "Member",
    targetId: memberId,
    targetName: memberName,
    changes,
  })
}

// 記錄刪除會員
export async function logDeleteMember(
  user: AuditUser,
  memberId: string,
  memberName: string
) {
  await logAudit({
    user,
    action: AuditAction.DELETE,
    targetType: "Member",
    targetId: memberId,
    targetName: memberName,
  })
}

// 記錄新增課程
export async function logCreateCourse(
  user: AuditUser,
  courseId: string,
  courseTitle: string,
  courseData: Record<string, unknown>
) {
  await logAudit({
    user,
    action: AuditAction.CREATE,
    targetType: "Course",
    targetId: courseId,
    targetName: courseTitle,
    changes: { created: courseData },
  })
}

// 記錄編輯課程
export async function logUpdateCourse(
  user: AuditUser,
  courseId: string,
  courseTitle: string,
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
) {
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  for (const key of Object.keys(newData)) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changes[key] = {
        from: oldData[key],
        to: newData[key],
      }
    }
  }

  if (Object.keys(changes).length === 0) {
    return
  }

  await logAudit({
    user,
    action: AuditAction.UPDATE,
    targetType: "Course",
    targetId: courseId,
    targetName: courseTitle,
    changes,
  })
}

// 記錄刪除課程
export async function logDeleteCourse(
  user: AuditUser,
  courseId: string,
  courseTitle: string
) {
  await logAudit({
    user,
    action: AuditAction.DELETE,
    targetType: "Course",
    targetId: courseId,
    targetName: courseTitle,
  })
}

// 記錄報名
export async function logRegistration(
  user: AuditUser,
  registrationId: string,
  memberName: string,
  courseTitle: string,
  metadata?: { isAdminAction?: boolean }
) {
  await logAudit({
    user,
    action: AuditAction.REGISTRATION,
    targetType: "Registration",
    targetId: registrationId,
    targetName: `${memberName} → ${courseTitle}`,
    metadata,
  })
}

// 記錄取消報名
export async function logCancelRegistration(
  user: AuditUser,
  registrationId: string,
  memberName: string,
  courseTitle: string,
  metadata?: { isAdminAction?: boolean }
) {
  await logAudit({
    user,
    action: AuditAction.CANCEL_REGISTRATION,
    targetType: "Registration",
    targetId: registrationId,
    targetName: `${memberName} → ${courseTitle}`,
    metadata,
  })
}

// 記錄權限變更
export async function logPermissionChange(
  user: AuditUser,
  targetMemberId: string,
  targetMemberName: string,
  changes: {
    oldRole?: Role
    newRole?: Role
    oldChapterIds?: string[]
    newChapterIds?: string[]
    oldChapterNames?: string[]
    newChapterNames?: string[]
  }
) {
  const changeDetails: Record<string, unknown> = {}

  if (changes.oldRole !== changes.newRole) {
    changeDetails.role = {
      from: changes.oldRole ? ROLE_LABELS[changes.oldRole] : null,
      to: changes.newRole ? ROLE_LABELS[changes.newRole] : null,
    }
  }

  if (
    JSON.stringify(changes.oldChapterIds) !==
    JSON.stringify(changes.newChapterIds)
  ) {
    changeDetails.managedChapters = {
      from: changes.oldChapterNames || changes.oldChapterIds,
      to: changes.newChapterNames || changes.newChapterIds,
    }
  }

  if (Object.keys(changeDetails).length === 0) {
    return
  }

  await logAudit({
    user,
    action: AuditAction.PERMISSION_CHANGE,
    targetType: "Member",
    targetId: targetMemberId,
    targetName: targetMemberName,
    changes: changeDetails,
  })
}

// ============================================
// 日誌查詢函式
// ============================================

export type AuditLogFilter = {
  userId?: string
  action?: AuditAction
  targetType?: string
  startDate?: Date
  endDate?: Date
}

// 查詢操作日誌
export async function getAuditLogs(
  filter: AuditLogFilter = {},
  pagination: { page?: number; pageSize?: number } = {}
) {
  const { page = 1, pageSize = 50 } = pagination
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}

  if (filter.userId) {
    where.userId = filter.userId
  }

  if (filter.action) {
    where.action = filter.action
  }

  if (filter.targetType) {
    where.targetType = filter.targetType
  }

  if (filter.startDate || filter.endDate) {
    where.createdAt = {}
    if (filter.startDate) {
      (where.createdAt as Record<string, Date>).gte = filter.startDate
    }
    if (filter.endDate) {
      (where.createdAt as Record<string, Date>).lte = filter.endDate
    }
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  return {
    logs,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

// ============================================
// 操作類型的中文標籤
// ============================================

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.CREATE]: "新增",
  [AuditAction.UPDATE]: "更新",
  [AuditAction.DELETE]: "刪除",
  [AuditAction.LOGIN]: "登入",
  [AuditAction.LOGOUT]: "登出",
  [AuditAction.PERMISSION_CHANGE]: "權限變更",
  [AuditAction.REGISTRATION]: "報名",
  [AuditAction.CANCEL_REGISTRATION]: "取消報名",
}

// 目標類型的中文標籤
export const TARGET_TYPE_LABELS: Record<string, string> = {
  Member: "會員",
  Course: "課程",
  Registration: "報名",
  Chapter: "分會",
  Session: "登入階段",
}

// 格式化日誌訊息（用於顯示）
export function formatAuditMessage(log: {
  action: AuditAction
  targetType: string
  targetName?: string | null
  userName?: string | null
}): string {
  const action = AUDIT_ACTION_LABELS[log.action]
  const targetType = TARGET_TYPE_LABELS[log.targetType] || log.targetType
  const targetName = log.targetName || ""
  const userName = log.userName || "系統"

  switch (log.action) {
    case AuditAction.LOGIN:
      return `${userName} 登入系統`
    case AuditAction.LOGOUT:
      return `${userName} 登出系統`
    case AuditAction.REGISTRATION:
      return `${userName} ${action}：${targetName}`
    case AuditAction.CANCEL_REGISTRATION:
      return `${userName} ${action}：${targetName}`
    case AuditAction.PERMISSION_CHANGE:
      return `${userName} 變更 ${targetName} 的權限`
    default:
      return `${userName} ${action}${targetType}：${targetName}`
  }
}
