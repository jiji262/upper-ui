import React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-background text-foreground border-border",
      destructive: "border-destructive/50 text-destructive dark:border-red-500 dark:text-red-400 dark:bg-red-950/50",
      success: "border-green-500/50 text-green-700 dark:border-green-500 dark:text-green-400 dark:bg-green-950/50",
      warning: "border-yellow-500/50 text-yellow-700 dark:border-yellow-500 dark:text-yellow-300 dark:bg-yellow-950/50",
      info: "border-blue-500/50 text-blue-700 dark:border-blue-500 dark:text-blue-300 dark:bg-blue-950/50",
    } as const

    return (
  <div
    ref={ref}
    role="alert"
        className={cn(
          "relative rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variantClasses[variant],
          className
        )}
    {...props}
  />
    )
  }
)
Alert.displayName = "Alert"

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
  )
)
AlertTitle.displayName = "AlertTitle"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
  )
)
AlertDescription.displayName = "AlertDescription"