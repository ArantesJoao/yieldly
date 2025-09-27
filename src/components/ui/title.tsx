import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const titleVariants = cva(
  "scroll-m-20 font-extrabold tracking-tight",
  {
    variants: {
      variant: {
        default: "text-4xl lg:text-5xl text-foreground",
      },
      size: {
        default: "text-4xl lg:text-5xl",
        sm: "text-3xl lg:text-4xl",
        lg: "text-5xl lg:text-6xl",
        xl: "text-6xl lg:text-7xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof titleVariants> {
  asChild?: boolean
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h1"
    return (
      <Comp
        className={cn(titleVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Title.displayName = "Title"

export { Title, titleVariants }
