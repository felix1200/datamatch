'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'privacy', label: 'Privacy & Data' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'bug', label: 'Bug Report' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would be an API call:
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-heavy border-b border-apple-border/50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-apple-text-secondary hover:text-apple-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to DataMatch</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-apple-text tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-apple-text-secondary max-w-2xl mx-auto">
            Have a question or need help? We&apos;re here for you. Choose your preferred way to reach us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-card p-6 shadow-card">
              <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-apple-blue" />
              </div>
              <h3 className="font-semibold text-apple-text mb-1">Email Us</h3>
              <p className="text-sm text-apple-text-secondary mb-3">
                For general inquiries and support
              </p>
              <a href="mailto:hello@datamatch.app" className="text-sm text-apple-blue hover:underline">
                hello@datamatch.app
              </a>
            </div>

            <div className="bg-white rounded-card p-6 shadow-card">
              <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-apple-blue" />
              </div>
              <h3 className="font-semibold text-apple-text mb-1">Billing Support</h3>
              <p className="text-sm text-apple-text-secondary mb-3">
                For payment and subscription questions
              </p>
              <a href="mailto:billing@datamatch.app" className="text-sm text-apple-blue hover:underline">
                billing@datamatch.app
              </a>
            </div>

            <div className="bg-white rounded-card p-6 shadow-card">
              <div className="w-10 h-10 bg-apple-blue/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-apple-blue" />
              </div>
              <h3 className="font-semibold text-apple-text mb-1">Response Time</h3>
              <p className="text-sm text-apple-text-secondary mb-3">
                We typically respond within
              </p>
              <p className="text-sm font-medium text-apple-text">
                1-2 business days
              </p>
              <p className="text-xs text-apple-text-secondary mt-2">
                Monday - Friday, 9am - 6pm (UTC)
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-apple-blue/5 rounded-card p-6">
              <h3 className="font-semibold text-apple-text mb-3 text-sm">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-apple-text-secondary hover:text-apple-blue transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-apple-text-secondary hover:text-apple-blue transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-apple-text-secondary hover:text-apple-blue transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card p-8 shadow-card">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-apple-text mb-2">Message Sent!</h2>
                  <p className="text-apple-text-secondary mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 1-2 business days.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-apple-blue hover:underline text-sm font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-apple-text mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-apple-border bg-apple-bg/50 text-apple-text text-sm focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-apple-text mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-apple-border bg-apple-bg/50 text-apple-text text-sm focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-apple-text mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-apple-border bg-apple-bg/50 text-apple-text text-sm focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-apple-text mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-apple-border bg-apple-bg/50 text-apple-text text-sm focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all"
                        placeholder="Brief description"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-apple-text mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-apple-border bg-apple-bg/50 text-apple-text text-sm focus:outline-none focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3 bg-apple-blue text-white rounded-xl font-medium text-sm hover:bg-apple-blue/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>

                  <p className="text-xs text-apple-text-secondary text-center">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy" className="text-apple-blue hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-apple-text text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'How do I reset my password?',
                a: 'Use the "Forgot password" link on the login page, or contact support for assistance.',
              },
              {
                q: 'Can I get a refund?',
                a: 'See our Refund Policy for details. Subscription refunds are available within 14 days of purchase.',
              },
              {
                q: 'My download isn\'t working. What should I do?',
                a: 'Check your browser console for errors, ensure your file is valid Excel format, and try again. Contact support if the issue persists.',
              },
              {
                q: 'Is my data safe?',
                a: 'Yes. All file processing happens in your browser. We never upload or store your spreadsheet data.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-card p-5 shadow-card">
                <h3 className="font-medium text-apple-text mb-2 text-sm">{faq.q}</h3>
                <p className="text-sm text-apple-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-apple-border bg-white/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-apple-text-secondary">
            &copy; {new Date().getFullYear()} DataMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-apple-text-secondary">
            <Link href="/privacy" className="hover:text-apple-text transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-apple-text transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-apple-text transition-colors">Refunds</Link>
            <Link href="/cookies" className="hover:text-apple-text transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
