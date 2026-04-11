'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FibonacciCursor } from '@/components/fibonacci-cursor'
import Link from 'next/link'
import { toast } from 'sonner'

const GOLDEN_RATIO = 1.618033988749
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const questions = [
  {
    id: 'revenue',
    question: 'What is your monthly revenue?',
    subtext: 'This helps us understand the scale of infrastructure you need.',
    options: [
      { value: 'under-500k', label: 'Under KES 500K', icon: '○' },
      { value: '500k-2m', label: 'KES 500K - 2M', icon: '◐' },
      { value: '2m-10m', label: 'KES 2M - 10M', icon: '◑' },
      { value: 'over-10m', label: 'Over KES 10M', icon: '●' },
    ],
  },
  {
    id: 'challenge',
    question: 'What is your biggest digital challenge?',
    subtext: 'Select the one that costs you the most.',
    options: [
      { value: 'visibility', label: 'No one can find us online', icon: '◎' },
      { value: 'conversion', label: 'Traffic but no conversions', icon: '⬡' },
      { value: 'payments', label: 'Payment collection is broken', icon: '⬢' },
      { value: 'operations', label: 'Too much manual work', icon: '⬣' },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you need this fixed?',
    subtext: 'Urgency helps us prioritize your diagnostic.',
    options: [
      { value: 'urgent', label: 'Yesterday (urgent)', icon: '!' },
      { value: '30-days', label: 'Within 30 days', icon: '1' },
      { value: '90-days', label: 'This quarter', icon: '3' },
      { value: 'exploring', label: 'Just exploring', icon: '?' },
    ],
  },
]

export default function DiagnosticPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', company: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spiralProgress, setSpiralProgress] = useState(0)

  const totalSteps = questions.length + 1
  const progress = (currentStep / totalSteps) * 100
  const currentQuestion = questions[currentStep]
  const isContactStep = currentStep === questions.length

  // Animate spiral progress
  useEffect(() => {
    setSpiralProgress(currentStep / totalSteps)
  }, [currentStep, totalSteps])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const payload = {
        name: contactInfo.name,
        email: contactInfo.email,
        company: contactInfo.company,
        revenue_range: answers.revenue,
        challenge: answers.challenge,
        timeline: answers.timeline,
      }
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit diagnostic')
      }
      
      setIsSubmitted(true)
      toast.success('Diagnostic submitted! Check your email within 24 hours.')
      
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isContactStep || isSubmitted) return
      
      const key = e.key.toUpperCase()
      const index = key.charCodeAt(0) - 65 // A=0, B=1, etc.
      
      if (index >= 0 && index < (currentQuestion?.options.length || 0)) {
        handleAnswer(currentQuestion!.id, currentQuestion!.options[index].value)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, currentQuestion, isContactStep, isSubmitted])

  return (
    <main className="relative min-h-screen bg-paper grain overflow-hidden">
      <FibonacciCursor />

      {/* Background Fibonacci spiral - animates as user progresses */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <motion.svg
          viewBox="0 0 500 500"
          className="w-[150vh] h-[150vh] opacity-[0.03]"
          style={{ rotate: spiralProgress * 137.5 }}
        >
          <motion.path
            d="M250 250 
               Q250 50 450 50 
               Q450 250 250 250 
               Q250 375 125 375 
               Q125 250 250 250
               Q250 175 325 175
               Q325 250 250 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: spiralProgress }}
            transition={{ duration: 0.809 }}
          />
        </motion.svg>
      </div>

      {/* Logo - top left */}
      <Link 
        href="/" 
        className="fixed top-8 left-8 z-50"
        data-hover
      >
        <span className="font-display text-lg tracking-tight text-text-primary">DRD</span>
        <span className="font-display text-lg tracking-tight text-accent ml-1">Digital</span>
      </Link>

      {/* Progress indicator - Fibonacci rectangles */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-2">
        {[...Array(totalSteps)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 transition-all duration-500 ${i <= currentStep ? 'bg-accent' : 'bg-border-subtle'}`}
            style={{ width: FIBONACCI[i + 3] }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.089 }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              /* Success state with Fibonacci celebration */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.809, ease: [0.34, 1.56, 0.64, 1] }}
                className="text-center"
              >
                {/* Fibonacci spiral success animation */}
                <div className="relative w-34 h-34 mx-auto mb-13">
                  <motion.svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.618, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <motion.path
                      d="M50 50 Q50 10 90 10 Q90 50 50 50 Q50 75 25 75 Q25 50 50 50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.618, delay: 0.34 }}
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="4"
                      className="fill-accent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.309 }}
                    />
                  </motion.svg>
                  
                  {/* Pulsing rings */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 border border-accent"
                      style={{ borderRadius: '50%' }}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: GOLDEN_RATIO * i, opacity: 0 }}
                      transition={{ duration: 2.618, delay: i * 0.21, repeat: Infinity }}
                    />
                  ))}
                </div>

                <motion.h2
                  className="font-display text-4xl text-text-primary mb-5"
                  initial={{ opacity: 0, y: 21 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  Diagnostic received.
                </motion.h2>

                <motion.p
                  className="text-lg text-text-secondary max-w-md mx-auto mb-13"
                  initial={{ opacity: 0, y: 21 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 }}
                >
                  We&apos;ll analyze your infrastructure and send a detailed report within 24 hours.
                </motion.p>

                {/* Summary */}
                <motion.div
                  className="text-left p-8 bg-paper-warm border border-border-subtle"
                  initial={{ opacity: 0, y: 21 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.89 }}
                >
                  <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest block mb-5">
                    Your responses
                  </span>
                  <div className="space-y-3">
                    {questions.map((q) => (
                      <div key={q.id} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
                        <span className="text-text-secondary text-sm">{q.question}</span>
                        <span className="font-mono text-sm text-accent">
                          {q.options.find(o => o.value === answers[q.id])?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.309 }}
                >
                  <Link
                    href="/"
                    className="font-mono text-sm text-text-tertiary hover:text-accent transition-colors"
                    data-hover
                  >
                    Return to home
                  </Link>
                </motion.div>
              </motion.div>
            ) : isContactStep ? (
              /* Contact form - Final step */
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 55 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -55 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-mono text-sm text-accent">Final Step</span>
                  <div className="w-8 h-px bg-accent" />
                </div>

                <h2 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mb-5">
                  Where should we send your{' '}
                  <span className="text-accent">diagnostic report</span>?
                </h2>

                <p className="text-lg text-text-secondary mb-13">
                  We&apos;ll deliver a custom infrastructure analysis within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { id: 'name', label: 'Your name', type: 'text', placeholder: 'John Doe' },
                    { id: 'email', label: 'Work email', type: 'email', placeholder: 'john@company.com' },
                    { id: 'company', label: 'Company name', type: 'text', placeholder: 'Acme Corp' },
                  ].map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 21 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.089 }}
                    >
                      <label className="font-mono text-xs text-text-tertiary uppercase tracking-widest block mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        required
                        value={contactInfo[field.id as keyof typeof contactInfo]}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full px-5 py-4 bg-surface border border-border-subtle text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-8 px-8 py-5 bg-accent text-primary-foreground font-medium flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 21 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 }}
                    data-hover
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Get My Diagnostic Report'}</span>
                    {!isSubmitting && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.618, repeat: Infinity }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                      </motion.span>
                    )}
                    {isSubmitting && (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-text-tertiary mt-5">
                    No spam. We&apos;ll only contact you about your diagnostic results.
                  </p>
                </form>
              </motion.div>
            ) : currentQuestion ? (
              /* Question step */
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 55 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -55 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="font-mono text-sm text-accent">
                    {String(currentStep + 1).padStart(2, '0')}
                  </span>
                  <span className="text-text-tertiary">/</span>
                  <span className="font-mono text-sm text-text-tertiary">
                    {String(questions.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Question */}
                <h2 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mb-3">
                  {currentQuestion.question}
                </h2>
                
                <p className="text-text-secondary mb-13">
                  {currentQuestion.subtext}
                </p>

                {/* Options - Fibonacci-spaced */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected = answers[currentQuestion.id] === option.value
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestion.id, option.value)}
                        className={`
                          w-full text-left p-5 border transition-all duration-500 group
                          ${isSelected 
                            ? 'bg-accent-soft border-accent' 
                            : 'bg-surface border-border-subtle hover:border-accent/50'}
                        `}
                        initial={{ opacity: 0, y: FIBONACCI[i + 2] }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.089, duration: 0.5 }}
                        data-hover
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <span className="w-8 h-8 flex items-center justify-center border border-border-subtle font-mono text-xs text-text-tertiary group-hover:border-accent group-hover:text-accent transition-colors">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className={`text-lg ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                              {option.label}
                            </span>
                          </div>
                          
                          <motion.div
                            className={`w-5 h-5 flex items-center justify-center transition-colors ${isSelected ? 'text-accent' : 'text-text-tertiary opacity-0 group-hover:opacity-50'}`}
                            animate={{ x: isSelected ? 0 : -5 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16">
                              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                          </motion.div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Keyboard hint */}
                <motion.p
                  className="mt-8 font-mono text-xs text-text-tertiary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  Press A, B, C, or D to select
                </motion.p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="fixed bottom-8 left-8 font-mono text-xs text-text-tertiary hidden lg:flex items-center gap-3">
        <motion.div
          className="w-2 h-2 bg-accent"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.618, repeat: Infinity }}
        />
        <span>Infrastructure Diagnostic</span>
      </div>
    </main>
  )
}
