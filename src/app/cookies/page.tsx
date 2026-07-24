import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Cookie Policy - DataMatch',
  description: 'Cookie Policy for DataMatch - Learn how we use cookies and tracking technologies',
};

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="July 24, 2026">
      <p className="lead">
        This Cookie Policy explains how DataMatch (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking technologies when you visit our website at datamatch.app.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit a website. They help the website remember your preferences and improve your experience. We also use similar technologies such as localStorage and sessionStorage.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>

      <h3>2.1 Strictly Necessary Cookies</h3>
      <p>These cookies are essential for the website to function properly. They cannot be disabled.</p>
      <ul>
        <li><strong>Session management</strong>: Keeping you logged in and maintaining your session</li>
        <li><strong>Security</strong>: Protecting against fraudulent activity and verifying your identity</li>
        <li><strong>Cookie preferences</strong>: Remembering your cookie consent choices</li>
      </ul>

      <h3>2.2 Functional Cookies</h3>
      <p>These cookies enable enhanced functionality and personalization.</p>
      <ul>
        <li><strong>User preferences</strong>: Remembering your settings and choices</li>
        <li><strong>Usage tracking</strong>: Tracking your file processing count for billing purposes</li>
      </ul>

      <h3>2.3 Analytics Cookies</h3>
      <p>These cookies help us understand how visitors use our website.</p>
      <ul>
        <li><strong>Google Analytics</strong>: Tracking website traffic and user behavior to improve our service</li>
        <li><strong>Performance monitoring</strong>: Identifying and fixing technical issues</li>
      </ul>

      <h2>3. Cookies We Use</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-apple-border">
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-left py-2 pr-4">Type</th>
              <th className="text-left py-2 pr-4">Duration</th>
              <th className="text-left py-2">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-apple-border/50">
              <td className="py-2 pr-4 font-mono text-xs">dm_session</td>
              <td className="py-2 pr-4">Necessary</td>
              <td className="py-2 pr-4">Session</td>
              <td className="py-2">User session management</td>
            </tr>
            <tr className="border-b border-apple-border/50">
              <td className="py-2 pr-4 font-mono text-xs">dm_cookie_consent</td>
              <td className="py-2 pr-4">Necessary</td>
              <td className="py-2 pr-4">1 year</td>
              <td className="py-2">Stores cookie preferences</td>
            </tr>
            <tr className="border-b border-apple-border/50">
              <td className="py-2 pr-4 font-mono text-xs">dm_usage</td>
              <td className="py-2 pr-4">Functional</td>
              <td className="py-2 pr-4">1 month</td>
              <td className="py-2">Tracks usage for billing</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-mono text-xs">_ga, _gid</td>
              <td className="py-2 pr-4">Analytics</td>
              <td className="py-2 pr-4">2 years / 24 hours</td>
              <td className="py-2">Google Analytics tracking</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. Third-Party Cookies</h2>
      <p>Some cookies are placed by third-party services that we use:</p>
      <ul>
        <li><strong>Google Analytics</strong>: For website analytics and performance measurement</li>
        <li><strong>Stripe</strong>: For payment processing (only on checkout pages)</li>
      </ul>
      <p>
        These third parties have their own privacy policies. We encourage you to review them.
      </p>

      <h2>5. Your Choices</h2>

      <h3>5.1 Cookie Consent Banner</h3>
      <p>
        When you first visit our website, you will see a cookie consent banner that allows you to accept or reject non-essential cookies. You can change your preferences at any time.
      </p>

      <h3>5.2 Browser Settings</h3>
      <p>
        Most web browsers allow you to control cookies through their settings. You can:
      </p>
      <ul>
        <li>View what cookies are stored and delete them individually</li>
        <li>Block all cookies</li>
        <li>Allow only first-party cookies</li>
        <li>Delete all cookies when you close your browser</li>
      </ul>
      <p>
        Please note that blocking some cookies may affect the functionality of our website.
      </p>

      <h3>5.3 Opt-Out Links</h3>
      <p>
        You can opt out of Google Analytics by installing the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on
        </a>.
      </p>

      <h2>6. Do Not Track</h2>
      <p>
        Some browsers have a &quot;Do Not Track&quot; (DNT) feature that signals to websites that you do not want to be tracked. We currently do not respond to DNT signals, but we do respect the Global Privacy Control (GPC) signal where required by law.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. The &quot;Last Updated&quot; date at the top indicates when this policy was last revised. We encourage you to review this policy periodically.
      </p>

      <h2>8. Contact Us</h2>
      <p>If you have questions about our use of cookies:</p>
      <ul>
        <li>Email: <a href="mailto:privacy@datamatch.app">privacy@datamatch.app</a></li>
        <li>Contact page: <a href="/contact">datamatch.app/contact</a></li>
      </ul>
    </LegalLayout>
  );
}
