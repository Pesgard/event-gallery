# 📋 Contratos de Información de la API - Event Gallery

## 🎯 ¿Qué son los Contratos de la API?

Los contratos de la API son definiciones TypeScript que especifican exactamente qué datos se envían y reciben en cada endpoint de la API. Esto garantiza:

- ✅ **Type Safety** - El compilador detecta errores antes de ejecutar
- ✅ **Autocompletado** - Tu editor sugiere propiedades disponibles
- ✅ **Documentación** - Los tipos sirven como documentación viva
- ✅ **Validación** - Funciones para validar datos antes de enviarlos
- ✅ **Consistencia** - Misma estructura en toda la aplicación

---

## 📁 Archivos Creados

### Ubicación: `src/lib/types/`

| Archivo | Descripción |
|---------|-------------|
| **`api-contracts.ts`** | Tipos base: User, Event, Image, Comment, etc. |
| **`api-routes.ts`** | Contratos de cada endpoint organizados por namespace |
| **`api-constants.ts`** | Constantes, límites, mensajes de error, endpoints |
| **`api-validators.ts`** | Funciones de validación para todos los tipos |
| **`api-examples.ts`** | Ejemplos de código funcional |
| **`index.ts`** | Exporta todo desde un único punto |
| **`API_CONTRACTS_README.md`** | Documentación exhaustiva en inglés |

### Ubicación: Raíz del proyecto

| Archivo | Descripción |
|---------|-------------|
| **`API_CONTRACTS_SUMMARY.md`** | Resumen visual de todos los contratos |
| **`API_WORKFLOWS.md`** | Flujos de trabajo con diagramas |
| **`CONTRATOS_API.md`** | Este archivo - Guía rápida en español |

---

## 🚀 Inicio Rápido

### 1. Importar Tipos

```typescript
// En cualquier archivo .ts o .svelte
import type { 
  Event, 
  Image, 
  User, 
  CreateEventRequest,
  ApiResponse 
} from '$lib/types';
```

### 2. Usar en Peticiones

```typescript
import { API_ENDPOINTS } from '$lib/types';
import type { CreateEventRequest, EventDetail } from '$lib/types';

const eventData: CreateEventRequest = {
  name: 'Mi Evento',
  date: '2025-12-01T00:00:00Z',
  location: 'Ciudad',
  category: 'conference'
};

const response = await fetch(API_ENDPOINTS.EVENTS.CREATE, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData),
  credentials: 'include'
});

const result: ApiResponse<EventDetail> = await response.json();
```

### 3. Validar Datos

```typescript
import { validateCreateEventRequest } from '$lib/types/api-validators';

const validation = validateCreateEventRequest(eventData);

if (!validation.valid) {
  console.error('Errores:', validation.errors);
  // validation.errors = {
  //   name: ['El nombre es requerido'],
  //   date: ['Formato de fecha inválido']
  // }
}
```

---

## 📊 Tipos Principales

### Usuario
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

### Evento
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
  inviteCode: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
```

### Imagen
```typescript
interface Image {
  id: string; // UUID
  eventId: string;
  userId: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  uploadedAt: string;
}
```

---

## 🔗 Endpoints Principales

```typescript
// Importar endpoints predefinidos
import { API_ENDPOINTS } from '$lib/types';

// Autenticación
API_ENDPOINTS.AUTH.REGISTER    // POST /api/auth/register
API_ENDPOINTS.AUTH.LOGIN       // POST /api/auth/login
API_ENDPOINTS.AUTH.LOGOUT      // POST /api/auth/logout

// Eventos
API_ENDPOINTS.EVENTS.LIST      // GET /api/events
API_ENDPOINTS.EVENTS.CREATE    // POST /api/events
API_ENDPOINTS.EVENTS.GET(id)   // GET /api/events/:id
API_ENDPOINTS.EVENTS.UPDATE(id) // PATCH /api/events/:id
API_ENDPOINTS.EVENTS.DELETE(id) // DELETE /api/events/:id
API_ENDPOINTS.EVENTS.JOIN(id)   // POST /api/events/:id/join

// Imágenes
API_ENDPOINTS.IMAGES.LIST      // GET /api/images
API_ENDPOINTS.IMAGES.CREATE    // POST /api/images
API_ENDPOINTS.IMAGES.GET(id)   // GET /api/images/:id
API_ENDPOINTS.IMAGES.LIKE(id)  // POST /api/images/:id/like
API_ENDPOINTS.IMAGES.UNLIKE(id) // DELETE /api/images/:id/unlike

// Comentarios
API_ENDPOINTS.COMMENTS.CREATE  // POST /api/comments
API_ENDPOINTS.COMMENTS.UPDATE(id) // PATCH /api/comments/:id
API_ENDPOINTS.COMMENTS.DELETE(id) // DELETE /api/comments/:id

// Búsqueda
API_ENDPOINTS.SEARCH           // GET /api/search
```

---

## 🔧 Constantes Útiles

```typescript
import { 
  MAX_IMAGE_SIZE,
  MAX_COMMENT_LENGTH,
  EVENT_CATEGORIES,
  EVENT_CATEGORY_LABELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} from '$lib/types';

// Límites
console.log(MAX_IMAGE_SIZE); // 10485760 (10 MB)
console.log(MAX_COMMENT_LENGTH); // 2000

// Categorías de eventos
console.log(EVENT_CATEGORIES); 
// ['wedding', 'birthday', 'conference', 'music', 'sports', 'art', 'corporate', 'other']

console.log(EVENT_CATEGORY_LABELS.wedding); // 'Boda'
console.log(EVENT_CATEGORY_LABELS.birthday); // 'Cumpleaños'

// Mensajes
console.log(ERROR_MESSAGES.INVALID_EMAIL); // 'Formato de email inválido'
console.log(SUCCESS_MESSAGES.EVENT_CREATED); // 'Evento creado exitosamente'
```

---

## ✅ Validadores Disponibles

```typescript
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateCreateEventRequest,
  validateUploadImageRequest,
  validateCreateCommentRequest,
  isValidEventCategory,
  isValidImageType
} from '$lib/types/api-validators';

// Validar campo individual
const emailErrors = validateEmail('user@example.com');
if (emailErrors.length > 0) {
  console.error(emailErrors);
}

// Validar objeto completo
const eventValidation = validateCreateEventRequest(eventData);
if (!eventValidation.valid) {
  console.error(eventValidation.errors);
}

// Type guards
if (isValidEventCategory('music')) {
  // TypeScript sabe que es un EventCategory válido
}
```

---

## 📦 Respuestas de la API

### Respuesta Exitosa
```typescript
{
  success: true,
  data: {
    // ... datos del recurso
  }
}
```

### Respuesta de Error
```typescript
{
  success: false,
  error: {
    error: "ValidationError",
    message: "Validation failed",
    statusCode: 422,
    details: {
      name: ["El nombre es requerido"],
      email: ["Email inválido"]
    }
  }
}
```

### Respuesta Paginada
```typescript
{
  success: true,
  data: {
    data: [...items],
    pagination: {
      currentPage: 1,
      totalPages: 10,
      totalItems: 200,
      itemsPerPage: 20,
      hasNextPage: true,
      hasPreviousPage: false
    }
  }
}
```

---

## 🎯 Ejemplos Comunes

### Crear un Evento

```typescript
import type { CreateEventRequest, EventDetail, ApiResponse } from '$lib/types';
import { validateCreateEventRequest } from '$lib/types/api-validators';
import { API_ENDPOINTS } from '$lib/types';

async function createEvent(data: CreateEventRequest): Promise<EventDetail> {
  // 1. Validar
  const validation = validateCreateEventRequest(data);
  if (!validation.valid) {
    throw new Error('Datos inválidos');
  }
  
  // 2. Enviar
  const response = await fetch(API_ENDPOINTS.EVENTS.CREATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  
  // 3. Procesar respuesta
  const result: ApiResponse<EventDetail> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Error al crear evento');
  }
  
  return result.data;
}

// Uso
const event = await createEvent({
  name: 'Tech Conference 2025',
  date: '2025-12-15T09:00:00Z',
  location: 'Convention Center',
  category: 'conference',
  isPrivate: false
});

console.log('Evento creado:', event.id);
console.log('Código de invitación:', event.inviteCode);
```

### Subir una Imagen

```typescript
import type { UploadImageResponse, ApiResponse } from '$lib/types';
import { validateImageFile } from '$lib/types/api-validators';
import { API_ENDPOINTS } from '$lib/types';

async function uploadImage(
  eventId: string,
  file: File,
  title?: string
): Promise<void> {
  // 1. Validar archivo
  const errors = validateImageFile(file);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
  
  // 2. Crear FormData
  const formData = new FormData();
  formData.append('eventId', eventId);
  formData.append('image', file);
  if (title) formData.append('title', title);
  
  // 3. Subir
  const response = await fetch(API_ENDPOINTS.IMAGES.CREATE, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  
  const result: ApiResponse<UploadImageResponse> = await response.json();
  
  if (result.success && result.data) {
    console.log('Imagen subida:', result.data.image.id);
  }
}
```

### Buscar Eventos

```typescript
import type { EventFilters, PaginatedResponse, EventWithStats } from '$lib/types';
import { API_ENDPOINTS } from '$lib/types';

async function searchEvents(filters: EventFilters) {
  const params = new URLSearchParams();
  
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  
  const response = await fetch(
    `${API_ENDPOINTS.EVENTS.LIST}?${params}`,
    { credentials: 'include' }
  );
  
  const result = await response.json();
  
  if (result.success && result.data) {
    const paginated: PaginatedResponse<EventWithStats> = result.data;
    return paginated;
  }
}

// Uso
const events = await searchEvents({
  category: 'music',
  search: 'concert',
  page: 1,
  limit: 20
});

console.log(`Total: ${events.pagination.totalItems} eventos`);
events.data.forEach(event => {
  console.log(`- ${event.name} (${event.participantCount} participantes)`);
});
```

---

## 📚 Documentación Adicional

Para información más detallada, consulta:

- **`API_CONTRACTS_README.md`** - Documentación exhaustiva de todos los endpoints
- **`API_CONTRACTS_SUMMARY.md`** - Resumen visual con ejemplos
- **`API_WORKFLOWS.md`** - Flujos de trabajo con diagramas de secuencia
- **`src/lib/types/api-examples.ts`** - Más ejemplos de código

---

## 💡 Consejos y Mejores Prácticas

### ✅ Hacer

- Usar tipos importados en todas las funciones que interactúan con la API
- Validar datos antes de enviar peticiones
- Manejar errores con try-catch y mostrar mensajes al usuario
- Usar `credentials: 'include'` en todas las peticiones autenticadas
- Implementar paginación para listas grandes
- Cachear respuestas cuando sea apropiado

### ❌ Evitar

- Hardcodear URLs de endpoints (usar `API_ENDPOINTS`)
- Enviar datos sin validar
- Ignorar errores de validación
- Usar valores mágicos (usar constantes de `api-constants.ts`)
- Cargar todos los datos de una vez (usar paginación)

---

## 🛠️ Herramientas de Desarrollo

### TypeScript IntelliSense

Los tipos te darán autocompletado en tu editor:

```typescript
import type { Event } from '$lib/types';

function displayEvent(event: Event) {
  // Tu editor sugerirá todas las propiedades disponibles
  console.log(event.name);
  console.log(event.location);
  console.log(event.date);
  // etc.
}
```

### Detección de Errores

TypeScript detectará errores antes de ejecutar:

```typescript
const event: Event = {
  name: 'Mi Evento',
  // ERROR: Falta la propiedad 'date' requerida
  location: 'Ciudad',
  // ERROR: 'categoria' no existe, debería ser 'category'
  categoria: 'conference'
};
```

---

## 📞 Soporte

Si tienes dudas sobre los contratos de la API:

1. Revisa la documentación en `API_CONTRACTS_README.md`
2. Consulta los ejemplos en `api-examples.ts`
3. Verifica los flujos de trabajo en `API_WORKFLOWS.md`
4. Busca la constante o validador en `api-constants.ts` o `api-validators.ts`

---

**Última actualización**: 20 de noviembre de 2025  
**Versión**: 1.0.0  
**Proyecto**: Event Gallery Application


