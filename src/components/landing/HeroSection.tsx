"use client"

import { ArrowRight, Info } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface HeroSectionProps {
  onGetStarted: () => void
  isLoading: boolean
  isLoggedIn: boolean
}

export function HeroSection({ onGetStarted, isLoading, isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-linen-100 to-brand-50 dark:from-brand-950 dark:via-brand-900 dark:to-background" />

      {/* Decorative elements - enhanced */}
      <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-brand-400/40 to-brand-600/30 dark:from-brand-600/30 dark:to-brand-800/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-linen-400/50 to-linen-600/40 dark:from-linen-700/30 dark:to-linen-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-300/20 via-linen-300/20 to-brand-400/20 dark:from-brand-700/10 dark:via-linen-800/10 dark:to-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 sm:pt-28 sm:pb-32">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <Image
                src="/brand-logos/logo-brand.svg"
                alt="Yieldly Logo"
                fill
                className="dark:hidden"
                priority
              />
              <Image
                src="/brand-logos/logo-brand-reverse.svg"
                alt="Yieldly Logo"
                fill
                className="hidden dark:block"
                priority
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-700 dark:text-brand-100 mb-6">
            Yieldly
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Your Personal Investment Tracker
          </p>

          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10">
            Take control of your investments. Track yields, visualize growth, and make informed decisions with beautiful, intuitive tools.
          </p>

          {/* CTA Button */}
          <Button
            onClick={onGetStarted}
            disabled={isLoading}
            size="lg"
            className="h-12 px-8 text-base sm:h-14 sm:px-10 sm:text-lg font-semibold bg-brand-700 hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400 text-white shadow-xl shadow-brand-700/30 dark:shadow-brand-500/30 hover:shadow-2xl hover:shadow-brand-700/40 dark:hover:shadow-brand-500/40 transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Free to use • Secure authentication with Google
            </p>

            {/* Disclaimer */}
            <Card className="max-w-lg border-linen-300 dark:border-linen-800 bg-linen-50/80 dark:bg-linen-950/30 backdrop-blur-sm mt-4">
              <div className="p-4 flex gap-3">
                <Info className="h-5 w-5 text-linen-700 dark:text-linen-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Personal Use App</p>
                  <p>
                    This is a personal investment tracker. You&apos;re welcome to create an account and explore,
                    but please note that guest accounts may have limited features or usage restrictions.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

