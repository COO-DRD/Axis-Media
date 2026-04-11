'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FibonacciCursor } from '@/components/fibonacci-cursor'
import { SpiralNav } from '@/components/spiral-nav'
import { GoldenFooter } from '@/components/golden-footer'

const GOLDEN_ANGLE = 137.5077640500378
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const partners = [
  {
    id: 'prideofafrica',
    name: 'PrideofAfrica-Diaspora Awards',
    shortName: 'PADA',
    category: 'Events & Recognition',
    description: 'Celebrating excellence across the African diaspora. Annual awards recognizing outstanding achievements in business, culture, and community leadership.',
    collaboration: 'Digital platform development, event management systems, and global audience engagement infrastructure.',
    highlight: 'Global Reach',
    highlightValue: '45+',
    highlightLabel: 'Countries',
    color: '#1D6F42',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
    imageAlt: 'Awards ceremony stage and event setup',
  },
  {
    id: 'sokofresh',
    name: 'Soko Fresh Mombasa',
    shortName: 'SFM',
    category: 'Agriculture & Commerce',
    description: 'Fresh produce marketplace connecting coastal farmers directly to consumers. Eliminating middlemen, ensuring fair prices and quality produce.',
    collaboration: 'E-commerce platform, supply chain tracking, and mobile-first ordering system for the Mombasa market.',
    highlight: 'Direct Trade',
    highlightValue: '200+',
    highlightLabel: 'Farmers',
    color: '#1D6F42',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    imageAlt: 'Fresh produce market with colorful vegetables',
  },
  {
    id: 'drdullu',
    name: 'DR.DULLU',
    shortName: 'DRD',
    category: 'Healthcare & Wellness',
    description: 'Healthcare innovation bringing accessible medical consultation and wellness services to underserved communities through technology.',
    collaboration: 'Telemedicine platform, patient management system, and health information accessibility tools.',
    highlight: 'Access',
    highlightValue: '24/7',
    highlightLabel: 'Availability',
    color: '#1D6F42',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80',
    imageAlt: 'Modern medical facility interior',
  },
  {
    id: 'robi',
    name: 'Robi Interactive',
    shortName: 'RI',
    category: 'Digital Media & Technology',
    description: 'Interactive media company creating engaging digital experiences, games, and educational content for the African market.',
    collaboration: 'Product development, user experience design, and scalable infrastructure for interactive applications.',
    highlight: 'Engagement',
    highlightValue: '1M+',
    highlightLabel: 'Users',
    color: '#1D6F42',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    imageAlt: 'Digital media and technology abstract',
  },
]

function PartnerCard({ partner, index, isActive, onClick }: { 
  partner: typeof partners[0]
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const fibDelay = FIBONACCI[index + 2] * 0.034

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 55 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.809, delay: fibDelay }}
    >
      <motion.div
        className={`
          relative overflow-hidden cursor-pointer
          bg-surface border transition-all duration-500
          ${isActive ? 'border-accent' : 'border-border-subtle hover:border-accent/40'}
        `}
        onClick={onClick}
        data-hover
        layout
      >
        {/* Main content */}
        <div className="p-8 lg:p-13">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Left: Partner info */}
            <div className="flex-1">
              <div className="flex items-center gap-5 mb-5">
                {/* Partner image/logo */}
                <motion.div
                  className="w-20 h-20 rounded-lg overflow-hidden border border-accent/20 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={partner.image}
                    alt={partner.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="font-display text-xl lg:text-2xl text-text-primary">
                    {partner.name}
                  </h3>
                  <span className="font-mono text-xs text-accent uppercase tracking-wider">
                    {partner.category}
                  </span>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed max-w-xl">
                {partner.description}
              </p>
            </div>

            {/* Right: Highlight stat */}
            <div className="flex items-center gap-8">
              <div className="text-right hidden md:block">
                <div className="font-mono text-xs text-text-tertiary uppercase tracking-wider mb-1">
                  {partner.highlight}
                </div>
                <div className="font-display text-4xl text-accent">
                  {partner.highlightValue}
                </div>
                <div className="font-mono text-xs text-text-tertiary">
                  {partner.highlightLabel}
                </div>
              </div>

              <motion.div
                className="w-13 h-13 flex items-center justify-center border border-border-subtle bg-paper-warm"
                animate={{ rotate: isActive ? 137.5 : 0 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-accent">
                  <motion.path
                    d="M10 4v12M4 10h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    animate={{ rotate: isActive ? 45 : 0 }}
                    style={{ transformOrigin: 'center' }}
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expanded collaboration details */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 lg:px-13 pb-8 lg:pb-13 pt-0">
                <div className="h-px bg-border-subtle mb-8" />
                
                <div className="grid lg:grid-cols-[1fr_1.618fr] gap-8">
                  <div>
                    <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block mb-3">
                      Partnership Focus
                    </span>
                    <p className="text-text-primary leading-relaxed">
                      {partner.collaboration}
                    </p>
                  </div>

                  {/* Fibonacci spiral decoration */}
                  <div className="flex items-center justify-end">
                    <motion.svg
                      viewBox="0 0 89 55"
                      className="w-34 h-21 opacity-20"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.618 }}
                    >
                      <motion.path
                        d="M0 55 Q0 0 55 0 Q89 0 89 34 Q89 55 68 55"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-accent"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.618 }}
                      />
                    </motion.svg>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-accent"
          initial={{ width: 0 }}
          animate={{ width: isActive ? '100%' : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function PartnersPage() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <main className="relative min-h-screen grain bg-paper">
      <FibonacciCursor />
      <SpiralNav />

      <div className="pt-34 pb-21">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header with spiral decoration */}
          <div ref={headerRef} className="relative mb-21">
            {/* Large decorative Fibonacci spiral */}
            <motion.svg
              viewBox="0 0 377 233"
              className="absolute -right-21 -top-13 w-[300px] h-[185px] opacity-5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 0.05 } : {}}
              transition={{ duration: 1.618 }}
            >
              <motion.path
                d="M377 233 Q377 0 144 0 Q0 0 0 89 Q0 144 55 144 Q89 144 89 110 Q89 89 68 89"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent"
                initial={{ pathLength: 0 }}
                animate={isHeaderInView ? { pathLength: 1 } : {}}
                transition={{ duration: 2.618, delay: 0.5 }}
              />
            </motion.svg>

            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -21 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.809 }}
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Ecosystem
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-text-primary leading-none"
              initial={{ opacity: 0, y: 34 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.13 }}
            >
              Partners
            </motion.h1>

            <motion.p
              className="mt-5 text-lg lg:text-xl text-text-secondary max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 21 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.21 }}
            >
              Organizations we collaborate with to build meaningful digital infrastructure 
              across East Africa and beyond.
            </motion.p>

            {/* Partner count */}
            <motion.div
              className="mt-8 flex items-center gap-5"
              initial={{ opacity: 0 }}
              animate={isHeaderInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.809, delay: 0.34 }}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl text-accent">
                  {partners.length}
                </span>
                <span className="font-mono text-xs text-text-tertiary uppercase">
                  Active Partners
                </span>
              </div>
            </motion.div>
          </div>

          {/* Partners grid - golden ratio based layout */}
          <div className="space-y-5">
            {partners.map((partner, index) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                index={index}
                isActive={activeId === partner.id}
                onClick={() => setActiveId(activeId === partner.id ? null : partner.id)}
              />
            ))}
          </div>

          {/* Fibonacci visual divider */}
          <motion.div
            className="my-21 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg width="233" height="144" viewBox="0 0 233 144" className="opacity-10">
              <path
                d="M0 144 Q0 0 144 0 Q233 0 233 89 M144 144 Q144 89 89 89 Q89 144 144 144"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent"
              />
            </svg>
          </motion.div>

          {/* Partnership CTA */}
          <motion.div
            className="relative bg-surface border border-border-subtle p-13 lg:p-21"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.809 }}
            viewport={{ once: true }}
          >
            {/* Corner spiral decoration */}
            <motion.svg
              viewBox="0 0 89 55"
              className="absolute top-8 right-8 w-21 h-13 opacity-10"
            >
              <path
                d="M0 55 Q0 0 55 0 Q89 0 89 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent"
              />
            </motion.svg>

            <div className="max-w-2xl">
              <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-5">
                Join the Ecosystem
              </span>
              <h2 className="font-display text-3xl lg:text-4xl text-text-primary mb-5 leading-tight">
                Building something that needs{' '}
                <span className="text-accent">infrastructure</span>?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                We partner with organizations across sectors to create digital systems 
                that compound value over time. If your mission aligns with building 
                lasting impact, let&apos;s talk.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/diagnostic"
                  className="inline-flex items-center justify-center gap-3 bg-accent text-primary-foreground px-8 py-4 font-medium transition-all hover:gap-5"
                  data-hover
                >
                  Start a Conversation
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </a>
                <a
                  href="/work"
                  className="inline-flex items-center justify-center gap-3 border border-border-subtle px-8 py-4 font-medium text-text-primary hover:border-accent transition-all"
                  data-hover
                >
                  View Our Work
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <GoldenFooter />
    </main>
  )
}
