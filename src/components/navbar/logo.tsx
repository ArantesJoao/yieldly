import Image from "next/image"

interface LogoProps {
  isHovered: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function Logo({ isHovered, onClick, onMouseEnter, onMouseLeave }: LogoProps) {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`flex-shrink-0 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'
        }`}
      aria-label="Go to top"
      tabIndex={0}
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br bg-brand-600 rounded-lg flex items-center justify-center">
        <Image src="/logo-linen.svg" alt="Yieldly" fill className="object-cover p-1.5" />
      </div>
    </button>
  )
}

