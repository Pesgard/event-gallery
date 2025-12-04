// ==========================================
// API MODULE EXPORTS
// ==========================================
// Central export point for API client and authentication
// ==========================================

export { apiClient, default as api } from './client';
export {
	getStoredToken,
	setStoredToken,
	removeStoredToken,
	getStoredUser,
	setStoredUser
} from './client';

// Re-export types for convenience
export type {
	ApiResponse,
	ApiError,
	LoginRequest,
	LoginResponse,
	CreateUserRequest,
	User
} from '$lib/types';


