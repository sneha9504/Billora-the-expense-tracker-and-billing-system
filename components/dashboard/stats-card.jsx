import { cn } from "@/lib/utils";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  className,
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl font-bold">{value}</p>

          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}

          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trendUp ? "+" : "-"}
              {trend}% from yesterday
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
