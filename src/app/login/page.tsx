"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLineLoading, setIsLineLoading] = useState(false)

  // LINE 登入
  const handleLineLogin = async () => {
    setIsLineLoading(true)
    await signIn("line", { callbackUrl })
  }

  // Email 登入 (開發用)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("請輸入 Email")
      return
    }

    setIsLoading(true)

    const result = await signIn("credentials", {
      email,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      toast.error("找不到此 Email 的會員資料")
    } else {
      toast.success("登入成功！")
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">登入</CardTitle>
        <CardDescription>
          登入後即可一鍵報名課程
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* LINE 登入 */}
        <Button
          onClick={handleLineLogin}
          disabled={isLineLoading}
          className="w-full bg-[#00B900] hover:bg-[#00A000] text-white"
          size="lg"
        >
          {isLineLoading ? (
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
          )}
          使用 LINE 登入
        </Button>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
            或
          </span>
        </div>

        {/* Email 登入 (開發用) */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (開發測試用)</Label>
            <Input
              id="email"
              type="email"
              placeholder="輸入已註冊的 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              此功能僅供開發測試，正式環境請使用 LINE 登入
            </p>
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />}
            Email 登入
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          還沒有帳號？{" "}
          <a href="/register" className="text-[#D4AF37] hover:underline font-medium">
            立即註冊
          </a>
        </p>
      </CardContent>
    </Card>
  )
}

function LoginLoading() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">登入</CardTitle>
        <CardDescription>
          載入中...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-12">
        <Loader2Icon className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
