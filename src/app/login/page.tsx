'use client'

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>Yieldly</h1>
      <p>Personal Investment Tracker</p>

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>

      <p>Sign in to access your investment tracker</p>
    </div>
  )
}
