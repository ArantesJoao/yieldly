import { TrendingUp, PieChart, LineChart } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Track Growth",
      description: "Monitor your investment yields and watch your portfolio grow over time with detailed analytics."
    },
    {
      icon: PieChart,
      title: "Multiple Accounts",
      description: "Manage all your investment accounts in one place with comprehensive portfolio overview."
    },
    {
      icon: LineChart,
      title: "Visual Insights",
      description: "Beautiful charts and graphs that make understanding your investments effortless."
    }
  ]

  return (
    <section className="relative py-20 pb-8 sm:py-28 bg-gradient-to-b from-transparent via-brand-50/70 to-linen-100/50 dark:from-transparent dark:via-brand-950/70 dark:to-brand-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-700 dark:text-brand-100 mb-1">
            Everything you need to track your investments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful tools to help you understand and grow your wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

