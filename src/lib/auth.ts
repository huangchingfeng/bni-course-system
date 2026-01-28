import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"
import { needsManagedChapters } from "./permissions"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    // LINE Login
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
    // 開發用 Email/Password 登入
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        // 開發環境：找到對應 email 的會員就允許登入
        const member = await prisma.member.findUnique({
          where: { email: credentials.email },
          include: {
            chapter: true,
            managedChapters: { select: { chapterId: true } },
          },
        })

        if (member) {
          return {
            id: member.id,
            email: member.email,
            name: member.name,
            image: member.avatarUrl,
            role: member.role,
            chapterId: member.chapterId || undefined,
            chapterName: member.chapter?.displayName || member.chapterName || "",
            managedChapterIds: member.managedChapters.map((mc) => mc.chapterId),
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: Role }).role || Role.MEMBER
        token.chapterId = (user as { chapterId?: string }).chapterId || ""
        token.chapterName = (user as { chapterName?: string }).chapterName || ""
        token.managedChapterIds = (user as { managedChapterIds?: string[] }).managedChapterIds || []
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.chapterId = token.chapterId as string
        session.user.chapterName = token.chapterName as string
        session.user.managedChapterIds = token.managedChapterIds as string[]
      }
      return session
    },
    async signIn({ user, account }) {
      // LINE 登入時，檢查或建立會員資料
      if (account?.provider === "line" && user.email) {
        const existingMember = await prisma.member.findUnique({
          where: { email: user.email },
        })

        if (!existingMember) {
          // 如果是新會員，需要先完成註冊流程
          return `/register?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || "")}`
        }

        // 已存在的 LINE 會員：載入 managedChapterIds
        if (needsManagedChapters(existingMember.role)) {
          const managed = await prisma.memberChapter.findMany({
            where: { memberId: existingMember.id },
            select: { chapterId: true },
          })
          user.managedChapterIds = managed.map((mc) => mc.chapterId)
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
