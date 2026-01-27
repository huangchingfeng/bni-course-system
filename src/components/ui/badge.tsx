import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        // Default - Navy
        default: "bg-[#0F172A] text-white",
        // Gold
        gold: "bg-gradient-to-r from-[#D4AF37]/15 to-[#E5C55C]/15 text-[#B8860B] border border-[#D4AF37]/30",
        // Success
        success: "bg-[#059669]/10 text-[#059669] border border-[#059669]/20",
        // Warning
        warning: "bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20",
        // Destructive
        destructive: "bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20",
        // Secondary
        secondary: "bg-[#F1F5F9] text-[#64748B]",
        // Outline
        outline: "border-2 border-[#E2E8F0] text-[#64748B] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
