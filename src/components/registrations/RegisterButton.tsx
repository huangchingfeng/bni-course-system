"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckIcon, Loader2Icon, XIcon, SparklesIcon } from "lucide-react"

interface RegisterButtonProps {
  courseId: string
  isRegistered: boolean
  registrationId?: string
  isFull: boolean
  isDeadlinePassed: boolean
}

export function RegisterButton({
  courseId,
  isRegistered: initialIsRegistered,
  registrationId: initialRegistrationId,
  isFull,
  isDeadlinePassed,
}: RegisterButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered)
  const [registrationId, setRegistrationId] = useState(initialRegistrationId)

  const handleRegister = async () => {
    if (status !== "authenticated") {
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "報名失敗")
        return
      }

      setIsRegistered(true)
      setRegistrationId(data.id)
      toast.success("報名成功！")
      router.refresh()
    } catch {
      toast.error("報名失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!registrationId) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/registrations?id=${registrationId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "取消報名失敗")
        return
      }

      setIsRegistered(false)
      setRegistrationId(undefined)
      toast.success("已取消報名")
      router.refresh()
    } catch {
      toast.error("取消報名失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  // 載入中狀態
  if (status === "loading") {
    return (
      <Button disabled className="w-full h-12" variant="secondary">
        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
        載入中...
      </Button>
    )
  }

  // 已截止
  if (isDeadlinePassed) {
    return (
      <Button disabled variant="secondary" className="w-full h-12 opacity-60">
        <XIcon className="h-4 w-4 mr-2" />
        已截止報名
      </Button>
    )
  }


  // 已報名
  if (isRegistered) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#059669]/10 border border-[#059669]/20 text-[#059669]">
          <CheckIcon className="h-5 w-5" />
          <span className="font-medium">已成功報名</span>
        </div>
        <Button
          variant="outline"
          className="w-full h-11 text-[#DC2626] border-[#DC2626]/30 hover:bg-[#DC2626]/5 hover:border-[#DC2626]/50"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <XIcon className="h-4 w-4 mr-2" />
          )}
          取消報名
        </Button>
      </div>
    )
  }

  // 未登入或可報名
  return (
    <Button
      onClick={handleRegister}
      disabled={isLoading}
      variant="gold"
      className="w-full h-12"
      size="lg"
    >
      {isLoading ? (
        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <SparklesIcon className="h-4 w-4 mr-2" />
      )}
      {status === "authenticated" ? "立即報名" : "登入後報名"}
    </Button>
  )
}
