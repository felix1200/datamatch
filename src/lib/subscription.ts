// Subscription and usage tracking service
// Currently all features are free, but download requires registration

export type PlanType = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  maxRows: number;
  dualFileMode: boolean;
  downloadsIncluded: boolean; // Whether downloads are included in the subscription
  downloadPricePerFile: number; // Price per download for free users ($0 if included)
  watermark: boolean;
  prioritySupport: boolean;
  teamFeatures: boolean;
  apiAccess: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxRows: Infinity, // Unlimited rows
    dualFileMode: true, // All features free for now
    downloadsIncluded: true, // Downloads are free but require registration
    downloadPricePerFile: 0, // Free for now
    watermark: false,
    prioritySupport: false,
    teamFeatures: false,
    apiAccess: false,
  },
  pro: {
    maxRows: Infinity,
    dualFileMode: true,
    downloadsIncluded: true,
    downloadPricePerFile: 0,
    watermark: false,
    prioritySupport: true,
    teamFeatures: false,
    apiAccess: false,
  },
  business: {
    maxRows: Infinity,
    dualFileMode: true,
    downloadsIncluded: true,
    downloadPricePerFile: 0,
    watermark: false,
    prioritySupport: true,
    teamFeatures: true,
    apiAccess: true,
  },
  enterprise: {
    maxRows: Infinity,
    dualFileMode: true,
    downloadsIncluded: true,
    downloadPricePerFile: 0,
    watermark: false,
    prioritySupport: true,
    teamFeatures: true,
    apiAccess: true,
  },
};

export interface UsageData {
  currentPlan: PlanType;
  downloadedFiles: string[]; // Array of file hashes that have been downloaded
}

const USAGE_KEY = 'datamatch_usage';

// Get current usage from localStorage
export function getUsage(): UsageData {
  if (typeof window === 'undefined') {
    return { currentPlan: 'free', downloadedFiles: [] };
  }
  
  const stored = localStorage.getItem(USAGE_KEY);
  if (!stored) {
    return { currentPlan: 'free', downloadedFiles: [] };
  }
  
  return JSON.parse(stored);
}

// Save usage to localStorage
export function saveUsage(usage: UsageData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

// Check if a file has already been downloaded (for free users)
export function hasFileBeenDownloaded(fileHash: string): boolean {
  const usage = getUsage();
  return usage.downloadedFiles.includes(fileHash);
}

// Mark a file as downloaded
export function markFileAsDownloaded(fileHash: string): void {
  const usage = getUsage();
  if (!usage.downloadedFiles.includes(fileHash)) {
    usage.downloadedFiles.push(fileHash);
    saveUsage(usage);
  }
}

// Check if user needs to pay for download (currently free for all users)
export function needsToPayForDownload(fileHash: string): { needsPayment: boolean; price: number } {
  // Currently all downloads are free - payment integration reserved for future
  return { needsPayment: false, price: 0 };
  
  // Future implementation when payment is enabled:
  // const usage = getUsage();
  // const limits = PLAN_LIMITS[usage.currentPlan];
  // 
  // // If downloads are included in subscription, no payment needed
  // if (limits.downloadsIncluded) {
  //   return { needsPayment: false, price: 0 };
  // }
  // 
  // // If file has already been downloaded, no payment needed
  // if (hasFileBeenDownloaded(fileHash)) {
  //   return { needsPayment: false, price: 0 };
  // }
  // 
  // // Free user needs to pay for this download
  // return { needsPayment: true, price: limits.downloadPricePerFile };
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
  
  // Dual file mode is now available for all users (free for now)
  // if (isDualFile && !limits.dualFileMode) {
  //   return {
  //     allowed: false,
  //     reason: 'Dual file mode is only available on Pro and Business plans.',
  //   };
  // }
  
  return { allowed: true };
}

// Check if user is logged in (required for download)
export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('datamatch_user');
  return user !== null;
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

// Placeholder: Pay for download
export async function payForDownload(fileHash: string, fileName: string, rowCount: number): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual payment processing (Stripe, etc.)
  console.log('TODO: Implement payment for download:', fileHash);
  
  // For now, just mark as downloaded (for testing)
  markFileAsDownloaded(fileHash);
  
  return { success: true, message: 'Payment successful (demo mode)' };
}

// Calculate file hash for tracking downloads
export async function calculateFileHash(fileContent: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileContent);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
