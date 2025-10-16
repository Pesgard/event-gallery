# Event Gallery - Database Documentation

## 📋 Descripción General

Esta base de datos PostgreSQL almacena toda la información de la aplicación Event Gallery. Las imágenes se almacenan en Amazon S3 y solo las referencias (URLs y keys) se guardan en la base de datos.

## 🗂️ Estructura de Tablas

### Tablas Principales

#### `user`
Almacena información de usuarios.
- **id**: TEXT (PK) - Identificador único del usuario
- **email**: VARCHAR(255) UNIQUE - Email del usuario
- **username**: VARCHAR(50) UNIQUE - Nombre de usuario
- **password_hash**: TEXT - Hash de la contraseña
- **full_name**: VARCHAR(255) - Nombre completo
- **avatar_url**: TEXT - URL del avatar (puede estar en S3)
- **created_at**: TIMESTAMP - Fecha de creación
- **updated_at**: TIMESTAMP - Fecha de última actualización

#### `session`
Gestiona sesiones de usuario.
- **id**: TEXT (PK) - Identificador de sesión
- **user_id**: TEXT (FK → user.id) - Usuario asociado
- **expires_at**: TIMESTAMP - Fecha de expiración

#### `event`
Almacena información de eventos.
- **id**: UUID (PK) - Identificador único del evento
- **name**: VARCHAR(255) - Nombre del evento
- **description**: TEXT - Descripción detallada
- **date**: TIMESTAMP - Fecha del evento
- **time**: VARCHAR(5) - Hora (formato HH:MM)
- **location**: VARCHAR(255) - Ubicación
- **category**: VARCHAR(50) - Categoría (wedding, birthday, conference, etc.)
- **is_private**: BOOLEAN - Si es privado o público
- **max_participants**: INTEGER - Límite de participantes (NULL = sin límite)
- **cover_image_url**: TEXT - URL de la imagen de portada en S3
- **cover_image_key**: TEXT - Key S3 para borrar la imagen
- **invite_code**: VARCHAR(20) UNIQUE - Código de invitación
- **created_by_id**: TEXT (FK → user.id) - Creador del evento
- **created_at**: TIMESTAMP - Fecha de creación
- **updated_at**: TIMESTAMP - Fecha de última actualización

#### `event_participant`
Relación muchos-a-muchos entre usuarios y eventos.
- **id**: UUID (PK)
- **event_id**: UUID (FK → event.id)
- **user_id**: TEXT (FK → user.id)
- **joined_at**: TIMESTAMP - Fecha de unión al evento
- **UNIQUE**: (event_id, user_id) - Un usuario solo puede unirse una vez

#### `image`
Metadatos de imágenes (archivos en S3).
- **id**: UUID (PK)
- **event_id**: UUID (FK → event.id) - Evento al que pertenece
- **user_id**: TEXT (FK → user.id) - Usuario que subió la imagen
- **title**: VARCHAR(255) - Título de la imagen
- **description**: TEXT - Descripción
- **image_url**: TEXT - URL completa de S3
- **image_key**: TEXT - Key S3 para gestionar el archivo
- **thumbnail_url**: TEXT - URL del thumbnail optimizado
- **thumbnail_key**: TEXT - Key S3 del thumbnail
- **width**: INTEGER - Ancho en píxeles
- **height**: INTEGER - Alto en píxeles
- **file_size**: INTEGER - Tamaño en bytes
- **mime_type**: VARCHAR(100) - Tipo MIME
- **uploaded_at**: TIMESTAMP - Fecha de subida

#### `image_like`
Registra "me gusta" en imágenes.
- **id**: UUID (PK)
- **image_id**: UUID (FK → image.id)
- **user_id**: TEXT (FK → user.id)
- **liked_at**: TIMESTAMP
- **UNIQUE**: (image_id, user_id) - Un like por usuario por imagen

#### `image_comment`
Comentarios en imágenes.
- **id**: UUID (PK)
- **image_id**: UUID (FK → image.id)
- **user_id**: TEXT (FK → user.id)
- **content**: TEXT - Contenido del comentario
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

## 📊 Vistas (Views)

### `event_statistics`
Estadísticas por evento:
- participant_count
- image_count
- total_likes

### `image_with_stats`
Imágenes con contadores:
- like_count
- comment_count

### `user_statistics`
Estadísticas por usuario:
- events_created
- events_joined
- images_uploaded
- images_liked

## 🔧 Funciones

### `update_updated_at_column()`
Actualiza automáticamente el campo `updated_at` cuando se modifica un registro.

### `generate_invite_code()`
Genera un código de invitación aleatorio de 8 caracteres.

### `can_user_join_event(event_id, user_id)`
Verifica si un usuario puede unirse a un evento (verifica límite y duplicados).

### `clean_expired_sessions()`
Elimina sesiones expiradas. Ejecutar periódicamente vía cron.

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- PostgreSQL 14 o superior
- Acceso a AWS S3
- Drizzle ORM (ya configurado en el proyecto)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_gallery"

# AWS S3
AWS_ACCESS_KEY_ID="tu_access_key"
AWS_SECRET_ACCESS_KEY="tu_secret_key"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="event-gallery-images"
S3_CLOUDFRONT_URL="https://d1234567890.cloudfront.net" # Opcional

# Application
PUBLIC_URL="http://localhost:5173"
```

### 3. Crear la Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE event_gallery;

# Salir
\q
```

### 4. Ejecutar Migraciones

#### Opción A: Usando el script SQL completo
```bash
psql -U username -d event_gallery -f db/schema.sql
```

#### Opción B: Usando Drizzle
```bash
# Generar migración desde el schema
pnpm db:generate

# Aplicar migración
pnpm db:push
```

### 5. Verificar la Instalación

```bash
# Abrir Drizzle Studio para visualizar la BD
pnpm db:studio
```

## ☁️ Configuración de AWS S3

### 1. Crear Bucket S3

```bash
aws s3 mb s3://event-gallery-images --region us-east-1
```

### 2. Estructura de Carpetas en S3

```
s3://event-gallery-images/
├── events/
│   ├── {event-id}/
│   │   ├── covers/
│   │   │   └── cover-{timestamp}.jpg
│   │   ├── images/
│   │   │   ├── {image-id}/
│   │   │   │   └── original-{timestamp}.jpg
│   │   └── thumbnails/
│   │       ├── {image-id}/
│   │       │   └── thumb-{timestamp}.jpg
└── avatars/
    └── {user-id}/
        └── avatar-{timestamp}.jpg
```

### 3. Configurar CORS en S3

Crea un archivo `cors-config.json`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://tudominio.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Aplicar la configuración:

```bash
aws s3api put-bucket-cors \
  --bucket event-gallery-images \
  --cors-configuration file://cors-config.json
```

### 4. Política de Bucket (Public Read)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::event-gallery-images/*"
    }
  ]
}
```

Aplicar:

```bash
aws s3api put-bucket-policy \
  --bucket event-gallery-images \
  --policy file://bucket-policy.json
```

### 5. Lifecycle Policy (Opcional)

Para optimizar costos, mueve archivos antiguos a Glacier:

```json
{
  "Rules": [
    {
      "Id": "ArchiveOldImages",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        }
      ],
      "Filter": {
        "Prefix": "events/"
      }
    }
  ]
}
```

### 6. Configurar CloudFront (Opcional pero Recomendado)

CloudFront acelera la entrega de imágenes globalmente.

```bash
# Crear distribución
aws cloudfront create-distribution \
  --origin-domain-name event-gallery-images.s3.us-east-1.amazonaws.com \
  --default-root-object index.html
```

### 7. Política IAM para la Aplicación

Crea un usuario IAM con esta política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::event-gallery-images",
        "arn:aws:s3:::event-gallery-images/*"
      ]
    }
  ]
}
```

## 🔒 Seguridad

### Mejores Prácticas

1. **Contraseñas**: Siempre hashear con bcrypt (factor 10+)
2. **Sesiones**: Limpiar sesiones expiradas regularmente
3. **S3**: Usar presigned URLs para uploads privados
4. **CORS**: Limitar origins a dominios conocidos
5. **SQL Injection**: Usar siempre queries parametrizadas (Drizzle lo hace automáticamente)

### Comando de Limpieza Regular

```sql
-- Ejecutar diariamente vía cron
SELECT clean_expired_sessions();
```

## 📈 Consultas Útiles

### Obtener eventos con estadísticas

```sql
SELECT * FROM event_statistics
WHERE event_date >= CURRENT_DATE
ORDER BY event_date ASC;
```

### Top 10 imágenes más populares

```sql
SELECT * FROM image_with_stats
ORDER BY like_count DESC
LIMIT 10;
```

### Usuarios más activos

```sql
SELECT * FROM user_statistics
ORDER BY images_uploaded DESC
LIMIT 20;
```

### Uso de almacenamiento por evento

```sql
SELECT 
    e.name,
    COUNT(i.id) AS image_count,
    ROUND(SUM(i.file_size) / 1024.0 / 1024.0, 2) AS total_size_mb
FROM event e
LEFT JOIN image i ON e.id = i.event_id
GROUP BY e.id, e.name
ORDER BY total_size_mb DESC;
```

### Encontrar imágenes huérfanas (sin evento)

```sql
SELECT * FROM image 
WHERE event_id NOT IN (SELECT id FROM event);
```

## 🛠️ Mantenimiento

### Backup

```bash
# Backup completo
pg_dump -U username event_gallery > backup_$(date +%Y%m%d).sql

# Backup solo estructura
pg_dump -U username --schema-only event_gallery > schema_backup.sql

# Backup S3
aws s3 sync s3://event-gallery-images ./s3-backup/
```

### Restaurar

```bash
# Restaurar base de datos
psql -U username event_gallery < backup_20250101.sql

# Restaurar S3
aws s3 sync ./s3-backup/ s3://event-gallery-images
```

### Optimización

```sql
-- Analizar tablas para optimizar queries
ANALYZE;

-- Reindexar
REINDEX DATABASE event_gallery;

-- Vacuum
VACUUM ANALYZE;
```

## 📞 Soporte

Para problemas o preguntas, consultar:
- Documentación de Drizzle: https://orm.drizzle.team/
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- PostgreSQL Docs: https://www.postgresql.org/docs/

## 📝 Changelog

### v1.0.0 (2025-10-16)
- ✅ Schema inicial
- ✅ Tablas: user, session, event, event_participant, image, image_like, image_comment
- ✅ Vistas: event_statistics, image_with_stats, user_statistics
- ✅ Funciones: update_updated_at_column, generate_invite_code, can_user_join_event, clean_expired_sessions
- ✅ Soporte para almacenamiento S3
- ✅ Índices optimizados

