import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Refund Policy — DataMatch',
  description: 'Refund Policy for DataMatch. Learn about our refund and cancellation terms.',
};

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="July 24, 2025">
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p className="text-lg">
            At DataMatch, we want you to be satisfied with your purchase. This Refund Policy explains when and how you can request a refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Download Fees (Free Plan Users)</h2>
          <p>For users on the Free plan, each unique file download costs $2.00 USD.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>No refund</strong> once the download has been initiated</li>
            <li>If a download fails due to a technical error on our side, we will provide a free re-download or refund upon request</li>
            <li>The same file can be downloaded again at no additional charge after the initial payment</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Subscription Plans</h2>
          <h3 className="font-medium text-gray-900 mb-2">2.1 Monthly Subscriptions</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Refunds available within <strong>14 days</strong> of the initial subscription purchase</li>
            <li>Refund is only available if you have <strong>not downloaded any files</strong> during the subscription period</li>
            <li>After 14 days or after first download, no refunds will be issued</li>
          </ul>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">2.2 Annual Subscriptions</h3>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Refunds available within <strong>30 days</strong> of the initial subscription purchase</li>
            <li>Refund is only available if you have <strong>not downloaded any files</strong> during the subscription period</li>
            <li>After 30 days or after first download, no refunds will be issued</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cancellation</h2>
          <p>You can cancel your subscription at any time:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Cancellation takes effect at the end of your current billing period</li>
            <li>You will retain access to paid features until the end of the billing period</li>
            <li>No partial refunds for unused time in the current billing period</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Exceptions</h2>
          <p>We may issue refunds outside of this policy in the following circumstances:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Service was unavailable for an extended period (more than 48 hours)</li>
            <li>Duplicate charges due to a billing error</li>
            <li>Unauthorized charges on your account</li>
            <li>As required by applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. EU Consumer Rights</h2>
          <p>If you are a consumer in the European Union, you have a statutory 14-day right of withdrawal. However, for digital content that is fully performed (i.e., you have used the download feature), you acknowledge that you consented to immediate performance and waived your right of withdrawal.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. How to Request a Refund</h2>
          <p>To request a refund, please contact us at <a href="mailto:support@datamatch.app" className="text-emerald-600 hover:underline">support@datamatch.app</a> with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your account email address</li>
            <li>Date of purchase</li>
            <li>Reason for the refund request</li>
          </ul>
          <p className="mt-2">We will process your request within 5-10 business days. Approved refunds will be issued to the original payment method.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Chargebacks</h2>
          <p>We strongly encourage you to contact us before initiating a chargeback with your bank or payment provider. Filing a chargeback without first contacting us may result in immediate suspension of your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact</h2>
          <p>For refund inquiries, please contact:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:support@datamatch.app" className="text-emerald-600 hover:underline">support@datamatch.app</a></li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
