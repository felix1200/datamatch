import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Privacy Policy - DataMatch',
  description: 'Privacy Policy for DataMatch - How we collect, use, and protect your data',
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="July 24, 2026">
      <p className="lead">
        At DataMatch, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
      </p>

      <div className="info-box">
        <strong>Key Principle: Your Files Never Leave Your Browser</strong>
        All Excel file processing happens entirely in your browser using client-side JavaScript. We never upload, store, or have access to your spreadsheet data.
      </div>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Information You Provide</h3>
      <table>
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Examples</th>
            <th>When Collected</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account Information</td>
            <td>Email address, name, password (hashed)</td>
            <td>Registration</td>
          </tr>
          <tr>
            <td>Payment Information</td>
            <td>Payment method details (processed by Stripe)</td>
            <td>Subscription or download purchase</td>
          </tr>
          <tr>
            <td>Communications</td>
            <td>Emails, support tickets, feedback</td>
            <td>When you contact us</td>
          </tr>
        </tbody>
      </table>

      <h3>1.2 Information Collected Automatically</h3>
      <table>
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Examples</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Usage Data</td>
            <td>Pages visited, features used, session duration</td>
            <td>Analytics, product improvement</td>
          </tr>
          <tr>
            <td>Device Information</td>
            <td>Browser type, operating system, screen size</td>
            <td>Compatibility, optimization</td>
          </tr>
          <tr>
            <td>IP Address</td>
            <td>Approximate geographic location</td>
            <td>Security, fraud prevention</td>
          </tr>
          <tr>
            <td>Cookies</td>
            <td>Session ID, preferences, consent choices</td>
            <td>Functionality, analytics</td>
          </tr>
        </tbody>
      </table>

      <h3>1.3 What We Do NOT Collect</h3>
      <ul>
        <li>Contents of your Excel files (processed locally in your browser)</li>
        <li>File names or metadata from your spreadsheets</li>
        <li>Any data within your spreadsheets</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use collected information for the following purposes:</p>
      <ul>
        <li><strong>Provide the Service:</strong> Create and manage your account, process payments, deliver purchased features</li>
        <li><strong>Improve the Service:</strong> Analyze usage patterns to enhance functionality and user experience</li>
        <li><strong>Communicate:</strong> Send service updates, respond to support requests, send required legal notices</li>
        <li><strong>Security:</strong> Detect and prevent fraud, abuse, and technical issues</li>
        <li><strong>Legal Compliance:</strong> Fulfill legal obligations, resolve disputes, enforce agreements</li>
      </ul>

      <h2>3. Legal Basis for Processing (EEA/UK Users)</h2>
      <p>If you are in the European Economic Area (EEA) or United Kingdom, we process your personal data under the following legal bases:</p>
      <ul>
        <li><strong>Contract:</strong> Processing necessary to perform our contract with you (e.g., providing the Service)</li>
        <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests (e.g., security, fraud prevention), provided your rights are not overridden</li>
        <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications)</li>
        <li><strong>Legal Obligation:</strong> Processing necessary to comply with applicable laws</li>
      </ul>

      <h2>4. Data Sharing and Disclosure</h2>
      <p>We do not sell your personal data. We may share information in the following circumstances:</p>

      <h3>4.1 Service Providers</h3>
      <p>We share data with trusted third parties who help us operate the Service:</p>
      <ul>
        <li><strong>Payment Processing:</strong> Stripe (payment information)</li>
        <li><strong>Analytics:</strong> Google Analytics (usage data, anonymized)</li>
        <li><strong>Hosting:</strong> Vercel (application hosting)</li>
        <li><strong>Database:</strong> Neon (account data, encrypted at rest)</li>
      </ul>

      <h3>4.2 Legal Requirements</h3>
      <p>We may disclose information if required by law, court order, or to protect the rights, property, or safety of DataMatch, our users, or others.</p>

      <h3>4.3 Business Transfers</h3>
      <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you of any such change.</p>

      <h2>5. International Data Transfers</h2>
      <p>
        If you are accessing the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers and service providers are located.
      </p>
      <p>
        For EEA/UK users, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs), to protect your data during international transfers.
      </p>

      <h2>6. Data Security</h2>
      <p>We implement industry-standard security measures to protect your information:</p>
      <ul>
        <li>TLS/SSL encryption for data in transit</li>
        <li>AES-256 encryption for data at rest</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Access controls and authentication requirements</li>
        <li>Secure password hashing (bcrypt)</li>
      </ul>
      <p>
        However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
      </p>

      <h2>7. Data Retention</h2>
      <table>
        <thead>
          <tr>
            <th>Data Type</th>
            <th>Retention Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account Information</td>
            <td>Duration of account + 30 days after deletion request</td>
          </tr>
          <tr>
            <td>Payment Records</td>
            <td>7 years (tax/legal requirements)</td>
          </tr>
          <tr>
            <td>Usage Analytics</td>
            <td>26 months</td>
          </tr>
          <tr>
            <td>Support Communications</td>
            <td>3 years</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Your Rights</h2>

      <h3>8.1 All Users</h3>
      <ul>
        <li>Access and view your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Export your data in a portable format</li>
        <li>Withdraw consent at any time</li>
        <li>Object to certain processing activities</li>
      </ul>

      <h3>8.2 EEA/UK Users (GDPR)</h3>
      <p>In addition to the above, you have the right to:</p>
      <ul>
        <li>Restrict processing of your data</li>
        <li>Data portability</li>
        <li>Lodge a complaint with your local supervisory authority</li>
      </ul>

      <h3>8.3 California Residents (CCPA/CPRA)</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Know what personal information is collected</li>
        <li>Know whether personal information is sold or disclosed</li>
        <li>Opt-out of the sale of personal information (we do not sell your data)</li>
        <li>Access your personal information</li>
        <li>Request deletion of your personal information</li>
        <li>Non-discrimination for exercising your rights</li>
      </ul>
      <p>To exercise these rights, email <a href="mailto:privacy@datamatch.app">privacy@datamatch.app</a>.</p>

      <h2>9. Cookies</h2>
      <p>We use cookies and similar technologies. See our <a href="/cookies">Cookie Policy</a> for details.</p>

      <h2>10. Children&apos;s Privacy</h2>
      <p>
        The Service is not directed to children under 13 (or under 16 in the EEA/UK). We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
      </p>

      <h2>11. Do Not Track</h2>
      <p>
        Some browsers have a &quot;Do Not Track&quot; feature. We currently do not respond to DNT signals, but we do honor the Global Privacy Control (GPC) signal where required by law.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be notified via email or a prominent notice on the Service at least 30 days before taking effect.
      </p>

      <h2>13. Contact Us</h2>
      <p>If you have questions about this Privacy Policy or wish to exercise your rights:</p>
      <ul>
        <li>Email: <a href="mailto:privacy@datamatch.app">privacy@datamatch.app</a></li>
        <li>Contact page: <a href="/contact">datamatch.app/contact</a></li>
        <li>EEA/UK Data Protection inquiries: <a href="mailto:dpo@datamatch.app">dpo@datamatch.app</a></li>
      </ul>
    </LegalLayout>
  );
}
