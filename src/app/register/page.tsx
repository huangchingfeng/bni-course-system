"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2Icon, UserPlusIcon, ArrowLeftIcon, CheckIcon } from "lucide-react"

interface Chapter {
  id: string
  name: string
  displayName: string
}

const roleOptions = [
  { value: "MEMBER", label: "一般會員" },
  { value: "AMBASSADOR", label: "大使" },
  { value: "DIRECTOR_CONSULTANT", label: "董事顧問" },
  { value: "REGIONAL_DIRECTOR", label: "區域董事" },
  { value: "EXECUTIVE_DIRECTOR", label: "執行董事" },
]

// 需要多選分會的角色
const rolesNeedingChapters = ["DIRECTOR_CONSULTANT", "AMBASSADOR"]

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    chapterInput: "",  // 一般會員的所屬分會
    profession: "",
    role: "MEMBER",
    managedChapterIds: [] as string[],  // 董事顧問/大使的負責分會
  })

  const needsChapterMultiSelect = rolesNeedingChapters.includes(formData.role)
  const needsSingleChapter = !rolesNeedingChapters.includes(formData.role) &&
    formData.role !== "REGIONAL_DIRECTOR" && formData.role !== "EXECUTIVE_DIRECTOR"

  // 載入分會列表
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("/api/chapters")
        if (response.ok) {
          const data = await response.json()
          setChapters(data)
        }
      } catch (error) {
        console.error("Error fetching chapters:", error)
      }
    }

    fetchChapters()
  }, [])

  // 點擊外部關閉建議列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // 分會輸入時過濾建議
    if (field === "chapterInput") {
      if (value.trim()) {
        const filtered = chapters.filter(
          (ch) =>
            ch.displayName.toLowerCase().includes(value.toLowerCase()) ||
            ch.name.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredChapters(filtered)
        setShowSuggestions(true)
      } else {
        setFilteredChapters([])
        setShowSuggestions(false)
      }
    }
  }

  const handleSelectChapter = (chapter: Chapter) => {
    setFormData((prev) => ({ ...prev, chapterInput: chapter.displayName }))
    setShowSuggestions(false)
  }

  const handleToggleManagedChapter = (chapterId: string) => {
    setFormData((prev) => {
      const ids = prev.managedChapterIds.includes(chapterId)
        ? prev.managedChapterIds.filter((id) => id !== chapterId)
        : [...prev.managedChapterIds, chapterId]
      return { ...prev, managedChapterIds: ids }
    })
  }

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
      // 切換角色時清空不需要的欄位
      chapterInput: rolesNeedingChapters.includes(role) ? "" : prev.chapterInput,
      managedChapterIds: rolesNeedingChapters.includes(role) ? prev.managedChapterIds : [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 前端驗證
    if (!formData.name || !formData.email || !formData.phone || !formData.profession) {
      toast.error("請填寫所有必填欄位")
      return
    }

    if (needsSingleChapter && !formData.chapterInput) {
      toast.error("請填寫所屬分會")
      return
    }

    if (needsChapterMultiSelect && formData.managedChapterIds.length === 0) {
      toast.error("請至少選擇一個負責分會")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          chapterInput: formData.chapterInput,
          profession: formData.profession,
          role: formData.role,
          managedChapterIds: formData.managedChapterIds,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "註冊失敗")
        return
      }

      toast.success("註冊成功！請使用此 Email 登入。")
      router.push("/login")
    } catch {
      toast.error("註冊失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container-wide py-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors group"
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            返回登入
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <UserPlusIcon className="h-7 w-7 text-[#D4AF37]" />
            </div>
            <CardTitle className="text-2xl">加入華字輩培訓</CardTitle>
            <CardDescription>
              填寫以下資料完成會員註冊
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 姓名 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="請輸入姓名"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* 聯絡電話 */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  聯絡電話 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="0912-345-678"
                  required
                />
              </div>

              {/* 角色選擇 */}
              <div className="space-y-2">
                <Label>
                  身份 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleChange(option.value)}
                      className={`
                        px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left
                        ${formData.role === option.value
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0F172A]"
                          : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 所屬分會（一般會員用） */}
              {needsSingleChapter && (
                <div className="space-y-2">
                  <Label htmlFor="chapterInput">
                    所屬分會 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative" ref={suggestionsRef}>
                    <Input
                      id="chapterInput"
                      value={formData.chapterInput}
                      onChange={(e) => handleChange("chapterInput", e.target.value)}
                      onFocus={() => {
                        if (formData.chapterInput.trim() && filteredChapters.length > 0) {
                          setShowSuggestions(true)
                        }
                      }}
                      placeholder="輸入分會名稱，例如：華冠、華榮"
                      autoComplete="off"
                      required
                    />
                    {/* 自動完成建議 */}
                    {showSuggestions && filteredChapters.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredChapters.map((chapter) => (
                          <button
                            key={chapter.id}
                            type="button"
                            className="w-full px-4 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors text-sm"
                            onClick={() => handleSelectChapter(chapter)}
                          >
                            {chapter.displayName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B]">
                    輸入時會顯示建議，也可以直接輸入分會名稱
                  </p>
                </div>
              )}

              {/* 負責分會多選（董事顧問/大使用） */}
              {needsChapterMultiSelect && (
                <div className="space-y-2">
                  <Label>
                    負責分會 <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-[#64748B] mb-2">
                    請勾選您負責的分會（可多選）
                  </p>
                  <div className="border border-[#E2E8F0] rounded-lg max-h-56 overflow-y-auto">
                    {chapters.map((chapter) => {
                      const isSelected = formData.managedChapterIds.includes(chapter.id)
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => handleToggleManagedChapter(chapter.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-b border-[#E2E8F0] last:border-b-0
                            ${isSelected ? "bg-[#D4AF37]/10 text-[#0F172A]" : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"}
                          `}
                        >
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? "border-[#D4AF37] bg-[#D4AF37]" : "border-[#CBD5E1]"}
                          `}>
                            {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                          </div>
                          {chapter.displayName}
                        </button>
                      )
                    })}
                  </div>
                  {formData.managedChapterIds.length > 0 && (
                    <p className="text-xs text-[#D4AF37]">
                      已選擇 {formData.managedChapterIds.length} 個分會
                    </p>
                  )}
                </div>
              )}

              {/* 專業別 */}
              <div className="space-y-2">
                <Label htmlFor="profession">
                  專業別 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleChange("profession", e.target.value)}
                  placeholder="例如：室內設計、保險、餐飲"
                  required
                />
                <p className="text-xs text-[#64748B]">
                  請填寫您的專業領域或行業別
                </p>
              </div>

              {/* 提交按鈕 */}
              <Button
                type="submit"
                variant="gold"
                className="w-full h-12 mt-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    註冊中...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    註冊會員
                  </>
                )}
              </Button>

              {/* 已有帳號連結 */}
              <p className="text-center text-sm text-[#64748B] pt-2">
                已有帳號？{" "}
                <Link href="/login" className="text-[#D4AF37] hover:underline font-medium">
                  立即登入
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
