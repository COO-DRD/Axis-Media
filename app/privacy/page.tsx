import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | DRD Digital',
  description: 'How DRD Digital collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 py-21">
        {/* Header */}
        <div className="mb-13">
          <h1 className="font-display text-4xl font-bold text-ink mb-4">
            Privacy Policy
          </h1>
          <p className="font-mono text-sm text-ink-muted">
            Last updated: {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              1. Information We Collect
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Name and contact information (email, phone)</li>
              <li>Company name and business details</li>
              <li>Diagnostic quiz responses</li>
              <li>Messages and inquiries submitted through our forms</li>
              <li>Usage data and analytics (via cookies)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              2. How We Use Your Information
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Provide and improve our digital infrastructure services</li>
              <li>Respond to your inquiries and requests</li>
              <li>Send service-related communications</li>
              <li>Analyze website usage to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              3. Data Storage & Security
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              We store your data using industry-standard security practices:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Encrypted database storage via Supabase</li>
              <li>Row Level Security (RLS) policies to prevent unauthorized access</li>
              <li>Regular security audits and updates</li>
              <li>Limited staff access to personal information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              4. Your Rights
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              Under Kenyan data protection laws and GDPR (for EU visitors), you have the right to:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>
            <p className="font-sans text-ink-muted mt-4 leading-relaxed">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@digital.dullugroup.co.ke" className="text-accent hover:underline">
                privacy@digital.dullugroup.co.ke
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              5. Cookies & Analytics
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              We use cookies and similar technologies to analyze website traffic and improve your experience. 
              You can manage cookie preferences through your browser settings. We use Vercel Analytics 
              for anonymous usage statistics - this data cannot identify individual users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              6. Third-Party Services
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              We use the following third-party services that may process your data:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Supabase (database hosting)</li>
              <li>Vercel (website hosting & analytics)</li>
              <li>Notion (content management)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              7. Contact Us
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, contact us:
            </p>
            <div className="mt-4 font-sans text-ink-muted">
              <p>DRD Digital</p>
              <p>Email: <a href="mailto:hello@digital.dullugroup.co.ke" className="text-accent hover:underline">hello@digital.dullugroup.co.ke</a></p>
              <p>Location: Mombasa, Kenya</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
