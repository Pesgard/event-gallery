-- ==========================================
-- EVENT GALLERY DATABASE SCHEMA
-- ==========================================
-- PostgreSQL Database Schema for Event Gallery Application
-- Images are stored in AWS S3
-- Created: 2025-10-16
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE: user
-- Stores user account information
-- ==========================================
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster email and username lookups
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);

-- ==========================================
-- TABLE: session
-- Stores user session tokens for authentication
-- ==========================================
CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_session_user_id ON "session"(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON "session"(expires_at);

-- ==========================================
-- TABLE: event
-- Stores event information
-- ==========================================
CREATE TABLE IF NOT EXISTS "event" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time VARCHAR(5), -- Format: HH:MM (24-hour format)
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- wedding, birthday, conference, music, sports, art, etc.
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    max_participants INTEGER,
    cover_image_url TEXT, -- S3 URL to the cover image
    cover_image_key TEXT, -- S3 key for deletion
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    created_by_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_created_by_id ON "event"(created_by_id);
CREATE INDEX IF NOT EXISTS idx_event_date ON "event"(date);
CREATE INDEX IF NOT EXISTS idx_event_category ON "event"(category);
CREATE INDEX IF NOT EXISTS idx_event_is_private ON "event"(is_private);
CREATE INDEX IF NOT EXISTS idx_event_invite_code ON "event"(invite_code);

-- ==========================================
-- TABLE: event_participant
-- Tracks which users have joined which events
-- ==========================================
CREATE TABLE IF NOT EXISTS "event_participant" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_participant_event FOREIGN KEY (event_id) 
        REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    -- Ensure a user can only join an event once
    CONSTRAINT unique_event_participant UNIQUE (event_id, user_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_event_participant_event_id ON "event_participant"(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participant_user_id ON "event_participant"(user_id);

-- ==========================================
-- TABLE: image
-- Stores image metadata (actual images stored in S3)
-- ==========================================
CREATE TABLE IF NOT EXISTS "image" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL, -- Full S3 URL to the image
    image_key TEXT NOT NULL, -- S3 object key for deletion
    thumbnail_url TEXT, -- S3 URL for optimized thumbnail
    thumbnail_key TEXT, -- S3 key for thumbnail
    width INTEGER,
    height INTEGER,
    file_size INTEGER, -- Size in bytes
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_image_event FOREIGN KEY (event_id) 
        REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_image_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_image_event_id ON "image"(event_id);
CREATE INDEX IF NOT EXISTS idx_image_user_id ON "image"(user_id);
CREATE INDEX IF NOT EXISTS idx_image_uploaded_at ON "image"(uploaded_at);

-- ==========================================
-- TABLE: image_like
-- Tracks which users have liked which images
-- ==========================================
CREATE TABLE IF NOT EXISTS "image_like" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_like_image FOREIGN KEY (image_id) 
        REFERENCES "image"(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    -- Ensure a user can only like an image once
    CONSTRAINT unique_image_like UNIQUE (image_id, user_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_image_like_image_id ON "image_like"(image_id);
CREATE INDEX IF NOT EXISTS idx_image_like_user_id ON "image_like"(user_id);

-- ==========================================
-- TABLE: image_comment
-- Stores comments on images
-- ==========================================
CREATE TABLE IF NOT EXISTS "image_comment" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_comment_image FOREIGN KEY (image_id) 
        REFERENCES "image"(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_image_comment_image_id ON "image_comment"(image_id);
CREATE INDEX IF NOT EXISTS idx_image_comment_user_id ON "image_comment"(user_id);
CREATE INDEX IF NOT EXISTS idx_image_comment_created_at ON "image_comment"(created_at);

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- View: Event statistics
CREATE OR REPLACE VIEW event_statistics AS
SELECT 
    e.id AS event_id,
    e.name AS event_name,
    e.date AS event_date,
    COUNT(DISTINCT ep.user_id) AS participant_count,
    COUNT(DISTINCT i.id) AS image_count,
    COUNT(DISTINCT il.id) AS total_likes
FROM event e
LEFT JOIN event_participant ep ON e.id = ep.event_id
LEFT JOIN image i ON e.id = i.event_id
LEFT JOIN image_like il ON i.id = il.image_id
GROUP BY e.id, e.name, e.date;

-- View: Image with like count
CREATE OR REPLACE VIEW image_with_stats AS
SELECT 
    i.*,
    COUNT(DISTINCT il.id) AS like_count,
    COUNT(DISTINCT ic.id) AS comment_count
FROM image i
LEFT JOIN image_like il ON i.id = il.image_id
LEFT JOIN image_comment ic ON i.id = ic.image_id
GROUP BY i.id;

-- View: User statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    COUNT(DISTINCT e.id) AS events_created,
    COUNT(DISTINCT ep.event_id) AS events_joined,
    COUNT(DISTINCT i.id) AS images_uploaded,
    COUNT(DISTINCT il.image_id) AS images_liked
FROM "user" u
LEFT JOIN event e ON u.id = e.created_by_id
LEFT JOIN event_participant ep ON u.id = ep.user_id
LEFT JOIN image i ON u.id = i.user_id
LEFT JOIN image_like il ON u.id = il.user_id
GROUP BY u.id, u.username, u.email;

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger: Update user updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update event updated_at
CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON "event"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update image_comment updated_at
CREATE TRIGGER update_image_comment_updated_at BEFORE UPDATE ON "image_comment"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user can join event
CREATE OR REPLACE FUNCTION can_user_join_event(
    p_event_id UUID,
    p_user_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    event_max_participants INTEGER;
    current_participants INTEGER;
    already_joined BOOLEAN;
BEGIN
    -- Check if user already joined
    SELECT EXISTS(
        SELECT 1 FROM event_participant 
        WHERE event_id = p_event_id AND user_id = p_user_id
    ) INTO already_joined;
    
    IF already_joined THEN
        RETURN FALSE;
    END IF;
    
    -- Get max participants
    SELECT max_participants INTO event_max_participants
    FROM event WHERE id = p_event_id;
    
    -- If no limit, user can join
    IF event_max_participants IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Count current participants
    SELECT COUNT(*) INTO current_participants
    FROM event_participant WHERE event_id = p_event_id;
    
    -- Check if there's space
    RETURN current_participants < event_max_participants;
END;
$$ LANGUAGE plpgsql;

-- Function: Clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM session WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SAMPLE DATA FOR TESTING (Optional)
-- Uncomment to populate with test data
-- ==========================================

/*
-- Insert test user
INSERT INTO "user" (id, email, username, password_hash, full_name) VALUES
('test-user-1', 'admin@eventgallery.com', 'admin', '$2a$10$hash', 'Admin User'),
('test-user-2', 'user1@example.com', 'user1', '$2a$10$hash', 'Test User 1'),
('test-user-3', 'user2@example.com', 'user2', '$2a$10$hash', 'Test User 2');

-- Insert test event
INSERT INTO "event" (name, description, date, time, location, category, invite_code, created_by_id) VALUES
('Tech Conference 2024', 'Annual technology conference', '2024-12-15 09:00:00+00', '09:00', 'Convention Center', 'conference', 'TECH2024', 'test-user-1'),
('Birthday Party', 'María''s 30th birthday celebration', '2024-11-20 18:00:00+00', '18:00', 'Home', 'birthday', 'BDAY2024', 'test-user-2');

-- Join events
INSERT INTO "event_participant" (event_id, user_id)
SELECT id, 'test-user-1' FROM "event" WHERE invite_code = 'TECH2024'
UNION ALL
SELECT id, 'test-user-2' FROM "event" WHERE invite_code = 'TECH2024';
*/

-- ==========================================
-- PERMISSIONS (Adjust as needed)
-- ==========================================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- ==========================================
-- NOTES
-- ==========================================

/*
S3 Storage Structure:
- Bucket: event-gallery-images
- Folder structure:
  - events/{event_id}/covers/{filename}
  - events/{event_id}/images/{image_id}/{filename}
  - events/{event_id}/thumbnails/{image_id}/{filename}

Recommended S3 bucket configuration:
1. Enable versioning for data protection
2. Configure lifecycle policies:
   - Delete thumbnails after 90 days of inactivity
   - Move to Glacier after 1 year
3. Enable CORS for web uploads
4. Use CloudFront for CDN distribution
5. Set up proper IAM policies for access control

Environment Variables needed:
- DATABASE_URL: PostgreSQL connection string
- AWS_ACCESS_KEY_ID: AWS access key
- AWS_SECRET_ACCESS_KEY: AWS secret key
- AWS_REGION: AWS region (e.g., us-east-1)
- S3_BUCKET_NAME: Name of the S3 bucket
- S3_CLOUDFRONT_URL: (Optional) CloudFront distribution URL
*/

-- ==========================================
-- MAINTENANCE QUERIES
-- ==========================================

-- Clean expired sessions (run daily via cron)
-- SELECT clean_expired_sessions();

-- Find orphaned S3 references (images without events)
-- SELECT * FROM image WHERE event_id NOT IN (SELECT id FROM event);

-- Get storage usage by event
-- SELECT 
--     e.name,
--     COUNT(i.id) AS image_count,
--     SUM(i.file_size) AS total_size_bytes,
--     ROUND(SUM(i.file_size) / 1024.0 / 1024.0, 2) AS total_size_mb
-- FROM event e
-- LEFT JOIN image i ON e.id = i.event_id
-- GROUP BY e.id, e.name
-- ORDER BY total_size_bytes DESC;

-- ==========================================
-- END OF SCHEMA
-- ==========================================



