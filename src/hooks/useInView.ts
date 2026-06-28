import { useEffect, useRef, useState } from "react"

/**
 * Trigger a one-shot fade-in when an element enters the viewport.
 * Used for scroll-reveal animations across the homepage.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduce motion fallback — show immediately
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, options)

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}

/**
 * Count-up animation. Animates from 0 → target when `active` flips to true.
 * Supports plain numbers and number+suffix strings ("120+", "365 天").
 */
export function useCountUp(target: string | number, active: boolean, durationMs = 1200): string {
  const [value, setValue] = useState(typeof target === "number" ? 0 : "")

  useEffect(() => {
    if (!active) return

    const isNumber = typeof target === "number"
    const endValue = isNumber ? (target as number) : parseFloat(String(target))
    const suffix = isNumber ? "" : String(target).replace(/[\d.]/g, "").trim()

    if (!isFinite(endValue)) {
      setValue(String(target))
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.floor(eased * endValue)
      setValue(`${current}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(`${endValue}${suffix}`)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, durationMs])

  return value
}