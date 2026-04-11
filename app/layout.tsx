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
  title: 'DRD Digital | Web Development & AI Systems | Mombasa, Kenya',
  description: 'DRD Digital is Mombasa\'s leading digital infrastructure firm. We build authority websites, AI-powered business systems, M-Pesa integration & payment automation for enterprises across Kenya and East Africa.',
  keywords: [
    // Location-based
    'web development Mombasa', 'digital agency Kenya', 'website design Mombasa', 
    'software development Kenya', 'tech company Mombasa', 'IT services Kenya',
    'digital marketing Mombasa', 'SEO Kenya', 'web design East Africa',
    // Service-based
    'M-Pesa integration', 'Daraja API', 'payment automation', 
    'AI integration', 'business automation', 'authority website',
    'corporate website', 'enterprise digital agency',
    // Industry-specific
    'fintech Kenya', 'e-commerce Kenya', 'SaaS development',
    'custom software Kenya', 'mobile app development Kenya'
  ],
  authors: [{ name: 'Ian Dullu', url: 'https://digital.dullugroup.co.ke' }],
  creator: 'DRD Digital',
  publisher: 'DRD Digital',
  metadataBase: new URL('https://digital.dullugroup.co.ke'),
  alternates: {
    canonical: 'https://digital.dullugroup.co.ke',
  },
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
    title: 'DRD Digital | Web Development & AI Systems | Mombasa, Kenya',
    description: 'Mombasa\'s leading digital infrastructure firm. Authority websites, AI systems, M-Pesa integration & payment automation for enterprises across Kenya and East Africa.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DRD Digital - Digital Infrastructure for African Enterprises',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@drddigital',
    creator: '@drddigital',
    title: 'DRD Digital | Web Development & AI Systems | Mombasa, Kenya',
    description: 'Mombasa\'s leading digital infrastructure firm. Authority websites, AI systems, M-Pesa integration & payment automation.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add when available
  },
  category: 'technology',
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
              "logo": "https://digital.dullugroup.co.ke/favicon.svg",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Ian Dullu",
                "jobTitle": "Digital Infrastructure Strategist"
              },
              "areaServed": ["Kenya", "East Africa", "Nairobi", "Mombasa", "Kampala", "Dar es Salaam"],
              "description": "DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.",
              "sameAs": [
                "https://github.com/COO-DRD",
                "https://linkedin.com/company/drd-digital"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "KE",
                "availableLanguage": ["English", "Swahili"]
              }
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
              "image": "https://digital.dullugroup.co.ke/favicon.svg",
              "url": "https://digital.dullugroup.co.ke",
              "telephone": "",
              "email": "hello@dullugroup.co.ke",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mombasa",
                "addressRegion": "Coast",
                "addressCountry": "KE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -4.0435,
                "longitude": 39.6682
              },
              "areaServed": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": -4.0435,
                  "longitude": 39.6682
                },
                "geoRadius": "1000",
                "description": "Kenya and East Africa"
              },
              "priceRange": "$$$",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
              },
              "serviceType": ["Web Development", "AI Integration", "Payment Automation", "Digital Infrastructure"]
            })
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "DRD Digital",
              "url": "https://digital.dullugroup.co.ke",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://digital.dullugroup.co.ke/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "inLanguage": "en-KE"
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
