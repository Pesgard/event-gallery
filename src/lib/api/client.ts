// ==========================================
// API CLIENT WITH BEARER TOKEN AUTHENTICATION
// ==========================================
// Client for making API requests to external backend
// Uses Bearer tokens for authentication
// ==========================================

import type {
	ApiResponse,
	ApiError,
	LoginRequest,
	LoginResponse,
	CreateUserRequest,
	User,
	Event,
	EventDetail,
	EventWithStats,
	CreateEventRequest,
	UpdateEventRequest,
	Image,
	ImageDetail,
	ImageWithStats,
	UploadImageRequest,
	UpdateImageRequest,
	Comment,
	CommentWithUser,
	CreateCommentRequest,
	UpdateCommentRequest,
	PaginatedResponse,
	EventFilters,
	ImageFilters,
	CommentFilters
} from '$lib/types';
import { API_ENDPOINTS } from '$lib/types';

// ==========================================
// CONFIGURATION
// ==========================================

// Get API base URL from environment variable
// Default to localhost for development (backend runs on port 3000 by default)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Storage keys
const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

export function getStoredToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeStoredToken(): void {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(TOKEN_STORAGE_KEY);
	localStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredUser(): User | null {
	if (typeof window === 'undefined') return null;
	const userStr = localStorage.getItem(USER_STORAGE_KEY);
	if (!userStr) return null;
	try {
		return JSON.parse(userStr);
	} catch {
		return null;
	}
}

export function setStoredUser(user: User): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// ==========================================
// API CLIENT CLASS
// ==========================================

class ApiClient {
	private baseUrl: string;
	private token: string | null = null;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
		// Load token from storage on initialization
		this.token = getStoredToken();
	}

	setToken(token: string | null): void {
		this.token = token;
		if (token) {
			setStoredToken(token);
		} else {
			removeStoredToken();
		}
	}

	getToken(): string | null {
		return this.token || getStoredToken();
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<ApiResponse<T>> {
		const token = this.getToken();
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string> || {})
		};

		// Add Bearer token if available
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, {
				...options,
				headers
			});

			// Handle 401 Unauthorized - token expired or invalid
			if (response.status === 401) {
				this.setToken(null);
				removeStoredToken();
				// Dispatch event for auth state change
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('auth:logout'));
				}
			}

			// Parse JSON response
			let data: ApiResponse<T>;
			try {
				data = await response.json();
			} catch (parseError) {
				// If response is not JSON, return error
				return {
					success: false,
					error: {
						error: 'ParseError',
						message: 'Invalid JSON response from server',
						statusCode: response.status
					}
				};
			}

			// If response is not ok and doesn't have success: false, wrap it
			if (!response.ok && data.success !== false) {
				return {
					success: false,
					error: {
						error: 'HttpError',
						message: `HTTP ${response.status}: ${response.statusText}`,
						statusCode: response.status
					}
				};
			}

			return data;
		} catch (error) {
			// Network error or other fetch errors
			return {
				success: false,
				error: {
					error: 'NetworkError',
					message: error instanceof Error ? error.message : 'Network request failed',
					statusCode: 0
				}
			};
		}
	}

	private async requestFormData<T>(
		endpoint: string,
		formData: FormData,
		options: RequestInit = {}
	): Promise<ApiResponse<T>> {
		const token = this.getToken();
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			// Don't set Content-Type for FormData, browser will set it with boundary
			...(options.headers as Record<string, string> || {})
		};

		// Add Bearer token if available
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, {
				...options,
				method: options.method || 'POST',
				body: formData,
				headers
			});

			// Handle 401 Unauthorized
			if (response.status === 401) {
				this.setToken(null);
				removeStoredToken();
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('auth:logout'));
				}
			}

			// Parse JSON response
			let data: ApiResponse<T>;
			try {
				data = await response.json();
			} catch (parseError) {
				return {
					success: false,
					error: {
						error: 'ParseError',
						message: 'Invalid JSON response from server',
						statusCode: response.status
					}
				};
			}

			// If response is not ok and doesn't have success: false, wrap it
			if (!response.ok && data.success !== false) {
				return {
					success: false,
					error: {
						error: 'HttpError',
						message: `HTTP ${response.status}: ${response.statusText}`,
						statusCode: response.status
					}
				};
			}

			return data;
		} catch (error) {
			return {
				success: false,
				error: {
					error: 'NetworkError',
					message: error instanceof Error ? error.message : 'Network request failed',
					statusCode: 0
				}
			};
		}
	}

	// ==========================================
	// AUTHENTICATION METHODS
	// ==========================================

	async register(data: CreateUserRequest): Promise<ApiResponse<LoginResponse>> {
		const response = await this.request<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, {
			method: 'POST',
			body: JSON.stringify(data)
		});

		if (response.success && response.data) {
			// Store token and user
			this.setToken(response.data.sessionId);
			setStoredUser(response.data.user);
		}

		return response;
	}

	async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
		const response = await this.request<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
			method: 'POST',
			body: JSON.stringify(credentials)
		});

		if (response.success && response.data) {
			// Store token and user
			this.setToken(response.data.sessionId);
			setStoredUser(response.data.user);
		}

		return response;
	}

	async logout(): Promise<ApiResponse<{ message: string }>> {
		const response = await this.request<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT, {
			method: 'POST'
		});

		// Clear token regardless of response
		this.setToken(null);
		removeStoredToken();

		return response;
	}

	async getCurrentUser(): Promise<ApiResponse<User>> {
		return this.request<User>(API_ENDPOINTS.AUTH.ME);
	}

	// ==========================================
	// EVENT METHODS
	// ==========================================

	async getEvents(filters?: EventFilters): Promise<ApiResponse<PaginatedResponse<EventWithStats>>> {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.set(key, String(value));
				}
			});
		}
		const query = params.toString();
		return this.request<PaginatedResponse<EventWithStats>>(
			`${API_ENDPOINTS.EVENTS.LIST}${query ? `?${query}` : ''}`
		);
	}

	async createEvent(data: CreateEventRequest): Promise<ApiResponse<EventDetail>> {
		// If coverImage is a File, we need to use FormData
		if (data.coverImage instanceof File) {
			const formData = new FormData();
			formData.append('name', data.name);
			formData.append('date', data.date);
			formData.append('location', data.location);
			formData.append('category', data.category);
			if (data.description) formData.append('description', data.description);
			if (data.time) formData.append('time', data.time);
			if (data.isPrivate !== undefined) formData.append('isPrivate', String(data.isPrivate));
			if (data.maxParticipants)
				formData.append('maxParticipants', String(data.maxParticipants));
			formData.append('coverImage', data.coverImage);

			return this.requestFormData<EventDetail>(API_ENDPOINTS.EVENTS.CREATE, formData, {
				method: 'POST'
			});
		}

		return this.request<EventDetail>(API_ENDPOINTS.EVENTS.CREATE, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async getEvent(id: string): Promise<ApiResponse<EventDetail>> {
		return this.request<EventDetail>(API_ENDPOINTS.EVENTS.GET(id));
	}

	async updateEvent(id: string, data: UpdateEventRequest): Promise<ApiResponse<EventDetail>> {
		// Handle file upload if coverImage is a File
		if (data.coverImage instanceof File) {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					if (value instanceof File) {
						formData.append(key, value);
					} else {
						formData.append(key, String(value));
					}
				}
			});

			return this.requestFormData<EventDetail>(API_ENDPOINTS.EVENTS.UPDATE(id), formData, {
				method: 'PATCH'
			});
		}

		return this.request<EventDetail>(API_ENDPOINTS.EVENTS.UPDATE(id), {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(API_ENDPOINTS.EVENTS.DELETE(id), {
			method: 'DELETE'
		});
	}

	async joinEvent(id: string): Promise<ApiResponse<{ event: EventDetail; message: string }>> {
		return this.request<{ event: EventDetail; message: string }>(
			API_ENDPOINTS.EVENTS.JOIN(id),
			{
				method: 'POST'
			}
		);
	}

	async joinEventByCode(inviteCode: string): Promise<ApiResponse<{ event: EventDetail; message: string }>> {
		return this.request<{ event: EventDetail; message: string }>(
			API_ENDPOINTS.EVENTS.JOIN_BY_CODE,
			{
				method: 'POST',
				body: JSON.stringify({ inviteCode })
			}
		);
	}

	async leaveEvent(id: string): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(API_ENDPOINTS.EVENTS.LEAVE(id), {
			method: 'DELETE'
		});
	}

	async getEventImages(
		id: string,
		filters?: ImageFilters
	): Promise<ApiResponse<PaginatedResponse<ImageWithStats>>> {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.set(key, String(value));
				}
			});
		}
		const query = params.toString();
		return this.request<PaginatedResponse<ImageWithStats>>(
			`${API_ENDPOINTS.EVENTS.IMAGES(id)}${query ? `?${query}` : ''}`
		);
	}

	// ==========================================
	// IMAGE METHODS
	// ==========================================

	async getImages(filters?: ImageFilters): Promise<ApiResponse<PaginatedResponse<ImageWithStats>>> {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.set(key, String(value));
				}
			});
		}
		const query = params.toString();
		return this.request<PaginatedResponse<ImageWithStats>>(
			`${API_ENDPOINTS.IMAGES.LIST}${query ? `?${query}` : ''}`
		);
	}

	async uploadImage(data: UploadImageRequest): Promise<ApiResponse<{ image: ImageWithStats; message: string }>> {
		const formData = new FormData();
		formData.append('eventId', data.eventId);
		formData.append('image', data.image);
		if (data.title) formData.append('title', data.title);
		if (data.description) formData.append('description', data.description);

		return this.requestFormData<{ image: ImageWithStats; message: string }>(
			API_ENDPOINTS.IMAGES.CREATE,
			formData,
			{
				method: 'POST'
			}
		);
	}

	async getImage(id: string): Promise<ApiResponse<ImageDetail>> {
		return this.request<ImageDetail>(API_ENDPOINTS.IMAGES.GET(id));
	}

	async updateImage(id: string, data: UpdateImageRequest): Promise<ApiResponse<ImageWithStats>> {
		return this.request<ImageWithStats>(API_ENDPOINTS.IMAGES.UPDATE(id), {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	async deleteImage(id: string): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(API_ENDPOINTS.IMAGES.DELETE(id), {
			method: 'DELETE'
		});
	}

	async likeImage(id: string): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> {
		return this.request<{ liked: boolean; likeCount: number }>(API_ENDPOINTS.IMAGES.LIKE(id), {
			method: 'POST'
		});
	}

	async unlikeImage(id: string): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> {
		return this.request<{ liked: boolean; likeCount: number }>(API_ENDPOINTS.IMAGES.UNLIKE(id), {
			method: 'DELETE'
		});
	}

	// ==========================================
	// COMMENT METHODS
	// ==========================================

	async createComment(data: CreateCommentRequest): Promise<ApiResponse<{ comment: CommentWithUser; message: string }>> {
		return this.request<{ comment: CommentWithUser; message: string }>(
			API_ENDPOINTS.COMMENTS.CREATE,
			{
				method: 'POST',
				body: JSON.stringify(data)
			}
		);
	}

	async updateComment(
		id: string,
		data: UpdateCommentRequest
	): Promise<ApiResponse<CommentWithUser>> {
		return this.request<CommentWithUser>(API_ENDPOINTS.COMMENTS.UPDATE(id), {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	async deleteComment(id: string): Promise<ApiResponse<{ message: string }>> {
		return this.request<{ message: string }>(API_ENDPOINTS.COMMENTS.DELETE(id), {
			method: 'DELETE'
		});
	}

	async getImageComments(
		imageId: string,
		page?: number,
		limit?: number
	): Promise<ApiResponse<PaginatedResponse<CommentWithUser>>> {
		const params = new URLSearchParams();
		if (page) params.set('page', String(page));
		if (limit) params.set('limit', String(limit));
		const query = params.toString();
		return this.request<PaginatedResponse<CommentWithUser>>(
			`${API_ENDPOINTS.COMMENTS.BY_IMAGE(imageId)}${query ? `?${query}` : ''}`
		);
	}

	// ==========================================
	// SEARCH METHODS
	// ==========================================

	async search(query: string, type: 'all' | 'events' | 'images' | 'users' = 'all'): Promise<ApiResponse<{
		events: EventWithStats[];
		images: ImageWithStats[];
		users: User[];
		total: number;
	}>> {
		const params = new URLSearchParams({ q: query, type });
		return this.request<{
			events: EventWithStats[];
			images: ImageWithStats[];
			users: User[];
			total: number;
		}>(`${API_ENDPOINTS.SEARCH}?${params}`);
	}

	// ==========================================
	// GALLERY METHODS
	// ==========================================

	async getGalleryStats(): Promise<ApiResponse<{
		totalEvents: number;
		totalImages: number;
		totalUsers: number;
	}>> {
		return this.request<{
			totalEvents: number;
			totalImages: number;
			totalUsers: number;
		}>(API_ENDPOINTS.GALLERY.STATS);
	}
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const apiClient = new ApiClient();

// Export for convenience
export default apiClient;


