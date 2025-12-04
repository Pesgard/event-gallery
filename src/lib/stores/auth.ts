// ==========================================
// AUTHENTICATION STORE
// ==========================================
// Reactive state management for authentication
// Uses Svelte 5 runes
// ==========================================

import type { User } from '$lib/types';
import { apiClient, getStoredToken, getStoredUser, setStoredUser, removeStoredToken } from '$lib/api/client';
import { browser } from '$app/environment';

// ==========================================
// STATE
// ==========================================

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isLoading: true,
	isAuthenticated: false
};

// Initialize state from localStorage if available
if (browser) {
	const storedToken = getStoredToken();
	const storedUser = getStoredUser();
	
	if (storedToken && storedUser) {
		initialState.token = storedToken;
		initialState.user = storedUser;
		initialState.isAuthenticated = true;
		apiClient.setToken(storedToken);
	}
}

export const authState = $state<AuthState>(initialState);

// ==========================================
// COMPUTED VALUES
// ==========================================

export const isAuthenticated = () => authState.isAuthenticated;
export const currentUser = () => authState.user;
export const authToken = () => authState.token;
export const isLoading = () => authState.isLoading;

// ==========================================
// ACTIONS
// ==========================================

export async function login(email: string, password: string) {
	authState.isLoading = true;
	
	try {
		const response = await apiClient.login({ email, password });
		
		if (response.success && response.data) {
			authState.user = response.data.user;
			authState.token = response.data.sessionId; // sessionId is the Bearer token
			authState.isAuthenticated = true;
			setStoredUser(response.data.user);
			return { success: true, data: response.data };
		} else {
			authState.user = null;
			authState.token = null;
			authState.isAuthenticated = false;
			return { success: false, error: response.error };
		}
	} catch (error) {
		authState.user = null;
		authState.token = null;
		authState.isAuthenticated = false;
		return {
			success: false,
			error: {
				error: 'NetworkError',
				message: error instanceof Error ? error.message : 'Login failed',
				statusCode: 0
			}
		};
	} finally {
		authState.isLoading = false;
	}
}

export async function register(
	email: string,
	username: string,
	password: string,
	fullName?: string
) {
	authState.isLoading = true;
	
	try {
		const response = await apiClient.register({
			email,
			username,
			password,
			fullName
		});
		
		if (response.success && response.data) {
			authState.user = response.data.user;
			authState.token = response.data.sessionId; // sessionId is the Bearer token
			authState.isAuthenticated = true;
			setStoredUser(response.data.user);
			return { success: true, data: response.data };
		} else {
			authState.user = null;
			authState.token = null;
			authState.isAuthenticated = false;
			return { success: false, error: response.error };
		}
	} catch (error) {
		authState.user = null;
		authState.token = null;
		authState.isAuthenticated = false;
		return {
			success: false,
			error: {
				error: 'NetworkError',
				message: error instanceof Error ? error.message : 'Registration failed',
				statusCode: 0
			}
		};
	} finally {
		authState.isLoading = false;
	}
}

export async function logout() {
	authState.isLoading = true;
	
	try {
		await apiClient.logout();
	} catch (error) {
		// Continue with logout even if API call fails
		console.error('Logout error:', error);
	} finally {
		authState.user = null;
		authState.token = null;
		authState.isAuthenticated = false;
		removeStoredToken();
		authState.isLoading = false;
	}
}

export async function refreshUser() {
	if (!authState.isAuthenticated) {
		return;
	}
	
	authState.isLoading = true;
	
	try {
		const response = await apiClient.getCurrentUser();
		
		if (response.success && response.data) {
			authState.user = response.data;
			setStoredUser(response.data);
		} else if (response.error?.statusCode === 401) {
			// Token expired or invalid
			await logout();
		}
	} catch (error) {
		console.error('Refresh user error:', error);
	} finally {
		authState.isLoading = false;
	}
}

// Initialize auth state on mount
if (browser) {
	// Listen for logout events (e.g., from 401 responses)
	window.addEventListener('auth:logout', () => {
		logout();
	});
	
	// Refresh user data on mount if authenticated
	if (authState.isAuthenticated) {
		refreshUser();
	} else {
		authState.isLoading = false;
	}
}


