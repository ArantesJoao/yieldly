"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  HeroSection,
  FeaturesSection,
  CTASection,
  LandingFooter
} from "@/components/landing"

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleGetStarted = async () => {
    // If user is already logged in, redirect to dashboard
    if (session) {
      router.push('/dashboard')
      return
    }

    // Otherwise, sign in
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen -mt-24 -m-4.5">
      <HeroSection
        onGetStarted={handleGetStarted}
        isLoading={isLoading}
        isLoggedIn={!!session}
      />
      <FeaturesSection />
      <CTASection
        onGetStarted={handleGetStarted}
        isLoading={isLoading}
        isLoggedIn={!!session}
      />
      <LandingFooter />
    </div>
  )
}
