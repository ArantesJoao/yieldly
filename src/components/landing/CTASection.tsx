"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  onGetStarted: () => void
  isLoading: boolean
  isLoggedIn: boolean
}

export function CTASection({ onGetStarted, isLoading, isLoggedIn }: CTASectionProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 dark:from-brand-500 dark:via-brand-700 dark:to-brand-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      {/* Enhanced gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-linen-500/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-brand-500/40 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to explore?
        </h2>
        <p className="text-lg sm:text-xl text-brand-100 mb-4 max-w-2xl mx-auto">
          Sign in to take a look at how Yieldly can help you track your investments.
        </p>
        <p className="text-sm text-brand-200 mb-10 max-w-xl mx-auto">
          Feel free to create an account and explore the features. Guest accounts are welcome to test the platform!
        </p>
        <Button
          onClick={onGetStarted}
          disabled={isLoading}
          size="lg"
          variant="secondary"
          className="h-12 px-8 text-base sm:h-14 sm:px-10 sm:text-lg font-semibold bg-white hover:bg-linen-50 text-brand-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              {isLoggedIn ? "Go to Dashboard" : "Explore Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </section>
  )
}

