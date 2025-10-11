import { useEffect, useState } from "react"

type KeyboardState = { isOpen: boolean; bottom: number }

export function useKeyboardInsets(enabled = true): KeyboardState {
  const [state, setState] = useState<KeyboardState>({ isOpen: false, bottom: 0 })

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    let raf = 0
    const updateState = (inset: number) => {
      const clamped = Math.max(0, Math.floor(inset))
      setState({ isOpen: clamped > 0, bottom: clamped })
    }

    // 1) Prefer the Virtual Keyboard API when present (Chromium)
    const navAny = navigator as any
    if (navAny.virtualKeyboard) {
      const vk = navAny.virtualKeyboard
      try { vk.overlaysContent = true } catch { }
      const update = () => updateState(vk.boundingRect?.height ?? 0)
      const onGeometry = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
      update()
      vk.addEventListener("geometrychange", onGeometry)
      return () => vk.removeEventListener("geometrychange", onGeometry)
    }

    // 2) Fallback: VisualViewport (iOS Safari & others)
    const vv = window.visualViewport
    if (vv) {
      const update = () => {
        // Keyboard height ≈ layout height - (visual height + visual offset)
        const inset = window.innerHeight - (vv.height + vv.offsetTop)
        updateState(inset)
      }
      const onChange = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
      vv.addEventListener("resize", onChange)
      vv.addEventListener("scroll", onChange)
      update()
      return () => {
        vv.removeEventListener("resize", onChange)
        vv.removeEventListener("scroll", onChange)
      }
    }
  }, [enabled])

  return state
}

