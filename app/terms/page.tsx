import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | DRD Digital',
  description: 'Terms and conditions for using DRD Digital services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 py-21">
        {/* Header */}
        <div className="mb-13">
          <h1 className="font-display text-4xl font-bold text-ink mb-4">
            Terms of Service
          </h1>
          <p className="font-mono text-sm text-ink-muted">
            Last updated: {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              1. Agreement to Terms
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              By accessing or using DRD Digital's website and services, you agree to be bound by these 
              Terms of Service. If you disagree with any part of the terms, you may not access our 
              services. These terms apply to all visitors, users, and clients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              2. Services Description
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              DRD Digital provides digital infrastructure services including:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Authority website development</li>
              <li>Payment automation systems</li>
              <li>AI-powered business solutions</li>
              <li>Digital strategy consulting</li>
              <li>Website maintenance and support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              3. Client Responsibilities
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              As a client, you agree to:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>Provide accurate and complete information for project requirements</li>
              <li>Respond to communications in a timely manner</li>
              <li>Provide necessary assets (logos, content, images) as agreed</li>
              <li>Make payments according to the agreed schedule</li>
              <li>Respect intellectual property rights of third parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              4. Payment Terms
            </h2>
            <p className="font-sans text-ink-muted mb-4 leading-relaxed">
              Our standard payment terms:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4">
              <li>50% deposit required to commence work</li>
              <li>50% balance due upon project completion</li>
              <li>Monthly retainers billed in advance</li>
              <li>Late payments subject to 1.5% monthly service charge</li>
              <li>All prices in Kenyan Shillings (KES) unless otherwise specified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              5. Intellectual Property
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              Upon full payment, clients receive ownership rights to custom code and designs created 
              specifically for their project. DRD Digital retains rights to:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4 mt-4">
              <li>Pre-existing frameworks and libraries</li>
              <li>General methodologies and approaches</li>
              <li>The right to display work in our portfolio</li>
              <li>Open source components used in projects</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              6. Project Timeline
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              Project timelines are estimates based on the scope of work defined in the proposal. 
              Delays caused by client-side factors (late feedback, delayed asset delivery, scope changes) 
              may extend timelines. We will communicate any timeline adjustments promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              7. Revisions & Changes
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              Our standard packages include 2 rounds of revisions. Additional revisions or significant 
              scope changes may incur extra charges. We request that all revision feedback be consolidated 
              and provided within 7 business days of receiving deliverables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              8. Limitation of Liability
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              DRD Digital's liability is limited to the amount paid for the specific service in question. 
              We are not liable for indirect, incidental, or consequential damages. We do not guarantee 
              specific business results (revenue, traffic, conversions) as these depend on factors 
              beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              9. Termination
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              Either party may terminate the agreement with 30 days written notice. Upon termination:
            </p>
            <ul className="list-disc list-inside font-sans text-ink-muted space-y-2 ml-4 mt-4">
              <li>Client pays for all work completed to date</li>
              <li>DRD Digital delivers all completed work and assets</li>
              <li>Any prepaid amounts for uncompleted work are refunded</li>
              <li>Intellectual property transfers according to Section 5</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              10. Governing Law
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              These terms are governed by the laws of the Republic of Kenya. Any disputes shall be 
              resolved through arbitration in Mombasa, Kenya, in accordance with the Kenyan Arbitration 
              Act.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              11. Changes to Terms
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Continued use of our services constitutes acceptance of 
              revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">
              12. Contact Information
            </h2>
            <p className="font-sans text-ink-muted leading-relaxed">
              For questions about these Terms of Service:
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
