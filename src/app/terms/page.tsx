import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Terms of Service — DataMatch',
  description: 'Terms of Service for DataMatch. Read our terms and conditions for using our service.',
};

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="July 24, 2025">
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p className="text-lg">
            Welcome to DataMatch. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, products, and services (collectively, the &quot;Services&quot;).
          </p>
          <p className="mt-4">
            By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By creating an account or using our Services, you confirm that:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>You are at least 16 years old (or the age of majority in your jurisdiction)</li>
            <li>You have the legal capacity to enter into these Terms</li>
            <li>You will comply with all applicable laws and regulations</li>
            <li>You will not use the Services for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Accounts</h2>
          <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
          <p className="mt-2">We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Free Plan and Downloads</h2>
          <h3 className="font-medium text-gray-900 mb-2">3.1 Free Plan</h3>
          <p>Our free plan allows you to upload and process Excel files without limitation. However, downloading processed results requires a one-time payment of $2.00 per unique file.</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">3.2 Download Fees</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Each unique file (identified by content hash) requires a $2.00 download fee for free plan users</li>
            <li>Once you have paid for a file, you may download it again at no additional charge</li>
            <li>Subscription plan users (Pro/Business) have downloads included in their subscription</li>
          </ul>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">3.3 Subscription Plans</h3>
          <p>We offer monthly and yearly subscription plans. Subscription fees are billed in advance for each billing period.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Payment Terms</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>All payments are processed securely through our payment provider (Stripe)</li>
            <li>Prices are in US Dollars (USD) unless otherwise stated</li>
            <li>Subscription fees are non-refundable except as required by law</li>
            <li>We may change prices with 30 days&apos; notice</li>
            <li>You are responsible for all applicable taxes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cancellation and Refunds</h2>
          <h3 className="font-medium text-gray-900 mb-2">5.1 Subscription Cancellation</h3>
          <p>You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You will continue to have access to paid features until the end of that period.</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">5.2 Refund Policy</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Download fees ($2.00 per file) are non-refundable once the download has been initiated</li>
            <li>Subscription fees may be refunded within 14 days of purchase if you have not used the paid features</li>
            <li>For annual subscriptions, pro-rated refunds may be available within the first 30 days</li>
            <li>Contact us at <a href="mailto:support@datamatch.app" className="text-emerald-600 hover:underline">support@datamatch.app</a> for refund requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Services for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Transmit viruses, malware, or other harmful code</li>
            <li>Interfere with or disrupt the Services</li>
            <li>Scrape, mine, or extract data from the Services without permission</li>
            <li>Share your account credentials with others</li>
            <li>Use the Services to process data that violates any third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
          <p>The Services, including all content, features, and functionality, are owned by DataMatch and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Content</h2>
          <p>You retain all rights to the files and data you process using our Services. Since all processing happens in your browser, we never access or store your file contents. We do not claim any ownership over your data.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
          <p className="font-medium">THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p className="mt-2">We do not warrant that:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The Services will be uninterrupted or error-free</li>
            <li>The results obtained from the Services will be accurate or reliable</li>
            <li>The quality of any products or services will meet your expectations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, DATAMATCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF YOUR USE OF THE SERVICES.</p>
          <p className="mt-2">Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Indemnification</h2>
          <p>You agree to indemnify and hold harmless DataMatch, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Services or violation of these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
          <p className="mt-2">Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">13. EU Consumer Rights</h2>
          <p>If you are a consumer in the European Union, you have a 14-day right of withdrawal for digital content purchases. However, by using our Services, you acknowledge that you consent to the immediate performance of the service and waive your right of withdrawal for digital content that has been fully performed.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through our Services. Your continued use of the Services after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact</h2>
          <p>For questions about these Terms, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:legal@datamatch.app" className="text-emerald-600 hover:underline">legal@datamatch.app</a></li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
