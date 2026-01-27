"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchIcon, XIcon, FilterIcon } from "lucide-react"

interface CourseType {
  id: string
  code: string
  name: string
}

interface CourseFilterProps {
  courseTypes: CourseType[]
  calendarMode?: boolean
}

export function CourseFilter({ courseTypes, calendarMode = false }: CourseFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState(searchParams.get("type") || "all")
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "")
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "")

  const view = searchParams.get("view") || "list"

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (type && type !== "all") params.set("type", type)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    if (view === "calendar") params.set("view", "calendar")

    router.push(`/courses?${params.toString()}`)
  }

  const handleTypeChange = (newType: string) => {
    setType(newType)
    if (calendarMode) {
      // 在行事曆模式下，直接應用篩選
      const params = new URLSearchParams()
      if (newType && newType !== "all") params.set("type", newType)
      params.set("view", "calendar")
      router.push(`/courses?${params.toString()}`)
    }
  }

  const handleReset = () => {
    setType("all")
    setDateFrom("")
    setDateTo("")
    const params = new URLSearchParams()
    if (view === "calendar") params.set("view", "calendar")
    router.push(`/courses?${params.toString()}`)
  }

  const hasFilters = type !== "all" || dateFrom || dateTo

  // 行事曆模式的簡化篩選
  if (calendarMode) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <Label className="text-sm font-medium text-[#64748B] whitespace-nowrap">
          培訓類型
        </Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[200px] h-10 rounded-xl border-2 border-[#E2E8F0] bg-white">
            <SelectValue placeholder="全部類型" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2 border-[#E2E8F0]">
            <SelectItem value="all" className="rounded-lg">全部類型</SelectItem>
            {courseTypes.map((ct) => (
              <SelectItem key={ct.id} value={ct.code} className="rounded-lg">
                <span className="font-medium">{ct.code}</span>
                <span className="text-[#64748B] ml-2">{ct.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-[#64748B]"
          >
            <XIcon className="h-4 w-4 mr-1" />
            清除篩選
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <FilterIcon className="h-5 w-5 text-[#D4AF37]" />
        <h3 className="text-base font-semibold text-[#0F172A]">篩選條件</h3>
        {hasFilters && (
          <span className="ml-2 px-2 py-0.5 bg-[#D4AF37]/10 text-[#B8860B] text-xs font-medium rounded-full">
            已套用
          </span>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Course Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium text-[#64748B]">
            培訓類型
          </Label>
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger
              id="type"
              className="h-11 rounded-xl border-2 border-[#E2E8F0] bg-white hover:border-[#CBD5E1] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              <SelectValue placeholder="全部類型" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-[#E2E8F0]">
              <SelectItem value="all" className="rounded-lg">全部類型</SelectItem>
              {courseTypes.map((ct) => (
                <SelectItem key={ct.id} value={ct.code} className="rounded-lg">
                  <span className="font-medium">{ct.code}</span>
                  <span className="text-[#64748B] ml-2">{ct.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium text-[#64748B]">
            開始日期
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium text-[#64748B]">
            結束日期
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-3">
          <Button onClick={handleSearch} variant="gold" className="flex-1 !text-[#0F172A]">
            <SearchIcon className="h-4 w-4 text-[#0F172A]" />
            搜尋培訓
          </Button>
          {hasFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="flex-shrink-0"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
