// ==========================================
// API VALIDATORS
// ==========================================
// Validation functions for API contracts
// ==========================================

import type {
	CreateUserRequest,
	CreateEventRequest,
	UpdateEventRequest,
	CreateCommentRequest,
	UpdateCommentRequest,
	UpdateUserRequest,
	UploadImageRequest,
	UpdateImageRequest,
	LoginRequest
} from './api-contracts';

import {
	MIN_USERNAME_LENGTH,
	MAX_USERNAME_LENGTH,
	MIN_PASSWORD_LENGTH,
	MAX_PASSWORD_LENGTH,
	MAX_EMAIL_LENGTH,
	MAX_EVENT_NAME_LENGTH,
	MAX_EVENT_DESCRIPTION_LENGTH,
	MAX_EVENT_LOCATION_LENGTH,
	MAX_IMAGE_TITLE_LENGTH,
	MAX_IMAGE_DESCRIPTION_LENGTH,
	MAX_COMMENT_LENGTH,
	MIN_COMMENT_LENGTH,
	MAX_FULL_NAME_LENGTH,
	MAX_IMAGE_SIZE,
	REGEX_PATTERNS,
	EVENT_CATEGORIES,
	ALLOWED_IMAGE_TYPES,
	ERROR_MESSAGES
} from './api-constants';

// ==========================================
// VALIDATION RESULT TYPE
// ==========================================

export interface ValidationResult {
	valid: boolean;
	errors: Record<string, string[]>;
}

export interface FieldValidation {
	field: string;
	errors: string[];
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function createValidationResult(errors: Record<string, string[]> = {}): ValidationResult {
	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}

function addError(errors: Record<string, string[]>, field: string, message: string): void {
	if (!errors[field]) {
		errors[field] = [];
	}
	errors[field].push(message);
}

// ==========================================
// FIELD VALIDATORS
// ==========================================

export function validateEmail(email: string | undefined): string[] {
	const errors: string[] = [];

	if (!email) {
		errors.push('El email es requerido');
		return errors;
	}

	if (email.length > MAX_EMAIL_LENGTH) {
		errors.push(`El email no puede tener más de ${MAX_EMAIL_LENGTH} caracteres`);
	}

	if (!REGEX_PATTERNS.EMAIL.test(email)) {
		errors.push(ERROR_MESSAGES.INVALID_EMAIL);
	}

	return errors;
}

export function validateUsername(username: string | undefined): string[] {
	const errors: string[] = [];

	if (!username) {
		errors.push('El nombre de usuario es requerido');
		return errors;
	}

	if (username.length < MIN_USERNAME_LENGTH) {
		errors.push(ERROR_MESSAGES.USERNAME_TOO_SHORT);
	}

	if (username.length > MAX_USERNAME_LENGTH) {
		errors.push(ERROR_MESSAGES.USERNAME_TOO_LONG);
	}

	if (!REGEX_PATTERNS.USERNAME.test(username)) {
		errors.push('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos');
	}

	return errors;
}

export function validatePassword(password: string | undefined): string[] {
	const errors: string[] = [];

	if (!password) {
		errors.push('La contraseña es requerida');
		return errors;
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		errors.push(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
	}

	if (password.length > MAX_PASSWORD_LENGTH) {
		errors.push(`La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres`);
	}

	// Check for at least one number
	if (!/\d/.test(password)) {
		errors.push('La contraseña debe contener al menos un número');
	}

	// Check for at least one letter
	if (!/[a-zA-Z]/.test(password)) {
		errors.push('La contraseña debe contener al menos una letra');
	}

	return errors;
}

export function validateFullName(fullName: string | undefined): string[] {
	const errors: string[] = [];

	if (fullName && fullName.length > MAX_FULL_NAME_LENGTH) {
		errors.push(`El nombre completo no puede tener más de ${MAX_FULL_NAME_LENGTH} caracteres`);
	}

	return errors;
}

export function validateEventName(name: string | undefined): string[] {
	const errors: string[] = [];

	if (!name || name.trim().length === 0) {
		errors.push('El nombre del evento es requerido');
		return errors;
	}

	if (name.length > MAX_EVENT_NAME_LENGTH) {
		errors.push(`El nombre del evento no puede tener más de ${MAX_EVENT_NAME_LENGTH} caracteres`);
	}

	return errors;
}

export function validateEventDescription(description: string | undefined): string[] {
	const errors: string[] = [];

	if (description && description.length > MAX_EVENT_DESCRIPTION_LENGTH) {
		errors.push(`La descripción no puede tener más de ${MAX_EVENT_DESCRIPTION_LENGTH} caracteres`);
	}

	return errors;
}

export function validateEventLocation(location: string | undefined): string[] {
	const errors: string[] = [];

	if (!location || location.trim().length === 0) {
		errors.push('La ubicación del evento es requerida');
		return errors;
	}

	if (location.length > MAX_EVENT_LOCATION_LENGTH) {
		errors.push(`La ubicación no puede tener más de ${MAX_EVENT_LOCATION_LENGTH} caracteres`);
	}

	return errors;
}

export function validateEventDate(date: string | undefined): string[] {
	const errors: string[] = [];

	if (!date) {
		errors.push('La fecha del evento es requerida');
		return errors;
	}

	const dateObj = new Date(date);
	if (isNaN(dateObj.getTime())) {
		errors.push('Formato de fecha inválido');
	}

	// Optional: check if date is in the future
	// if (dateObj < new Date()) {
	//   errors.push('La fecha del evento debe ser futura');
	// }

	return errors;
}

export function validateEventTime(time: string | undefined): string[] {
	const errors: string[] = [];

	if (time && !REGEX_PATTERNS.TIME_24H.test(time)) {
		errors.push('Formato de hora inválido. Use HH:MM (formato 24 horas)');
	}

	return errors;
}

export function validateEventCategory(category: string | undefined): string[] {
	const errors: string[] = [];

	if (!category) {
		errors.push('La categoría del evento es requerida');
		return errors;
	}

	if (!EVENT_CATEGORIES.includes(category as any)) {
		errors.push('Categoría de evento inválida');
	}

	return errors;
}

export function validateMaxParticipants(maxParticipants: number | undefined): string[] {
	const errors: string[] = [];

	if (maxParticipants !== undefined) {
		if (!Number.isInteger(maxParticipants)) {
			errors.push('El número máximo de participantes debe ser un entero');
		} else if (maxParticipants < 1) {
			errors.push('El número máximo de participantes debe ser al menos 1');
		} else if (maxParticipants > 100000) {
			errors.push('El número máximo de participantes no puede exceder 100,000');
		}
	}

	return errors;
}

export function validateImageTitle(title: string | undefined): string[] {
	const errors: string[] = [];

	if (title && title.length > MAX_IMAGE_TITLE_LENGTH) {
		errors.push(`El título de la imagen no puede tener más de ${MAX_IMAGE_TITLE_LENGTH} caracteres`);
	}

	return errors;
}

export function validateImageDescription(description: string | undefined): string[] {
	const errors: string[] = [];

	if (description && description.length > MAX_IMAGE_DESCRIPTION_LENGTH) {
		errors.push(`La descripción de la imagen no puede tener más de ${MAX_IMAGE_DESCRIPTION_LENGTH} caracteres`);
	}

	return errors;
}

export function validateImageFile(file: File | undefined): string[] {
	const errors: string[] = [];

	if (!file) {
		errors.push('El archivo de imagen es requerido');
		return errors;
	}

	if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
		errors.push(ERROR_MESSAGES.INVALID_IMAGE_TYPE);
	}

	if (file.size > MAX_IMAGE_SIZE) {
		errors.push(ERROR_MESSAGES.IMAGE_TOO_LARGE);
	}

	return errors;
}

export function validateCommentContent(content: string | undefined): string[] {
	const errors: string[] = [];

	if (!content || content.trim().length === 0) {
		errors.push('El contenido del comentario es requerido');
		return errors;
	}

	if (content.length < MIN_COMMENT_LENGTH) {
		errors.push(`El comentario debe tener al menos ${MIN_COMMENT_LENGTH} carácter`);
	}

	if (content.length > MAX_COMMENT_LENGTH) {
		errors.push(ERROR_MESSAGES.COMMENT_TOO_LONG);
	}

	return errors;
}

export function validateUUID(uuid: string | undefined): string[] {
	const errors: string[] = [];

	if (!uuid) {
		errors.push('El ID es requerido');
		return errors;
	}

	if (!REGEX_PATTERNS.UUID.test(uuid)) {
		errors.push('Formato de ID inválido');
	}

	return errors;
}

export function validateInviteCode(code: string | undefined): string[] {
	const errors: string[] = [];

	if (!code) {
		errors.push('El código de invitación es requerido');
		return errors;
	}

	if (!REGEX_PATTERNS.INVITE_CODE.test(code)) {
		errors.push('Formato de código de invitación inválido');
	}

	return errors;
}

// ==========================================
// REQUEST VALIDATORS
// ==========================================

export function validateLoginRequest(data: LoginRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	const emailErrors = validateEmail(data.email);
	if (emailErrors.length > 0) {
		errors.email = emailErrors;
	}

	if (!data.password) {
		errors.password = ['La contraseña es requerida'];
	}

	return createValidationResult(errors);
}

export function validateCreateUserRequest(data: CreateUserRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	const emailErrors = validateEmail(data.email);
	if (emailErrors.length > 0) {
		errors.email = emailErrors;
	}

	const usernameErrors = validateUsername(data.username);
	if (usernameErrors.length > 0) {
		errors.username = usernameErrors;
	}

	const passwordErrors = validatePassword(data.password);
	if (passwordErrors.length > 0) {
		errors.password = passwordErrors;
	}

	if (data.fullName) {
		const fullNameErrors = validateFullName(data.fullName);
		if (fullNameErrors.length > 0) {
			errors.fullName = fullNameErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateUpdateUserRequest(data: UpdateUserRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	if (data.fullName !== undefined) {
		const fullNameErrors = validateFullName(data.fullName);
		if (fullNameErrors.length > 0) {
			errors.fullName = fullNameErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateCreateEventRequest(data: CreateEventRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	const nameErrors = validateEventName(data.name);
	if (nameErrors.length > 0) {
		errors.name = nameErrors;
	}

	if (data.description) {
		const descriptionErrors = validateEventDescription(data.description);
		if (descriptionErrors.length > 0) {
			errors.description = descriptionErrors;
		}
	}

	const dateErrors = validateEventDate(data.date);
	if (dateErrors.length > 0) {
		errors.date = dateErrors;
	}

	if (data.time) {
		const timeErrors = validateEventTime(data.time);
		if (timeErrors.length > 0) {
			errors.time = timeErrors;
		}
	}

	const locationErrors = validateEventLocation(data.location);
	if (locationErrors.length > 0) {
		errors.location = locationErrors;
	}

	const categoryErrors = validateEventCategory(data.category);
	if (categoryErrors.length > 0) {
		errors.category = categoryErrors;
	}

	if (data.maxParticipants !== undefined) {
		const maxParticipantsErrors = validateMaxParticipants(data.maxParticipants);
		if (maxParticipantsErrors.length > 0) {
			errors.maxParticipants = maxParticipantsErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateUpdateEventRequest(data: UpdateEventRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	if (data.name !== undefined) {
		const nameErrors = validateEventName(data.name);
		if (nameErrors.length > 0) {
			errors.name = nameErrors;
		}
	}

	if (data.description !== undefined) {
		const descriptionErrors = validateEventDescription(data.description);
		if (descriptionErrors.length > 0) {
			errors.description = descriptionErrors;
		}
	}

	if (data.date !== undefined) {
		const dateErrors = validateEventDate(data.date);
		if (dateErrors.length > 0) {
			errors.date = dateErrors;
		}
	}

	if (data.time !== undefined) {
		const timeErrors = validateEventTime(data.time);
		if (timeErrors.length > 0) {
			errors.time = timeErrors;
		}
	}

	if (data.location !== undefined) {
		const locationErrors = validateEventLocation(data.location);
		if (locationErrors.length > 0) {
			errors.location = locationErrors;
		}
	}

	if (data.category !== undefined) {
		const categoryErrors = validateEventCategory(data.category);
		if (categoryErrors.length > 0) {
			errors.category = categoryErrors;
		}
	}

	if (data.maxParticipants !== undefined) {
		const maxParticipantsErrors = validateMaxParticipants(data.maxParticipants);
		if (maxParticipantsErrors.length > 0) {
			errors.maxParticipants = maxParticipantsErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateUploadImageRequest(
	data: Pick<UploadImageRequest, 'eventId' | 'title' | 'description'>,
	file?: File
): ValidationResult {
	const errors: Record<string, string[]> = {};

	const eventIdErrors = validateUUID(data.eventId);
	if (eventIdErrors.length > 0) {
		errors.eventId = eventIdErrors;
	}

	if (data.title) {
		const titleErrors = validateImageTitle(data.title);
		if (titleErrors.length > 0) {
			errors.title = titleErrors;
		}
	}

	if (data.description) {
		const descriptionErrors = validateImageDescription(data.description);
		if (descriptionErrors.length > 0) {
			errors.description = descriptionErrors;
		}
	}

	if (file) {
		const fileErrors = validateImageFile(file);
		if (fileErrors.length > 0) {
			errors.image = fileErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateUpdateImageRequest(data: UpdateImageRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	if (data.title !== undefined) {
		const titleErrors = validateImageTitle(data.title);
		if (titleErrors.length > 0) {
			errors.title = titleErrors;
		}
	}

	if (data.description !== undefined) {
		const descriptionErrors = validateImageDescription(data.description);
		if (descriptionErrors.length > 0) {
			errors.description = descriptionErrors;
		}
	}

	return createValidationResult(errors);
}

export function validateCreateCommentRequest(data: CreateCommentRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	const imageIdErrors = validateUUID(data.imageId);
	if (imageIdErrors.length > 0) {
		errors.imageId = imageIdErrors;
	}

	const contentErrors = validateCommentContent(data.content);
	if (contentErrors.length > 0) {
		errors.content = contentErrors;
	}

	return createValidationResult(errors);
}

export function validateUpdateCommentRequest(data: UpdateCommentRequest): ValidationResult {
	const errors: Record<string, string[]> = {};

	const contentErrors = validateCommentContent(data.content);
	if (contentErrors.length > 0) {
		errors.content = contentErrors;
	}

	return createValidationResult(errors);
}

// ==========================================
// PAGINATION VALIDATORS
// ==========================================

export function validatePaginationParams(params: {
	page?: number;
	limit?: number;
}): ValidationResult {
	const errors: Record<string, string[]> = {};

	if (params.page !== undefined) {
		if (!Number.isInteger(params.page) || params.page < 1) {
			errors.page = ['El número de página debe ser un entero positivo'];
		}
	}

	if (params.limit !== undefined) {
		if (!Number.isInteger(params.limit) || params.limit < 1) {
			errors.limit = ['El límite debe ser un entero positivo'];
		} else if (params.limit > 100) {
			errors.limit = ['El límite no puede ser mayor a 100'];
		}
	}

	return createValidationResult(errors);
}

// ==========================================
// UTILITY VALIDATORS
// ==========================================

export function sanitizeString(str: string): string {
	return str.trim().replace(/\s+/g, ' ');
}

export function sanitizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function sanitizeUsername(username: string): string {
	return username.trim().toLowerCase();
}

// ==========================================
// TYPE GUARDS WITH VALIDATION
// ==========================================

export function isValidCreateUserRequest(data: unknown): data is CreateUserRequest {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as any;
	return (
		typeof obj.email === 'string' &&
		typeof obj.username === 'string' &&
		typeof obj.password === 'string' &&
		(obj.fullName === undefined || typeof obj.fullName === 'string')
	);
}

export function isValidCreateEventRequest(data: unknown): data is CreateEventRequest {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as any;
	return (
		typeof obj.name === 'string' &&
		typeof obj.date === 'string' &&
		typeof obj.location === 'string' &&
		typeof obj.category === 'string'
	);
}

export function isValidCreateCommentRequest(data: unknown): data is CreateCommentRequest {
	if (typeof data !== 'object' || data === null) return false;
	const obj = data as any;
	return typeof obj.imageId === 'string' && typeof obj.content === 'string';
}


