"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2Icon, UploadIcon, XIcon, ImageIcon } from "lucide-react"
import { CourseStatus } from "@prisma/client"

interface CourseType {
  id: string
  code: string
  name: string
}

interface CourseData {
  id?: string
  title: string
  description: string
  bannerUrl: string
  typeId: string
  date: string
  startTime: string
  endTime: string
  location: string
  address: string
  capacity: string
  deadline: string
  status: CourseStatus
}

interface CourseFormProps {
  courseTypes: CourseType[]
  initialData?: CourseData
  isEditing?: boolean
}

export function CourseForm({ courseTypes, initialData, isEditing }: CourseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<CourseData>(
    initialData || {
      title: "",
      description: "",
      bannerUrl: "",
      typeId: "",
      date: "",
      startTime: "09:00",
      endTime: "17:00",
      location: "",
      address: "",
      capacity: "",
      deadline: "",
      status: CourseStatus.DRAFT,
    }
  )

  const handleChange = (field: keyof CourseData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 驗證檔案類型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("僅支援 JPG、PNG、GIF、WebP 格式")
      return
    }

    // 驗證檔案大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("檔案大小不可超過 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "上傳失敗")
        return
      }

      handleChange("bannerUrl", data.url)
      toast.success("圖片上傳成功")
    } catch {
      toast.error("上傳失敗，請稍後再試")
    } finally {
      setIsUploading(false)
      // 清除 input 的值，這樣同一檔案可以再次上傳
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveBanner = () => {
    handleChange("bannerUrl", "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證必填欄位
    if (!formData.title || !formData.typeId || !formData.date || !formData.location) {
      toast.error("請填寫必填欄位")
      return
    }

    setIsLoading(true)

    try {
      const url = isEditing
        ? `/api/courses/${initialData?.id}`
        : "/api/courses"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "操作失敗")
        return
      }

      toast.success(isEditing ? "課程更新成功" : "課程建立成功")
      router.push("/admin/courses")
      router.refresh()
    } catch {
      toast.error("操作失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* 基本資訊 */}
        <Card>
          <CardHeader>
            <CardTitle>基本資訊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">課程名稱 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="例：2026 年第一季 MSP 成功會員培訓"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeId">課程類型 *</Label>
              <Select
                value={formData.typeId}
                onValueChange={(value) => handleChange("typeId", value)}
              >
                <SelectTrigger id="typeId">
                  <SelectValue placeholder="選擇課程類型" />
                </SelectTrigger>
                <SelectContent>
                  {courseTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.code} - {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">課程說明</Label>
              <textarea
                id="description"
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="課程內容描述..."
              />
            </div>

            <div className="space-y-2">
              <Label>培訓橫幅圖片</Label>

              {/* 隱藏的 file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {formData.bannerUrl ? (
                /* 有圖片時顯示預覽 */
                <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC]">
                  <img
                    src={formData.bannerUrl}
                    alt="Banner 預覽"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <UploadIcon className="h-4 w-4 mr-1" />
                      更換圖片
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveBanner}
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      移除
                    </Button>
                  </div>
                </div>
              ) : (
                /* 沒有圖片時顯示上傳區域 */
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center cursor-pointer hover:border-[#D4AF37] hover:bg-[#FAFBFC] transition-colors"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2Icon className="h-8 w-8 animate-spin text-[#D4AF37]" />
                      <p className="text-sm text-[#64748B]">上傳中...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-[#64748B]" />
                      </div>
                      <p className="text-sm font-medium text-[#0F172A]">點擊上傳圖片</p>
                      <p className="text-xs text-[#64748B]">
                        支援 JPG、PNG、GIF、WebP，最大 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                建議比例 3:1 或 4:1，將顯示於培訓詳情頁頂部
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 時間地點 */}
        <Card>
          <CardHeader>
            <CardTitle>時間地點</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">日期 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">開始時間 *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">結束時間 *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">地點 *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="例：新北市政府行政大樓"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="例：新北市板橋區中山路一段161號"
              />
            </div>
          </CardContent>
        </Card>

        {/* 報名設定 */}
        <Card>
          <CardHeader>
            <CardTitle>報名設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">人數上限</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="留空表示無限制"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">報名截止日</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">狀態</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as CourseStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">草稿</SelectItem>
                  <SelectItem value="PUBLISHED">已發布</SelectItem>
                  <SelectItem value="CLOSED">已截止</SelectItem>
                  <SelectItem value="CANCELLED">已取消</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                只有「已發布」的課程會顯示在前台，讓會員報名
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 操作按鈕 */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
            {isEditing ? "更新課程" : "建立課程"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            取消
          </Button>
        </div>
      </div>
    </form>
  )
}
