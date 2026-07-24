import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Refund Policy - DataMatch',
  description: 'Refund Policy for DataMatch - Understand our refund terms and conditions',
};

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="July 24, 2026">
      <p className="lead">
        We want you to be satisfied with your DataMatch purchase. This Refund Policy explains when and how you can request a refund.
      </p>

      <h2>1. Per-File Download Purchases (Free Tier)</h2>

      <h3>1.1 Pricing</h3>
      <p>
        Free tier users are charged $2.00 USD per unique file download. A &quot;unique file&quot; is identified by its content hash — the same file downloaded multiple times is only charged once.
      </p>

      <h3>1.2 Refund Eligibility</h3>
      <p>
        Due to the nature of digital goods (instant delivery of processed files), <strong>per-file download purchases are generally non-refundable</strong>. However, we will consider refunds in the following cases:
      </p>
      <ul>
        <li>The downloaded file is corrupted or unreadable due to a technical error on our end</li>
        <li>The file does not contain the expected matched data due to a system malfunction</li>
        <li>You were charged multiple times for the same file (duplicate charge)</li>
      </ul>

      <h3>1.3 Refund Request Period</h3>
      <p>
        Refund requests for per-file downloads must be submitted within <strong>7 days</strong> of the purchase date.
      </p>

      <h2>2. Subscription Plans (Pro & Business)</h2>

      <h3>2.1 14-Day Money-Back Guarantee</h3>
      <p>
        New subscribers are eligible for a full refund within <strong>14 days</strong> of their initial subscription purchase, no questions asked. This applies to both monthly and yearly plans.
      </p>

      <div className="info-box">
        <strong>EU/UK Consumer Rights</strong>
        For customers in the European Union and United Kingdom, you have a 14-day right of withdrawal under EU consumer law. If you purchased a subscription and wish to cancel within 14 days, you are entitled to a full refund.
      </div>

      <h3>2.2 After 14 Days</h3>
      <p>
        After the 14-day period, subscriptions are <strong>non-refundable</strong> for the remaining billing period. However, you can cancel at any time to prevent future charges.
      </p>

      <h3>2.3 Monthly Subscriptions</h3>
      <p>
        Monthly subscriptions auto-renew each month. You can cancel before the next billing date to avoid future charges. No partial-month refunds are provided.
      </p>

      <h3>2.4 Yearly Subscriptions</h3>
      <p>
        Yearly subscriptions are billed annually. After the 14-day guarantee period, no refunds are provided for the remaining year.
      </p>

      <h2>3. How to Request a Refund</h2>

      <h3>Step 1: Contact Support</h3>
      <p>
        Send an email to <a href="mailto:billing@datamatch.app">billing@datamatch.app</a> with the subject line &quot;Refund Request&quot;.
      </p>

      <h3>Step 2: Provide Required Information</h3>
      <p>Please include the following in your email:</p>
      <ul>
        <li>Your account email address</li>
        <li>Date of purchase</li>
        <li>Amount charged</li>
        <li>Reason for refund request</li>
        <li>For per-file downloads: the file name or transaction ID</li>
      </ul>

      <h3>Step 3: Review Process</h3>
      <p>
        We will review your request within <strong>3-5 business days</strong>. If approved, the refund will be processed to your original payment method.
      </p>

      <h3>Step 4: Refund Processing</h3>
      <p>
        Refunds typically take <strong>5-10 business days</strong> to appear on your statement, depending on your bank or payment provider.
      </p>

      <h2>4. Exceptions</h2>
      <p>We may deny refund requests in the following cases:</p>
      <ul>
        <li>Request submitted after the applicable refund period</li>
        <li>Evidence of abuse or fraudulent activity</li>
        <li>Violation of our Terms of Service</li>
        <li>Multiple refund requests from the same account</li>
      </ul>

      <h2>5. Chargebacks</h2>
      <p>
        If you initiate a chargeback with your bank or payment provider without first contacting us, we may permanently suspend your account. We strongly encourage you to contact us first to resolve any billing issues.
      </p>

      <h2>6. Failed Payments</h2>
      <p>
        If your payment fails due to insufficient funds or expired payment methods, your subscription will be suspended. You will have <strong>7 days</strong> to update your payment information before your subscription is canceled.
      </p>

      <h2>7. Service Interruptions</h2>
      <p>
        In the event of a significant service interruption (more than 24 consecutive hours), we may provide pro-rated refunds or service credits at our discretion. This does not apply to scheduled maintenance or force majeure events.
      </p>

      <h2>8. Frequently Asked Questions</h2>

      <h3>Q: Can I get a refund if I don&apos;t use my subscription?</h3>
      <p>
        A: Unused subscription time is not eligible for refund after the 14-day guarantee period. We recommend trying the free tier before subscribing.
      </p>

      <h3>Q: I was charged twice for the same file. What should I do?</h3>
      <p>
        A: This is a billing error on our end. Contact us immediately at <a href="mailto:billing@datamatch.app">billing@datamatch.app</a> and we will issue a full refund for the duplicate charge.
      </p>

      <h3>Q: The downloaded file has errors. Can I get a refund?</h3>
      <p>
        A: Yes. If the file is corrupted due to our technical issues, we will either fix the issue or provide a full refund. Please contact support with details.
      </p>

      <h3>Q: Can I switch plans and get a refund for the difference?</h3>
      <p>
        A: When upgrading, you will be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle — no partial refunds are issued.
      </p>

      <h3>Q: How long does the refund take?</h3>
      <p>
        A: Once approved, refunds are processed within 5-10 business days. The actual time depends on your bank or payment provider.
      </p>

      <h2>9. Contact Us</h2>
      <p>For billing questions or refund requests:</p>
      <ul>
        <li>Email: <a href="mailto:billing@datamatch.app">billing@datamatch.app</a></li>
        <li>Contact page: <a href="/contact">datamatch.app/contact</a></li>
        <li>Response time: Within 1-2 business days</li>
      </ul>
    </LegalLayout>
  );
}
