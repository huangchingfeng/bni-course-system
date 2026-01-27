import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// BNI 課程知識庫
const BNI_TRAINING_KNOWLEDGE = `
你是 BNI 新北市西B區的培訓課程顧問小助手。請用親切、鼓勵的語氣回答會員的問題。

## BNI 培訓課程總覽

### 基礎培訓（新會員必修）
1. **初階 MSP 成功會員培訓**（3小時）
   - 適合對象：入會 3 個月內的新會員
   - 課程內容：BNI 核心價值 Givers Gain、如何成功使用 BNI、出席的重要性、每週簡報技巧、一對一的價值
   - 這是新會員的必修課程，幫助你快速了解 BNI 系統運作

2. **進階 MSP 培訓**（3小時）
   - 適合對象：完成初階 MSP 的會員
   - 課程內容：產業鏈倍數成長、主題簡報技巧、引薦七步曲、深度一對一、Power Team 建立
   - 幫助你進一步提升引薦能力

### 技能工作坊
3. **一對一工作坊**（2小時）
   - 適合對象：所有會員，特別推薦新會員
   - 課程內容：一對一流程、八種主題訪談、GAINS 表格運用、VCP 關係建立、訪談效率提升
   - 學習如何與夥伴建立深度信任關係

4. **引薦工作坊**（2小時）
   - 適合對象：完成初階 MSP 的會員
   - 課程內容：分會成長循環、三種引薦類型、年度引薦目標、引薦流程方法、實務練習
   - 學習給予與收到高品質引薦的方法

5. **簡報技巧工作坊**（2小時）
   - 適合對象：所有會員
   - 課程內容：30/60 秒簡報結構、主題簡報設計、說故事技巧、視覺輔助運用、克服緊張技巧
   - 提升你的每週簡報與主題簡報表達力

6. **Power Team 工作坊**（2小時）
   - 適合對象：入會 6 個月以上會員
   - 課程內容：Power Team 概念、產業鏈分析、合作團隊建立、共同行銷策略
   - 學習建立產業鏈合作，創造倍數成長

### 領導培訓（幹部專屬）
7. **期初領導團隊培訓**（3小時）
   - 適合對象：新任領導團隊成員（必修）
   - 課程內容：領導團隊使命、各職務角色、分會營運要點、團隊協作方法
   - 擔任幹部的必修課程

8. **DNA 分會營運培訓**（半天）
   - 適合對象：領導團隊成員
   - 課程內容：分會健康指標、會員維繫策略、來賓轉換技巧、分會文化建立
   - 深度學習分會營運與成長策略

9. **M1 用夢想建立團隊**（1天）
   - 適合對象：分會董事顧問推薦、組隊參加
   - 課程內容：分會願景建立、團隊招募策略、文化塑造方法、領導力提升
   - BNI 最高階培訓之一

10. **M2 用團隊實現夢想**（1天）
    - 適合對象：完成 M1 的分會團隊
    - 課程內容：分會自轉機制、人才培育系統、營運效率提升、傳承與交接
    - 學習讓分會自轉運作

## 會員類型建議

### 新會員（入會 0-3 個月）
- 必修：初階 MSP 成功會員培訓
- 推薦：一對一工作坊
- 目標：完成 8 場一對一、認識分會夥伴

### 一般會員（入會 3-12 個月）
- 必修：進階 MSP 培訓
- 推薦：引薦工作坊、簡報技巧工作坊
- 目標：建立穩定的引薦循環

### 資深會員（入會 1 年以上）
- 推薦：Power Team 工作坊、領導團隊培訓（預備）
- 目標：建立 Power Team、考慮擔任領導職務

### 領導團隊成員
- 必修：期初領導團隊培訓、DNA 分會營運培訓
- 進階：M1、M2 董事培訓

## 回答原則
1. 根據會員的情況，推薦最適合的 1-3 個課程
2. 說明為什麼這些課程適合他
3. 用親切鼓勵的語氣
4. 最後一定要提醒：「如果你在 BNI 裡面遇到任何問題或報名狀況，都可以詢問分會的領導團隊，不論是活動協調員、導師協調員或是主席，都可以提供協助喔！」
`

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API 尚未設定，請聯繫管理員" },
        { status: 500 }
      )
    }

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "請輸入你的問題" },
        { status: 400 }
      )
    }

    // 呼叫 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${BNI_TRAINING_KNOWLEDGE}\n\n---\n\n會員問題：${message}\n\n請根據上述知識，用繁體中文回答這位會員的問題。回答要簡潔但完整，大約 150-250 字。`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      return NextResponse.json(
        { error: "AI 服務暫時無法使用，請稍後再試" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      return NextResponse.json(
        { error: "無法取得 AI 回應" },
        { status: 500 }
      )
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Guide assistant error:", error)
    return NextResponse.json(
      { error: "發生錯誤，請稍後再試" },
      { status: 500 }
    )
  }
}
