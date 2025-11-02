import { pgTable, text, timestamp, boolean, integer, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  googleId: text('google_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const socialAccounts = pgTable('social_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  platform: text('platform').notNull(), // 'tiktok', 'youtube', 'linkedin', 'twitter'
  accountId: text('account_id').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const videos = pgTable('videos', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnail: text('thumbnail'),
  duration: integer('duration'),
  platforms: json('platforms').notNull(), // ['tiktok', 'youtube']
  status: text('status').notNull().default('draft'), // 'draft', 'scheduled', 'published', 'failed'
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const publications = pgTable('publications', {
  id: text('id').primaryKey(),
  videoId: text('video_id').notNull().references(() => videos.id),
  platform: text('platform').notNull(),
  platformVideoId: text('platform_video_id'),
  status: text('status').notNull(), // 'pending', 'published', 'failed'
  platformUrl: text('platform_url'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const n8nWebhooks = pgTable('n8n_webhooks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  webhookUrl: text('webhook_url').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
