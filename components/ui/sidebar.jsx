"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* -------------------------------------------------------------------------- */
/* Constants */
/* -------------------------------------------------------------------------- */

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

/* -------------------------------------------------------------------------- */
/* Context */
/* -------------------------------------------------------------------------- */

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/* Provider */
/* -------------------------------------------------------------------------- */

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)

  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value) => {
      const next = typeof value === "function" ? value(open) : value
      onOpenChange ? onOpenChange(next) : _setOpen(next)
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [open, onOpenChange]
  )

  const toggleSidebar = React.useCallback(() => {
    isMobile
      ? setOpenMobile((o) => !o)
      : setOpen((o) => !o)
  }, [isMobile, setOpen])

  React.useEffect(() => {
    function handler(e) {
      if (
        e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, openMobile, isMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* Sidebar */
/* -------------------------------------------------------------------------- */

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          className="bg-sidebar w-(--sidebar-width) p-0 [&>button]:hidden"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile sidebar</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      className="hidden md:block"
    >
      <div
        className={cn(
          "fixed inset-y-0 z-10 w-(--sidebar-width) transition-all",
          side === "left" ? "left-0" : "right-0",
          className
        )}
        {...props}
      >
        <div className="bg-sidebar flex h-full flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Trigger / Rail */
/* -------------------------------------------------------------------------- */

function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(e) => {
        onClick?.(e)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 sm:flex",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Layout Helpers */
/* -------------------------------------------------------------------------- */

function SidebarInset({ className, ...props }) {
  return (
    <main
      className={cn("flex w-full flex-1 flex-col", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }) {
  return <div className={cn("p-2", className)} {...props} />
}

function SidebarFooter({ className, ...props }) {
  return <div className={cn("p-2", className)} {...props} />
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-auto", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }) {
  return (
    <Separator
      className={cn("bg-sidebar-border mx-2", className)}
      {...props}
    />
  )
}

function SidebarInput({ className, ...props }) {
  return (
    <Input
      className={cn("h-8 bg-background shadow-none", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Menu */
/* -------------------------------------------------------------------------- */

function SidebarMenu({ className, ...props }) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }) {
  return <li className={cn("relative", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent",
  {
    variants: {
      size: { sm: "h-7 text-xs", default: "h-8", lg: "h-12" },
    },
    defaultVariants: { size: "default" },
  }
)

function SidebarMenuButton({
  asChild = false,
  size = "default",
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        sidebarMenuButtonVariants({ size }),
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Exports */
/* -------------------------------------------------------------------------- */

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
}
