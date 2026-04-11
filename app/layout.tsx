import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DRD Digital — Digital Infrastructure for African Enterprises',
  description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
  keywords: ['digital infrastructure', 'authority website', 'web development Kenya', 'M-Pesa integration', 'Daraja API', 'payment automation Kenya', 'AI integration Kenya', 'business automation Mombasa', 'corporate website Mombasa', 'enterprise digital agency Kenya'],
  authors: [{ name: 'Ian Dullu', url: 'https://digital.dullugroup.co.ke' }],
  creator: 'DRD Digital',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://digital.dullugroup.co.ke',
    siteName: 'DRD Digital',
    title: 'DRD Digital — Digital Infrastructure for African Enterprises',
    description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRD Digital — Digital Infrastructure for African Enterprises',
    description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DRD Digital",
              "url": "https://digital.dullugroup.co.ke",
              "logo": "https://digital.dullugroup.co.ke/logo.png",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Ian Dullu",
                "jobTitle": "Digital Infrastructure Strategist"
              },
              "areaServed": ["Kenya", "East Africa"],
              "description": "DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa."
            })
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "DRD Digital",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mombasa",
                "addressCountry": "Kenya"
              },
              "areaServed": ["Kenya", "East Africa"]
            })
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
