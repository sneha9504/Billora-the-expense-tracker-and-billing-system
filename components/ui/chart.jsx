'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

// Theme selectors
const THEMES = {
  light: '',
  dark: '.dark',
}

// --------------------
// Context
// --------------------
const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }
  return context
}

// --------------------
// Container
// --------------------
function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground \
           [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 \
           [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border \
           [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border \
           [&_.recharts-radial-bar-background-sector]:fill-muted \
           [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted \
           [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border \
           flex aspect-video justify-center text-xs \
           [&_.recharts-dot[stroke='#fff']]:stroke-transparent \
           [&_.recharts-layer]:outline-hidden \
           [&_.recharts-sector]:outline-hidden \
           [&_.recharts-sector[stroke='#fff']]:stroke-transparent \
           [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

// --------------------
// Dynamic CSS Variables
// --------------------
function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg?.theme || cfg?.color
  )

  if (!colorConfig.length) return null

  const styles = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      return `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      item.theme?.[theme] || item.color
    return color ? `  --color-${key}: ${color};` : ''
  })
  .join('\n')}
}`
    })
    .join('\n')

  return <style dangerouslySetInnerHTML={{ __html: styles }} />
}

// --------------------
// Tooltip
// --------------------
const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null

    const item = payload[0]
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)

    const value =
      !labelKey && typeof label === 'string'
        ? config[label]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    return value ? (
      <div className={cn('font-medium', labelClassName)}>{value}</div>
    ) : null
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) return null

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload?.fill || item.color

          return (
            <div
              key={item.dataKey || index}
              className={cn(
                'flex w-full gap-2',
                indicator === 'dot' && 'items-center'
              )}
            >
              {!hideIndicator && (
                <div
                  className={cn(
                    'shrink-0 rounded-sm',
                    indicator === 'dot' && 'h-2.5 w-2.5',
                    indicator === 'line' && 'w-1',
                    indicator === 'dashed' &&
                      'w-0 border-[1.5px] border-dashed bg-transparent'
                  )}
                  style={{
                    backgroundColor: indicatorColor,
                    borderColor: indicatorColor,
                  }}
                />
              )}

              <div className="flex flex-1 justify-between">
                <div className="grid gap-1">
                  {nestLabel && tooltipLabel}
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </div>
                {item.value !== undefined && (
                  <span className="font-mono font-medium">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --------------------
// Legend
// --------------------
const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div key={item.value} className="flex items-center gap-1.5">
            {!hideIcon && itemConfig?.icon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// --------------------
// Helper
// --------------------
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== 'object' || payload === null) return undefined

  const payloadData =
    payload.payload && typeof payload.payload === 'object'
      ? payload.payload
      : undefined

  let configKey = key

  if (typeof payload[key] === 'string') {
    configKey = payload[key]
  } else if (
    payloadData &&
    typeof payloadData[key] === 'string'
  ) {
    configKey = payloadData[key]
  }

  return config[configKey] || config[key]
}

// --------------------
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
