import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-brand-200/50 dark:border-brand-800/50 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-700/10 dark:hover:shadow-brand-500/10 transition-all duration-300 hover:scale-105">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-400 dark:to-brand-500 flex items-center justify-center shadow-md">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-100">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </Card>
  )
}

