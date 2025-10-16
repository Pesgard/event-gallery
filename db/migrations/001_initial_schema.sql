-- ==========================================
-- MIGRATION: 001 - Initial Schema
-- Date: 2025-10-16
-- Description: Create initial database schema for Event Gallery
-- ==========================================

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user table
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

CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);

-- Create session table
CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_user_id ON "session"(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON "session"(expires_at);

-- Create event table
CREATE TABLE IF NOT EXISTS "event" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time VARCHAR(5),
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    max_participants INTEGER,
    cover_image_url TEXT,
    cover_image_key TEXT,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    created_by_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_event_created_by_id ON "event"(created_by_id);
CREATE INDEX IF NOT EXISTS idx_event_date ON "event"(date);
CREATE INDEX IF NOT EXISTS idx_event_category ON "event"(category);
CREATE INDEX IF NOT EXISTS idx_event_is_private ON "event"(is_private);
CREATE INDEX IF NOT EXISTS idx_event_invite_code ON "event"(invite_code);

-- Create event_participant table
CREATE TABLE IF NOT EXISTS "event_participant" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_participant_event FOREIGN KEY (event_id) 
        REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT unique_event_participant UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_event_participant_event_id ON "event_participant"(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participant_user_id ON "event_participant"(user_id);

-- Create image table
CREATE TABLE IF NOT EXISTS "image" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    image_key TEXT NOT NULL,
    thumbnail_url TEXT,
    thumbnail_key TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_image_event FOREIGN KEY (event_id) 
        REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_image_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_image_event_id ON "image"(event_id);
CREATE INDEX IF NOT EXISTS idx_image_user_id ON "image"(user_id);
CREATE INDEX IF NOT EXISTS idx_image_uploaded_at ON "image"(uploaded_at);

-- Create image_like table
CREATE TABLE IF NOT EXISTS "image_like" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_like_image FOREIGN KEY (image_id) 
        REFERENCES "image"(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT unique_image_like UNIQUE (image_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_image_like_image_id ON "image_like"(image_id);
CREATE INDEX IF NOT EXISTS idx_image_like_user_id ON "image_like"(user_id);

-- Create image_comment table
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

CREATE INDEX IF NOT EXISTS idx_image_comment_image_id ON "image_comment"(image_id);
CREATE INDEX IF NOT EXISTS idx_image_comment_user_id ON "image_comment"(user_id);
CREATE INDEX IF NOT EXISTS idx_image_comment_created_at ON "image_comment"(created_at);

-- Create views
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

CREATE OR REPLACE VIEW image_with_stats AS
SELECT 
    i.*,
    COUNT(DISTINCT il.id) AS like_count,
    COUNT(DISTINCT ic.id) AS comment_count
FROM image i
LEFT JOIN image_like il ON i.id = il.image_id
LEFT JOIN image_comment ic ON i.id = ic.image_id
GROUP BY i.id;

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

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON "event"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_comment_updated_at BEFORE UPDATE ON "image_comment"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
    SELECT EXISTS(
        SELECT 1 FROM event_participant 
        WHERE event_id = p_event_id AND user_id = p_user_id
    ) INTO already_joined;
    
    IF already_joined THEN
        RETURN FALSE;
    END IF;
    
    SELECT max_participants INTO event_max_participants
    FROM event WHERE id = p_event_id;
    
    IF event_max_participants IS NULL THEN
        RETURN TRUE;
    END IF;
    
    SELECT COUNT(*) INTO current_participants
    FROM event_participant WHERE event_id = p_event_id;
    
    RETURN current_participants < event_max_participants;
END;
$$ LANGUAGE plpgsql;

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

COMMIT;

