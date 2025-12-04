# API Contracts Documentation

Esta documentación describe los contratos de información (tipos TypeScript) para la API de Event Gallery.

## Archivos Incluidos

### 1. `api-contracts.ts`
Contiene todas las interfaces y tipos base para la API.

### 2. `api-routes.ts`
Define los contratos específicos para cada endpoint de la API, organizados por namespaces.

### 3. `api-examples.ts`
Proporciona ejemplos prácticos de cómo usar los contratos en código real.

---

## Estructura de Datos Principal

### User (Usuario)
```typescript
interface User {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}
```

### Event (Evento)
```typescript
interface Event {
    id: string; // UUID
    name: string;
    description: string | null;
    date: string; // ISO 8601
    time: string | null; // HH:MM
    location: string;
    category: EventCategory;
    isPrivate: boolean;
    maxParticipants: number | null;
    coverImageUrl: string | null;
    coverImageKey: string | null;
    inviteCode: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}
```

### Image (Imagen)
```typescript
interface Image {
    id: string; // UUID
    eventId: string;
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
    uploadedAt: string;
}
```

### Comment (Comentario)
```typescript
interface Comment {
    id: string; // UUID
    imageId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
```

---

## Endpoints de la API

### Autenticación

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Request Body:**
```typescript
{
    email: string;
    username: string;
    password: string;
    fullName?: string;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        user: User;
        sessionId: string;
    };
    error?: ApiError;
}
```

#### POST `/api/auth/login`
Inicia sesión de un usuario.

**Request Body:**
```typescript
{
    email: string;
    password: string;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        user: User;
        sessionId: string;
    };
    error?: ApiError;
}
```

#### POST `/api/auth/logout`
Cierra la sesión del usuario actual.

**Response:**
```typescript
{
    success: boolean;
    data?: { message: string };
    error?: ApiError;
}
```

#### GET `/api/auth/me`
Obtiene la información del usuario autenticado.

**Response:**
```typescript
{
    success: boolean;
    data?: User;
    error?: ApiError;
}
```

---

### Eventos

#### GET `/api/events`
Lista todos los eventos con filtros opcionales.

**Query Parameters:**
```typescript
{
    category?: EventCategory;
    isPrivate?: boolean;
    search?: string;
    startDate?: string; // ISO 8601
    endDate?: string; // ISO 8601
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        data: EventWithStats[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
    error?: ApiError;
}
```

#### POST `/api/events`
Crea un nuevo evento.

**Request Body:**
```typescript
{
    name: string;
    description?: string;
    date: string; // ISO 8601
    time?: string; // HH:MM
    location: string;
    category: EventCategory;
    isPrivate?: boolean;
    maxParticipants?: number;
    coverImage?: File;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: EventDetail;
    error?: ApiError;
}
```

#### GET `/api/events/:id`
Obtiene los detalles de un evento específico.

**Response:**
```typescript
{
    success: boolean;
    data?: EventDetail;
    error?: ApiError;
}
```

#### PATCH `/api/events/:id`
Actualiza un evento existente.

**Request Body:**
```typescript
{
    name?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    category?: EventCategory;
    isPrivate?: boolean;
    maxParticipants?: number;
    coverImage?: File;
}
```

#### DELETE `/api/events/:id`
Elimina un evento.

**Response:**
```typescript
{
    success: boolean;
    data?: { message: string };
    error?: ApiError;
}
```

#### POST `/api/events/:id/join`
Unirse a un evento.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        event: EventDetail;
        message: string;
    };
    error?: ApiError;
}
```

#### POST `/api/events/join-by-code`
Unirse a un evento usando un código de invitación.

**Request Body:**
```typescript
{
    inviteCode: string;
}
```

#### DELETE `/api/events/:id/leave`
Salir de un evento.

#### GET `/api/events/:id/participants`
Obtiene la lista de participantes de un evento.

**Response:**
```typescript
{
    success: boolean;
    data?: ParticipantWithUser[];
    error?: ApiError;
}
```

#### GET `/api/events/:id/images`
Obtiene las imágenes de un evento específico.

**Query Parameters:** igual que `GET /api/images`

#### POST `/api/events/validate-invite`
Valida un código de invitación.

**Request Body:**
```typescript
{
    inviteCode: string;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        valid: boolean;
        event?: EventWithStats;
        canJoin?: boolean;
        reason?: string;
    };
    error?: ApiError;
}
```

---

### Imágenes

#### GET `/api/images`
Lista todas las imágenes con filtros opcionales.

**Query Parameters:**
```typescript
{
    eventId?: string;
    userId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
```

#### POST `/api/images`
Sube una nueva imagen.

**Request Body (FormData):**
```typescript
{
    eventId: string;
    title?: string;
    description?: string;
    image: File;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        image: ImageWithStats;
        message: string;
    };
    error?: ApiError;
}
```

#### GET `/api/images/:id`
Obtiene los detalles de una imagen específica.

**Response:**
```typescript
{
    success: boolean;
    data?: ImageDetail;
    error?: ApiError;
}
```

#### PATCH `/api/images/:id`
Actualiza los metadatos de una imagen.

**Request Body:**
```typescript
{
    title?: string;
    description?: string;
}
```

#### DELETE `/api/images/:id`
Elimina una imagen.

#### POST `/api/images/:id/like`
Dar "me gusta" a una imagen.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        liked: boolean;
        likeCount: number;
    };
    error?: ApiError;
}
```

#### DELETE `/api/images/:id/unlike`
Quitar "me gusta" de una imagen.

#### GET `/api/images/:id/likes`
Obtiene la lista de usuarios que dieron "me gusta" a una imagen.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        users: UserPublic[];
        count: number;
    };
    error?: ApiError;
}
```

#### POST `/api/images/bulk-delete`
Elimina múltiples imágenes a la vez.

**Request Body:**
```typescript
{
    imageIds: string[]; // Array of UUIDs
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        deletedCount: number;
        failedIds: string[];
        message: string;
    };
    error?: ApiError;
}
```

---

### Comentarios

#### GET `/api/comments`
Lista comentarios con filtros opcionales.

**Query Parameters:**
```typescript
{
    imageId?: string;
    userId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
```

#### POST `/api/comments`
Crea un nuevo comentario.

**Request Body:**
```typescript
{
    imageId: string;
    content: string;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        comment: CommentWithUser;
        message: string;
    };
    error?: ApiError;
}
```

#### GET `/api/comments/:id`
Obtiene un comentario específico.

#### PATCH `/api/comments/:id`
Actualiza un comentario.

**Request Body:**
```typescript
{
    content: string;
}
```

#### DELETE `/api/comments/:id`
Elimina un comentario.

#### GET `/api/images/:imageId/comments`
Obtiene todos los comentarios de una imagen específica.

---

### Búsqueda

#### GET `/api/search`
Busca en eventos, imágenes y usuarios.

**Query Parameters:**
```typescript
{
    q: string; // search query
    type?: 'events' | 'images' | 'users' | 'all';
    page?: number;
    limit?: number;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        events: EventWithStats[];
        images: ImageWithStats[];
        users: UserPublic[];
        total: number;
    };
    error?: ApiError;
}
```

---

### Galería

#### GET `/api/gallery/featured`
Obtiene imágenes destacadas.

**Query Parameters:**
```typescript
{
    limit?: number;
}
```

#### GET `/api/gallery/recent`
Obtiene imágenes recientes.

#### GET `/api/gallery/popular`
Obtiene imágenes populares (más likes).

#### GET `/api/gallery/stats`
Obtiene estadísticas generales de la galería.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        totalEvents: number;
        totalImages: number;
        totalUsers: number;
        totalLikes: number;
        totalComments: number;
    };
    error?: ApiError;
}
```

---

### Actividad

#### GET `/api/activity/feed`
Obtiene el feed de actividad.

**Query Parameters:**
```typescript
{
    page?: number;
    limit?: number;
    userId?: string;
    eventId?: string;
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        activities: Activity[];
        hasMore: boolean;
    };
    error?: ApiError;
}
```

#### GET `/api/activity/user/:userId`
Obtiene la actividad de un usuario específico.

---

### Usuarios

#### GET `/api/users/:id`
Obtiene el perfil público de un usuario.

**Response:**
```typescript
{
    success: boolean;
    data?: UserPublic;
    error?: ApiError;
}
```

#### PATCH `/api/users/:id`
Actualiza el perfil del usuario.

**Request Body:**
```typescript
{
    fullName?: string;
    avatarUrl?: string;
}
```

#### DELETE `/api/users/:id`
Elimina una cuenta de usuario.

#### GET `/api/users/:id/statistics`
Obtiene estadísticas del usuario.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        userId: string;
        username: string;
        email: string;
        eventsCreated: number;
        eventsJoined: number;
        imagesUploaded: number;
        imagesLiked: number;
    };
    error?: ApiError;
}
```

#### GET `/api/users/:id/events`
Obtiene los eventos creados por un usuario.

#### GET `/api/users/:id/images`
Obtiene las imágenes subidas por un usuario.

#### GET `/api/users/:id/liked-images`
Obtiene las imágenes que le gustan a un usuario.

---

### Upload (S3 Presigned URLs)

#### POST `/api/upload/presigned-url`
Obtiene una URL pre-firmada para subir archivos directamente a S3.

**Request Body:**
```typescript
{
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadType: 'event-cover' | 'image' | 'avatar';
    eventId?: string; // required for event-cover and image
}
```

**Response:**
```typescript
{
    success: boolean;
    data?: {
        uploadUrl: string;
        fileUrl: string;
        fileKey: string;
        expiresIn: number;
    };
    error?: ApiError;
}
```

---

### Health Check

#### GET `/api/health`
Verifica el estado de la API.

**Response:**
```typescript
{
    success: boolean;
    data?: {
        status: 'ok' | 'error';
        timestamp: string;
        database: 'connected' | 'disconnected';
        s3: 'connected' | 'disconnected';
        uptime: number;
    };
    error?: ApiError;
}
```

#### GET `/api/health/db`
Verifica el estado de la base de datos.

---

## Tipos de Categorías de Eventos

```typescript
type EventCategory = 
    | 'wedding'      // Bodas
    | 'birthday'     // Cumpleaños
    | 'conference'   // Conferencias
    | 'music'        // Eventos musicales
    | 'sports'       // Eventos deportivos
    | 'art'          // Eventos artísticos
    | 'corporate'    // Eventos corporativos
    | 'other';       // Otros
```

---

## Manejo de Errores

Todas las respuestas de error siguen este formato:

```typescript
{
    success: false;
    error: {
        error: string;        // Error type
        message: string;      // Human-readable message
        statusCode: number;   // HTTP status code
        details?: {           // Validation errors (opcional)
            [field: string]: string[];
        };
    };
}
```

### Códigos de Error Comunes

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (p.ej., email ya existe)
- `413` - Payload Too Large (archivo muy grande)
- `422` - Unprocessable Entity (error de validación)
- `500` - Internal Server Error

### Ejemplo de Error de Validación

```json
{
    "success": false,
    "error": {
        "error": "ValidationError",
        "message": "Validation failed",
        "statusCode": 422,
        "details": {
            "name": ["Name is required", "Name must be less than 255 characters"],
            "email": ["Email format is invalid"]
        }
    }
}
```

---

## Paginación

Todas las respuestas paginadas incluyen:

```typescript
{
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
```

### Parámetros de Paginación

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 20, max: 100)
- `sortBy` - Campo para ordenar
- `sortOrder` - Orden: 'asc' o 'desc' (default: 'desc')

---

## Formatos de Fecha

Todas las fechas usan el formato **ISO 8601**:

```typescript
// Ejemplo: "2025-11-20T18:30:00Z"
// Ejemplo con timezone: "2025-11-20T18:30:00-05:00"

date: string; // ISO 8601 timestamp
```

### Formato de Hora

Las horas se almacenan en formato **HH:MM** (24 horas):

```typescript
time: string; // "18:30", "09:00", "23:45"
```

---

## Autenticación

La API utiliza **sesiones basadas en cookies**.

### Headers Requeridos

Para endpoints protegidos, la cookie de sesión debe incluirse automáticamente:

```typescript
// El navegador envía automáticamente la cookie de sesión
fetch('/api/events', {
    credentials: 'include' // Importante para incluir cookies
});
```

---

## Subida de Archivos

### Método 1: Upload Directo (FormData)

```typescript
const formData = new FormData();
formData.append('eventId', eventId);
formData.append('image', fileInput.files[0]);
formData.append('title', 'Mi Foto');

fetch('/api/images', {
    method: 'POST',
    body: formData,
    credentials: 'include'
});
```

### Método 2: Presigned URLs (Recomendado para archivos grandes)

```typescript
// 1. Obtener URL pre-firmada
const { uploadUrl, fileUrl, fileKey } = await fetch('/api/upload/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        fileName: 'photo.jpg',
        fileType: 'image/jpeg',
        fileSize: 1024000,
        uploadType: 'image',
        eventId: '...'
    })
}).then(r => r.json());

// 2. Subir archivo directamente a S3
await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
});

// 3. Crear registro en la base de datos
await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        eventId,
        imageUrl: fileUrl,
        imageKey: fileKey,
        title: 'Mi Foto'
    })
});
```

---

## Límites y Restricciones

- **Tamaño máximo de imagen**: 10 MB
- **Formatos de imagen permitidos**: JPEG, PNG, GIF, WEBP
- **Máximo de imágenes por evento**: Ilimitado (configurable)
- **Longitud máxima de comentario**: 2000 caracteres
- **Longitud máxima de nombre de evento**: 255 caracteres
- **Longitud máxima de username**: 50 caracteres

---

## Ejemplos de Uso

Consulta el archivo `api-examples.ts` para ver ejemplos completos de:

- Autenticación y manejo de sesiones
- Creación y actualización de eventos
- Subida y gestión de imágenes
- Sistema de likes y comentarios
- Búsqueda y filtrado
- Manejo de errores
- Paginación e infinite scroll
- Cliente API tipado

---

## Mejores Prácticas

1. **Siempre validar datos del cliente** antes de enviar
2. **Manejar errores apropiadamente** con try-catch
3. **Usar tipos TypeScript** para garantizar type-safety
4. **Implementar debouncing** para búsquedas en tiempo real
5. **Cachear respuestas** cuando sea apropiado
6. **Usar paginación** para listas grandes
7. **Incluir feedback visual** durante uploads
8. **Verificar permisos** antes de mostrar acciones

---

## Recursos Adicionales

- **Esquema de Base de Datos**: Ver `db/schema.sql`
- **Drizzle Schema**: Ver `src/lib/server/db/schema.ts`
- **Componentes Svelte**: Ver `src/lib/components/`
- **Rutas de la Aplicación**: Ver `src/routes/`

---

## Contacto y Soporte

Para preguntas o problemas con la API, consulta la documentación del proyecto o contacta al equipo de desarrollo.


