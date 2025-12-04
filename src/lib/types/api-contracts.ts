// ==========================================
// API CONTRACTS FOR EVENT GALLERY
// ==========================================
// Type definitions for API requests and responses
// ==========================================

// ==========================================
// USER TYPES
// ==========================================

export interface User {
	id: string;
	email: string;
	username: string;
	fullName: string | null;
	avatarUrl: string | null;
	createdAt: string; // ISO 8601 timestamp
	updatedAt: string; // ISO 8601 timestamp
}

export interface UserPublic {
	id: string;
	username: string;
	fullName: string | null;
	avatarUrl: string | null;
}

export interface CreateUserRequest {
	email: string;
	username: string;
	password: string;
	fullName?: string;
}

export interface UpdateUserRequest {
	fullName?: string;
	avatarUrl?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	sessionId: string; // This is the Bearer token to use in Authorization header
}

export interface UserStatistics {
	userId: string;
	username: string;
	email: string;
	eventsCreated: number;
	eventsJoined: number;
	imagesUploaded: number;
	imagesLiked: number;
}

// ==========================================
// EVENT TYPES
// ==========================================

export type EventCategory = 
	| 'wedding'
	| 'birthday'
	| 'conference'
	| 'music'
	| 'sports'
	| 'art'
	| 'corporate'
	| 'other';

export interface Event {
	id: string; // UUID
	name: string;
	description: string | null;
	date: string; // ISO 8601 timestamp
	time: string | null; // HH:MM format
	location: string;
	category: EventCategory;
	isPrivate: boolean;
	maxParticipants: number | null;
	coverImageUrl: string | null;
	coverImageKey: string | null;
	inviteCode: string;
	createdById: string;
	createdAt: string; // ISO 8601 timestamp
	updatedAt: string; // ISO 8601 timestamp
}

export interface EventWithCreator extends Event {
	creator: UserPublic;
}

export interface EventWithStats extends Event {
	participantCount: number;
	imageCount: number;
	totalLikes: number;
}

export interface EventDetail extends EventWithCreator {
	participantCount: number;
	imageCount: number;
	totalLikes: number;
	participants: UserPublic[];
	isParticipant: boolean; // if current user is participant
}

export interface CreateEventRequest {
	name: string;
	description?: string;
	date: string; // ISO 8601 timestamp
	time?: string; // HH:MM format
	location: string;
	category: EventCategory;
	isPrivate?: boolean;
	maxParticipants?: number;
	coverImage?: File; // For form data upload
}

export interface UpdateEventRequest {
	name?: string;
	description?: string;
	date?: string; // ISO 8601 timestamp
	time?: string; // HH:MM format
	location?: string;
	category?: EventCategory;
	isPrivate?: boolean;
	maxParticipants?: number;
	coverImage?: File; // For form data upload
}

export interface JoinEventRequest {
	inviteCode: string;
}

export interface JoinEventResponse {
	event: EventDetail;
	message: string;
}

// ==========================================
// IMAGE TYPES
// ==========================================

export interface Image {
	id: string; // UUID
	eventId: string; // UUID
	userId: string;
	title: string | null;
	description: string | null;
	imageUrl: string;
	imageKey: string;
	thumbnailUrl: string | null;
	thumbnailKey: string | null;
	width: number | null;
	height: number | null;
	fileSize: number | null; // bytes
	mimeType: string | null;
	uploadedAt: string; // ISO 8601 timestamp
}

export interface ImageWithUser extends Image {
	user: UserPublic;
}

export interface ImageWithStats extends Image {
	likeCount: number;
	commentCount: number;
}

export interface ImageDetail extends ImageWithUser, ImageWithStats {
	isLikedByCurrentUser: boolean;
	comments: CommentWithUser[];
}

export interface UploadImageRequest {
	eventId: string; // UUID
	title?: string;
	description?: string;
	image: File; // For form data upload
}

export interface UpdateImageRequest {
	title?: string;
	description?: string;
}

export interface UploadImageResponse {
	image: ImageWithStats;
	message: string;
}

// ==========================================
// LIKE TYPES
// ==========================================

export interface ImageLike {
	id: string; // UUID
	imageId: string; // UUID
	userId: string;
	likedAt: string; // ISO 8601 timestamp
}

export interface LikeImageResponse {
	liked: boolean; // true if liked, false if unliked
	likeCount: number;
}

// ==========================================
// COMMENT TYPES
// ==========================================

export interface Comment {
	id: string; // UUID
	imageId: string; // UUID
	userId: string;
	content: string;
	createdAt: string; // ISO 8601 timestamp
	updatedAt: string; // ISO 8601 timestamp
}

export interface CommentWithUser extends Comment {
	user: UserPublic;
}

export interface CreateCommentRequest {
	imageId: string; // UUID
	content: string;
}

export interface UpdateCommentRequest {
	content: string;
}

export interface CreateCommentResponse {
	comment: CommentWithUser;
	message: string;
}

// ==========================================
// PARTICIPANT TYPES
// ==========================================

export interface EventParticipant {
	id: string; // UUID
	eventId: string; // UUID
	userId: string;
	joinedAt: string; // ISO 8601 timestamp
}

export interface ParticipantWithUser extends EventParticipant {
	user: UserPublic;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

export interface PaginationParams {
	page?: number; // default: 1
	limit?: number; // default: 20
	sortBy?: string; // field to sort by
	sortOrder?: 'asc' | 'desc'; // default: 'desc'
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

// ==========================================
// FILTER TYPES
// ==========================================

export interface EventFilters extends PaginationParams {
	category?: EventCategory;
	isPrivate?: boolean;
	search?: string; // search in name, description, location
	startDate?: string; // ISO 8601
	endDate?: string; // ISO 8601
	createdById?: string;
}

export interface ImageFilters extends PaginationParams {
	eventId?: string; // UUID
	userId?: string;
	search?: string; // search in title, description
	startDate?: string; // ISO 8601
	endDate?: string; // ISO 8601
}

export interface CommentFilters extends PaginationParams {
	imageId?: string; // UUID
	userId?: string;
}

// ==========================================
// ERROR TYPES
// ==========================================

export interface ApiError {
	error: string;
	message: string;
	statusCode: number;
	details?: Record<string, string[]>; // validation errors
}

export interface ValidationError {
	field: string;
	message: string;
}

// ==========================================
// RESPONSE WRAPPERS
// ==========================================

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
}

export interface ApiSuccessResponse<T> {
	success: true;
	data: T;
}

export interface ApiErrorResponse {
	success: false;
	error: ApiError;
}

// ==========================================
// UPLOAD TYPES
// ==========================================

export interface S3UploadResult {
	url: string; // Full S3 URL
	key: string; // S3 object key
	bucket: string;
}

export interface ImageUploadMetadata {
	width: number;
	height: number;
	fileSize: number;
	mimeType: string;
}

// ==========================================
// STATISTICS TYPES
// ==========================================

export interface EventStatistics {
	eventId: string; // UUID
	eventName: string;
	eventDate: string; // ISO 8601
	participantCount: number;
	imageCount: number;
	totalLikes: number;
}

export interface GalleryStats {
	totalEvents: number;
	totalImages: number;
	totalUsers: number;
	totalLikes: number;
	totalComments: number;
}

// ==========================================
// SEARCH TYPES
// ==========================================

export interface SearchRequest {
	query: string;
	filters?: {
		events?: boolean;
		images?: boolean;
		users?: boolean;
	};
	pagination?: PaginationParams;
}

export interface SearchResults {
	events: EventWithStats[];
	images: ImageWithStats[];
	users: UserPublic[];
	total: number;
}

// ==========================================
// INVITE CODE TYPES
// ==========================================

export interface ValidateInviteCodeRequest {
	inviteCode: string;
}

export interface ValidateInviteCodeResponse {
	valid: boolean;
	event?: EventWithStats;
	canJoin?: boolean;
	reason?: string; // e.g., "Event is full", "Already joined"
}

// ==========================================
// BULK OPERATIONS
// ==========================================

export interface BulkDeleteImagesRequest {
	imageIds: string[]; // UUIDs
}

export interface BulkDeleteImagesResponse {
	deletedCount: number;
	failedIds: string[];
	message: string;
}

// ==========================================
// ACTIVITY FEED
// ==========================================

export type ActivityType = 
	| 'event_created'
	| 'event_joined'
	| 'image_uploaded'
	| 'image_liked'
	| 'comment_added';

export interface Activity {
	id: string;
	type: ActivityType;
	userId: string;
	user: UserPublic;
	eventId?: string;
	imageId?: string;
	timestamp: string; // ISO 8601
	metadata?: Record<string, unknown>;
}

export interface ActivityFeedResponse {
	activities: Activity[];
	hasMore: boolean;
}

