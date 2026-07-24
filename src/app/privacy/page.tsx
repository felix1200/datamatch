import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Privacy Policy — DataMatch',
  description: 'Privacy Policy for DataMatch. Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 24, 2025">
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p className="text-lg">
            DataMatch (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="mt-4">
            Please read this policy carefully. By accessing or using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <h3 className="font-medium text-gray-900 mb-2">1.1 Personal Information</h3>
          <p>We may collect the following personal information when you register or use our services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Payment information (processed securely through our payment provider)</li>
            <li>Subscription and billing details</li>
          </ul>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">1.2 Automatically Collected Information</h3>
          <p>When you access our services, we may automatically collect:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent on pages</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">1.3 Files You Upload</h3>
          <p className="font-medium text-emerald-700">
            Important: All file processing happens entirely in your browser. We do not upload, store, or have access to your Excel files or their contents. Your data never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>To create and manage your account</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send you service-related notifications</li>
            <li>To provide customer support</li>
            <li>To improve our services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Legal Basis for Processing (GDPR)</h2>
          <p>If you are in the European Economic Area (EEA), we process your personal data based on the following legal grounds:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for one or more specific purposes</li>
            <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you</li>
            <li><strong>Legal obligation:</strong> Processing is necessary for compliance with a legal obligation</li>
            <li><strong>Legitimate interests:</strong> Processing is necessary for our legitimate interests, provided your rights override those interests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Your Rights</h2>
          <h3 className="font-medium text-gray-900 mb-2">4.1 GDPR Rights (EEA Users)</h3>
          <p>If you are a resident of the EEA, you have the following rights:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Right of access:</strong> You can request copies of your personal data</li>
            <li><strong>Right to rectification:</strong> You can request correction of inaccurate data</li>
            <li><strong>Right to erasure:</strong> You can request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Right to restrict processing:</strong> You can request that we limit the processing of your data</li>
            <li><strong>Right to data portability:</strong> You can request transfer of your data to another service</li>
            <li><strong>Right to object:</strong> You can object to processing of your personal data</li>
            <li><strong>Right to withdraw consent:</strong> You can withdraw consent at any time</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at <a href="mailto:privacy@datamatch.app" className="text-emerald-600 hover:underline">privacy@datamatch.app</a>.</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">4.2 CCPA Rights (California Residents)</h3>
          <p>If you are a California resident, you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Know what personal information is being collected about you</li>
            <li>Know whether your personal information is sold or disclosed and to whom</li>
            <li>Say no to the sale of personal information</li>
            <li>Access your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Not be discriminated against for exercising your privacy rights</li>
          </ul>
          <p className="mt-2"><strong>We do not sell your personal information.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Account data: Retained until you delete your account</li>
            <li>Payment records: Retained for 7 years as required by tax laws</li>
            <li>Usage data: Retained for up to 24 months</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. International Data Transfers</h2>
          <p>Your data may be transferred to and processed in countries other than your own. When we transfer data outside the EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor, and analyze data:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Payment processors:</strong> Stripe for payment processing (they have their own privacy policy)</li>
            <li><strong>Analytics:</strong> Privacy-respecting analytics to improve our service</li>
            <li><strong>Hosting:</strong> Secure cloud hosting providers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
          <p>Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child, please contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. For significant changes, we will provide prominent notice via email or through our service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:privacy@datamatch.app" className="text-emerald-600 hover:underline">privacy@datamatch.app</a></li>
            <li>Data Protection Officer: <a href="mailto:dpo@datamatch.app" className="text-emerald-600 hover:underline">dpo@datamatch.app</a></li>
          </ul>
          <p className="mt-2">EEA users may also lodge a complaint with their local supervisory authority.</p>
        </section>
      </div>
    </LegalLayout>
  );
}
