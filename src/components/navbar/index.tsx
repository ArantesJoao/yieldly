"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Logo from "./logo"
import { HamburgerButton } from "./hamburger-button"
import { MobileMenu } from "./mobile-menu"

export default function Navbar() {
  const { data: session } = useSession()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", fullLabel: "Dashboard" },
    { id: "accounts", label: "Accounts", fullLabel: "Accounts" },
    { id: "ledger", label: "Ledger", fullLabel: "Ledger" },
    { id: "settings", label: "Settings", fullLabel: "Settings" },
  ]

  const handleNavigate = (itemId: string) => {
    console.log(`Clicked: ${itemId}`)
  }

  const handleLogin = () => {
    window.location.href = '/login'
  }

  // If user is not logged in, show only logo and login button
  if (!session) {
    return (
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 lg:px-0">
        <div className="relative backdrop-blur-md bg-slate-800/30 border border-white/10 rounded-full px-4 lg:px-6 py-2.5 lg:py-3 shadow-2xl">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-brand-500/10 rounded-full" />

          <div className="relative flex items-center gap-3 lg:gap-6">
            <Logo
              isHovered={hoveredItem === "logo"}
              onClick={() => handleNavigate("home")}
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            />

            {/* Login button */}
            <button
              onClick={handleLogin}
              onMouseEnter={() => setHoveredItem("login")}
              onMouseLeave={() => setHoveredItem(null)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg border ${hoveredItem === "login"
                  ? "bg-brand-600 text-linen border-brand-500 shadow-lg shadow-brand-500/20"
                  : "text-gray-300 hover:text-white border-white/20 hover:border-brand-500/50"
                }`}
              tabIndex={0}
            >
              Login
            </button>
          </div>
        </div>
      </nav>
    )
  }

  // If user is logged in, show full navigation
  return (
    <>
      <nav className={`fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 lg:px-0 transition-transform duration-1200 ease-out ${isMobileMenuOpen ? '-translate-y-32' : 'translate-y-0'}`}>
        <div className="relative backdrop-blur-md bg-slate-800/30 border border-white/10 rounded-full px-4 lg:px-6 py-2.5 lg:py-3 shadow-2xl">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-brand-500/10 rounded-full" />

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
              <div className="w-px h-6 bg-white/10" />

              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg text-gray-300 hover:text-white"
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
