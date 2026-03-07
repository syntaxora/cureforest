"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type AnimationVariant = "fade-up" | "fade-left" | "fade-right" | "fade-in" | "zoom-in"

interface ScrollAnimateProps {
  children: ReactNode
  variant?: AnimationVariant
  delay?: number
  className?: string
}

const variantStyles: Record<AnimationVariant, { initial: string; animate: string }> = {
  "fade-up": {
    initial: "translate-y-4 opacity-0",
    animate: "translate-y-0 opacity-100",
  },
  "fade-left": {
    initial: "-translate-x-4 opacity-0",
    animate: "translate-x-0 opacity-100",
  },
  "fade-right": {
    initial: "translate-x-4 opacity-0",
    animate: "translate-x-0 opacity-100",
  },
  "fade-in": {
    initial: "opacity-0",
    animate: "opacity-100",
  },
  "zoom-in": {
    initial: "scale-[0.97] opacity-0",
    animate: "scale-100 opacity-100",
  },
}

export function ScrollAnimate({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const styles = variantStyles[variant]

  return (
    <div
      ref={ref}
      className={`transition-all duration-400 ease-out ${isVisible ? styles.animate : styles.initial} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
