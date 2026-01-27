import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Premium Navy Button (Default)
        default:
          "bg-[#0F172A] text-white rounded-xl shadow-md hover:bg-[#1E293B] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        // Gold Accent Button
        gold:
          "bg-gradient-to-r from-[#D4AF37] to-[#E5C55C] text-[#0F172A] rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-semibold",
        // Destructive
        destructive:
          "bg-[#DC2626] text-white rounded-xl shadow-md hover:bg-[#B91C1C] hover:shadow-lg",
        // Outline
        outline:
          "border-2 border-[#E2E8F0] bg-white text-[#0F172A] rounded-xl hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
        // Secondary
        secondary:
          "bg-[#F1F5F9] text-[#0F172A] rounded-xl hover:bg-[#E2E8F0]",
        // Ghost
        ghost:
          "text-[#64748B] rounded-xl hover:bg-[#F1F5F9] hover:text-[#0F172A]",
        // Link
        link: "text-[#0F172A] underline-offset-4 hover:underline hover:text-[#D4AF37]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs",
        sm: "h-9 rounded-lg gap-1.5 px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "size-11 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
