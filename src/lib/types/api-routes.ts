// ==========================================
// API ROUTE CONTRACTS FOR EVENT GALLERY
// ==========================================
// Defines the structure of API endpoints with their
// request and response types
// ==========================================

import type {
	User,
	UserPublic,
	CreateUserRequest,
	UpdateUserRequest,
	LoginRequest,
	LoginResponse,
	UserStatistics,
	Event,
	EventWithCreator,
	EventWithStats,
	EventDetail,
	CreateEventRequest,
	UpdateEventRequest,
	JoinEventRequest,
	JoinEventResponse,
	Image,
	ImageWithUser,
	ImageWithStats,
	ImageDetail,
	UploadImageRequest,
	UpdateImageRequest,
	UploadImageResponse,
	LikeImageResponse,
	Comment,
	CommentWithUser,
	CreateCommentRequest,
	UpdateCommentRequest,
	CreateCommentResponse,
	PaginatedResponse,
	EventFilters,
	ImageFilters,
	CommentFilters,
	ApiResponse,
	ValidateInviteCodeRequest,
	ValidateInviteCodeResponse,
	BulkDeleteImagesRequest,
	BulkDeleteImagesResponse,
	SearchRequest,
	SearchResults,
	ActivityFeedResponse,
	GalleryStats,
	ParticipantWithUser
} from './api-contracts';

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

export namespace AuthRoutes {
	// POST /api/auth/register
	export type RegisterRequest = CreateUserRequest;
	export type RegisterResponse = ApiResponse<{ user: User; sessionId: string }>;

	// POST /api/auth/login
	export type LoginRequestBody = LoginRequest;
	export type LoginResponseBody = ApiResponse<LoginResponse>;

	// POST /api/auth/logout
	export type LogoutResponse = ApiResponse<{ message: string }>;

	// GET /api/auth/me
	export type GetCurrentUserResponse = ApiResponse<User>;

	// GET /api/auth/validate-session
	export type ValidateSessionResponse = ApiResponse<{ valid: boolean; user?: User }>;
}

// ==========================================
// USER ROUTES
// ==========================================

export namespace UserRoutes {
	// GET /api/users/:id
	export type GetUserResponse = ApiResponse<UserPublic>;

	// PATCH /api/users/:id
	export type UpdateUserRequestBody = UpdateUserRequest;
	export type UpdateUserResponse = ApiResponse<User>;

	// DELETE /api/users/:id
	export type DeleteUserResponse = ApiResponse<{ message: string }>;

	// GET /api/users/:id/statistics
	export type GetUserStatisticsResponse = ApiResponse<UserStatistics>;

	// GET /api/users/:id/events
	export type GetUserEventsResponse = ApiResponse<PaginatedResponse<EventWithStats>>;

	// GET /api/users/:id/images
	export type GetUserImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;

	// GET /api/users/:id/liked-images
	export type GetUserLikedImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;
}

// ==========================================
// EVENT ROUTES
// ==========================================

export namespace EventRoutes {
	// GET /api/events
	export type GetEventsQuery = EventFilters;
	export type GetEventsResponse = ApiResponse<PaginatedResponse<EventWithStats>>;

	// POST /api/events
	export type CreateEventRequestBody = CreateEventRequest;
	export type CreateEventResponse = ApiResponse<EventDetail>;

	// GET /api/events/:id
	export type GetEventResponse = ApiResponse<EventDetail>;

	// PATCH /api/events/:id
	export type UpdateEventRequestBody = UpdateEventRequest;
	export type UpdateEventResponse = ApiResponse<EventDetail>;

	// DELETE /api/events/:id
	export type DeleteEventResponse = ApiResponse<{ message: string }>;

	// POST /api/events/:id/join
	export type JoinEventRequestBody = JoinEventRequest;
	export type JoinEventResponse = ApiResponse<JoinEventResponse>;

	// POST /api/events/join-by-code
	export type JoinByCodeRequestBody = { inviteCode: string };
	export type JoinByCodeResponse = ApiResponse<JoinEventResponse>;

	// DELETE /api/events/:id/leave
	export type LeaveEventResponse = ApiResponse<{ message: string }>;

	// GET /api/events/:id/participants
	export type GetEventParticipantsResponse = ApiResponse<ParticipantWithUser[]>;

	// GET /api/events/:id/images
	export type GetEventImagesQuery = ImageFilters;
	export type GetEventImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;

	// POST /api/events/validate-invite
	export type ValidateInviteRequestBody = ValidateInviteCodeRequest;
	export type ValidateInviteResponse = ApiResponse<ValidateInviteCodeResponse>;

	// GET /api/events/:id/statistics
	export type GetEventStatisticsResponse = ApiResponse<{
		participantCount: number;
		imageCount: number;
		totalLikes: number;
		totalComments: number;
	}>;
}

// ==========================================
// IMAGE ROUTES
// ==========================================

export namespace ImageRoutes {
	// GET /api/images
	export type GetImagesQuery = ImageFilters;
	export type GetImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;

	// POST /api/images
	export type UploadImageRequestBody = UploadImageRequest;
	export type UploadImageResponseBody = ApiResponse<UploadImageResponse>;

	// GET /api/images/:id
	export type GetImageResponse = ApiResponse<ImageDetail>;

	// PATCH /api/images/:id
	export type UpdateImageRequestBody = UpdateImageRequest;
	export type UpdateImageResponse = ApiResponse<ImageWithStats>;

	// DELETE /api/images/:id
	export type DeleteImageResponse = ApiResponse<{ message: string }>;

	// POST /api/images/:id/like
	export type LikeImageResponse = ApiResponse<LikeImageResponse>;

	// DELETE /api/images/:id/unlike
	export type UnlikeImageResponse = ApiResponse<LikeImageResponse>;

	// GET /api/images/:id/likes
	export type GetImageLikesResponse = ApiResponse<{
		users: UserPublic[];
		count: number;
	}>;

	// POST /api/images/bulk-delete
	export type BulkDeleteRequestBody = BulkDeleteImagesRequest;
	export type BulkDeleteResponse = ApiResponse<BulkDeleteImagesResponse>;
}

// ==========================================
// COMMENT ROUTES
// ==========================================

export namespace CommentRoutes {
	// GET /api/comments
	export type GetCommentsQuery = CommentFilters;
	export type GetCommentsResponse = ApiResponse<PaginatedResponse<CommentWithUser>>;

	// POST /api/comments
	export type CreateCommentRequestBody = CreateCommentRequest;
	export type CreateCommentResponse = ApiResponse<CreateCommentResponse>;

	// GET /api/comments/:id
	export type GetCommentResponse = ApiResponse<CommentWithUser>;

	// PATCH /api/comments/:id
	export type UpdateCommentRequestBody = UpdateCommentRequest;
	export type UpdateCommentResponse = ApiResponse<CommentWithUser>;

	// DELETE /api/comments/:id
	export type DeleteCommentResponse = ApiResponse<{ message: string }>;

	// GET /api/images/:imageId/comments
	export type GetImageCommentsQuery = { page?: number; limit?: number };
	export type GetImageCommentsResponse = ApiResponse<PaginatedResponse<CommentWithUser>>;
}

// ==========================================
// SEARCH ROUTES
// ==========================================

export namespace SearchRoutes {
	// GET /api/search
	export type SearchQuery = {
		q: string; // search query
		type?: 'events' | 'images' | 'users' | 'all';
		page?: number;
		limit?: number;
	};
	export type SearchResponse = ApiResponse<SearchResults>;
}

// ==========================================
// GALLERY ROUTES
// ==========================================

export namespace GalleryRoutes {
	// GET /api/gallery/featured
	export type GetFeaturedImagesQuery = { limit?: number };
	export type GetFeaturedImagesResponse = ApiResponse<ImageWithStats[]>;

	// GET /api/gallery/recent
	export type GetRecentImagesQuery = ImageFilters;
	export type GetRecentImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;

	// GET /api/gallery/popular
	export type GetPopularImagesQuery = ImageFilters;
	export type GetPopularImagesResponse = ApiResponse<PaginatedResponse<ImageWithStats>>;

	// GET /api/gallery/stats
	export type GetGalleryStatsResponse = ApiResponse<GalleryStats>;
}

// ==========================================
// ACTIVITY ROUTES
// ==========================================

export namespace ActivityRoutes {
	// GET /api/activity/feed
	export type GetActivityFeedQuery = {
		page?: number;
		limit?: number;
		userId?: string; // filter by user
		eventId?: string; // filter by event
	};
	export type GetActivityFeedResponse = ApiResponse<ActivityFeedResponse>;

	// GET /api/activity/user/:userId
	export type GetUserActivityQuery = {
		page?: number;
		limit?: number;
	};
	export type GetUserActivityResponse = ApiResponse<ActivityFeedResponse>;
}

// ==========================================
// UPLOAD ROUTES (S3 Presigned URLs)
// ==========================================

export namespace UploadRoutes {
	// POST /api/upload/presigned-url
	export type GetPresignedUrlRequest = {
		fileName: string;
		fileType: string;
		fileSize: number;
		uploadType: 'event-cover' | 'image' | 'avatar';
		eventId?: string; // required for event-cover and image
	};
	export type GetPresignedUrlResponse = ApiResponse<{
		uploadUrl: string; // presigned URL for upload
		fileUrl: string; // final URL of the file
		fileKey: string; // S3 key
		expiresIn: number; // seconds
	}>;
}

// ==========================================
// ADMIN ROUTES (Optional)
// ==========================================

export namespace AdminRoutes {
	// GET /api/admin/users
	export type GetAllUsersQuery = { page?: number; limit?: number };
	export type GetAllUsersResponse = ApiResponse<PaginatedResponse<User>>;

	// GET /api/admin/events
	export type GetAllEventsQuery = EventFilters;
	export type GetAllEventsResponse = ApiResponse<PaginatedResponse<EventWithStats>>;

	// DELETE /api/admin/events/:id
	export type DeleteEventResponse = ApiResponse<{ message: string }>;

	// DELETE /api/admin/images/:id
	export type DeleteImageResponse = ApiResponse<{ message: string }>;

	// GET /api/admin/statistics
	export type GetAdminStatisticsResponse = ApiResponse<{
		totalUsers: number;
		totalEvents: number;
		totalImages: number;
		totalLikes: number;
		totalComments: number;
		storageUsed: number; // bytes
		activeUsers: number; // last 30 days
	}>;

	// POST /api/admin/clean-expired-sessions
	export type CleanExpiredSessionsResponse = ApiResponse<{
		deletedCount: number;
		message: string;
	}>;
}

// ==========================================
// HEALTH CHECK ROUTES
// ==========================================

export namespace HealthRoutes {
	// GET /api/health
	export type HealthCheckResponse = ApiResponse<{
		status: 'ok' | 'error';
		timestamp: string;
		database: 'connected' | 'disconnected';
		s3: 'connected' | 'disconnected';
		uptime: number; // seconds
	}>;

	// GET /api/health/db
	export type DatabaseHealthResponse = ApiResponse<{
		status: 'ok' | 'error';
		latency: number; // milliseconds
	}>;
}

// ==========================================
// WEBHOOK ROUTES (Optional - for S3 events)
// ==========================================

export namespace WebhookRoutes {
	// POST /api/webhooks/s3-upload
	export type S3UploadWebhookBody = {
		eventName: string;
		bucket: string;
		key: string;
		size: number;
		timestamp: string;
	};
	export type S3UploadWebhookResponse = ApiResponse<{ received: boolean }>;
}

// ==========================================
// TYPE HELPERS
// ==========================================

// Helper type to extract request body type from a route
export type RequestBody<T> = T extends { body: infer B } ? B : never;

// Helper type to extract response type from a route
export type ResponseData<T> = T extends ApiResponse<infer D> ? D : never;

// Helper to create typed API client methods
export interface ApiClient {
	// Auth
	register: (data: AuthRoutes.RegisterRequest) => Promise<ResponseData<AuthRoutes.RegisterResponse>>;
	login: (data: AuthRoutes.LoginRequestBody) => Promise<ResponseData<AuthRoutes.LoginResponseBody>>;
	logout: () => Promise<ResponseData<AuthRoutes.LogoutResponse>>;
	getCurrentUser: () => Promise<ResponseData<AuthRoutes.GetCurrentUserResponse>>;

	// Events
	getEvents: (filters?: EventRoutes.GetEventsQuery) => Promise<ResponseData<EventRoutes.GetEventsResponse>>;
	createEvent: (data: EventRoutes.CreateEventRequestBody) => Promise<ResponseData<EventRoutes.CreateEventResponse>>;
	getEvent: (id: string) => Promise<ResponseData<EventRoutes.GetEventResponse>>;
	updateEvent: (id: string, data: EventRoutes.UpdateEventRequestBody) => Promise<ResponseData<EventRoutes.UpdateEventResponse>>;
	deleteEvent: (id: string) => Promise<ResponseData<EventRoutes.DeleteEventResponse>>;
	joinEvent: (id: string) => Promise<ResponseData<EventRoutes.JoinEventResponse>>;
	leaveEvent: (id: string) => Promise<ResponseData<EventRoutes.LeaveEventResponse>>;

	// Images
	getImages: (filters?: ImageRoutes.GetImagesQuery) => Promise<ResponseData<ImageRoutes.GetImagesResponse>>;
	uploadImage: (data: ImageRoutes.UploadImageRequestBody) => Promise<ResponseData<ImageRoutes.UploadImageResponseBody>>;
	getImage: (id: string) => Promise<ResponseData<ImageRoutes.GetImageResponse>>;
	updateImage: (id: string, data: ImageRoutes.UpdateImageRequestBody) => Promise<ResponseData<ImageRoutes.UpdateImageResponse>>;
	deleteImage: (id: string) => Promise<ResponseData<ImageRoutes.DeleteImageResponse>>;
	likeImage: (id: string) => Promise<ResponseData<ImageRoutes.LikeImageResponse>>;
	unlikeImage: (id: string) => Promise<ResponseData<ImageRoutes.UnlikeImageResponse>>;

	// Comments
	getComments: (filters?: CommentRoutes.GetCommentsQuery) => Promise<ResponseData<CommentRoutes.GetCommentsResponse>>;
	createComment: (data: CommentRoutes.CreateCommentRequestBody) => Promise<ResponseData<CommentRoutes.CreateCommentResponse>>;
	updateComment: (id: string, data: CommentRoutes.UpdateCommentRequestBody) => Promise<ResponseData<CommentRoutes.UpdateCommentResponse>>;
	deleteComment: (id: string) => Promise<ResponseData<CommentRoutes.DeleteCommentResponse>>;

	// Search
	search: (query: SearchRoutes.SearchQuery) => Promise<ResponseData<SearchRoutes.SearchResponse>>;

	// Gallery
	getFeaturedImages: (query?: GalleryRoutes.GetFeaturedImagesQuery) => Promise<ResponseData<GalleryRoutes.GetFeaturedImagesResponse>>;
	getRecentImages: (query?: GalleryRoutes.GetRecentImagesQuery) => Promise<ResponseData<GalleryRoutes.GetRecentImagesResponse>>;
	getPopularImages: (query?: GalleryRoutes.GetPopularImagesQuery) => Promise<ResponseData<GalleryRoutes.GetPopularImagesResponse>>;
	getGalleryStats: () => Promise<ResponseData<GalleryRoutes.GetGalleryStatsResponse>>;
}


