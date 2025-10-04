import { Button } from "@/components/ui/button"
import { PRESETS } from "./constants"
import type { DateRange } from "./types"

interface QuickRangesProps {
  onSelectRange: (range: DateRange) => void
}

export function QuickRanges({ onSelectRange }: QuickRangesProps) {
  const handlePreset = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    onSelectRange({ from, to })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Select a predefined date range
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="lg"
            onClick={() => handlePreset(preset.days)}
            className="justify-start h-auto py-3 px-4"
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

