import { cn } from "@/lib/utils"

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
}) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    primary: "bg-primary/10 border-primary/20",
  }

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    primary: "bg-primary/20 text-primary",
  }

  return (
    <div className={cn("rounded-xl border p-6 shadow-sm", variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-card-foreground">
            {value}
          </p>

          {trend && (
            <p
              className={cn(
                "mt-1 text-sm",
                trend.value >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
