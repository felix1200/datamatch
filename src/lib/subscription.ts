// Subscription and usage tracking service
// This is a placeholder implementation - replace with actual backend API calls

export type PlanType = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  maxRows: number;
  maxProcessesPerMonth: number;
  dualFileMode: boolean;
  watermark: boolean;
  prioritySupport: boolean;
  teamFeatures: boolean;
  apiAccess: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxRows: 100,
    maxProcessesPerMonth: 3,
    dualFileMode: false,
    watermark: true,
    prioritySupport: false,
    teamFeatures: false,
    apiAccess: false,
  },
  pro: {
    maxRows: 10000,
    maxProcessesPerMonth: Infinity,
    dualFileMode: true,
    watermark: false,
    prioritySupport: true,
    teamFeatures: false,
    apiAccess: false,
  },
  business: {
    maxRows: 100000,
    maxProcessesPerMonth: Infinity,
    dualFileMode: true,
    watermark: false,
    prioritySupport: true,
    teamFeatures: true,
    apiAccess: true,
  },
  enterprise: {
    maxRows: Infinity,
    maxProcessesPerMonth: Infinity,
    dualFileMode: true,
    watermark: false,
    prioritySupport: true,
    teamFeatures: true,
    apiAccess: true,
  },
};

export interface UsageData {
  processesThisMonth: number;
  lastResetDate: string; // ISO date string
  currentPlan: PlanType;
}

const USAGE_KEY = 'datamatch_usage';

// Get current usage from localStorage
export function getUsage(): UsageData {
  if (typeof window === 'undefined') {
    return { processesThisMonth: 0, lastResetDate: new Date().toISOString(), currentPlan: 'free' };
  }
  
  const stored = localStorage.getItem(USAGE_KEY);
  if (!stored) {
    return { processesThisMonth: 0, lastResetDate: new Date().toISOString(), currentPlan: 'free' };
  }
  
  const usage: UsageData = JSON.parse(stored);
  
  // Reset counter if it's a new month
  const lastReset = new Date(usage.lastResetDate);
  const now = new Date();
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    usage.processesThisMonth = 0;
    usage.lastResetDate = now.toISOString();
    saveUsage(usage);
  }
  
  return usage;
}

// Save usage to localStorage
export function saveUsage(usage: UsageData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

// Increment usage counter
export function incrementUsage(): UsageData {
  const usage = getUsage();
  usage.processesThisMonth += 1;
  saveUsage(usage);
  return usage;
}

// Check if user can process based on their plan
export function canProcess(rowCount: number, isDualFile: boolean): { allowed: boolean; reason?: string } {
  const usage = getUsage();
  const limits = PLAN_LIMITS[usage.currentPlan];
  
  if (rowCount > limits.maxRows) {
    return {
      allowed: false,
      reason: `Your ${usage.currentPlan} plan supports up to ${limits.maxRows.toLocaleString()} rows. Please upgrade to process more data.`,
    };
  }
  
  if (usage.processesThisMonth >= limits.maxProcessesPerMonth) {
    return {
      allowed: false,
      reason: `You've used all ${limits.maxProcessesPerMonth} free processes this month. Upgrade to Pro for unlimited processing.`,
    };
  }
  
  if (isDualFile && !limits.dualFileMode) {
    return {
      allowed: false,
      reason: 'Dual file mode is only available on Pro and Business plans.',
    };
  }
  
  return { allowed: true };
}

// TODO: Replace with actual API calls when backend is ready

// Placeholder: Subscribe to a plan
export async function subscribeToPlan(plan: PlanType, paymentMethod: unknown): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual payment processing (Stripe, etc.)
  console.log('TODO: Implement payment processing for plan:', plan);
  
  // For now, just update local storage (for testing)
  const usage = getUsage();
  usage.currentPlan = plan;
  saveUsage(usage);
  
  return { success: true, message: `Successfully subscribed to ${plan} plan (demo mode)` };
}

// Placeholder: Cancel subscription
export async function cancelSubscription(): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual subscription cancellation
  console.log('TODO: Implement subscription cancellation');
  
  const usage = getUsage();
  usage.currentPlan = 'free';
  saveUsage(usage);
  
  return { success: true, message: 'Subscription cancelled (demo mode)' };
}

// Placeholder: Get subscription status from backend
export async function fetchSubscriptionStatus(): Promise<{ plan: PlanType; status: string }> {
  // TODO: Fetch from actual backend API
  const usage = getUsage();
  return { plan: usage.currentPlan, status: 'active' };
}
