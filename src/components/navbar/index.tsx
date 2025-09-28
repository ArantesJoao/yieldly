"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import Logo from "./logo"
import { Button } from "../ui/button"
import { MobileMenu } from "./mobile-menu"
import { HamburgerButton } from "./hamburger-button"

export default function Navbar() {
  const { data: session } = useSession()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { id: "dashboard", label: "Dashboard", fullLabel: "Dashboard" },
    { id: "accounts", label: "Accounts", fullLabel: "Accounts" },
    { id: "settings", label: "Settings", fullLabel: "Settings" },
  ]

  const handleNavigate = (itemId: string) => {
    router.push(itemId)
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  // If user is not logged in, show only logo and login button
  if (!session) {
    return (
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 lg:px-0">
        <div className="relative backdrop-blur-md bg-gradient-to-r from-card via-card/95 to-card border border-primary/20 rounded-full px-4 lg:px-6 py-2.5 lg:py-3 shadow-2xl shadow-primary/30">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/10 to-primary/25 rounded-full" />
          {/* Inner brand accent */}
          <div className="absolute inset-[1px] bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-full" />

          <div className="relative flex items-center gap-3 lg:gap-6">
            <Logo
              isHovered={hoveredItem === "logo"}
              onClick={() => handleNavigate("home")}
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            />

            {/* Login button */}
            <Button
              onClick={handleLogin}
              onMouseEnter={() => setHoveredItem("login")}
              onMouseLeave={() => setHoveredItem(null)}
              className="h-8 lg:h-10"
              tabIndex={0}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  // If user is logged in, show full navigation
  return (
    <>
      <nav className={`fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 lg:px-0 transition-transform duration-1200 ease-out ${isMobileMenuOpen ? '-translate-y-32' : 'translate-y-0'}`}>
        <div className="relative backdrop-blur-md bg-gradient-to-r from-card via-card/95 to-card border border-primary/20 rounded-full px-4 lg:px-6 py-2.5 lg:py-3 shadow-2xl shadow-primary/30">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/10 to-primary/25 rounded-full" />
          {/* Inner brand accent */}
          <div className="absolute inset-[1px] bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-full" />

          <div className="relative flex items-center gap-3 lg:gap-0 lg:justify-start lg:space-x-8">
            <Logo
              isHovered={hoveredItem === "logo"}
              onClick={() => handleNavigate("dashboard")}
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            />

            {/* Mobile hamburger button */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Desktop separator */}
              <div className="w-px h-6 bg-gradient-to-b from-primary/40 via-border to-primary/40" />

              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/50 hover:border hover:border-primary/20"
                    tabIndex={0}
                  >
                    <span className={`transition-all duration-300 ${hoveredItem === item.id ? 'opacity-0' : 'opacity-100'
                      }`}>
                      {item.label}
                    </span>

                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                      {item.fullLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        onNavigate={handleNavigate}
      />
    </>
  )
}
