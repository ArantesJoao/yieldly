interface NavItem {
  id: string
  label: string
  fullLabel: string
}

interface MobileMenuProps {
  isOpen: boolean
  navItems: NavItem[]
  onClose: () => void
  onNavigate: (id: string) => void
}

export function MobileMenu({
  isOpen,
  navItems,
  onClose,
  onNavigate
}: MobileMenuProps) {
  const handleNavigate = (id: string) => {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Backdrop overlay with smooth fade */}
      <div
        className={`fixed inset-0 bg-background/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Liquid Glass Mobile Menu */}
      <div
        className={`fixed top-3 left-1/2 transform -translate-x-1/2 w-[340px] max-w-[calc(100vw-2rem)] z-50 lg:hidden transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen
          ? "translate-y-0 scale-100"
          : "-translate-y-8 scale-90 pointer-events-none"
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Frosted glass container with separate opacity transition */}
        <div className={`relative backdrop-blur-3xl bg-card/20 border border-white/20 dark:border-white/10 rounded-[28px] shadow-2xl shadow-black/20 dark:shadow-black/40 overflow-hidden transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          {/* Ambient light reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/10 opacity-50 pointer-events-none" />

          {/* Subtle shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative p-4">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-1 px-2">
              <h3
                id="mobile-menu-title"
                className="text-sm font-semibold text-foreground/80 tracking-tight"
              >
                Menu
              </h3>
              <button
                onClick={onClose}
                className="group p-2.5 rounded-full bg-card/60 hover:bg-card/80 active:scale-90 backdrop-blur-xl border border-border/50 hover:border-border transition-all duration-200 ease-out shadow-lg"
                aria-label="Close navigation menu"
                tabIndex={0}
              >
                <svg
                  className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation buttons */}
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="group w-full px-6 py-4 rounded-2xl bg-card/50 hover:bg-card/70 active:scale-[0.97] backdrop-blur-xl border border-border/40 hover:border-border/60 transition-all duration-300 ease-out shadow-lg hover:shadow-xl text-left overflow-hidden"
                  tabIndex={0}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  {/* Button shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-out pointer-events-none" />

                  <span className="relative text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                    {item.fullLabel}
                  </span>

                  {/* Subtle chevron indicator */}
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
