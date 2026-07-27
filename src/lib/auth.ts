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

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Create authenticated fetch headers
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// Register a new user
export async function registerUser(email: string, password: string, name?: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    if (data.user) {
      saveUser(data.user);
      if (data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    if (data.user) {
      saveUser(data.user);
      if (data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
    }

    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearUser();
  }
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
