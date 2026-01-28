import { messagingApi } from "@line/bot-sdk"

const { MessagingApiClient } = messagingApi

// LINE Messaging API client（懶載入）
let client: messagingApi.MessagingApiClient | null = null

export function getLineClient(): messagingApi.MessagingApiClient {
  if (!client) {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN
    if (!channelAccessToken) {
      throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not defined")
    }
    client = new MessagingApiClient({ channelAccessToken })
  }
  return client
}

// 推送文字訊息到群組
export async function pushTextMessage(groupId: string, text: string) {
  const lineClient = getLineClient()
  await lineClient.pushMessage({
    to: groupId,
    messages: [{ type: "text", text }],
  })
}
