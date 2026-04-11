'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const stats = [
  { label: 'Revenue recovered', value: 'KES 4.2M', prefix: '+' },
  { label: 'Systems deployed', value: '12', suffix: ' active' },
  { label: 'Uptime average', value: '99.7', suffix: '%' },
]

const terminalLines = [
  { type: 'comment', text: '// Initializing DRD Digital infrastructure...' },
  { type: 'command', text: '> system.analyze(east_africa.enterprises)' },
  { type: 'output', text: '  Found: 73% revenue leakage from broken digital infrastructure' },
  { type: 'command', text: '> drd.deploy({ solution: "authority_website" })' },
  { type: 'success', text: '  [SUCCESS] Infrastructure gap closed.' },
  { type: 'command', text: '> system.status()' },
  { type: 'output', text: '  Status: OPERATIONAL | Region: Mombasa, Kenya' },
]

export function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentText, setCurrentText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleLines >= terminalLines.length) {
      setIsTyping(false)
      return
    }

    const currentLine = terminalLines[visibleLines]
    let charIndex = 0
    
    const typeChar = () => {
      if (charIndex <= currentLine.text.length) {
        setCurrentText(currentLine.text.slice(0, charIndex))
        charIndex++
        setTimeout(typeChar, currentLine.type === 'comment' ? 15 : 25)
      } else {
        setTimeout(() => {
          setVisibleLines(prev => prev + 1)
          setCurrentText('')
        }, currentLine.type === 'success' ? 800 : 300)
      }
    }

    const delay = visibleLines === 0 ? 1000 : 100
    const timeout = setTimeout(typeChar, delay)
    return () => clearTimeout(timeout)
  }, [visibleLines])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--signal-glow)_0%,_transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Statement */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block font-mono text-xs text-signal uppercase tracking-widest mb-4">
                Digital Infrastructure Firm
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-text-primary">
                We build the systems
                <br />
                <span className="text-signal">that build</span>
                <br />
                African enterprises
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-text-secondary max-w-md"
            >
              Authority websites. AI-powered operations. Payment infrastructure. 
              For businesses ready to stop losing revenue to broken digital foundations.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-mono text-2xl text-text-primary">
                    {stat.prefix && <span className="text-signal">{stat.prefix}</span>}
                    {stat.value}
                    {stat.suffix && <span className="text-text-tertiary text-lg">{stat.suffix}</span>}
                  </div>
                  <div className="text-xs text-text-tertiary uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href="/diagnostic"
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-signal text-void font-medium transition-all hover:bg-signal/90"
              >
                <span>Run Infrastructure Diagnostic</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-signal/50 transition-colors"
              >
                <span>View deployments</span>
              </Link>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            {/* Terminal window */}
            <div className="relative bg-ink border border-border-subtle overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-border-dim">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-text-tertiary/30" />
                  <div className="w-3 h-3 bg-text-tertiary/30" />
                  <div className="w-3 h-3 bg-text-tertiary/30" />
                </div>
                <span className="ml-4 font-mono text-xs text-text-tertiary">drd_system.terminal</span>
              </div>

              {/* Terminal content */}
              <div ref={terminalRef} className="p-6 font-mono text-sm space-y-2 min-h-[320px]">
                <AnimatePresence mode="popLayout">
                  {terminalLines.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        ${line.type === 'comment' ? 'text-text-tertiary' : ''}
                        ${line.type === 'command' ? 'text-signal' : ''}
                        ${line.type === 'output' ? 'text-text-secondary' : ''}
                        ${line.type === 'success' ? 'text-green-400' : ''}
                      `}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Current typing line */}
                {isTyping && visibleLines < terminalLines.length && (
                  <div className={`
                    ${terminalLines[visibleLines].type === 'comment' ? 'text-text-tertiary' : ''}
                    ${terminalLines[visibleLines].type === 'command' ? 'text-signal' : ''}
                    ${terminalLines[visibleLines].type === 'output' ? 'text-text-secondary' : ''}
                    ${terminalLines[visibleLines].type === 'success' ? 'text-green-400' : ''}
                  `}>
                    {currentText}
                    <span className="animate-pulse text-signal">|</span>
                  </div>
                )}

                {/* Cursor when done */}
                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 pt-2"
                  >
                    <span className="text-signal">{'\u276f'}</span>
                    <span className="animate-pulse text-signal">|</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border border-signal/20 pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-border-subtle pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-text-tertiary uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-signal to-transparent"
        />
      </motion.div>
    </section>
  )
}
