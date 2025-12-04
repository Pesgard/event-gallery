# 📋 Contratos de Información de la API - Event Gallery

## 📁 Archivos Creados

### 1. **`api-contracts.ts`** - Tipos Base
Contiene todas las interfaces y tipos principales para la API:
- ✅ **User Types** - Tipos relacionados con usuarios
- ✅ **Event Types** - Tipos de eventos y categorías
- ✅ **Image Types** - Tipos para imágenes y sus metadatos
- ✅ **Comment Types** - Tipos de comentarios
- ✅ **Like Types** - Tipos para el sistema de "me gusta"
- ✅ **Pagination Types** - Tipos para respuestas paginadas
- ✅ **Filter Types** - Tipos para filtros de búsqueda
- ✅ **Error Types** - Tipos para manejo de errores
- ✅ **Response Wrappers** - Envoltorios de respuesta estándar

### 2. **`api-routes.ts`** - Contratos de Endpoints
Define los contratos específicos para cada ruta de la API organizados por namespaces:
- 🔐 **AuthRoutes** - Autenticación y sesiones
- 👤 **UserRoutes** - Gestión de usuarios
- 📅 **EventRoutes** - CRUD de eventos
- 🖼️ **ImageRoutes** - Gestión de imágenes
- 💬 **CommentRoutes** - Sistema de comentarios
- 🔍 **SearchRoutes** - Búsqueda global
- 🎨 **GalleryRoutes** - Galería pública
- 📊 **ActivityRoutes** - Feed de actividad
- ☁️ **UploadRoutes** - Upload a S3
- ⚙️ **AdminRoutes** - Rutas administrativas
- 🏥 **HealthRoutes** - Health checks

### 3. **`api-examples.ts`** - Ejemplos de Uso
Ejemplos prácticos de implementación:
- 📝 Registro e inicio de sesión
- 🎫 Creación y actualización de eventos
- 📤 Subida de imágenes con FormData
- ❤️ Sistema de likes y comentarios
- 🔎 Búsqueda y filtrado
- 🚨 Manejo de errores
- 📄 Paginación e infinite scroll
- 🔌 Cliente API tipado completo

### 4. **`api-constants.ts`** - Constantes y Configuración
Constantes y utilidades:
- ⚙️ Configuración de la API
- 📏 Límites de archivos y texto
- 🎨 Categorías de eventos
- 🔑 Códigos de invitación
- 🍪 Configuración de sesiones
- ☁️ Estructura de S3
- 📐 Procesamiento de imágenes
- ❌ Mensajes de error
- ✅ Mensajes de éxito
- 🔢 Códigos de estado HTTP
- 🔗 Builders de endpoints
- ✔️ Funciones de validación

### 5. **`api-validators.ts`** - Validadores
Funciones de validación para todos los tipos:
- 📧 Validación de email
- 👤 Validación de username
- 🔐 Validación de contraseña
- 📅 Validación de eventos
- 🖼️ Validación de imágenes
- 💬 Validación de comentarios
- 🆔 Validación de UUIDs
- 🎫 Validación de códigos de invitación
- 📄 Validación de paginación

### 6. **`index.ts`** - Punto de Entrada
Exporta todos los tipos, rutas, constantes y validadores desde un único archivo.

### 7. **`API_CONTRACTS_README.md`** - Documentación Completa
Documentación exhaustiva de la API con:
- 📖 Descripción de todos los endpoints
- 📝 Ejemplos de request/response
- 🔍 Query parameters
- 🚨 Manejo de errores
- 📄 Paginación
- 📅 Formatos de fecha
- 🔐 Autenticación
- 📤 Subida de archivos
- 🎯 Mejores prácticas

---

## 🚀 Uso Rápido

### Importar Tipos

```typescript
// Importar tipos específicos
import type { 
  Event, 
  Image, 
  User, 
  CreateEventRequest,
  ApiResponse 
} from '$lib/types';

// Importar constantes
import { 
  API_ENDPOINTS, 
  MAX_IMAGE_SIZE, 
  EVENT_CATEGORIES 
} from '$lib/types';

// Importar validadores
import { 
  validateCreateEventRequest,
  validateEmail 
} from '$lib/types/api-validators';
```

### Ejemplo de Petición Tipada

```typescript
import type { CreateEventRequest, ApiResponse, EventDetail } from '$lib/types';
import { API_ENDPOINTS } from '$lib/types';

async function createEvent(data: CreateEventRequest): Promise<EventDetail> {
  const response = await fetch(API_ENDPOINTS.EVENTS.CREATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include'
  });

  const result: ApiResponse<EventDetail> = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Failed to create event');
  }
  
  return result.data;
}
```

### Ejemplo de Validación

```typescript
import { validateCreateEventRequest } from '$lib/types/api-validators';

const eventData = {
  name: 'Mi Evento',
  date: '2025-12-01T00:00:00Z',
  location: 'Ciudad',
  category: 'conference'
};

const validation = validateCreateEventRequest(eventData);

if (!validation.valid) {
  console.error('Errores de validación:', validation.errors);
  // validation.errors = {
  //   name: ['El nombre es muy corto'],
  //   date: ['Formato inválido']
  // }
}
```

---

## 📊 Estructura de Datos Principal

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
  id: string;
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
  id: string;
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

### Comentario
```typescript
interface Comment {
  id: string;
  imageId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔗 Endpoints Principales

### Autenticación
```
POST   /api/auth/register       - Registrar usuario
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/logout         - Cerrar sesión
GET    /api/auth/me             - Usuario actual
```

### Eventos
```
GET    /api/events              - Listar eventos
POST   /api/events              - Crear evento
GET    /api/events/:id          - Obtener evento
PATCH  /api/events/:id          - Actualizar evento
DELETE /api/events/:id          - Eliminar evento
POST   /api/events/:id/join     - Unirse a evento
DELETE /api/events/:id/leave    - Salir de evento
GET    /api/events/:id/images   - Imágenes del evento
```

### Imágenes
```
GET    /api/images              - Listar imágenes
POST   /api/images              - Subir imagen
GET    /api/images/:id          - Obtener imagen
PATCH  /api/images/:id          - Actualizar imagen
DELETE /api/images/:id          - Eliminar imagen
POST   /api/images/:id/like     - Dar like
DELETE /api/images/:id/unlike   - Quitar like
GET    /api/images/:id/likes    - Ver likes
```

### Comentarios
```
GET    /api/comments            - Listar comentarios
POST   /api/comments            - Crear comentario
GET    /api/comments/:id        - Obtener comentario
PATCH  /api/comments/:id        - Actualizar comentario
DELETE /api/comments/:id        - Eliminar comentario
```

### Otros
```
GET    /api/search              - Búsqueda global
GET    /api/gallery/featured    - Imágenes destacadas
GET    /api/gallery/recent      - Imágenes recientes
GET    /api/gallery/popular     - Imágenes populares
GET    /api/health              - Estado de la API
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

## ⚙️ Constantes Importantes

### Límites de Archivos
- **Imagen**: 10 MB
- **Avatar**: 2 MB
- **Cover Image**: 5 MB

### Formatos Permitidos
- **Imágenes**: JPEG, PNG, GIF, WEBP

### Límites de Texto
- **Username**: 3-50 caracteres
- **Password**: 8-128 caracteres
- **Email**: máx. 255 caracteres
- **Nombre de evento**: máx. 255 caracteres
- **Descripción de evento**: máx. 5000 caracteres
- **Comentario**: máx. 2000 caracteres

### Categorías de Eventos
- `wedding` - Boda 💒
- `birthday` - Cumpleaños 🎂
- `conference` - Conferencia 🎤
- `music` - Música 🎵
- `sports` - Deportes ⚽
- `art` - Arte 🎨
- `corporate` - Corporativo 💼
- `other` - Otro 📅

---

## 🎯 Características Destacadas

✅ **Type-Safety Completo** - TypeScript en toda la API  
✅ **Validación Integrada** - Validadores para todos los tipos  
✅ **Documentación Exhaustiva** - Ejemplos y guías completas  
✅ **Constantes Centralizadas** - Configuración en un solo lugar  
✅ **Manejo de Errores** - Tipos de error estructurados  
✅ **Paginación Estándar** - Interface uniforme de paginación  
✅ **Filtros Tipados** - Filtros para búsquedas avanzadas  
✅ **Cliente API** - Interface para implementar cliente tipado  
✅ **Ejemplos Prácticos** - Código de ejemplo funcional  

---

## 📚 Recursos Adicionales

- **Documentación Completa**: Ver `API_CONTRACTS_README.md`
- **Ejemplos de Código**: Ver `api-examples.ts`
- **Esquema de Base de Datos**: Ver `db/schema.sql`
- **Validadores**: Ver `api-validators.ts`
- **Constantes**: Ver `api-constants.ts`

---

## 🤝 Contribuir

Para agregar nuevos tipos o endpoints:

1. Agregar tipos base en `api-contracts.ts`
2. Agregar rutas en `api-routes.ts` usando namespaces
3. Agregar constantes en `api-constants.ts`
4. Agregar validadores en `api-validators.ts`
5. Agregar ejemplos en `api-examples.ts`
6. Actualizar documentación en `API_CONTRACTS_README.md`
7. Exportar desde `index.ts`

---

## ✨ Mejores Prácticas

1. **Siempre usar los tipos importados** para garantizar type-safety
2. **Validar datos del cliente** antes de enviar peticiones
3. **Manejar errores apropiadamente** con try-catch
4. **Usar constantes** en lugar de valores hardcoded
5. **Implementar paginación** para listas grandes
6. **Incluir credentials** en fetch para sesiones
7. **Sanitizar inputs** antes de enviar
8. **Cachear respuestas** cuando sea apropiado

---

**Creado**: 20 de noviembre de 2025  
**Versión**: 1.0.0  
**Proyecto**: Event Gallery Application


