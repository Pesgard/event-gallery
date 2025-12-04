// ==========================================
// API TYPES INDEX
// ==========================================
// Central export file for all API contracts
// ==========================================

// Export all types from api-contracts
export type {
	// User types
	User,
	UserPublic,
	CreateUserRequest,
	UpdateUserRequest,
	LoginRequest,
	LoginResponse,
	UserStatistics,
	
	// Event types
	EventCategory,
	Event,
	EventWithCreator,
	EventWithStats,
	EventDetail,
	CreateEventRequest,
	UpdateEventRequest,
	JoinEventRequest,
	JoinEventResponse,
	
	// Image types
	Image,
	ImageWithUser,
	ImageWithStats,
	ImageDetail,
	UploadImageRequest,
	UpdateImageRequest,
	UploadImageResponse,
	
	// Like types
	ImageLike,
	LikeImageResponse,
	
	// Comment types
	Comment,
	CommentWithUser,
	CreateCommentRequest,
	UpdateCommentRequest,
	CreateCommentResponse,
	
	// Participant types
	EventParticipant,
	ParticipantWithUser,
	
	// Pagination types
	PaginationParams,
	PaginatedResponse,
	
	// Filter types
	EventFilters,
	ImageFilters,
	CommentFilters,
	
	// Error types
	ApiError,
	ValidationError,
	
	// Response wrappers
	ApiResponse,
	ApiSuccessResponse,
	ApiErrorResponse,
	
	// Upload types
	S3UploadResult,
	ImageUploadMetadata,
	
	// Statistics types
	EventStatistics,
	GalleryStats,
	
	// Search types
	SearchRequest,
	SearchResults,
	
	// Invite code types
	ValidateInviteCodeRequest,
	ValidateInviteCodeResponse,
	
	// Bulk operations
	BulkDeleteImagesRequest,
	BulkDeleteImagesResponse,
	
	// Activity feed
	ActivityType,
	Activity,
	ActivityFeedResponse
} from './api-contracts';

// Export all route types (namespaces are exported as types)
export type {
	AuthRoutes,
	UserRoutes,
	EventRoutes,
	ImageRoutes,
	CommentRoutes,
	SearchRoutes,
	GalleryRoutes,
	ActivityRoutes,
	UploadRoutes,
	AdminRoutes,
	HealthRoutes,
	WebhookRoutes,
	ApiClient
} from './api-routes';

// Export all constants and utilities
export * from './api-constants';

