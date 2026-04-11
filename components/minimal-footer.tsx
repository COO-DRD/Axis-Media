'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function MinimalFooter() {
  return (
    <footer className="relative border-t border-border-dim">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center border border-border-subtle">
                <span className="font-mono text-signal text-sm font-medium">DRD</span>
              </div>
              <div>
                <div className="font-display text-lg font-medium text-text-primary">DRD Digital</div>
                <div className="text-xs text-text-tertiary">Digital Infrastructure Firm</div>
              </div>
            </div>
            <p className="text-sm text-text-secondary max-w-xs">
              Building the systems that build African enterprises. Based in Mombasa, serving East Africa.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">Navigation</span>
              <nav className="space-y-2">
                <Link href="/" className="block text-sm text-text-secondary hover:text-signal transition-colors">System</Link>
                <Link href="/work" className="block text-sm text-text-secondary hover:text-signal transition-colors">Projects</Link>
                <Link href="/research" className="block text-sm text-text-secondary hover:text-signal transition-colors">Insights</Link>
                <Link href="/diagnostic" className="block text-sm text-text-secondary hover:text-signal transition-colors">Diagnostic</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">Connect</span>
              <nav className="space-y-2">
                <a href="mailto:hello@dullugroup.co.ke" className="block text-sm text-text-secondary hover:text-signal transition-colors">Email</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-text-secondary hover:text-signal transition-colors">LinkedIn</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-text-secondary hover:text-signal transition-colors">Twitter</a>
              </nav>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">Status</span>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-signal"
                />
                <span className="text-sm text-text-secondary">Accepting new projects</span>
              </div>
              <div className="font-mono text-xs text-text-tertiary">
                Mombasa, Kenya · EAT
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border-dim flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-text-tertiary">
            © {new Date().getFullYear()} DRD Digital. All rights reserved.
          </div>
          <div className="font-mono text-xs text-text-tertiary">
            Part of the DR.DULLU Group
          </div>
        </div>
      </div>
    </footer>
  )
}
