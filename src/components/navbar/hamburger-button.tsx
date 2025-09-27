interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  const handleClick = () => {
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      tabIndex={0}
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center">
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''
            }`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''
            }`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''
            }`}
        />
      </div>
    </button>
  )
}
