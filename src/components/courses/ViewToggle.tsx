"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGridIcon, CalendarIcon } from "lucide-react"

interface ViewToggleProps {
  currentView: "list" | "calendar"
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleViewChange = (view: "list" | "calendar") => {
    const params = new URLSearchParams(searchParams.toString())
    if (view === "list") {
      params.delete("view")
    } else {
      params.set("view", view)
    }
    router.push(`/courses?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl">
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("list")}
        className={currentView === "list" ? "" : "text-[#64748B] hover:text-[#0F172A]"}
      >
        <LayoutGridIcon className="h-4 w-4 mr-1.5" />
        列表
      </Button>
      <Button
        variant={currentView === "calendar" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("calendar")}
        className={currentView === "calendar" ? "" : "text-[#64748B] hover:text-[#0F172A]"}
      >
        <CalendarIcon className="h-4 w-4 mr-1.5" />
        行事曆
      </Button>
    </div>
  )
}
