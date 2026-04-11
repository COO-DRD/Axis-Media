'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const links = [
  { label: 'Work', href: '/work' },
  { label: 'Research', href: '/research' },
  { label: 'Diagnostic', href: '/diagnostic' },
  { label: 'Partners', href: '/partners' },
]

export function GoldenFooter() {
  return (
    <footer className="relative py-21 bg-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-[1.618fr_1fr] gap-13">
          {/* Left - Brand & Contact */}
          <div>
            <Link href="/" className="inline-block mb-8" data-hover>
              <span className="font-display text-2xl tracking-tight text-text-primary">
                DRD
              </span>
              <span className="font-display text-2xl tracking-tight text-accent ml-1">
                Digital
              </span>
            </Link>

            <p className="text-text-secondary max-w-md mb-8 leading-relaxed">
              Digital infrastructure for African enterprises. 
              Authority websites, payment automation, and AI-powered systems 
              built in Mombasa, deployed globally.
            </p>

            <div className="space-y-2 font-mono text-sm">
              <a 
                href="mailto:hello@digital.dullugroup.co.ke" 
                className="block text-text-secondary hover:text-accent transition-colors"
                data-hover
              >
                hello@digital.dullugroup.co.ke
              </a>
              <span className="block text-text-tertiary">
                Mombasa, Kenya
              </span>
            </div>
          </div>

          {/* Right - Navigation */}
          <div className="flex flex-col justify-between">
            <nav className="space-y-3">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 21 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.089 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
                    data-hover
                  >
                    <span className="w-5 h-px bg-border-medium group-hover:bg-accent group-hover:w-8 transition-all duration-500" />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Fibonacci signature */}
            <div className="mt-13 flex items-center gap-3">
              <svg width="34" height="21" viewBox="0 0 34 21" className="text-accent opacity-30">
                <path
                  d="M0 21 Q0 0 21 0 Q34 0 34 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <span className="font-mono text-xs text-text-tertiary">
                1.618
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-21 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-5">
          <span className="font-mono text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} DRD Digital. All rights reserved.
          </span>
          
          <div className="flex items-center gap-8 font-mono text-xs text-text-tertiary">
            <span>Part of the DR.DULLU Group</span>
            <span>Founded by Ian Dullu</span>
          </div>
          
          <div className="flex items-center gap-6 font-mono text-xs">
            <a href="/privacy" className="text-text-tertiary hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-text-tertiary hover:text-accent transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
