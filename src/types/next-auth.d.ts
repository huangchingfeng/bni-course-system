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
    }
  }

  interface User {
    id: string
    role?: Role
    chapterId?: string
    chapterName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    chapterId: string
    chapterName: string
  }
}
