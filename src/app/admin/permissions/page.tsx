"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ShieldIcon,
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  Loader2Icon,
  CheckIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react"

interface Chapter {
  id: string
  displayName: string
}

interface PermissionMember {
  id: string
  name: string
  email: string
  role: string
  roleLabel: string
  chapter: Chapter | null
  managedChapters: Chapter[]
}

interface AllMember {
  id: string
  name: string
  email: string
  role: string
  chapter: {
    id: string
    displayName: string
  } | null
}

// 角色顏色
const roleColors: Record<string, string> = {
  MEMBER: "bg-gray-100 text-gray-700",
  MENTOR_COORDINATOR: "bg-teal-100 text-teal-700",
  EVENT_COORDINATOR: "bg-cyan-100 text-cyan-700",
  CHAPTER_LEADER: "bg-blue-100 text-blue-700",
  AMBASSADOR: "bg-green-100 text-green-700",
  DIRECTOR_CONSULTANT: "bg-purple-100 text-purple-700",
  REGIONAL_DIRECTOR: "bg-orange-100 text-orange-700",
  EXECUTIVE_DIRECTOR: "bg-amber-100 text-amber-700",
  ADMIN: "bg-red-100 text-red-700",
}

// 可分配的管理角色
const assignableRoles = [
  { value: "MENTOR_COORDINATOR", label: "導師協調員" },
  { value: "EVENT_COORDINATOR", label: "活動協調員" },
  { value: "CHAPTER_LEADER", label: "分會幹部" },
  { value: "AMBASSADOR", label: "大使" },
  { value: "DIRECTOR_CONSULTANT", label: "董事顧問" },
  { value: "REGIONAL_DIRECTOR", label: "區域董事" },
  { value: "EXECUTIVE_DIRECTOR", label: "執行董事" },
  { value: "ADMIN", label: "管理員" },
]

// 需要多選分會的角色
const rolesNeedingChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"]

export default function AdminPermissionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isAdmin = session?.user?.role === "ADMIN"

  const [admins, setAdmins] = useState<PermissionMember[]>([])
  const [allMembers, setAllMembers] = useState<AllMember[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  // 新增管理員對話框
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")

  // 編輯對話框
  const [editMember, setEditMember] = useState<PermissionMember | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // 刪除確認
  const [deleteMember, setDeleteMember] = useState<PermissionMember | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 權限檢查
  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin")
    }
  }, [session, status, router])

  // 載入資料
  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const fetchData = async () => {
    try {
      const [permissionsRes, membersRes, chaptersRes] = await Promise.all([
        fetch("/api/permissions"),
        fetch("/api/members"),
        fetch("/api/chapters"),
      ])
      const permissionsData = await permissionsRes.json()
      const membersData = await membersRes.json()
      const chaptersData = await chaptersRes.json()

      setAdmins(permissionsData)
      setAllMembers(membersData)
      setChapters(chaptersData)
    } catch {
      toast.error("載入資料失敗")
    } finally {
      setIsLoading(false)
    }
  }

  // 篩選管理員
  const filteredAdmins = admins.filter((admin) => {
    const matchSearch =
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  // 篩選可新增的會員（排除已有管理權限的）
  const availableMembers = allMembers.filter((member) => {
    const isNotAdmin = !admins.some((a) => a.id === member.id)
    const matchSearch =
      memberSearch === "" ||
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase())
    return isNotAdmin && matchSearch
  })

  const needsChapterMultiSelect = rolesNeedingChapters.includes(selectedRole)
  const editNeedsChapterMultiSelect = editMember
    ? rolesNeedingChapters.includes(editMember.role)
    : false

  const handleToggleChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const handleEditToggleChapter = (chapterId: string) => {
    if (!editMember) return
    const currentIds = editMember.managedChapters.map((c) => c.id)
    const newIds = currentIds.includes(chapterId)
      ? currentIds.filter((id) => id !== chapterId)
      : [...currentIds, chapterId]
    setEditMember({
      ...editMember,
      managedChapters: chapters.filter((c) => newIds.includes(c.id)),
    })
  }

  // 新增管理員
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMemberId || !selectedRole) {
      toast.error("請選擇會員和角色")
      return
    }

    if (needsChapterMultiSelect && selectedChapterIds.length === 0) {
      toast.error("請至少選擇一個負責分會")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMemberId,
          role: selectedRole,
          managedChapterIds: needsChapterMultiSelect ? selectedChapterIds : [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "新增失敗")
        return
      }

      toast.success("權限設定成功")
      setIsAddDialogOpen(false)
      resetAddForm()
      fetchData()
    } catch {
      toast.error("新增失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 更新權限
  const handleUpdatePermission = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editMember) return

    if (
      editNeedsChapterMultiSelect &&
      editMember.managedChapters.length === 0
    ) {
      toast.error("請至少選擇一個負責分會")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: editMember.id,
          role: editMember.role,
          managedChapterIds: editNeedsChapterMultiSelect
            ? editMember.managedChapters.map((c) => c.id)
            : [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "更新失敗")
        return
      }

      toast.success("權限更新成功")
      setIsEditDialogOpen(false)
      setEditMember(null)
      fetchData()
    } catch {
      toast.error("更新失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 移除權限
  const handleRemovePermission = async () => {
    if (!deleteMember) return

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/permissions?memberId=${deleteMember.id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "移除失敗")
        return
      }

      toast.success("權限已移除")
      setIsDeleteDialogOpen(false)
      setDeleteMember(null)
      fetchData()
    } catch {
      toast.error("移除失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAddForm = () => {
    setSelectedMemberId("")
    setSelectedRole("")
    setSelectedChapterIds([])
    setMemberSearch("")
  }

  const openEditDialog = (member: PermissionMember) => {
    setEditMember({ ...member })
    setIsEditDialogOpen(true)
  }

  if (status === "loading" || isLoading) {
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
            <ShieldIcon className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">權限管理</h1>
        </div>
        <p className="text-muted-foreground">
          管理系統管理員與各角色權限，共 {admins.length} 位管理者
        </p>
      </div>

      {/* 搜尋和新增 */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名或 Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetAddForm()}>
              <PlusIcon className="h-4 w-4 mr-2" />
              新增管理員
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增管理員</DialogTitle>
              <DialogDescription>
                從現有會員中選擇並設定管理權限
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {/* 搜尋會員 */}
              <div className="space-y-2">
                <Label>搜尋會員</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="輸入姓名或 Email..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* 選擇會員 */}
              <div className="space-y-2">
                <Label>選擇會員 *</Label>
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {availableMembers.length > 0 ? (
                    availableMembers.slice(0, 20).map((member) => {
                      const isSelected = selectedMemberId === member.id
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedMemberId(member.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b last:border-b-0 text-left
                            ${isSelected ? "bg-amber-50" : "bg-white hover:bg-gray-50"}
                          `}
                        >
                          <div
                            className={`
                            w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}
                          `}
                          >
                            {isSelected && (
                              <CheckIcon className="h-2.5 w-2.5 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.email}
                            </p>
                          </div>
                          {member.chapter && (
                            <Badge variant="outline" className="flex-shrink-0">
                              {member.chapter.displayName}
                            </Badge>
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {memberSearch ? "沒有符合的會員" : "所有會員已有管理權限"}
                    </div>
                  )}
                </div>
                {availableMembers.length > 20 && (
                  <p className="text-xs text-muted-foreground">
                    顯示前 20 筆，請使用搜尋縮小範圍
                  </p>
                )}
              </div>

              {/* 選擇角色 */}
              <div className="space-y-2">
                <Label>指派角色 *</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value)
                    if (!rolesNeedingChapters.includes(value)) {
                      setSelectedChapterIds([])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 負責分會多選（董事顧問/大使） */}
              {needsChapterMultiSelect && (
                <div className="space-y-2">
                  <Label>負責分會 *</Label>
                  <p className="text-xs text-muted-foreground">
                    請勾選負責的分會（可多選）
                  </p>
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {chapters.map((chapter) => {
                      const isSelected = selectedChapterIds.includes(chapter.id)
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => handleToggleChapter(chapter.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors border-b last:border-b-0
                            ${isSelected ? "bg-amber-50" : "bg-white hover:bg-gray-50"}
                          `}
                        >
                          <div
                            className={`
                            w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}
                          `}
                          >
                            {isSelected && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {chapter.displayName}
                        </button>
                      )
                    })}
                  </div>
                  {selectedChapterIds.length > 0 && (
                    <p className="text-xs text-amber-600">
                      已選擇 {selectedChapterIds.length} 個分會
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  新增
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 管理員列表 */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>所屬分會</TableHead>
              <TableHead>負責分會</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{admin.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={roleColors[admin.role] || "bg-gray-100"}
                    >
                      {admin.roleLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.chapter ? (
                      <div className="flex items-center gap-1">
                        <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {admin.chapter.displayName}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.managedChapters.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {admin.managedChapters.slice(0, 3).map((chapter) => (
                          <Badge
                            key={chapter.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {chapter.displayName}
                          </Badge>
                        ))}
                        {admin.managedChapters.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{admin.managedChapters.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      {admin.id !== session?.user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeleteMember(admin)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">
                    {search ? "沒有符合條件的管理員" : "尚無管理員資料"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 編輯對話框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯權限</DialogTitle>
            <DialogDescription>
              修改 {editMember?.name} 的權限設定
            </DialogDescription>
          </DialogHeader>
          {editMember && (
            <form onSubmit={handleUpdatePermission} className="space-y-4">
              <div className="space-y-2">
                <Label>角色 *</Label>
                <Select
                  value={editMember.role}
                  onValueChange={(value) => {
                    setEditMember({
                      ...editMember,
                      role: value,
                      managedChapters: rolesNeedingChapters.includes(value)
                        ? editMember.managedChapters
                        : [],
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editNeedsChapterMultiSelect && (
                <div className="space-y-2">
                  <Label>負責分會 *</Label>
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {chapters.map((chapter) => {
                      const isSelected = editMember.managedChapters.some(
                        (c) => c.id === chapter.id
                      )
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => handleEditToggleChapter(chapter.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors border-b last:border-b-0
                            ${isSelected ? "bg-amber-50" : "bg-white hover:bg-gray-50"}
                          `}
                        >
                          <div
                            className={`
                            w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}
                          `}
                          >
                            {isSelected && (
                              <CheckIcon className="h-3 w-3 text-white" />
                            )}
                          </div>
                          {chapter.displayName}
                        </button>
                      )
                    })}
                  </div>
                  {editMember.managedChapters.length > 0 && (
                    <p className="text-xs text-amber-600">
                      已選擇 {editMember.managedChapters.length} 個分會
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditMember(null)
                  }}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  儲存
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 刪除確認對話框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要移除權限？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteMember?.name} 的管理權限將被移除，降為一般會員。
              此操作會被記錄在操作日誌中。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemovePermission}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              )}
              確定移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
