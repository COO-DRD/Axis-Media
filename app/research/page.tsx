'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { FibonacciCursor } from '@/components/fibonacci-cursor'
import { SpiralNav } from '@/components/spiral-nav'
import { GoldenFooter } from '@/components/golden-footer'
import Link from 'next/link'

const articles = [
  {
    id: 'infrastructure-gap',
    number: '01',
    category: 'Infrastructure',
    title: 'Why 73% of Kenyan SMEs Lose Revenue to Digital Infrastructure Gaps',
    excerpt: 'The hidden costs of broken websites, manual processes, and disconnected systems.',
    readTime: '8 min',
    featured: true,
    content: [
      {
        type: 'lead',
        text: 'Every day, thousands of potential customers in Kenya encounter a business website that takes 12 seconds to load, gives up, and goes to a competitor. They fill out a contact form that never gets a response. They try to pay via M-Pesa and the transaction fails.',
      },
      {
        type: 'paragraph',
        text: 'This is the infrastructure gap, and it is costing East African businesses more than they realize. Our research across 200+ corporate websites in Kenya revealed that 73% fail basic performance, security, or mobile standards that global businesses take for granted.',
      },
      {
        type: 'heading',
        text: 'The Three Pillars of Digital Infrastructure',
      },
      {
        type: 'paragraph',
        text: 'Digital infrastructure is not about having a website or a social media presence. It is the underlying systems that enable your business to capture, convert, and serve customers at scale. For East African enterprises, this breaks down into three critical pillars: Authority Presence, Operational Automation, and Payment Infrastructure.',
      },
      {
        type: 'stat',
        value: '40%',
        label: 'Cart abandonment rate due to payment failures in East Africa',
      },
      {
        type: 'heading',
        text: 'What Authority Websites Actually Do',
      },
      {
        type: 'paragraph',
        text: 'An authority website is not just a brochure online. It is a 24/7 sales representative, lead qualification system, and trust-building machine. It loads in under 2 seconds. It ranks for the terms your customers are searching. It captures contact information and nurtures prospects while you sleep.',
      },
      {
        type: 'paragraph',
        text: 'Most Kenyan business websites do none of these things. They are built on outdated platforms, hosted on slow servers, and designed without any consideration for user experience or search visibility.',
      },
      {
        type: 'stat',
        value: 'KES 4.2M',
        label: 'Average annual revenue recovered by fixing infrastructure gaps',
      },
    ],
  },
  {
    id: 'mpesa-integration',
    number: '02',
    category: 'Payments',
    title: 'M-Pesa Integration: The Complete Technical Guide for Kenyan Businesses',
    excerpt: 'STK Push, callbacks, reconciliation, and everything in between.',
    readTime: '12 min',
    featured: false,
    content: [
      {
        type: 'lead',
        text: 'M-Pesa processes over KES 23 trillion annually. If your business cannot accept M-Pesa payments seamlessly, you are leaving money on the table.',
      },
      {
        type: 'paragraph',
        text: 'This guide covers everything from Daraja API setup to production-grade error handling. Whether you are integrating M-Pesa for the first time or optimizing an existing implementation, you will find actionable insights here.',
      },
      {
        type: 'heading',
        text: 'Understanding the Daraja API',
      },
      {
        type: 'paragraph',
        text: 'The Safaricom Daraja API provides programmatic access to M-Pesa services. The most common integration is STK Push, which sends a payment prompt directly to a customer phone. When implemented correctly, this reduces payment friction to a single PIN entry.',
      },
      {
        type: 'stat',
        value: '2.3s',
        label: 'Average STK Push response time with proper implementation',
      },
      {
        type: 'heading',
        text: 'Common Integration Pitfalls',
      },
      {
        type: 'paragraph',
        text: 'Most M-Pesa integrations fail not because of the API, but because of poor callback handling. Safaricom sends transaction results to your callback URL, but many implementations cannot handle timeouts, duplicates, or out-of-order deliveries.',
      },
    ],
  },
  {
    id: 'ai-business',
    number: '03',
    category: 'AI Operations',
    title: 'AI for East African Businesses: Beyond the Hype',
    excerpt: 'Practical applications of AI that deliver ROI, not science fiction.',
    readTime: '6 min',
    featured: false,
    content: [
      {
        type: 'lead',
        text: 'AI is not about robots taking over. For most businesses, AI is about automating the repetitive tasks that drain your team productivity.',
      },
      {
        type: 'paragraph',
        text: 'Lead qualification, document processing, customer support, appointment scheduling. These are the areas where AI delivers immediate, measurable ROI. A single AI agent can do the work of three full-time employees, with perfect consistency and zero sick days.',
      },
      {
        type: 'heading',
        text: 'Starting with High-Impact Use Cases',
      },
      {
        type: 'paragraph',
        text: 'The best AI implementations start with a single, well-defined problem. A healthcare clinic might deploy an AI triage assistant that handles after-hours patient queries. A logistics company might use AI to extract data from shipping documents.',
      },
      {
        type: 'stat',
        value: '60%',
        label: 'Average admin workload reduction with AI assistance',
      },
    ],
  },
]

export default function ResearchPage() {
  const [selectedId, setSelectedId] = useState<string | null>('infrastructure-gap')
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const spiralRotate = useTransform(scrollYProgress, [0, 1], [0, 137.5])

  const selectedArticle = articles.find(a => a.id === selectedId)

  return (
    <main ref={containerRef} className="relative min-h-screen grain bg-paper">
      <FibonacciCursor />
      <SpiralNav />

      <div className="pt-34 pb-21">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div ref={headerRef} className="relative mb-21">
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -21 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.809 }}
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Research & Insights
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl tracking-tight text-text-primary leading-tight"
              initial={{ opacity: 0, y: 34 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.13 }}
            >
              Thinking in{' '}
              <span className="text-accent">systems</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-lg text-text-secondary max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 21 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.21 }}
            >
              Deep dives into digital infrastructure, payment systems, 
              and AI operations for East African enterprises.
            </motion.p>
          </div>

          {/* Split layout: Article list + Reader */}
          <div className="grid lg:grid-cols-[0.382fr_0.618fr] gap-px bg-border-subtle min-h-[70vh]">
            {/* Article list - Golden ratio minor */}
            <div className="bg-paper-warm">
              {articles.map((article, index) => (
                <motion.button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  className={`
                    w-full text-left p-8 border-b border-border-subtle transition-all duration-500
                    ${selectedId === article.id 
                      ? 'bg-surface border-l-2 border-l-accent' 
                      : 'border-l-2 border-l-transparent hover:bg-surface/50'}
                  `}
                  initial={{ opacity: 0, x: -21 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.089 }}
                  data-hover
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-accent">{article.number}</span>
                    <span className="font-mono text-xs text-text-tertiary uppercase">{article.category}</span>
                    <span className="text-text-tertiary">·</span>
                    <span className="font-mono text-xs text-text-tertiary">{article.readTime}</span>
                  </div>
                  
                  <h3 className="font-display text-lg text-text-primary leading-snug mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {article.excerpt}
                  </p>

                  {article.featured && (
                    <span className="inline-block mt-3 px-3 py-1 bg-accent-soft border border-accent/20 font-mono text-xs text-accent">
                      Featured
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Article reader - Golden ratio major */}
            <div className="bg-surface relative">
              {/* Decorative spiral */}
              <motion.div
                className="absolute right-8 top-8 w-34 h-21 opacity-5 pointer-events-none"
                style={{ rotate: spiralRotate }}
              >
                <svg viewBox="0 0 144 89" className="w-full h-full">
                  <path
                    d="M0 89 Q0 0 89 0 Q144 0 144 55"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-accent"
                  />
                </svg>
              </motion.div>

              <AnimatePresence mode="wait">
                {selectedArticle ? (
                  <motion.article
                    key={selectedArticle.id}
                    initial={{ opacity: 0, y: 21 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -21 }}
                    transition={{ duration: 0.5 }}
                    className="p-8 md:p-13 max-w-2xl"
                  >
                    {/* Article header */}
                    <header className="mb-13">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-xs text-accent uppercase">
                          {selectedArticle.category}
                        </span>
                        <span className="w-1 h-1 bg-text-tertiary rounded-full" />
                        <span className="font-mono text-xs text-text-tertiary">
                          {selectedArticle.readTime} read
                        </span>
                      </div>
                      
                      <h1 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
                        {selectedArticle.title}
                      </h1>
                    </header>

                    {/* Article content */}
                    <div className="space-y-8">
                      {selectedArticle.content.map((block, i) => {
                        if (block.type === 'lead') {
                          return (
                            <motion.p
                              key={i}
                              className="text-xl text-text-primary leading-relaxed font-light"
                              initial={{ opacity: 0, y: 13 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.089 }}
                            >
                              {block.text}
                            </motion.p>
                          )
                        }
                        if (block.type === 'paragraph') {
                          return (
                            <motion.p
                              key={i}
                              className="text-text-secondary leading-relaxed"
                              initial={{ opacity: 0, y: 13 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.089 }}
                            >
                              {block.text}
                            </motion.p>
                          )
                        }
                        if (block.type === 'heading') {
                          return (
                            <motion.h2
                              key={i}
                              className="font-display text-2xl text-text-primary pt-5"
                              initial={{ opacity: 0, y: 13 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.089 }}
                            >
                              {block.text}
                            </motion.h2>
                          )
                        }
                        if (block.type === 'stat') {
                          return (
                            <motion.div
                              key={i}
                              className="my-8 py-8 px-8 border-l-2 border-accent bg-accent-soft"
                              initial={{ opacity: 0, x: -21 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.089 }}
                            >
                              <div className="font-display text-5xl text-accent mb-2">
                                {block.value}
                              </div>
                              <div className="text-text-secondary">
                                {block.label}
                              </div>
                            </motion.div>
                          )
                        }
                        return null
                      })}
                    </div>

                    {/* CTA */}
                    <motion.div
                      className="mt-21 pt-8 border-t border-border-subtle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                    >
                      <p className="text-text-secondary mb-5">
                        Ready to fix your infrastructure gaps?
                      </p>
                      <Link
                        href="/diagnostic"
                        className="inline-flex items-center gap-3 font-medium text-accent hover:text-accent-light transition-colors group"
                        data-hover
                      >
                        Run a free diagnostic
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.618, repeat: Infinity }}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        </motion.span>
                      </Link>
                    </motion.div>
                  </motion.article>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center p-13"
                  >
                    <div className="text-center">
                      <div className="w-21 h-21 mx-auto mb-5 border border-border-subtle flex items-center justify-center text-text-tertiary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-text-secondary">Select an article to read</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <GoldenFooter />
    </main>
  )
}
