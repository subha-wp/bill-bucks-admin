"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/invoices"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/invoices" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Invoices
      </Link>
      <Link
        href="/dashboard/cashbacks"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/cashbacks" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Cashbacks
      </Link>
      <Link
        href="/dashboard/withdrawals"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/withdrawals" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Withdrawals
      </Link>
    </nav>
  )
}

