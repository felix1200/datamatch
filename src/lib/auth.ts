// User authentication service
// This is a placeholder implementation - replace with actual backend API calls

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

const USER_KEY = 'datamatch_user';
const AUTH_TOKEN_KEY = 'datamatch_auth_token';

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) {
    return null;
  }
  
  return JSON.parse(stored);
}

// Save user to localStorage
export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Clear user from localStorage
export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// TODO: Replace with actual API calls when backend is ready

// Placeholder: Register a new user
export async function registerUser(email: string, password: string, name?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Implement actual registration API call
  console.log('TODO: Implement user registration for:', email);
  
  // For now, simulate successful registration
  const user: User = {
    id: 'user_' + Date.now(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };
  
  saveUser(user);
  
  return { success: true, user };
}

// Placeholder: Login user
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Implement actual login API call
  console.log('TODO: Implement user login for:', email);
  
  // For now, simulate successful login
  const user: User = {
    id: 'user_' + Date.now(),
    email,
    createdAt: new Date().toISOString(),
  };
  
  saveUser(user);
  
  return { success: true, user };
}

// Placeholder: Logout user
export async function logoutUser(): Promise<void> {
  // TODO: Implement actual logout API call
  console.log('TODO: Implement user logout');
  
  clearUser();
}

// Placeholder: Update user profile
export async function updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Implement actual profile update API call
  console.log('TODO: Implement profile update');
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: 'Not logged in' };
  }
  
  const updatedUser = { ...currentUser, ...updates };
  saveUser(updatedUser);
  
  return { success: true, user: updatedUser };
}
