"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeftIcon, Loader2Icon, TrashIcon } from "lucide-react"

interface Chapter {
  id: string
  displayName: string
}

interface Member {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  isActive: boolean
  chapterId: string
  chapter: {
    displayName: string
  }
  registrations: Array<{
    id: string
    status: string
    course: {
      title: string
      date: string
    }
  }>
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string

  const [member, setMember] = useState<Member | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    chapterId: "",
    role: "MEMBER",
    isActive: true,
  })

  useEffect(() => {
    fetchData()
  }, [memberId])

  const fetchData = async () => {
    try {
      const [memberRes, chaptersRes] = await Promise.all([
        fetch(`/api/members/${memberId}`),
        fetch("/api/chapters"),
      ])

      if (!memberRes.ok) {
        toast.error("會員不存在")
        router.push("/admin/members")
        return
      }

      const memberData = await memberRes.json()
      const chaptersData = await chaptersRes.json()

      setMember(memberData)
      setChapters(chaptersData)
      setFormData({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone || "",
        chapterId: memberData.chapterId,
        role: memberData.role,
        isActive: memberData.isActive,
      })
    } catch {
      toast.error("載入資料失敗")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.chapterId) {
      toast.error("請填寫必填欄位")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "更新失敗")
        return
      }

      toast.success("會員資料已更新")
      router.push("/admin/members")
    } catch {
      toast.error("更新失敗")
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

  if (!member) {
    return null
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/members"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        返回會員列表
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">編輯會員</h1>
        <p className="text-muted-foreground mt-1">
          修改會員資料
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">電話</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chapterId">所屬分會 *</Label>
                  <Select
                    value={formData.chapterId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, chapterId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">角色</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">會員</SelectItem>
                      <SelectItem value="CHAPTER_LEADER">分會幹部</SelectItem>
                      <SelectItem value="ADMIN">管理員</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">狀態</Label>
                  <Select
                    value={formData.isActive ? "active" : "inactive"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isActive: value === "active" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">啟用</SelectItem>
                      <SelectItem value="inactive">停用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  儲存變更
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 報名紀錄 */}
        <Card>
          <CardHeader>
            <CardTitle>報名紀錄</CardTitle>
          </CardHeader>
          <CardContent>
            {member.registrations && member.registrations.length > 0 ? (
              <div className="space-y-3">
                {member.registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{reg.course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reg.course.date).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                    <Badge
                      variant={
                        reg.status === "REGISTERED" ? "default" : "secondary"
                      }
                    >
                      {reg.status === "REGISTERED"
                        ? "已報名"
                        : reg.status === "CANCELLED"
                        ? "已取消"
                        : reg.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                尚無報名紀錄
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
