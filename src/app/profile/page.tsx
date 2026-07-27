'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Download, CreditCard } from 'lucide-react';
import { getCurrentUser, getAuthToken } from '@/lib/auth';
import { showToast } from '@/components/toast';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface Subscription {
  plan: string;
  planDisplayName: string;
  status: string;
  billingCycle: string;
  currentPeriodEnd?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser as UserProfile);
      setName(currentUser.name || '');
      fetchSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        showToast({ type: 'success', title: 'Name updated successfully' });
        setEditingName(false);
        if (user) {
          setUser({ ...user, name });
        }
      } else {
        showToast({ type: 'error', title: 'Failed to update name' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Network error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in</h1>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-[-0.02em] mb-2">Profile</h1>
          <p className="text-[#6e6e73]">Manage your account settings and subscription.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1d1d1f]">Account Information</h2>
                <p className="text-sm text-[#6e6e73]">Your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-[#6e6e73]" />
                  <span className="text-[15px] text-[#1d1d1f]">{user.email}</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Name</label>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[15px] text-[#1d1d1f]">{user.name || 'Not set'}</span>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Member Since</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-[#6e6e73]" />
                  <span className="text-[15px] text-[#1d1d1f]">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1d1d1f]">Subscription</h2>
                <p className="text-sm text-[#6e6e73]">Your current plan</p>
              </div>
            </div>

            {subscription ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Current Plan</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.plan === 'free' ? 'bg-gray-100 text-gray-700' :
                      subscription.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {subscription.planDisplayName}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-[15px] text-[#1d1d1f] capitalize">{subscription.status}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Billing Cycle</label>
                  <div className="mt-1">
                    <span className="text-[15px] text-[#1d1d1f] capitalize">{subscription.billingCycle}</span>
                  </div>
                </div>

                {subscription.currentPeriodEnd && (
                  <div>
                    <label className="text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Renews On</label>
                    <div className="mt-1">
                      <span className="text-[15px] text-[#1d1d1f]">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <a href="/pricing" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    {subscription.plan === 'free' ? 'Upgrade Plan →' : 'Manage Subscription →'}
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#6e6e73] mb-4">No active subscription</p>
                <a href="/pricing" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">
                  View Plans
                </a>
              </div>
            )}
          </div>

          {/* Usage Stats Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/[0.04] md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1d1d1f]">Usage Statistics</h2>
                  <p className="text-sm text-[#6e6e73]">Your activity overview</p>
                </div>
              </div>
              <a href="/history" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                View History →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-[#6e6e73] mb-1">Total Downloads</p>
                <p className="text-2xl font-semibold text-[#1d1d1f]">—</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-[#6e6e73] mb-1">Files Processed</p>
                <p className="text-2xl font-semibold text-[#1d1d1f]">—</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-[#6e6e73] mb-1">Data Matched</p>
                <p className="text-2xl font-semibold text-[#1d1d1f]">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
