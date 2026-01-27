"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PlusIcon, UsersIcon, Loader2Icon } from "lucide-react"

interface Chapter {
  id: string
  name: string
  displayName: string
  region: string
  isActive: boolean
  _count: {
    members: number
  }
}

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
  })

  useEffect(() => {
    fetchChapters()
  }, [])

  const fetchChapters = async () => {
    try {
      const response = await fetch("/api/chapters")
      const data = await response.json()
      setChapters(data)
    } catch {
      toast.error("載入資料失敗")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("請填寫分會名稱")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "新增失敗")
        return
      }

      toast.success("分會新增成功")
      setIsDialogOpen(false)
      setFormData({ name: "", displayName: "" })
      fetchChapters()
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

  const totalMembers = chapters.reduce(
    (sum, chapter) => sum + chapter._count.members,
    0
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分會管理</h1>
          <p className="text-muted-foreground mt-1">
            共 {chapters.length} 個分會，{totalMembers} 位會員
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              新增分會
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增分會</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">分會代號 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例：華榮"
                />
                <p className="text-xs text-muted-foreground">
                  用於系統識別，建議使用簡短名稱
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">顯示名稱</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  placeholder="例：華榮分會（留空則自動產生）"
                />
              </div>

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
      </div>

      {/* 分會列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{chapter.displayName}</CardTitle>
                {chapter.isActive ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    啟用中
                  </Badge>
                ) : (
                  <Badge variant="secondary">已停用</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UsersIcon className="h-4 w-4" />
                <span>{chapter._count.members} 位會員</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {chapter.region}
              </p>
            </CardContent>
          </Card>
        ))}

        {chapters.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">尚無分會資料</p>
            <Button onClick={() => setIsDialogOpen(true)}>建立第一個分會</Button>
          </div>
        )}
      </div>
    </div>
  )
}
