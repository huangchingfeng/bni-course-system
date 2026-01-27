import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "flex h-11 w-full rounded-xl border-2 border-[#E2E8F0] bg-white px-4 py-2.5",
        "text-base text-[#0F172A] placeholder:text-[#94A3B8]",
        // Transitions
        "transition-all duration-200",
        // Focus state
        "focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20",
        // Hover state
        "hover:border-[#CBD5E1]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F8FAFC]",
        // Error state
        "aria-invalid:border-[#DC2626] aria-invalid:focus:border-[#DC2626] aria-invalid:focus:ring-[#DC2626]/20",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#0F172A]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
