# 🔐 Autenticación con Bearer Tokens

Esta aplicación utiliza **Bearer Tokens** para autenticación en lugar de cookies. El token se envía en el header `Authorization` de cada petición HTTP.

---

## 📋 Formato del Token

El token se envía en el header HTTP de la siguiente manera:

```
Authorization: Bearer <token>
```

Donde `<token>` es el valor de `sessionId` retornado por los endpoints de autenticación.

---

## 🔄 Flujo de Autenticación

### 1. Login/Registro

```typescript
// El backend retorna:
{
  "success": true,
  "data": {
    "user": { ... },
    "sessionId": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Este es el Bearer token
  }
}
```

### 2. Almacenamiento

El token se guarda automáticamente en `localStorage` con la clave `auth_token`:

```typescript
localStorage.setItem('auth_token', sessionId);
```

### 3. Uso en Peticiones

El cliente API agrega automáticamente el header en todas las peticiones:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📝 Ejemplo de Petición

### Sin el Cliente API (fetch directo):

```typescript
const token = localStorage.getItem('auth_token');

const response = await fetch('http://api.example.com/api/events', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Con el Cliente API (recomendado):

```typescript
import { apiClient } from '$lib/api';

// El token se agrega automáticamente
const response = await apiClient.getEvents();
```

---

## 🚨 Manejo de Errores

### Token Expirado (401)

Cuando el backend retorna un código 401, el cliente API:

1. Limpia el token de `localStorage`
2. Limpia el estado de autenticación
3. Dispara el evento `auth:logout`
4. El store de autenticación maneja el logout automáticamente

```typescript
// En apiClient.request()
if (response.status === 401) {
  this.setToken(null);
  removeStoredToken();
  window.dispatchEvent(new CustomEvent('auth:logout'));
}
```

---

## 🔒 Seguridad

### Buenas Prácticas

1. **HTTPS en producción**: Siempre usa HTTPS para proteger los tokens en tránsito
2. **Token expiration**: El backend debe implementar expiración de tokens
3. **Refresh tokens**: Considera usar refresh tokens para renovar tokens sin re-login
4. **Storage**: Considera `sessionStorage` en lugar de `localStorage` para mayor seguridad

### Consideraciones

- **localStorage**: Persiste entre sesiones del navegador
- **sessionStorage**: Se limpia al cerrar la pestaña
- **XSS**: Los tokens en `localStorage` son vulnerables a XSS, asegúrate de sanitizar inputs

---

## 🔄 Refresh Tokens (Opcional)

Si el backend implementa refresh tokens, puedes extender el cliente API:

```typescript
// En apiClient.ts
private async refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;
  
  const response = await fetch(`${this.baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  if (data.success && data.data) {
    this.setToken(data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
    return true;
  }
  
  return false;
}

// En request(), antes de retornar error 401:
if (response.status === 401) {
  const refreshed = await this.refreshToken();
  if (refreshed) {
    // Reintentar la petición original
    return this.request(endpoint, options);
  }
  // Si no se pudo refrescar, hacer logout
  this.setToken(null);
  removeStoredToken();
}
```

---

## 📚 Referencias

- [RFC 6750 - Bearer Token Usage](https://tools.ietf.org/html/rfc6750)
- [OAuth 2.0 Bearer Tokens](https://oauth.net/2/bearer-tokens/)
- [MDN: Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

---

**Última actualización**: 20 de noviembre de 2025


