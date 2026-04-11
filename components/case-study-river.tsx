'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const caseStudies = [
  {
    client: 'PrideofAfrica-Diaspora Awards',
    industry: 'Events & Recognition',
    result: '45+ Countries',
    brief: 'Digital platform for annual awards celebrating excellence across the African diaspora. Global audience engagement infrastructure.',
    tags: ['Events Platform', 'Global Reach', 'Awards System'],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    imageAlt: 'Kenya international event venue lights stage',
  },
  {
    client: 'Soko Fresh Mombasa',
    industry: 'Agriculture & Commerce',
    result: '200+ Farmers',
    brief: 'E-commerce platform connecting coastal farmers directly to consumers. Supply chain tracking and mobile-first ordering.',
    tags: ['E-commerce', 'M-Pesa', 'Supply Chain'],
    image: 'https://images.unsplash.com/photo-1605218427306-022ba6b9c02c?w=800&q=80',
    imageAlt: 'Kenya agriculture farm produce export quality',
  },
  {
    client: 'DR.DULLU',
    industry: 'Business Consulting & Strategy',
    result: '98% Client Retention',
    brief: 'Corporate consulting firm helping businesses optimize operations, strategy, and digital transformation across East Africa.',
    tags: ['Consulting', 'Strategy', 'Digital Transformation'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    imageAlt: 'Modern Nairobi business district skyline with glass towers',
  },
  {
    client: 'Robi Interactive',
    industry: 'Digital Media & Technology',
    result: '1M+ Users',
    brief: 'Interactive media platform creating engaging digital experiences, games, and educational content for the African market.',
    tags: ['Interactive Media', 'Gaming', 'EdTech'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edeb2?w=800&q=80',
    imageAlt: 'Creative digital media design studio workspace',
  },
]

export function CaseStudyRiver() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])

  return (
    <section ref={containerRef} className="relative py-34 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 mb-13">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.809 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Selected Work
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text-primary leading-tight max-w-xl">
              Results that{' '}
              <span className="text-accent">compound</span>
            </h2>
            
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 font-mono text-sm text-text-secondary hover:text-accent transition-colors"
              data-hover
            >
              View all projects
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.618, repeat: Infinity }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scrolling case studies */}
      <motion.div 
        className="flex gap-8 px-8"
        style={{ x }}
      >
        {caseStudies.map((study, index) => (
          <motion.article
            key={index}
            className="group relative flex-shrink-0 w-[500px] bg-surface border border-border-subtle hover:border-accent transition-all duration-500"
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.809, delay: index * 0.13 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={study.image}
                alt={study.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="font-mono text-xs text-white/80 uppercase tracking-wider">
                  {study.industry}
                </span>
                <h3 className="font-display text-xl text-white mt-1">
                  {study.client}
                </h3>
              </div>
            </div>

            {/* Content section with result */}
            <div className="p-8 border-b border-border-subtle">
              <div className="flex items-start justify-between mb-6">
                <p className="text-text-secondary leading-relaxed flex-1 pr-4">
                  {study.brief}
                </p>
                
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-2xl text-accent">
                    {study.result.split(' ')[0]}
                  </div>
                  <div className="font-mono text-xs text-text-tertiary">
                    {study.result.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="p-8 flex flex-wrap gap-2">
              {study.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-paper-warm border border-border-subtle font-mono text-xs text-text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hover reveal line */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-accent"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.article>
        ))}

        {/* Final CTA card */}
        <motion.div
          className="flex-shrink-0 w-[400px] flex items-center justify-center border border-dashed border-accent/30 bg-accent-soft p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          viewport={{ once: true }}
        >
          <Link
            href="/diagnostic"
            className="text-center group"
            data-hover
          >
            <div className="w-21 h-21 mx-auto mb-5 border border-accent flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-accent group-hover:text-white transition-colors">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="font-display text-xl text-text-primary block mb-2">
              Your project here
            </span>
            <span className="font-mono text-xs text-text-tertiary">
              Start with a diagnostic
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="mt-13 flex justify-center gap-2 items-center text-text-tertiary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.89 }}
        viewport={{ once: true }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" className="animate-pulse">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        <span className="font-mono text-xs">Scroll to explore</span>
      </motion.div>
    </section>
  )
}
