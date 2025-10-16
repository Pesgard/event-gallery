import { pgTable, serial, integer, text, timestamp, boolean, varchar, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== USERS & AUTH ====================

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	fullName: varchar('full_name', { length: 255 }),
	avatarUrl: text('avatar_url'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// ==================== EVENTS ====================

export const event = pgTable('event', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
	time: varchar('time', { length: 5 }), // Format: HH:MM
	location: varchar('location', { length: 255 }).notNull(),
	category: varchar('category', { length: 50 }).notNull(), // wedding, birthday, conference, etc.
	isPrivate: boolean('is_private').notNull().default(false),
	maxParticipants: integer('max_participants'),
	coverImageUrl: text('cover_image_url'), // S3 URL
	coverImageKey: text('cover_image_key'), // S3 key for deletion
	inviteCode: varchar('invite_code', { length: 20 }).notNull().unique(),
	createdById: text('created_by_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ==================== EVENT PARTICIPANTS ====================

export const eventParticipant = pgTable('event_participant', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.references(() => event.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ==================== IMAGES ====================

export const image = pgTable('image', {
	id: uuid('id').primaryKey().defaultRandom(),
	eventId: uuid('event_id')
		.notNull()
		.references(() => event.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }),
	description: text('description'),
	imageUrl: text('image_url').notNull(), // S3 URL
	imageKey: text('image_key').notNull(), // S3 key for deletion
	thumbnailUrl: text('thumbnail_url'), // S3 URL for thumbnail
	thumbnailKey: text('thumbnail_key'), // S3 key for thumbnail
	width: integer('width'),
	height: integer('height'),
	fileSize: integer('file_size'), // in bytes
	mimeType: varchar('mime_type', { length: 100 }),
	uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ==================== IMAGE LIKES ====================

export const imageLike = pgTable('image_like', {
	id: uuid('id').primaryKey().defaultRandom(),
	imageId: uuid('image_id')
		.notNull()
		.references(() => image.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	likedAt: timestamp('liked_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ==================== IMAGE COMMENTS ====================

export const imageComment = pgTable('image_comment', {
	id: uuid('id').primaryKey().defaultRandom(),
	imageId: uuid('image_id')
		.notNull()
		.references(() => image.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

// ==================== RELATIONS ====================

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	createdEvents: many(event),
	eventParticipations: many(eventParticipant),
	images: many(image),
	imageLikes: many(imageLike),
	imageComments: many(imageComment)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const eventRelations = relations(event, ({ one, many }) => ({
	creator: one(user, {
		fields: [event.createdById],
		references: [user.id]
	}),
	participants: many(eventParticipant),
	images: many(image)
}));

export const eventParticipantRelations = relations(eventParticipant, ({ one }) => ({
	event: one(event, {
		fields: [eventParticipant.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [eventParticipant.userId],
		references: [user.id]
	})
}));

export const imageRelations = relations(image, ({ one, many }) => ({
	event: one(event, {
		fields: [image.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [image.userId],
		references: [user.id]
	}),
	likes: many(imageLike),
	comments: many(imageComment)
}));

export const imageLikeRelations = relations(imageLike, ({ one }) => ({
	image: one(image, {
		fields: [imageLike.imageId],
		references: [image.id]
	}),
	user: one(user, {
		fields: [imageLike.userId],
		references: [user.id]
	})
}));

export const imageCommentRelations = relations(imageComment, ({ one }) => ({
	image: one(image, {
		fields: [imageComment.imageId],
		references: [image.id]
	}),
	user: one(user, {
		fields: [imageComment.userId],
		references: [user.id]
	})
}));

// ==================== TYPES ====================

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Event = typeof event.$inferSelect;
export type EventParticipant = typeof eventParticipant.$inferSelect;
export type Image = typeof image.$inferSelect;
export type ImageLike = typeof imageLike.$inferSelect;
export type ImageComment = typeof imageComment.$inferSelect;
