import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface AuthCardHeaderProps {
  icon: LucideIcon
  title: string
  description: ReactNode
  className?: string
}

/**
 * Shared header for every auth card: the round crimson icon badge,
 * centered title and supporting copy (matches the site's brand color).
 */
export function AuthCardHeader({
  icon: Icon,
  title,
  description,
  className,
}: AuthCardHeaderProps) {
  return (
    <div className={cn("mb-7 flex flex-col items-center text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c82020] text-white shadow-lg shadow-[#c82020]/25 ring-4 ring-[#c82020]/10 dark:ring-[#c82020]/20">
        <Icon className="h-6 w-6" strokeWidth={1.9} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h1>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
