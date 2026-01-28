"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
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
} from "@/components/ui/dialog"
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
  PlusIcon,
  SearchIcon,
  PencilIcon,
  Loader2Icon,
  CheckIcon,
} from "lucide-react"

interface Chapter {
  id: string
  name: string
  displayName: string
}

interface Member {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  isActive: boolean
  chapterName: string | null
  chapter: {
    id: string
    displayName: string
  } | null
  _count: {
    registrations: number
  }
}

const roleLabels: Record<string, string> = {
  MEMBER: "會員",
  CHAPTER_LEADER: "分會幹部",
  AMBASSADOR: "大使",
  DIRECTOR_CONSULTANT: "董事顧問",
  REGIONAL_DIRECTOR: "區域董事",
  EXECUTIVE_DIRECTOR: "執行董事",
  ADMIN: "管理員",
}

const roleColors: Record<string, string> = {
  MEMBER: "bg-gray-100 text-gray-700",
  CHAPTER_LEADER: "bg-blue-100 text-blue-700",
  AMBASSADOR: "bg-green-100 text-green-700",
  DIRECTOR_CONSULTANT: "bg-purple-100 text-purple-700",
  REGIONAL_DIRECTOR: "bg-orange-100 text-orange-700",
  EXECUTIVE_DIRECTOR: "bg-amber-100 text-amber-700",
  ADMIN: "bg-red-100 text-red-700",
}

// 需要多選分會的角色
const rolesNeedingChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"]

export default function AdminMembersPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const [members, setMembers] = useState<Member[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterChapter, setFilterChapter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 新增會員表單
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    chapterId: "",
    role: "MEMBER",
    managedChapterIds: [] as string[],
  })

  const needsChapterMultiSelect = rolesNeedingChapters.includes(formData.role)

  // 載入資料
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [membersRes, chaptersRes] = await Promise.all([
        fetch("/api/members"),
        fetch("/api/chapters"),
      ])
      const membersData = await membersRes.json()
      const chaptersData = await chaptersRes.json()
      setMembers(membersData)
      setChapters(chaptersData)
    } catch {
      toast.error("載入資料失敗")
    } finally {
      setIsLoading(false)
    }
  }

  // 篩選會員
  const filteredMembers = members.filter((member) => {
    const matchSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
    const matchChapter =
      filterChapter === "all" || member.chapter?.id === filterChapter
    return matchSearch && matchChapter
  })

  const handleToggleManagedChapter = (chapterId: string) => {
    setFormData((prev) => {
      const ids = prev.managedChapterIds.includes(chapterId)
        ? prev.managedChapterIds.filter((id) => id !== chapterId)
        : [...prev.managedChapterIds, chapterId]
      return { ...prev, managedChapterIds: ids }
    })
  }

  // 新增會員
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast.error("請填寫必填欄位")
      return
    }

    if (!needsChapterMultiSelect && !formData.chapterId) {
      toast.error("請選擇所屬分會")
      return
    }

    if (needsChapterMultiSelect && formData.managedChapterIds.length === 0) {
      toast.error("請至少選擇一個負責分會")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          chapterId: formData.chapterId || undefined,
          role: formData.role,
          managedChapterIds: formData.managedChapterIds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "新增失敗")
        return
      }

      toast.success("會員新增成功")
      setIsDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        chapterId: "",
        role: "MEMBER",
        managedChapterIds: [],
      })
      fetchData()
    } catch {
      toast.error("新增失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">會員管理</h1>
          <p className="text-muted-foreground mt-1">
            共 {members.length} 位會員
          </p>
        </div>

        {/* 只有 ADMIN 才能新增會員 */}
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                新增會員
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增會員</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="會員姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">電話</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0912-345-678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">角色</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value,
                        chapterId: rolesNeedingChapters.includes(value) ? "" : formData.chapterId,
                        managedChapterIds: rolesNeedingChapters.includes(value) ? formData.managedChapterIds : [],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">會員</SelectItem>
                      <SelectItem value="CHAPTER_LEADER">分會幹部</SelectItem>
                      <SelectItem value="AMBASSADOR">大使</SelectItem>
                      <SelectItem value="DIRECTOR_CONSULTANT">董事顧問</SelectItem>
                      <SelectItem value="REGIONAL_DIRECTOR">區域董事</SelectItem>
                      <SelectItem value="EXECUTIVE_DIRECTOR">執行董事</SelectItem>
                      <SelectItem value="ADMIN">管理員</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 所屬分會（非多選角色） */}
                {!needsChapterMultiSelect && (
                  <div className="space-y-2">
                    <Label htmlFor="chapterId">所屬分會 *</Label>
                    <Select
                      value={formData.chapterId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, chapterId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選擇分會" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 負責分會多選（董事顧問/大使） */}
                {needsChapterMultiSelect && (
                  <div className="space-y-2">
                    <Label>負責分會 *</Label>
                    <p className="text-xs text-muted-foreground">
                      請勾選負責的分會（可多選）
                    </p>
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {chapters.map((chapter) => {
                        const isSelected = formData.managedChapterIds.includes(chapter.id)
                        return (
                          <button
                            key={chapter.id}
                            type="button"
                            onClick={() => handleToggleManagedChapter(chapter.id)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors border-b last:border-b-0
                              ${isSelected ? "bg-amber-50 text-foreground" : "bg-white text-muted-foreground hover:bg-gray-50"}
                            `}
                          >
                            <div className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                              ${isSelected ? "border-amber-500 bg-amber-500" : "border-gray-300"}
                            `}>
                              {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                            </div>
                            {chapter.displayName}
                          </button>
                        )
                      })}
                    </div>
                    {formData.managedChapterIds.length > 0 && (
                      <p className="text-xs text-amber-600">
                        已選擇 {formData.managedChapterIds.length} 個分會
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
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
        )}
      </div>

      {/* 搜尋和篩選 */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名或 Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterChapter} onValueChange={setFilterChapter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="篩選分會" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分會</SelectItem>
            {chapters.map((chapter) => (
              <SelectItem key={chapter.id} value={chapter.id}>
                {chapter.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 會員列表 */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>電話</TableHead>
              <TableHead>分會</TableHead>
              <TableHead>角色</TableHead>
              <TableHead className="text-center">報名次數</TableHead>
              {isAdmin && <TableHead className="text-right">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.phone || "-"}
                  </TableCell>
                  <TableCell>{member.chapter?.displayName || member.chapterName || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={roleColors[member.role] || "bg-gray-100 text-gray-700"}
                    >
                      {roleLabels[member.role] || member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {member._count.registrations}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <Link href={`/admin/members/${member.id}`}>
                        <Button variant="ghost" size="sm">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-12">
                  <p className="text-muted-foreground">
                    {search || filterChapter !== "all"
                      ? "沒有符合條件的會員"
                      : "尚無會員資料"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
