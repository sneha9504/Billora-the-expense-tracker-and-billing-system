"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Package,
  Receipt,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Wallet },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden transition-opacity",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-transparent"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          collapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-20"
            : "translate-x-0 w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold shrink-0">
              B
            </div>
            <span
              className={cn(
                "font-bold text-lg transition-opacity",
                collapsed ? "lg:opacity-0" : "opacity-100"
              )}
            >
              Billora
            </span>
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href))

              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    onClick={() => setCollapsed(true)}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "transition-opacity",
                        collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "transition-opacity",
                collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
              )}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
