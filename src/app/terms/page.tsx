import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Terms of Service - DataMatch',
  description: 'Terms of Service for DataMatch - Match & look up data between Excel spreadsheets',
};

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="July 24, 2026">
      <p className="lead">
        Welcome to DataMatch (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, tools, and services (collectively, the &quot;Service&quot;).
      </p>

      <p>
        By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.
      </p>

      <h2>1. Description of Service</h2>
      <p>
        DataMatch is a web-based tool that helps users match, look up, and merge data between Excel spreadsheets. The Service processes files entirely in your browser — no data is uploaded to our servers.
      </p>

      <h2>2. Eligibility</h2>
      <p>To use the Service, you must:</p>
      <ul>
        <li>Be at least 13 years of age (or the minimum age of digital consent in your country)</li>
        <li>Have the legal capacity to enter into these Terms</li>
        <li>Not be prohibited from using the Service under applicable law</li>
      </ul>

      <h2>3. User Accounts</h2>
      <h3>3.1 Account Creation</h3>
      <p>
        Some features require a user account. When creating an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
      </p>

      <h3>3.2 Account Security</h3>
      <p>
        You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized access or security breach.
      </p>

      <h3>3.3 Account Termination</h3>
      <p>
        We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time through your account settings or by contacting us.
      </p>

      <h2>4. Free Tier Usage</h2>
      <p>
        Free tier users may upload and process an unlimited number of Excel files. However, downloading processed results requires a one-time payment of $2.00 USD per unique file.
      </p>
      <div className="info-box">
        <strong>Same File, No Repeat Charge</strong>
        If you download a processed file and later need to download it again, you will not be charged again. Each unique file (identified by content hash) can be downloaded once for $2.00.
      </div>

      <h2>5. Paid Subscriptions</h2>
      <h3>5.1 Subscription Plans</h3>
      <p>We offer the following subscription plans:</p>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Monthly</th>
            <th>Yearly</th>
            <th>Downloads</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>$0</td>
            <td>$0</td>
            <td>$2/file</td>
          </tr>
          <tr>
            <td>Pro</td>
            <td>$9</td>
            <td>$79</td>
            <td>Included</td>
          </tr>
          <tr>
            <td>Business</td>
            <td>$29</td>
            <td>$249</td>
            <td>Included</td>
          </tr>
        </tbody>
      </table>

      <h3>5.2 Billing</h3>
      <p>
        Subscription fees are billed in advance on a monthly or yearly basis, depending on your selected plan. All fees are in US Dollars (USD) and are non-refundable except as specified in our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h3>5.3 Cancellation</h3>
      <p>
        You may cancel your subscription at any time. Upon cancellation, you will retain access to paid features until the end of your current billing period. No partial refunds will be issued.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Use the Service for any illegal purpose or in violation of any applicable laws</li>
        <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
        <li>Use the Service to process data that infringes on any third party&apos;s intellectual property rights</li>
        <li>Share your account credentials with others</li>
        <li>Use automated systems (bots, scrapers) to access the Service</li>
        <li>Interfere with or disrupt the Service or servers</li>
        <li>Resell or redistribute the Service without our written consent</li>
      </ul>

      <h2>7. Intellectual Property</h2>
      <p>
        The Service, including its design, features, and code, is owned by DataMatch and protected by copyright, trademark, and other intellectual property laws. You retain ownership of any data you process using the Service.
      </p>

      <h2>8. Data Processing</h2>
      <p>
        All file processing occurs entirely in your browser. We do not upload, store, or have access to your files. For more information, see our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>
      <p>
        We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We do not warrant that the results obtained from the Service will be accurate or reliable.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, DATAMATCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR LOSS OF BUSINESS OPPORTUNITY.
      </p>
      <p>
        Our total liability shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless DataMatch, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
      </p>

      <h2>12. Changes to the Service</h2>
      <p>
        We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will make reasonable efforts to notify users of significant changes.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified via email or a prominent notice on the Service at least 30 days before taking effect. Continued use of the Service after changes take effect constitutes acceptance.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
      </p>

      <h2>15. Dispute Resolution</h2>
      <h3>15.1 Informal Resolution</h3>
      <p>
        Before filing any claim, you agree to first contact us and attempt to resolve the dispute informally by sending a written notice to <a href="mailto:legal@datamatch.app">legal@datamatch.app</a>.
      </p>

      <h3>15.2 Binding Arbitration</h3>
      <p>
        If informal resolution fails, any dispute shall be resolved through binding arbitration under the rules of the American Arbitration Association (AAA). The arbitration shall take place in Wilmington, Delaware.
      </p>

      <h3>15.3 Class Action Waiver</h3>
      <p>
        You agree to resolve disputes on an individual basis and waive any right to participate in a class action lawsuit or class-wide arbitration.
      </p>

      <h2>16. Severability</h2>
      <p>
        If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
      </p>

      <h2>17. Contact Us</h2>
      <p>If you have questions about these Terms, please contact us:</p>
      <ul>
        <li>Email: <a href="mailto:legal@datamatch.app">legal@datamatch.app</a></li>
        <li>Contact page: <a href="/contact">datamatch.app/contact</a></li>
      </ul>
    </LegalLayout>
  );
}
