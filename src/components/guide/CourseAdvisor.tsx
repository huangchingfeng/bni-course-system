"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  SendIcon,
  Loader2Icon,
  MessageCircleIcon,
  UserIcon,
  BotIcon,
  LightbulbIcon,
} from "lucide-react"

// 預設問題建議
const suggestedQuestions = [
  "我剛入會，應該先上什麼課？",
  "我想提升簡報能力",
  "如何增加引薦數量？",
  "我想了解 Power Team",
  "領導團隊需要上什麼課？",
]

export function CourseAdvisor() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasAsked, setHasAsked] = useState(false)

  const handleSubmit = async (questionToAsk?: string) => {
    const finalQuestion = questionToAsk || question
    if (!finalQuestion.trim()) return

    setIsLoading(true)
    setHasAsked(true)
    setResponse("")

    try {
      const res = await fetch("/api/guide-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalQuestion }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResponse(data.error || "發生錯誤，請稍後再試")
      } else {
        setResponse(data.response)
      }
    } catch {
      setResponse("網路連線失敗，請檢查網路後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (q: string) => {
    setQuestion(q)
    handleSubmit(q)
  }

  const handleReset = () => {
    setQuestion("")
    setResponse("")
    setHasAsked(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E3A5F] px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">培訓課程小助手</h3>
            <p className="text-sm text-white/70">告訴我你的情況，我來推薦適合的課程</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasAsked ? (
          <>
            {/* 輸入區域 */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例如：我剛入會兩個月，想知道應該先上什麼課程？"
                  className="w-full h-24 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] resize-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
              </div>

              <Button
                onClick={() => handleSubmit()}
                disabled={!question.trim() || isLoading}
                variant="gold"
                className="w-full"
              >
                {isLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                詢問小助手
              </Button>
            </div>

            {/* 建議問題 */}
            <div className="mt-6 pt-6 border-t border-[#E2E8F0]/60">
              <p className="text-sm text-[#64748B] mb-3 flex items-center gap-2">
                <LightbulbIcon className="h-4 w-4" />
                或者點擊以下常見問題：
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="px-3 py-1.5 text-sm bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 對話顯示 */}
            <div className="space-y-4">
              {/* 用戶問題 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-4 w-4 text-[#D4AF37]" />
                </div>
                <div className="flex-1 bg-[#F1F5F9] rounded-xl rounded-tl-none px-4 py-3">
                  <p className="text-[#0F172A]">{question}</p>
                </div>
              </div>

              {/* AI 回應 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E5C55C] flex items-center justify-center flex-shrink-0">
                  <BotIcon className="h-4 w-4 text-[#0F172A]" />
                </div>
                <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl rounded-tl-none px-4 py-3">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      <span>正在思考中...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-[#334155] leading-relaxed">
                      {response.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            {!isLoading && (
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  問其他問題
                </Button>
              </div>
            )}
          </>
        )}

        {/* 提示訊息 */}
        <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
          <p className="text-sm text-[#0F172A]/80 leading-relaxed">
            <strong className="text-[#D4AF37]">小提醒：</strong>
            如果你在 BNI 裡面遇到任何問題或報名狀況，都可以詢問分會的領導團隊，不論是<strong>活動協調員</strong>、<strong>導師協調員</strong>或是<strong>主席</strong>，都可以提供協助！
          </p>
        </div>
      </div>
    </div>
  )
}
