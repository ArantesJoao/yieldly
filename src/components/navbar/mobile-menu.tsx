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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClose()
            }
          }}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-3 left-1/2 transform -translate-x-1/2 w-80 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl z-50 lg:hidden transition-all duration-300 shadow-2xl shadow-primary/20 ${isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="p-6 relative">
          {/* Inner brand glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-xl pointer-events-none" />
          <div className="relative flex items-center justify-between mb-6">
            <h3 id="mobile-menu-title" className="text-lg font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Navigation
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gradient-to-br from-secondary/80 to-primary/10 hover:from-accent hover:to-primary/20 border border-primary/30 hover:border-primary/50 transition-all duration-300"
              aria-label="Close navigation menu"
              tabIndex={0}
            >
              <svg
                className="w-5 h-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="relative space-y-2" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 border text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-secondary/80 hover:to-primary/10 border-border/30 hover:border-primary/40"
                tabIndex={0}
              >
                <span className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 shadow-sm shadow-primary/20" />
                  {item.fullLabel}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
