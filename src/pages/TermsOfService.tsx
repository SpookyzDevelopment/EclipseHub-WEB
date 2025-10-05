import { FileText } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function TermsOfService() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-fuchsia-400" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
          </div>
          <p className="text-violet-100/70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-2xl p-8 space-y-8 text-violet-100/80 shadow-[0_25px_60px_rgba(56,189,248,0.25)]">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Eclipse Hub's services, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to these terms, please do not use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. License Usage</h2>
            <p className="mb-4">
              When you activate a service subscription through Eclipse Hub, you are granted a
              non-exclusive, non-transferable license to use the product according to its specific
              terms. License keys are for personal or business use as specified in the product
              description.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Do not share or distribute license keys</li>
              <li>Do not resell or transfer licenses without authorization</li>
              <li>Respect device limitations specified for each product</li>
              <li>Use products in compliance with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Refund Policy</h2>
            <p className="mb-4">
              We offer a 30-day money-back guarantee on all purchases. If you are not satisfied with
              your purchase, contact our support team within 30 days for a full refund. Refund
              requests after license key activation may be subject to review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Account Security</h2>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account credentials.
              Eclipse Hub is not liable for any loss or damage resulting from unauthorized access to your
              account due to your failure to maintain security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use our services for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer, decompile, or disassemble any software</li>
              <li>Remove or modify any proprietary notices or labels</li>
              <li>Use automated systems to access our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="mb-4">
              All content, trademarks, and intellectual property on Eclipse Hub remain the property of
              their respective owners. Your purchase grants you a license to use, not ownership of
              the underlying intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              Eclipse Hub shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of our services. Our total liability shall not
              exceed the amount paid by you for the specific product or service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Service Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify, suspend, or discontinue any part of our services at any
              time. We will provide reasonable notice of significant changes when possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with applicable laws. Any
              disputes arising from these terms shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-violet-100/80">
              <p>Email: legal@eclipcestore.digital</p>
              <p>Support: support@eclipcestore.digital</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
