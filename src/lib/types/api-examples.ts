// ==========================================
// API CONTRACTS USAGE EXAMPLES
// ==========================================
// Examples of how to use the API contracts
// These are TypeScript examples for reference
// ==========================================

import type {
	CreateEventRequest,
	UpdateEventRequest,
	UploadImageRequest,
	CreateCommentRequest,
	EventFilters,
	ImageFilters,
	LoginRequest,
	CreateUserRequest,
	ApiResponse,
	EventDetail,
	ImageDetail,
	PaginatedResponse,
	EventWithStats
} from './api-contracts';

// ==========================================
// AUTHENTICATION EXAMPLES
// ==========================================

// Example: Register a new user
const registerExample: CreateUserRequest = {
	email: 'user@example.com',
	username: 'johndoe',
	password: 'SecurePassword123!',
	fullName: 'John Doe'
};

// Example: Login
const loginExample: LoginRequest = {
	email: 'user@example.com',
	password: 'SecurePassword123!'
};

// Example: API call with fetch
async function loginUser(credentials: LoginRequest): Promise<ApiResponse<{ user: any; sessionId: string }>> {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});

	return response.json();
}

// ==========================================
// EVENT EXAMPLES
// ==========================================

// Example: Create a new event
const createEventExample: CreateEventRequest = {
	name: 'Tech Conference 2025',
	description: 'Annual technology conference with industry leaders',
	date: '2025-12-15T09:00:00Z',
	time: '09:00',
	location: 'Convention Center, San Francisco',
	category: 'conference',
	isPrivate: false,
	maxParticipants: 500
};

// Example: Update an event
const updateEventExample: UpdateEventRequest = {
	name: 'Tech Conference 2025 - Updated',
	description: 'Annual technology conference with special guest speakers',
	maxParticipants: 600
};

// Example: Filter events
const eventFiltersExample: EventFilters = {
	category: 'conference',
	isPrivate: false,
	search: 'tech',
	startDate: '2025-01-01T00:00:00Z',
	endDate: '2025-12-31T23:59:59Z',
	page: 1,
	limit: 20,
	sortBy: 'date',
	sortOrder: 'desc'
};

// Example: Fetch events with filters
async function fetchEvents(filters: EventFilters): Promise<PaginatedResponse<EventWithStats>> {
	const queryParams = new URLSearchParams();
	
	if (filters.category) queryParams.set('category', filters.category);
	if (filters.search) queryParams.set('search', filters.search);
	if (filters.page) queryParams.set('page', filters.page.toString());
	if (filters.limit) queryParams.set('limit', filters.limit.toString());
	// ... add more params

	const response = await fetch(`/api/events?${queryParams.toString()}`);
	const data: ApiResponse<PaginatedResponse<EventWithStats>> = await response.json();
	
	if (data.success && data.data) {
		return data.data;
	}
	
	throw new Error(data.error?.message || 'Failed to fetch events');
}

// Example: Join event by invite code
async function joinEventByCode(inviteCode: string): Promise<void> {
	const response = await fetch('/api/events/join-by-code', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ inviteCode })
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to join event');
	}
}

// ==========================================
// IMAGE EXAMPLES
// ==========================================

// Example: Upload an image (with FormData)
async function uploadImageExample(
	eventId: string,
	imageFile: File,
	title: string,
	description?: string
): Promise<void> {
	const formData = new FormData();
	formData.append('eventId', eventId);
	formData.append('image', imageFile);
	formData.append('title', title);
	if (description) {
		formData.append('description', description);
	}

	const response = await fetch('/api/images', {
		method: 'POST',
		body: formData
		// Note: Don't set Content-Type header, browser will set it automatically with boundary
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to upload image');
	}
}

// Example: Filter images
const imageFiltersExample: ImageFilters = {
	eventId: '123e4567-e89b-12d3-a456-426614174000',
	search: 'landscape',
	startDate: '2025-01-01T00:00:00Z',
	page: 1,
	limit: 30,
	sortBy: 'uploadedAt',
	sortOrder: 'desc'
};

// Example: Like an image
async function likeImage(imageId: string): Promise<void> {
	const response = await fetch(`/api/images/${imageId}/like`, {
		method: 'POST'
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to like image');
	}
}

// Example: Unlike an image
async function unlikeImage(imageId: string): Promise<void> {
	const response = await fetch(`/api/images/${imageId}/unlike`, {
		method: 'DELETE'
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to unlike image');
	}
}

// Example: Get image details
async function getImageDetails(imageId: string): Promise<ImageDetail> {
	const response = await fetch(`/api/images/${imageId}`);
	const data: ApiResponse<ImageDetail> = await response.json();
	
	if (data.success && data.data) {
		return data.data;
	}
	
	throw new Error(data.error?.message || 'Failed to fetch image details');
}

// ==========================================
// COMMENT EXAMPLES
// ==========================================

// Example: Create a comment
const createCommentExample: CreateCommentRequest = {
	imageId: '123e4567-e89b-12d3-a456-426614174000',
	content: 'Amazing photo! Love the composition and lighting.'
};

// Example: Add a comment
async function addComment(imageId: string, content: string): Promise<void> {
	const response = await fetch('/api/comments', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			imageId,
			content
		})
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to add comment');
	}
}

// Example: Update a comment
async function updateComment(commentId: string, content: string): Promise<void> {
	const response = await fetch(`/api/comments/${commentId}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content })
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to update comment');
	}
}

// Example: Delete a comment
async function deleteComment(commentId: string): Promise<void> {
	const response = await fetch(`/api/comments/${commentId}`, {
		method: 'DELETE'
	});

	const data = await response.json();
	
	if (!data.success) {
		throw new Error(data.error?.message || 'Failed to delete comment');
	}
}

// ==========================================
// SEARCH EXAMPLES
// ==========================================

// Example: Search across all content
async function searchAll(query: string): Promise<void> {
	const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`);
	const data = await response.json();
	
	if (data.success) {
		console.log('Events:', data.data.events);
		console.log('Images:', data.data.images);
		console.log('Users:', data.data.users);
	}
}

// Example: Search only events
async function searchEvents(query: string): Promise<void> {
	const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=events&limit=10`);
	const data = await response.json();
	
	if (data.success) {
		console.log('Found events:', data.data.events);
	}
}

// ==========================================
// ERROR HANDLING EXAMPLES
// ==========================================

// Example: Proper error handling
async function createEventWithErrorHandling(eventData: CreateEventRequest): Promise<EventDetail> {
	try {
		const response = await fetch('/api/events', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(eventData)
		});

		const data: ApiResponse<EventDetail> = await response.json();

		if (!data.success || !data.data) {
			// Handle API errors
			if (data.error) {
				// Validation errors
				if (data.error.details) {
					console.error('Validation errors:', data.error.details);
					// data.error.details is Record<string, string[]>
					// Example: { "name": ["Name is required"], "date": ["Invalid date format"] }
				}
				throw new Error(data.error.message);
			}
			throw new Error('Failed to create event');
		}

		return data.data;

	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating event:', error.message);
		}
		throw error;
	}
}

// ==========================================
// PAGINATION EXAMPLES
// ==========================================

// Example: Handle paginated results
async function fetchAllEventPages(): Promise<EventWithStats[]> {
	const allEvents: EventWithStats[] = [];
	let currentPage = 1;
	let hasMorePages = true;

	while (hasMorePages) {
		const response = await fetch(`/api/events?page=${currentPage}&limit=20`);
		const data: ApiResponse<PaginatedResponse<EventWithStats>> = await response.json();

		if (data.success && data.data) {
			allEvents.push(...data.data.data);
			hasMorePages = data.data.pagination.hasNextPage;
			currentPage++;
		} else {
			break;
		}
	}

	return allEvents;
}

// Example: Infinite scroll implementation
class InfiniteScrollEvents {
	private page = 1;
	private hasMore = true;
	private loading = false;
	events: EventWithStats[] = [];

	async loadMore(): Promise<void> {
		if (this.loading || !this.hasMore) return;

		this.loading = true;

		try {
			const response = await fetch(`/api/events?page=${this.page}&limit=20`);
			const data: ApiResponse<PaginatedResponse<EventWithStats>> = await response.json();

			if (data.success && data.data) {
				this.events.push(...data.data.data);
				this.hasMore = data.data.pagination.hasNextPage;
				this.page++;
			}
		} finally {
			this.loading = false;
		}
	}
}

// ==========================================
// TYPED API CLIENT EXAMPLE
// ==========================================

// Example: Creating a typed API client
class EventGalleryApiClient {
	private baseUrl: string;

	constructor(baseUrl = '/api') {
		this.baseUrl = baseUrl;
	}

	private async request<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			}
		});

		const data: ApiResponse<T> = await response.json();

		if (!data.success || !data.data) {
			throw new Error(data.error?.message || 'Request failed');
		}

		return data.data;
	}

	// Auth methods
	async login(credentials: LoginRequest) {
		return this.request('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials)
		});
	}

	async register(userData: CreateUserRequest) {
		return this.request('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
	}

	async logout() {
		return this.request('/auth/logout', { method: 'POST' });
	}

	// Event methods
	async getEvents(filters?: EventFilters) {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					params.set(key, String(value));
				}
			});
		}
		return this.request<PaginatedResponse<EventWithStats>>(
			`/events?${params.toString()}`
		);
	}

	async createEvent(eventData: CreateEventRequest) {
		return this.request<EventDetail>('/events', {
			method: 'POST',
			body: JSON.stringify(eventData)
		});
	}

	async getEvent(id: string) {
		return this.request<EventDetail>(`/events/${id}`);
	}

	async updateEvent(id: string, data: UpdateEventRequest) {
		return this.request<EventDetail>(`/events/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	async deleteEvent(id: string) {
		return this.request(`/events/${id}`, { method: 'DELETE' });
	}

	// Image methods
	async getImage(id: string) {
		return this.request<ImageDetail>(`/images/${id}`);
	}

	async likeImage(id: string) {
		return this.request(`/images/${id}/like`, { method: 'POST' });
	}

	async unlikeImage(id: string) {
		return this.request(`/images/${id}/unlike`, { method: 'DELETE' });
	}

	// Add more methods as needed...
}

// Usage of the API client
const api = new EventGalleryApiClient();

// Example usage
async function exampleUsage() {
	// Login
	await api.login({
		email: 'user@example.com',
		password: 'password123'
	});

	// Get events
	const events = await api.getEvents({
		category: 'conference',
		page: 1,
		limit: 20
	});

	console.log('Events:', events.data);
	console.log('Total pages:', events.pagination.totalPages);

	// Create event
	const newEvent = await api.createEvent({
		name: 'My Event',
		date: '2025-12-01T00:00:00Z',
		location: 'Online',
		category: 'conference'
	});

	console.log('Created event:', newEvent);
}

// ==========================================
// FORM VALIDATION EXAMPLES
// ==========================================

// Example: Validate create event form
function validateCreateEventForm(data: CreateEventRequest): string[] {
	const errors: string[] = [];

	if (!data.name || data.name.trim().length === 0) {
		errors.push('Event name is required');
	}

	if (data.name && data.name.length > 255) {
		errors.push('Event name must be less than 255 characters');
	}

	if (!data.date) {
		errors.push('Event date is required');
	}

	if (!data.location || data.location.trim().length === 0) {
		errors.push('Event location is required');
	}

	if (!data.category) {
		errors.push('Event category is required');
	}

	const validCategories = ['wedding', 'birthday', 'conference', 'music', 'sports', 'art', 'corporate', 'other'];
	if (data.category && !validCategories.includes(data.category)) {
		errors.push('Invalid event category');
	}

	if (data.maxParticipants !== undefined && data.maxParticipants < 1) {
		errors.push('Max participants must be at least 1');
	}

	return errors;
}

// ==========================================
// WEBSOCKET EXAMPLES (Future)
// ==========================================

// Example: Real-time updates for comments
class RealtimeImageComments {
	private ws: WebSocket | null = null;
	private imageId: string;

	constructor(imageId: string) {
		this.imageId = imageId;
	}

	connect() {
		this.ws = new WebSocket(`ws://localhost:3000/api/ws/images/${this.imageId}/comments`);

		this.ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('New comment:', data);
			// Update UI with new comment
		};

		this.ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};
	}

	disconnect() {
		this.ws?.close();
	}
}

export {
	loginUser,
	fetchEvents,
	joinEventByCode,
	uploadImageExample,
	likeImage,
	unlikeImage,
	getImageDetails,
	addComment,
	updateComment,
	deleteComment,
	searchAll,
	searchEvents,
	createEventWithErrorHandling,
	fetchAllEventPages,
	InfiniteScrollEvents,
	EventGalleryApiClient,
	validateCreateEventForm,
	RealtimeImageComments
};


