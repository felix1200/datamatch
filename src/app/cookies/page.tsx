import LegalLayout from '@/components/legal-layout';

export const metadata = {
  title: 'Cookie Policy — DataMatch',
  description: 'Cookie Policy for DataMatch. Learn how we use cookies and similar technologies.',
};

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="July 24, 2025">
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p className="text-lg">
            This Cookie Policy explains how DataMatch (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
          <p className="mt-2">Cookies set by the website owner are called &quot;first-party cookies.&quot; Cookies set by parties other than the website owner are called &quot;third-party cookies.&quot;</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">2.1 Strictly Necessary Cookies</h3>
          <p>These cookies are essential for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.</p>
          <table className="w-full mt-2 text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium">Cookie</th>
                <th className="text-left py-2 font-medium">Purpose</th>
                <th className="text-left py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">session_id</td>
                <td className="py-2">Maintains your session</td>
                <td className="py-2">Session</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">cookie-consent</td>
                <td className="py-2">Stores your cookie preferences</td>
                <td className="py-2">1 year</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">2.2 Analytics Cookies</h3>
          <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
          <table className="w-full mt-2 text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium">Cookie</th>
                <th className="text-left py-2 font-medium">Purpose</th>
                <th className="text-left py-2 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">_ga, _ga_*</td>
                <td className="py-2">Google Analytics - tracks page views</td>
                <td className="py-2">2 years</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">2.3 Functional Cookies</h3>
          <p>These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Your Choices</h2>
          <p>You have several options to control cookies:</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">3.1 Cookie Consent Banner</h3>
          <p>When you first visit our website, you will see a cookie consent banner where you can choose to accept all cookies or only necessary cookies.</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">3.2 Browser Settings</h3>
          <p>Most browsers allow you to control cookies through their settings. You can:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from particular sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p className="mt-2">Please note that if you block cookies, some features of our website may not function properly.</p>

          <h3 className="font-medium text-gray-900 mb-2 mt-4">3.3 Opt-Out Links</h3>
          <p>Some third-party services provide opt-out options:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Google Analytics: <a href="https://tools.google.com/dlpage/ga_optout" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Analytics Opt-out</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Do Not Track</h2>
          <p>Some browsers have a &quot;Do Not Track&quot; feature that lets you tell websites that you do not want to have your online activities tracked. These features are not yet uniform, and we do not currently respond to these signals.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Updates to This Policy</h2>
          <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make changes, we will update the &quot;Last updated&quot; date at the top of this page.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:privacy@datamatch.app" className="text-emerald-600 hover:underline">privacy@datamatch.app</a></li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
