import { Role } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: Role
      chapterId: string
      chapterName: string
      managedChapterIds: string[]
    }
  }

  interface User {
    id: string
    role?: Role
    chapterId?: string
    chapterName?: string
    managedChapterIds?: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    chapterId: string
    chapterName: string
    managedChapterIds: string[]
  }
}
