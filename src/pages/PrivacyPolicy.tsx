import { Shield } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function PrivacyPolicy() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#050013] via-[#0b0121] to-[#050013] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs />

        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-sky-300" />
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-200 to-sky-200 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
          </div>
          <p className="text-violet-100/70">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-2xl p-8 space-y-8 text-violet-100/80 shadow-[0_25px_60px_rgba(56,189,248,0.25)]">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email address</li>
                  <li>Name</li>
                  <li>Billing information</li>
                  <li>Purchase history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Browser type and version</li>
                  <li>Pages visited</li>
                  <li>Time and date of visits</li>
                  <li>Device information</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support</li>
              <li>Send license keys and download links</li>
              <li>Improve our services and user experience</li>
              <li>Send important updates and notifications</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Payment processors to complete transactions</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Professional advisors in case of business transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at privacy@eclipcestore.digital
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your experience. You can control
              cookie settings through your browser preferences. Types of cookies we use:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Essential cookies for site functionality</li>
              <li>Analytics cookies to improve our services</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only as long as necessary to fulfill the purposes
              outlined in this policy, comply with legal obligations, resolve disputes, and enforce
              our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for users under 18 years of age. We do not knowingly
              collect information from children. If you believe we have collected information from a
              child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data during international
              transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Policy Updates</h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant
              changes via email or website notice. Continued use of our services after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="mb-4">
              For questions or concerns about this Privacy Policy or our data practices:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p>Email: privacy@eclipcestore.digital</p>
              <p>Support: support@eclipcestore.digital</p>
              <p className="mt-2">Data Protection Officer: dpo@eclipcestore.digital</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
