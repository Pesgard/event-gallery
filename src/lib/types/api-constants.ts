// ==========================================
// API CONSTANTS
// ==========================================
// Constants used throughout the API
// ==========================================

import type { EventCategory } from './api-contracts';

// ==========================================
// API CONFIGURATION
// ==========================================
// Note: In SPA mode, API_BASE_URL should be set via environment variable VITE_API_BASE_URL
// The actual base URL is handled by the API client, not these constants
// These constants are for building endpoint paths only

export const API_BASE_URL = '/api'; // This is just the path prefix, not the full URL

export const API_VERSION = 'v1';

// ==========================================
// PAGINATION DEFAULTS
// ==========================================

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
export const DEFAULT_SORT_ORDER = 'desc' as const;

// ==========================================
// FILE UPLOAD LIMITS
// ==========================================

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
export const MAX_COVER_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

export const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp'
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = [
	'.jpg',
	'.jpeg',
	'.png',
	'.gif',
	'.webp'
] as const;

// ==========================================
// TEXT LIMITS
// ==========================================

export const MAX_USERNAME_LENGTH = 50;
export const MIN_USERNAME_LENGTH = 3;

export const MAX_EMAIL_LENGTH = 255;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const MAX_EVENT_NAME_LENGTH = 255;
export const MAX_EVENT_DESCRIPTION_LENGTH = 5000;
export const MAX_EVENT_LOCATION_LENGTH = 255;

export const MAX_IMAGE_TITLE_LENGTH = 255;
export const MAX_IMAGE_DESCRIPTION_LENGTH = 2000;

export const MAX_COMMENT_LENGTH = 2000;
export const MIN_COMMENT_LENGTH = 1;

export const MAX_FULL_NAME_LENGTH = 255;

// ==========================================
// EVENT CATEGORIES
// ==========================================

export const EVENT_CATEGORIES: readonly EventCategory[] = [
	'wedding',
	'birthday',
	'conference',
	'music',
	'sports',
	'art',
	'corporate',
	'other'
] as const;

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
	wedding: 'Boda',
	birthday: 'Cumpleaños',
	conference: 'Conferencia',
	music: 'Música',
	sports: 'Deportes',
	art: 'Arte',
	corporate: 'Corporativo',
	other: 'Otro'
};

export const EVENT_CATEGORY_ICONS: Record<EventCategory, string> = {
	wedding: '💒',
	birthday: '🎂',
	conference: '🎤',
	music: '🎵',
	sports: '⚽',
	art: '🎨',
	corporate: '💼',
	other: '📅'
};

// ==========================================
// INVITE CODE
// ==========================================

export const INVITE_CODE_LENGTH = 8;
export const INVITE_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// ==========================================
// SESSION
// ==========================================

export const SESSION_COOKIE_NAME = 'session';
export const SESSION_DURATION_DAYS = 30;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// ==========================================
// S3 BUCKET STRUCTURE
// ==========================================

export const S3_BUCKET_FOLDERS = {
	EVENT_COVERS: 'events/{eventId}/covers',
	EVENT_IMAGES: 'events/{eventId}/images/{imageId}',
	EVENT_THUMBNAILS: 'events/{eventId}/thumbnails/{imageId}',
	USER_AVATARS: 'users/{userId}/avatars'
} as const;

// ==========================================
// IMAGE PROCESSING
// ==========================================

export const THUMBNAIL_WIDTH = 400;
export const THUMBNAIL_HEIGHT = 400;
export const THUMBNAIL_QUALITY = 80;

export const IMAGE_MAX_WIDTH = 2000;
export const IMAGE_MAX_HEIGHT = 2000;
export const IMAGE_QUALITY = 90;

// ==========================================
// ERROR MESSAGES
// ==========================================

export const ERROR_MESSAGES = {
	// Auth errors
	INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
	EMAIL_ALREADY_EXISTS: 'Este email ya está registrado',
	USERNAME_ALREADY_EXISTS: 'Este nombre de usuario ya está en uso',
	UNAUTHORIZED: 'Debes iniciar sesión para realizar esta acción',
	FORBIDDEN: 'No tienes permisos para realizar esta acción',
	SESSION_EXPIRED: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
	
	// Validation errors
	INVALID_EMAIL: 'Formato de email inválido',
	PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
	USERNAME_TOO_SHORT: `El nombre de usuario debe tener al menos ${MIN_USERNAME_LENGTH} caracteres`,
	USERNAME_TOO_LONG: `El nombre de usuario no puede tener más de ${MAX_USERNAME_LENGTH} caracteres`,
	
	// Event errors
	EVENT_NOT_FOUND: 'Evento no encontrado',
	EVENT_FULL: 'El evento ha alcanzado su capacidad máxima',
	ALREADY_JOINED: 'Ya eres participante de este evento',
	NOT_PARTICIPANT: 'No eres participante de este evento',
	INVALID_INVITE_CODE: 'Código de invitación inválido',
	NOT_EVENT_CREATOR: 'Solo el creador del evento puede realizar esta acción',
	
	// Image errors
	IMAGE_NOT_FOUND: 'Imagen no encontrada',
	IMAGE_TOO_LARGE: `La imagen no puede superar los ${MAX_IMAGE_SIZE / 1024 / 1024} MB`,
	INVALID_IMAGE_TYPE: 'Tipo de archivo no permitido. Usa JPG, PNG, GIF o WEBP',
	NOT_IMAGE_OWNER: 'Solo el propietario de la imagen puede realizar esta acción',
	
	// Comment errors
	COMMENT_NOT_FOUND: 'Comentario no encontrado',
	COMMENT_TOO_LONG: `El comentario no puede tener más de ${MAX_COMMENT_LENGTH} caracteres`,
	NOT_COMMENT_OWNER: 'Solo el autor del comentario puede realizar esta acción',
	
	// User errors
	USER_NOT_FOUND: 'Usuario no encontrado',
	
	// General errors
	INTERNAL_SERVER_ERROR: 'Error interno del servidor',
	BAD_REQUEST: 'Solicitud inválida',
	NOT_FOUND: 'Recurso no encontrado',
	VALIDATION_ERROR: 'Error de validación',
	
	// File upload errors
	UPLOAD_FAILED: 'Error al subir el archivo',
	S3_ERROR: 'Error al almacenar el archivo',
	FILE_REQUIRED: 'Debe proporcionar un archivo',
	
	// Database errors
	DATABASE_ERROR: 'Error de base de datos',
	DUPLICATE_ENTRY: 'El registro ya existe'
} as const;

// ==========================================
// SUCCESS MESSAGES
// ==========================================

export const SUCCESS_MESSAGES = {
	// Auth
	REGISTER_SUCCESS: 'Cuenta creada exitosamente',
	LOGIN_SUCCESS: 'Sesión iniciada correctamente',
	LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
	
	// Events
	EVENT_CREATED: 'Evento creado exitosamente',
	EVENT_UPDATED: 'Evento actualizado exitosamente',
	EVENT_DELETED: 'Evento eliminado exitosamente',
	EVENT_JOINED: 'Te has unido al evento exitosamente',
	EVENT_LEFT: 'Has salido del evento',
	
	// Images
	IMAGE_UPLOADED: 'Imagen subida exitosamente',
	IMAGE_UPDATED: 'Imagen actualizada exitosamente',
	IMAGE_DELETED: 'Imagen eliminada exitosamente',
	IMAGE_LIKED: 'Te gusta esta imagen',
	IMAGE_UNLIKED: 'Ya no te gusta esta imagen',
	
	// Comments
	COMMENT_CREATED: 'Comentario añadido exitosamente',
	COMMENT_UPDATED: 'Comentario actualizado exitosamente',
	COMMENT_DELETED: 'Comentario eliminado exitosamente',
	
	// User
	PROFILE_UPDATED: 'Perfil actualizado exitosamente',
	ACCOUNT_DELETED: 'Cuenta eliminada exitosamente'
} as const;

// ==========================================
// HTTP STATUS CODES
// ==========================================

export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	PAYLOAD_TOO_LARGE: 413,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503
} as const;

// ==========================================
// ACTIVITY TYPES
// ==========================================

export const ACTIVITY_TYPE_LABELS = {
	event_created: 'Creó un evento',
	event_joined: 'Se unió a un evento',
	image_uploaded: 'Subió una imagen',
	image_liked: 'Le gustó una imagen',
	comment_added: 'Comentó en una imagen'
} as const;

// ==========================================
// SORT OPTIONS
// ==========================================

export const EVENT_SORT_OPTIONS = [
	{ value: 'date', label: 'Fecha' },
	{ value: 'createdAt', label: 'Fecha de creación' },
	{ value: 'name', label: 'Nombre' },
	{ value: 'participantCount', label: 'Participantes' },
	{ value: 'imageCount', label: 'Imágenes' }
] as const;

export const IMAGE_SORT_OPTIONS = [
	{ value: 'uploadedAt', label: 'Fecha de subida' },
	{ value: 'likeCount', label: 'Me gusta' },
	{ value: 'commentCount', label: 'Comentarios' },
	{ value: 'title', label: 'Título' }
] as const;

// ==========================================
// REGEX PATTERNS
// ==========================================

export const REGEX_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	USERNAME: /^[a-zA-Z0-9_-]+$/,
	TIME_24H: /^([01]\d|2[0-3]):([0-5]\d)$/,
	UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
	INVITE_CODE: /^[A-Z0-9]{8}$/
} as const;

// ==========================================
// CACHE DURATIONS (in seconds)
// ==========================================

export const CACHE_DURATIONS = {
	SHORT: 60, // 1 minute
	MEDIUM: 300, // 5 minutes
	LONG: 3600, // 1 hour
	VERY_LONG: 86400 // 24 hours
} as const;

// ==========================================
// RATE LIMITING
// ==========================================

export const RATE_LIMITS = {
	AUTH: {
		WINDOW_MS: 15 * 60 * 1000, // 15 minutes
		MAX_REQUESTS: 5
	},
	API: {
		WINDOW_MS: 15 * 60 * 1000, // 15 minutes
		MAX_REQUESTS: 100
	},
	UPLOAD: {
		WINDOW_MS: 60 * 60 * 1000, // 1 hour
		MAX_REQUESTS: 50
	}
} as const;

// ==========================================
// FEATURE FLAGS
// ==========================================

export const FEATURES = {
	ENABLE_COMMENTS: true,
	ENABLE_LIKES: true,
	ENABLE_PRIVATE_EVENTS: true,
	ENABLE_IMAGE_UPLOAD: true,
	ENABLE_BULK_DELETE: true,
	ENABLE_ACTIVITY_FEED: true,
	ENABLE_SEARCH: true,
	ENABLE_WEBSOCKETS: false, // Future feature
	ENABLE_NOTIFICATIONS: false // Future feature
} as const;

// ==========================================
// TYPE GUARDS
// ==========================================

export function isValidEventCategory(value: string): value is EventCategory {
	return EVENT_CATEGORIES.includes(value as EventCategory);
}

export function isValidImageType(mimeType: string): boolean {
	return ALLOWED_IMAGE_TYPES.includes(mimeType as any);
}

export function isValidEmail(email: string): boolean {
	return REGEX_PATTERNS.EMAIL.test(email);
}

export function isValidUsername(username: string): boolean {
	return (
		REGEX_PATTERNS.USERNAME.test(username) &&
		username.length >= MIN_USERNAME_LENGTH &&
		username.length <= MAX_USERNAME_LENGTH
	);
}

export function isValidTime(time: string): boolean {
	return REGEX_PATTERNS.TIME_24H.test(time);
}

export function isValidUUID(uuid: string): boolean {
	return REGEX_PATTERNS.UUID.test(uuid);
}

export function isValidInviteCode(code: string): boolean {
	return REGEX_PATTERNS.INVITE_CODE.test(code);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getMaxFileSizeLabel(bytes: number): string {
	return formatFileSize(bytes);
}

export function getEventCategoryLabel(category: EventCategory): string {
	return EVENT_CATEGORY_LABELS[category] || category;
}

export function getEventCategoryIcon(category: EventCategory): string {
	return EVENT_CATEGORY_ICONS[category] || '📅';
}

// ==========================================
// API ENDPOINT BUILDERS
// ==========================================

export const API_ENDPOINTS = {
	// Auth
	AUTH: {
		REGISTER: `${API_BASE_URL}/auth/register`,
		LOGIN: `${API_BASE_URL}/auth/login`,
		LOGOUT: `${API_BASE_URL}/auth/logout`,
		ME: `${API_BASE_URL}/auth/me`,
		VALIDATE_SESSION: `${API_BASE_URL}/auth/validate-session`
	},
	
	// Users
	USERS: {
		GET: (id: string) => `${API_BASE_URL}/users/${id}`,
		UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
		DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
		STATISTICS: (id: string) => `${API_BASE_URL}/users/${id}/statistics`,
		EVENTS: (id: string) => `${API_BASE_URL}/users/${id}/events`,
		IMAGES: (id: string) => `${API_BASE_URL}/users/${id}/images`,
		LIKED_IMAGES: (id: string) => `${API_BASE_URL}/users/${id}/liked-images`
	},
	
	// Events
	EVENTS: {
		LIST: `${API_BASE_URL}/events`,
		CREATE: `${API_BASE_URL}/events`,
		GET: (id: string) => `${API_BASE_URL}/events/${id}`,
		UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
		DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,
		JOIN: (id: string) => `${API_BASE_URL}/events/${id}/join`,
		LEAVE: (id: string) => `${API_BASE_URL}/events/${id}/leave`,
		PARTICIPANTS: (id: string) => `${API_BASE_URL}/events/${id}/participants`,
		IMAGES: (id: string) => `${API_BASE_URL}/events/${id}/images`,
		STATISTICS: (id: string) => `${API_BASE_URL}/events/${id}/statistics`,
		JOIN_BY_CODE: `${API_BASE_URL}/events/join-by-code`,
		VALIDATE_INVITE: `${API_BASE_URL}/events/validate-invite`
	},
	
	// Images
	IMAGES: {
		LIST: `${API_BASE_URL}/images`,
		CREATE: `${API_BASE_URL}/images`,
		GET: (id: string) => `${API_BASE_URL}/images/${id}`,
		UPDATE: (id: string) => `${API_BASE_URL}/images/${id}`,
		DELETE: (id: string) => `${API_BASE_URL}/images/${id}`,
		LIKE: (id: string) => `${API_BASE_URL}/images/${id}/like`,
		UNLIKE: (id: string) => `${API_BASE_URL}/images/${id}/unlike`,
		LIKES: (id: string) => `${API_BASE_URL}/images/${id}/likes`,
		BULK_DELETE: `${API_BASE_URL}/images/bulk-delete`
	},
	
	// Comments
	COMMENTS: {
		LIST: `${API_BASE_URL}/comments`,
		CREATE: `${API_BASE_URL}/comments`,
		GET: (id: string) => `${API_BASE_URL}/comments/${id}`,
		UPDATE: (id: string) => `${API_BASE_URL}/comments/${id}`,
		DELETE: (id: string) => `${API_BASE_URL}/comments/${id}`,
		BY_IMAGE: (imageId: string) => `${API_BASE_URL}/images/${imageId}/comments`
	},
	
	// Gallery
	GALLERY: {
		FEATURED: `${API_BASE_URL}/gallery/featured`,
		RECENT: `${API_BASE_URL}/gallery/recent`,
		POPULAR: `${API_BASE_URL}/gallery/popular`,
		STATS: `${API_BASE_URL}/gallery/stats`
	},
	
	// Search
	SEARCH: `${API_BASE_URL}/search`,
	
	// Activity
	ACTIVITY: {
		FEED: `${API_BASE_URL}/activity/feed`,
		USER: (userId: string) => `${API_BASE_URL}/activity/user/${userId}`
	},
	
	// Upload
	UPLOAD: {
		PRESIGNED_URL: `${API_BASE_URL}/upload/presigned-url`
	},
	
	// Health
	HEALTH: {
		CHECK: `${API_BASE_URL}/health`,
		DATABASE: `${API_BASE_URL}/health/db`
	}
} as const;

