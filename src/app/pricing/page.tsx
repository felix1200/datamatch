'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { subscribeToPlan, getUsage, type PlanType } from '@/lib/subscription';

interface PlanFeature {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
}

const FEATURES: PlanFeature[] = [
  { name: 'Upload & process files', free: 'Unlimited', pro: 'Unlimited', business: 'Unlimited' },
  { name: 'Rows per file', free: 'Unlimited', pro: '10,000', business: '100,000' },
  { name: 'Download results', free: '$2/file', pro: 'Included', business: 'Included' },
  { name: 'Same file re-download', free: 'Free', pro: 'Free', business: 'Free' },
  { name: 'Dual file mode', free: false, pro: true, business: true },
  { name: 'Batch processing', free: false, pro: true, business: true },
  { name: 'Watermark-free export', free: false, pro: true, business: true },
  { name: 'Priority support', free: false, pro: true, business: true },
  { name: 'Team collaboration', free: false, pro: false, business: true },
  { name: 'API access', free: false, pro: false, business: true },
];

const PLANS = [
  {
    id: 'free' as PlanType,
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Upload & process unlimited files. Pay $2 per download.',
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro' as PlanType,
    name: 'Pro',
    price: { monthly: 9, yearly: 79 },
    description: 'For individuals and freelancers',
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'business' as PlanType,
    name: 'Business',
    price: { monthly: 29, yearly: 249 },
    description: 'For teams and growing businesses',
    cta: 'Upgrade to Business',
    popular: false,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const usage = getUsage();
    setCurrentPlan(usage.currentPlan);
  }, []);

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === currentPlan) return;
    
    setLoading(plan);
    try {
      // TODO: Replace with actual payment flow (Stripe, etc.)
      const result = await subscribeToPlan(plan, null);
      if (result.success) {
        setCurrentPlan(plan);
        alert(result.message);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getFeatureValue = (feature: PlanFeature, plan: PlanType): string | boolean => {
    if (plan === 'free') return feature.free;
    if (plan === 'pro') return feature.pro;
    if (plan === 'business') return feature.business;
    return feature.free;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="font-semibold text-gray-900">DataMatch</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">Back to App</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core data matching features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 rounded-full bg-emerald-600 transition-colors"
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-3 bg-emerald-100 text-emerald-700">
              Save 27%
            </Badge>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
            const isCurrent = plan.id === currentPlan;
            const isLoading = loading === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? 'border-emerald-500 border-2 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500 ml-2">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : isCurrent ? 'outline' : 'secondary'}
                    disabled={isCurrent || isLoading}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-900">Includes:</p>
                  <ul className="space-y-2">
                    {FEATURES.slice(0, 5).map((feature) => {
                      const value = getFeatureValue(feature, plan.id);
                      return (
                        <li key={feature.name} className="flex items-center gap-2 text-sm">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <X className="w-4 h-4 text-gray-300" />
                            )
                          ) : (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className="text-gray-600">
                            {feature.name}: {typeof value === 'boolean' ? '' : value}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-xl border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Compare all features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-emerald-600">Pro</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Business</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr key={feature.name} className="border-b last:border-0">
                    <td className="py-3 px-4 text-sm text-gray-700">{feature.name}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">
                      {renderFeatureValue(feature.free)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">
                      {renderFeatureValue(feature.pro)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-gray-600">
                      {renderFeatureValue(feature.business)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I try before I buy?</h3>
              <p className="text-sm text-gray-600">
                Yes! The free plan lets you process up to 100 rows, 3 times per month. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What happens when I reach my limit?</h3>
              <p className="text-sm text-gray-600">
                You'll be prompted to upgrade to continue processing. Your data is never lost.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Is my data secure?</h3>
              <p className="text-sm text-gray-600">
                All processing happens in your browser. Your files never leave your device, ensuring complete privacy and security.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function renderFeatureValue(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-gray-300 mx-auto" />
    );
  }
  return value;
}
