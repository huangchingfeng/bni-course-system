"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FileTextIcon,
  Loader2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  XIcon,
  EyeIcon,
} from "lucide-react"

interface AuditLog {
  id: string
  userId: string
  userEmail: string
  userName: string | null
  action: string
  actionLabel: string
  targetType: string
  targetTypeLabel: string
  targetId: string | null
  targetName: string | null
  changes: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  } | null
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface FilterOption {
  value: string
  label: string
}

// 操作類型顏色
const actionColors: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-purple-100 text-purple-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  PERMISSION_CHANGE: "bg-amber-100 text-amber-700",
  REGISTRATION: "bg-cyan-100 text-cyan-700",
  CANCEL_REGISTRATION: "bg-orange-100 text-orange-700",
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = session?.user?.role === "ADMIN"

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  })
  const [actionOptions, setActionOptions] = useState<FilterOption[]>([])
  const [targetTypeOptions, setTargetTypeOptions] = useState<FilterOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 篩選條件
  const [filterAction, setFilterAction] = useState("all")
  const [filterTargetType, setFilterTargetType] = useState("all")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // 詳情對話框
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // 權限檢查
  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin")
    }
  }, [session, status, router])

  // 載入日誌
  const fetchLogs = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "50",
      })

      if (filterAction && filterAction !== "all") {
        params.set("action", filterAction)
      }
      if (filterTargetType && filterTargetType !== "all") {
        params.set("targetType", filterTargetType)
      }
      if (filterStartDate) {
        params.set("startDate", filterStartDate)
      }
      if (filterEndDate) {
        params.set("endDate", filterEndDate)
      }

      const response = await fetch(`/api/logs?${params.toString()}`)
      const data = await response.json()

      setLogs(data.logs)
      setPagination(data.pagination)
      setActionOptions(data.filters.actionOptions)
      setTargetTypeOptions(data.filters.targetTypeOptions)
    } catch {
      console.error("Failed to fetch logs")
    } finally {
      setIsLoading(false)
    }
  }, [filterAction, filterTargetType, filterStartDate, filterEndDate])

  useEffect(() => {
    if (isAdmin) {
      fetchLogs()
    }
  }, [isAdmin, fetchLogs])

  // 套用篩選
  const handleApplyFilters = () => {
    fetchLogs(1)
  }

  // 清除篩選
  const handleClearFilters = () => {
    setFilterAction("all")
    setFilterTargetType("all")
    setFilterStartDate("")
    setFilterEndDate("")
  }

  // 格式化時間
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 格式化變更內容
  const formatChanges = (changes: Record<string, unknown> | null) => {
    if (!changes) return null

    return Object.entries(changes).map(([key, value]) => {
      if (typeof value === "object" && value !== null && "from" in value && "to" in value) {
        const change = value as { from: unknown; to: unknown }
        return (
          <div key={key} className="mb-2">
            <span className="font-medium text-gray-700">{key}：</span>
            <div className="ml-4 text-sm">
              <span className="text-red-600 line-through">
                {String(change.from || "-")}
              </span>
              <span className="mx-2">→</span>
              <span className="text-green-600">{String(change.to || "-")}</span>
            </div>
          </div>
        )
      }
      return (
        <div key={key} className="mb-2">
          <span className="font-medium text-gray-700">{key}：</span>
          <span className="text-gray-600">
            {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
          </span>
        </div>
      )
    })
  }

  const hasActiveFilters =
    filterAction !== "all" ||
    filterTargetType !== "all" ||
    filterStartDate ||
    filterEndDate

  if (status === "loading" || (isLoading && logs.length === 0)) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="p-8">
      {/* 標題 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#0F172A]">
            <FileTextIcon className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">操作日誌</h1>
        </div>
        <p className="text-muted-foreground">
          追蹤系統中所有的操作記錄，共 {pagination.total} 筆
        </p>
      </div>

      {/* 篩選器 */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            篩選條件
            {hasActiveFilters && (
              <Badge className="ml-2" variant="secondary">
                已套用
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleClearFilters}>
              <XIcon className="h-4 w-4 mr-2" />
              清除篩選
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>操作類型</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類型</SelectItem>
                    {actionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>目標類型</Label>
                <Select
                  value={filterTargetType}
                  onValueChange={setFilterTargetType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="全部類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部類型</SelectItem>
                    {targetTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>開始日期</Label>
                <Input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>結束日期</Label>
                <Input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleApplyFilters}>套用篩選</Button>
            </div>
          </div>
        )}
      </div>

      {/* 日誌列表 */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">時間</TableHead>
              <TableHead className="w-[120px]">操作者</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
              <TableHead className="w-[80px]">類型</TableHead>
              <TableHead>目標</TableHead>
              <TableHead className="w-[60px] text-right">詳情</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {log.userName || log.userEmail}
                      </p>
                      {log.userName && (
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {log.userEmail}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={actionColors[log.action] || "bg-gray-100"}
                    >
                      {log.actionLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.targetTypeLabel}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{log.targetName || "-"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {(log.changes || log.metadata) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">
                    {hasActiveFilters ? "沒有符合條件的日誌" : "尚無操作日誌"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分頁 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            第 {pagination.page} / {pagination.totalPages} 頁，共{" "}
            {pagination.total} 筆
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => fetchLogs(pagination.page - 1)}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              上一頁
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => fetchLogs(pagination.page + 1)}
            >
              下一頁
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* 詳情對話框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>操作詳情</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              {/* 基本資訊 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">時間</Label>
                  <p className="font-medium">
                    {formatDateTime(selectedLog.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">操作者</Label>
                  <p className="font-medium">
                    {selectedLog.userName || selectedLog.userEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">操作類型</Label>
                  <Badge
                    variant="secondary"
                    className={actionColors[selectedLog.action] || "bg-gray-100"}
                  >
                    {selectedLog.actionLabel}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">目標類型</Label>
                  <p className="font-medium">{selectedLog.targetTypeLabel}</p>
                </div>
                {selectedLog.targetName && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">目標名稱</Label>
                    <p className="font-medium">{selectedLog.targetName}</p>
                  </div>
                )}
              </div>

              {/* 變更內容 */}
              {selectedLog.changes && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    變更內容
                  </Label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {formatChanges(selectedLog.changes)}
                  </div>
                </div>
              )}

              {/* 額外資訊 */}
              {selectedLog.metadata && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    額外資訊
                  </Label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
