-- ==========================================
-- Event Gallery - Seed Data
-- ==========================================
-- Datos de ejemplo para pruebas y desarrollo
-- ==========================================

BEGIN;

-- Limpiar datos existentes (cuidado en producción!)
-- TRUNCATE TABLE image_comment, image_like, image, event_participant, event, session, "user" CASCADE;

-- ==========================================
-- USERS
-- ==========================================
-- Nota: Las contraseñas están hasheadas con bcrypt
-- Password para todos: "password123"
-- Hash: $2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm

INSERT INTO "user" (id, email, username, password_hash, full_name, avatar_url) VALUES
('user-1', 'admin@eventgallery.com', 'admin', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'Admin User', 'https://i.pravatar.cc/150?img=1'),
('user-2', 'maria.garcia@example.com', 'maria_garcia', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'María García', 'https://i.pravatar.cc/150?img=5'),
('user-3', 'carlos.lopez@example.com', 'carlos_lopez', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'Carlos López', 'https://i.pravatar.cc/150?img=12'),
('user-4', 'ana.martinez@example.com', 'ana_martinez', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'Ana Martínez', 'https://i.pravatar.cc/150?img=9'),
('user-5', 'juan.perez@example.com', 'juan_perez', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'Juan Pérez', 'https://i.pravatar.cc/150?img=15'),
('user-6', 'sofia.ruiz@example.com', 'sofia_ruiz', '$2a$10$rPwVKvkqDhJCPbKvXQp.QuMSZNqWHGJVJcTVqz4qKdHqVmQGlOqJm', 'Sofía Ruiz', 'https://i.pravatar.cc/150?img=20')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- EVENTS
-- ==========================================

INSERT INTO "event" (id, name, description, date, time, location, category, is_private, max_participants, invite_code, created_by_id, cover_image_url) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Conferencia Tech 2024',
    'La mayor conferencia de tecnología del año con los mejores ponentes internacionales. Charlas sobre IA, desarrollo web, cloud computing y más.',
    '2024-12-15 09:00:00+00',
    '09:00',
    'Centro de Convenciones, Ciudad de México',
    'technology',
    false,
    500,
    'TECH2024',
    'user-1',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Cumpleaños de María',
    'Celebración del cumpleaños número 30 de María. ¡Habrá pastel, música y mucha diversión!',
    '2024-11-20 18:00:00+00',
    '18:00',
    'Salón de Fiestas "La Alegría"',
    'birthday',
    true,
    50,
    'MARIA30',
    'user-2',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&h=400&fit=crop'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Boda de Ana y Carlos',
    'Nos casamos! Acompáñanos en este día tan especial para nosotros.',
    '2025-01-10 16:00:00+00',
    '16:00',
    'Jardines "El Paraíso"',
    'wedding',
    true,
    150,
    'ANACARLOS',
    'user-3',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=400&fit=crop'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Festival de Música Rock',
    'Tres días de música en vivo con las mejores bandas de rock nacional e internacional.',
    '2024-12-01 14:00:00+00',
    '14:00',
    'Parque Central',
    'music',
    false,
    5000,
    'ROCKFEST',
    'user-4',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=400&fit=crop'
),
(
    '55555555-5555-5555-5555-555555555555',
    'Maratón Anual 2024',
    'Maratón de 42km por las principales calles de la ciudad. Categorías: 5km, 10km, 21km y 42km.',
    '2024-11-05 07:00:00+00',
    '07:00',
    'Plaza Principal',
    'sports',
    false,
    1000,
    'MARA2024',
    'user-5',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=400&fit=crop'
),
(
    '66666666-6666-6666-6666-666666666666',
    'Exposición de Arte Contemporáneo',
    'Muestra de artistas emergentes de la región. Pinturas, esculturas y arte digital.',
    '2024-11-15 10:00:00+00',
    '10:00',
    'Museo de Arte Moderno',
    'art',
    false,
    NULL,
    'ARTE2024',
    'user-6',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=400&fit=crop'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- EVENT PARTICIPANTS
-- ==========================================

INSERT INTO "event_participant" (event_id, user_id, joined_at) VALUES
-- Tech Conference
('11111111-1111-1111-1111-111111111111', 'user-1', NOW() - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111111', 'user-2', NOW() - INTERVAL '25 days'),
('11111111-1111-1111-1111-111111111111', 'user-3', NOW() - INTERVAL '20 days'),
('11111111-1111-1111-1111-111111111111', 'user-4', NOW() - INTERVAL '15 days'),
('11111111-1111-1111-1111-111111111111', 'user-5', NOW() - INTERVAL '10 days'),

-- Birthday
('22222222-2222-2222-2222-222222222222', 'user-2', NOW() - INTERVAL '20 days'),
('22222222-2222-2222-2222-222222222222', 'user-3', NOW() - INTERVAL '18 days'),
('22222222-2222-2222-2222-222222222222', 'user-4', NOW() - INTERVAL '15 days'),

-- Wedding
('33333333-3333-3333-3333-333333333333', 'user-3', NOW() - INTERVAL '60 days'),
('33333333-3333-3333-3333-333333333333', 'user-4', NOW() - INTERVAL '60 days'),
('33333333-3333-3333-3333-333333333333', 'user-1', NOW() - INTERVAL '50 days'),
('33333333-3333-3333-3333-333333333333', 'user-2', NOW() - INTERVAL '45 days'),

-- Music Festival
('44444444-4444-4444-4444-444444444444', 'user-4', NOW() - INTERVAL '25 days'),
('44444444-4444-4444-4444-444444444444', 'user-1', NOW() - INTERVAL '20 days'),
('44444444-4444-4444-4444-444444444444', 'user-5', NOW() - INTERVAL '15 days'),
('44444444-4444-4444-4444-444444444444', 'user-6', NOW() - INTERVAL '10 days'),

-- Marathon
('55555555-5555-5555-5555-555555555555', 'user-5', NOW() - INTERVAL '40 days'),
('55555555-5555-5555-5555-555555555555', 'user-1', NOW() - INTERVAL '35 days'),
('55555555-5555-5555-5555-555555555555', 'user-3', NOW() - INTERVAL '30 days'),

-- Art Exhibition
('66666666-6666-6666-6666-666666666666', 'user-6', NOW() - INTERVAL '15 days'),
('66666666-6666-6666-6666-666666666666', 'user-2', NOW() - INTERVAL '12 days'),
('66666666-6666-6666-6666-666666666666', 'user-4', NOW() - INTERVAL '10 days')

ON CONFLICT (event_id, user_id) DO NOTHING;

-- ==========================================
-- IMAGES
-- ==========================================
-- Nota: En producción, estos serían URLs de S3
-- Para demo, usamos URLs de servicios públicos

INSERT INTO "image" (id, event_id, user_id, title, description, image_url, image_key, thumbnail_url, width, height, file_size, mime_type) VALUES

-- Tech Conference Images
(
    'img-00000001-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'user-1',
    'Keynote de Apertura',
    'El CEO dando la charla inaugural sobre el futuro de la IA',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'events/11111111-1111-1111-1111-111111111111/images/img-001.jpg',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    1920,
    1080,
    2048576,
    'image/jpeg'
),
(
    'img-00000001-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'user-2',
    'Panel de Inteligencia Artificial',
    'Expertos discutiendo sobre ética en IA',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    'events/11111111-1111-1111-1111-111111111111/images/img-002.jpg',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    1920,
    1080,
    1884160,
    'image/jpeg'
),
(
    'img-00000001-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'user-3',
    'Networking Break',
    'Asistentes compartiendo ideas durante el coffee break',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    'events/11111111-1111-1111-1111-111111111111/images/img-003.jpg',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    1920,
    1280,
    2359296,
    'image/jpeg'
),

-- Birthday Images
(
    'img-00000002-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'user-2',
    'El Pastel',
    'Hermoso pastel de 3 pisos decorado con flores',
    'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
    'events/22222222-2222-2222-2222-222222222222/images/img-001.jpg',
    'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400',
    1080,
    1350,
    1677721,
    'image/jpeg'
),
(
    'img-00000002-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'user-3',
    'Brindis',
    'Todos brindando por María',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    'events/22222222-2222-2222-2222-222222222222/images/img-002.jpg',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    1920,
    1280,
    2211840,
    'image/jpeg'
),

-- Wedding Images
(
    'img-00000003-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'user-1',
    'La Ceremonia',
    'Los novios diciendo "Sí, acepto"',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'events/33333333-3333-3333-3333-333333333333/images/img-001.jpg',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
    1920,
    1280,
    2883584,
    'image/jpeg'
),
(
    'img-00000003-0000-0000-0000-000000000002',
    '33333333-3333-3333-3333-333333333333',
    'user-2',
    'Primer Baile',
    'Ana y Carlos bailando su primera canción como esposos',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
    'events/33333333-3333-3333-3333-333333333333/images/img-002.jpg',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400',
    1920,
    1280,
    2457600,
    'image/jpeg'
),

-- Music Festival Images
(
    'img-00000004-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'user-4',
    'Headliner en el Escenario Principal',
    'La banda principal encendiendo el festival',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'events/44444444-4444-4444-4444-444444444444/images/img-001.jpg',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    1920,
    1280,
    2764800,
    'image/jpeg'
),

-- Marathon Images
(
    'img-00000005-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    'user-5',
    'La Salida',
    'Miles de corredores iniciando el maratón',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    'events/55555555-5555-5555-5555-555555555555/images/img-001.jpg',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400',
    1920,
    1280,
    2621440,
    'image/jpeg'
),

-- Art Exhibition Images
(
    'img-00000006-0000-0000-0000-000000000001',
    '66666666-6666-6666-6666-666666666666',
    'user-6',
    'Galería Principal',
    'Vista de la exposición con varias obras',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'events/66666666-6666-6666-6666-666666666666/images/img-001.jpg',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    1920,
    1280,
    2097152,
    'image/jpeg'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- IMAGE LIKES
-- ==========================================

INSERT INTO "image_like" (image_id, user_id) VALUES
-- Likes for Tech Conference
('img-00000001-0000-0000-0000-000000000001', 'user-2'),
('img-00000001-0000-0000-0000-000000000001', 'user-3'),
('img-00000001-0000-0000-0000-000000000001', 'user-4'),
('img-00000001-0000-0000-0000-000000000002', 'user-1'),
('img-00000001-0000-0000-0000-000000000002', 'user-4'),
('img-00000001-0000-0000-0000-000000000003', 'user-1'),
('img-00000001-0000-0000-0000-000000000003', 'user-2'),
('img-00000001-0000-0000-0000-000000000003', 'user-5'),

-- Likes for Birthday
('img-00000002-0000-0000-0000-000000000001', 'user-3'),
('img-00000002-0000-0000-0000-000000000001', 'user-4'),
('img-00000002-0000-0000-0000-000000000002', 'user-2'),
('img-00000002-0000-0000-0000-000000000002', 'user-4'),

-- Likes for Wedding
('img-00000003-0000-0000-0000-000000000001', 'user-1'),
('img-00000003-0000-0000-0000-000000000001', 'user-2'),
('img-00000003-0000-0000-0000-000000000001', 'user-4'),
('img-00000003-0000-0000-0000-000000000002', 'user-1'),
('img-00000003-0000-0000-0000-000000000002', 'user-3'),

-- Likes for Music Festival
('img-00000004-0000-0000-0000-000000000001', 'user-1'),
('img-00000004-0000-0000-0000-000000000001', 'user-5'),
('img-00000004-0000-0000-0000-000000000001', 'user-6'),

-- Likes for Marathon
('img-00000005-0000-0000-0000-000000000001', 'user-1'),
('img-00000005-0000-0000-0000-000000000001', 'user-3'),

-- Likes for Art Exhibition
('img-00000006-0000-0000-0000-000000000001', 'user-2'),
('img-00000006-0000-0000-0000-000000000001', 'user-4')

ON CONFLICT (image_id, user_id) DO NOTHING;

-- ==========================================
-- IMAGE COMMENTS
-- ==========================================

INSERT INTO "image_comment" (image_id, user_id, content) VALUES
-- Comments on Tech Conference
('img-00000001-0000-0000-0000-000000000001', 'user-2', '¡Excelente charla! Me encantó la perspectiva sobre IA ética.'),
('img-00000001-0000-0000-0000-000000000001', 'user-3', 'Totalmente de acuerdo, muy inspirador.'),
('img-00000001-0000-0000-0000-000000000002', 'user-4', 'El panel estuvo increíble, aprendí muchísimo.'),
('img-00000001-0000-0000-0000-000000000003', 'user-1', 'Gran oportunidad para hacer networking.'),

-- Comments on Birthday
('img-00000002-0000-0000-0000-000000000001', 'user-3', '¡Qué hermoso pastel! Felicidades María 🎉'),
('img-00000002-0000-0000-0000-000000000002', 'user-4', 'Fue una fiesta inolvidable.'),

-- Comments on Wedding
('img-00000003-0000-0000-0000-000000000001', 'user-1', '¡Felicidades a los novios! Hermosa ceremonia ❤️'),
('img-00000003-0000-0000-0000-000000000002', 'user-2', 'Qué bonito momento, lloré de emoción.'),

-- Comments on Music Festival
('img-00000004-0000-0000-0000-000000000001', 'user-5', 'La mejor banda del festival sin duda 🎸'),

-- Comments on Marathon
('img-00000005-0000-0000-0000-000000000001', 'user-3', '¡Qué energía! Fue increíble participar.')

ON CONFLICT DO NOTHING;

COMMIT;

-- ==========================================
-- Verificar datos insertados
-- ==========================================

SELECT 'Users:' AS table_name, COUNT(*) AS count FROM "user"
UNION ALL
SELECT 'Events:', COUNT(*) FROM "event"
UNION ALL
SELECT 'Participants:', COUNT(*) FROM "event_participant"
UNION ALL
SELECT 'Images:', COUNT(*) FROM "image"
UNION ALL
SELECT 'Likes:', COUNT(*) FROM "image_like"
UNION ALL
SELECT 'Comments:', COUNT(*) FROM "image_comment";

-- ==========================================
-- Mostrar estadísticas
-- ==========================================

SELECT 
    'Event Statistics' AS info,
    event_name,
    participant_count,
    image_count,
    total_likes
FROM event_statistics
ORDER BY event_date;

