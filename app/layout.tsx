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
  title: {
    default: 'DRD Digital — Digital Infrastructure for African Enterprises',
    template: '%s | DRD Digital',
  },
  description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
  keywords: ['digital infrastructure Kenya', 'web development Mombasa', 'M-Pesa integration', 'Daraja API', 'payment automation Kenya', 'AI integration East Africa', 'business automation Mombasa', 'corporate website Kenya', 'enterprise digital agency', 'DRD Digital', 'Ian Dullu', 'SaaS development Kenya', 'fintech solutions Kenya', 'e-commerce Kenya', 'custom software Mombasa'],
  authors: [{ name: 'Ian Dullu', url: 'https://digital.dullugroup.co.ke' }],
  creator: 'DRD Digital',
  publisher: 'DRD Digital',
  metadataBase: new URL('https://digital.dullugroup.co.ke'),
  alternates: {
    canonical: '/',
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
    title: 'DRD Digital — Digital Infrastructure for African Enterprises',
    description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DRD Digital - Digital Infrastructure for African Enterprises',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRD Digital — Digital Infrastructure for African Enterprises',
    description: 'DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
  },
  category: 'technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DRD Digital",
              "alternateName": "DRD Digital Infrastructure",
              "url": "https://digital.dullugroup.co.ke",
              "logo": "https://digital.dullugroup.co.ke/favicon.svg",
              "image": "https://digital.dullugroup.co.ke/og-image.jpg",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Ian Dullu",
                "jobTitle": "Digital Infrastructure Strategist",
                "url": "https://digital.dullugroup.co.ke/about"
              },
              "description": "DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa.",
              "slogan": "We build the digital backbone African enterprises deserve.",
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Kenya"
                },
                {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": -1.2921,
                    "longitude": 36.8219
                  },
                  "geoRadius": "500 km"
                }
              ],
              "sameAs": [
                "https://github.com/COO-DRD",
                "https://linkedin.com/company/drd-digital"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "areaServed": "KE",
                "availableLanguage": ["English", "Swahili"]
              }
            })
          }}
        />
        
        {/* Local Business Schema with GEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "DRD Digital",
              "description": "Digital infrastructure, web development, and AI solutions for Kenyan enterprises",
              "url": "https://digital.dullugroup.co.ke",
              "telephone": "+254-XXX-XXXXXX",
              "email": "hello@digital.dullugroup.co.ke",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mombasa CBD",
                "addressLocality": "Mombasa",
                "addressRegion": "Coast",
                "postalCode": "80100",
                "addressCountry": "KE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -4.0435,
                "longitude": 39.6682
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
              },
              "priceRange": "$$$",
              "currenciesAccepted": "KES, USD",
              "paymentAccepted": "M-Pesa, Bank Transfer, Card",
              "hasMap": "https://maps.google.com/?q=Mombasa,Kenya",
              "isAccessibleForFree": false
            })
          }}
        />
        
        {/* WebSite Schema for Search */}
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
              }
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
