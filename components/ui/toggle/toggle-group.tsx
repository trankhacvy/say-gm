import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/utils/cn"

const toggleVariants = tv({
  base: [
    "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-gray-800/16 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800/16 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],

  variants: {
    variant: {
      default: "bg-transparent hover:bg-gray-800/24 data-[state=on]:bg-gray-800/16",
      outline: "border border-gray-500/16 bg-transparent data-[state=on]:shadow-[rgb(33,43,54)_0px_0px_0px_2px]",
    },
    size: {
      default: "h-10 px-3",
      sm: "h-9 px-2.5",
      lg: "h-11 px-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("!inline-flex gap-2 rounded-lg", className)} {...props} />
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
