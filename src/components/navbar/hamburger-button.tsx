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
      className="lg:hidden p-2 rounded-xl hover:bg-card/60 active:scale-90 backdrop-blur-xl border border-border/30 hover:border-border/50 transition-all duration-300 ease-out shadow-md hover:shadow-lg"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      tabIndex={0}
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center">
        <span
          className={`block h-0.5 w-5 bg-foreground rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-45 translate-y-[5px]' : ''
            }`}
        />
        <span
          className={`block h-0.5 w-5 bg-foreground rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] mt-1 ${isOpen ? 'opacity-0 scale-75' : ''
            }`}
        />
        <span
          className={`block h-0.5 w-5 bg-foreground rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] mt-1 ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''
            }`}
        />
      </div>
    </button>
  )
}
