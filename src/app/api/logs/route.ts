import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role, AuditAction } from "@prisma/client"
import { canViewAuditLogs } from "@/lib/permissions"
import { getAuditLogs, AUDIT_ACTION_LABELS, TARGET_TYPE_LABELS } from "@/lib/audit"

// GET /api/logs - 取得操作日誌
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canViewAuditLogs(session.user.role as Role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    // 解析查詢參數
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10)
    const userId = searchParams.get("userId") || undefined
    const action = searchParams.get("action") as AuditAction | undefined
    const targetType = searchParams.get("targetType") || undefined
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // 驗證分頁參數
    const validPage = Math.max(1, page)
    const validPageSize = Math.min(100, Math.max(1, pageSize))

    // 建立過濾條件
    const filter: {
      userId?: string
      action?: AuditAction
      targetType?: string
      startDate?: Date
      endDate?: Date
    } = {}

    if (userId) {
      filter.userId = userId
    }

    if (action && Object.values(AuditAction).includes(action)) {
      filter.action = action
    }

    if (targetType) {
      filter.targetType = targetType
    }

    if (startDate) {
      const parsed = new Date(startDate)
      if (!isNaN(parsed.getTime())) {
        filter.startDate = parsed
      }
    }

    if (endDate) {
      const parsed = new Date(endDate)
      if (!isNaN(parsed.getTime())) {
        // 設為當天結束
        parsed.setHours(23, 59, 59, 999)
        filter.endDate = parsed
      }
    }

    // 查詢日誌
    const result = await getAuditLogs(filter, {
      page: validPage,
      pageSize: validPageSize,
    })

    // 格式化回應
    const formattedLogs = result.logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      userEmail: log.userEmail,
      userName: log.userName,
      action: log.action,
      actionLabel: AUDIT_ACTION_LABELS[log.action],
      targetType: log.targetType,
      targetTypeLabel: TARGET_TYPE_LABELS[log.targetType] || log.targetType,
      targetId: log.targetId,
      targetName: log.targetName,
      changes: log.changes,
      metadata: log.metadata,
      createdAt: log.createdAt,
      user: log.user,
    }))

    return NextResponse.json({
      logs: formattedLogs,
      pagination: result.pagination,
      filters: {
        actionOptions: Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
        targetTypeOptions: Object.entries(TARGET_TYPE_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
