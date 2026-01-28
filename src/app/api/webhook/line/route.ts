import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// POST /api/webhook/line - LINE Webhook 接收端
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // 驗證簽章
    const channelSecret = process.env.LINE_CHANNEL_SECRET
    if (!channelSecret) {
      console.error("LINE_CHANNEL_SECRET is not defined")
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const signature = request.headers.get("x-line-signature")
    const expectedSignature = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    const payload = JSON.parse(body)
    const events = payload.events || []

    for (const event of events) {
      // Bot 被加入群組時，記錄 groupId
      if (event.type === "join" && event.source?.type === "group") {
        console.log("=== LINE Bot 加入群組 ===")
        console.log("Group ID:", event.source.groupId)
        console.log("========================")
      }

      // Bot 被加入聊天室時
      if (event.type === "join" && event.source?.type === "room") {
        console.log("=== LINE Bot 加入聊天室 ===")
        console.log("Room ID:", event.source.roomId)
        console.log("===========================")
      }

      // 收到訊息時，記錄來源（方便取得 groupId）
      if (event.type === "message" && event.source?.type === "group") {
        console.log("收到群組訊息，Group ID:", event.source.groupId)
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("LINE Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
