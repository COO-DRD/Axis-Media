'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const GOLDEN_RATIO = 1.618033988749

// Throttle helper
function throttle(fn: (e: MouseEvent) => void, limit: number) {
  let inThrottle = false
  return (e: MouseEvent) => {
    if (!inThrottle) {
      fn(e)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function FibonacciCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Lighter spring config for better performance
  const springConfig = { damping: 25, stiffness: 120, mass: 0.3 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  // Trail positions stored in ref to avoid re-renders
  const trailPositions = useRef<{ x: number; y: number }[]>([])

  useEffect(() => {
    // Throttled mousemove for performance
    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      
      // Update trail positions directly via DOM
      trailPositions.current.unshift({ x: e.clientX, y: e.clientY })
      trailPositions.current = trailPositions.current.slice(0, 5)
      
      trailRef.current.forEach((el, i) => {
        const pos = trailPositions.current[i]
        if (el && pos) {
          el.style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px)`
          el.style.opacity = String(1 - i * 0.15)
        }
      })
    }, 16) // ~60fps

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.matches?.('a, button, [role="button"], input, textarea, [data-hover]')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.matches?.('a, button, [role="button"], input, textarea, [data-hover]')) {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Optimized trail - simple divs updated via ref */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRef.current[i] = el }}
          className="fixed pointer-events-none z-[9998] w-2 h-2 bg-accent/40 rounded-full"
          style={{
            transform: 'translate(-9999px, -9999px)', // Start offscreen
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Main cursor - Fibonacci spiral shape */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Outer spiral ring */}
        <motion.div
          className="absolute"
          animate={{
            scale: isHovering ? 1.618 : 1,
            rotate: isClicking ? 137.5 : 0, // Golden angle
          }}
          transition={{
            type: 'spring',
            damping: 13,
            stiffness: 55,
          }}
          style={{
            width: 34,
            height: 34,
            marginLeft: -17,
            marginTop: -17,
          }}
        >
          <svg 
            viewBox="0 0 34 34" 
            className="w-full h-full"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Fibonacci spiral path */}
            <path
              d="M17 17 
                 Q17 4 30 4 
                 Q30 17 17 17 
                 Q17 24 10 24 
                 Q10 17 17 17"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              className={isHovering ? 'animate-draw-path' : ''}
              style={{
                strokeDasharray: isHovering ? '1000' : '0',
                strokeDashoffset: isHovering ? '0' : '0',
              }}
            />
          </svg>
        </motion.div>

        {/* Inner dot */}
        <motion.div
          className="bg-white"
          animate={{
            scale: isClicking ? 0.5 : isHovering ? 0.8 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 8,
            stiffness: 89,
          }}
          style={{
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            borderRadius: '50%',
          }}
        />

        {/* Hover state - single pulse instead of infinite */}
        {isHovering && (
          <motion.div
            className="absolute border border-white/40 rounded-full"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: 34,
              height: 34,
              marginLeft: -17,
              marginTop: -17,
            }}
          />
        )}
      </motion.div>
    </>
  )
}
