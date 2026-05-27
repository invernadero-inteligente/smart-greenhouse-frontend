# 🔗 Integración Frontend - Backend

## 📋 Endpoints Consumidos

### 🔐 Autenticación
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me (actual user)
```

### 📍 Zonas
```
GET /api/zones?isActive=true
GET /api/zones/{id}
POST /api/zones
PUT /api/zones/{id}
DELETE /api/zones/{id}
```

### 🌾 Cultivos
```
GET /api/crops?status=GROWING&zoneId=1
GET /api/crops/{id}
POST /api/crops
PUT /api/crops/{id}
DELETE /api/crops/{id}
```

### ⚙️ Umbrales
```
GET /api/thresholds?zoneIds[]=1&variables[]=TEMPERATURE
GET /api/thresholds/{id}
POST /api/thresholds
PUT /api/thresholds/{id}
DELETE /api/thresholds/{id}
```

### 👤 Usuarios (Admin)
```
GET /api/users
GET /api/users/{id}
POST /api/users
PUT /api/users/{id}
PATCH /api/users/{id}/status
DELETE /api/users/{id}
```

### ⚠️ Alertas (Placeholder)
```
GET /api/alerts
GET /api/alerts/{id}
PUT /api/alerts/{id}/resolve
```

### 💨 Actuadores (Placeholder)
```
GET /api/actuators
GET /api/actuators/{id}
PATCH /api/actuators/{id}
```

### 📦 Inventario (Placeholder)
```
GET /api/inventory
GET /api/inventory/{id}
POST /api/inventory
PUT /api/inventory/{id}
DELETE /api/inventory/{id}
```

## 🔑 Headers Requeridos

```javascript
Authorization: Bearer {token}
Content-Type: application/json
```

## 📝 Estructura de Requests

### Crear Zona
```json
{
  "name": "Zona 1",
  "description": "Área de cultivo principal",
  "isActive": true
}
```

### Crear Cultivo
```json
{
  "name": "Tomate",
  "variety": "Cherry",
  "zoneId": 1,
  "plantCount": 50,
  "sowingDate": "2024-05-01",
  "status": "GROWING"
}
```

### Crear Umbral
```json
{
  "zoneId": 1,
  "variable": "TEMPERATURE",
  "minValue": 18,
  "maxValue": 30
}
```

### Crear Usuario
```json
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123",
  "role": "TECHNICIAN",
  "active": true
}
```

## 📤 Estructura de Responses

### Success (201/200)
```json
{
  "id": 1,
  "name": "Zona 1",
  "description": "...",
  "isActive": true,
  "createdAt": "2024-05-01T10:30:00Z",
  "updatedAt": "2024-05-01T10:30:00Z"
}
```

### Error (400/401/403/500)
```json
{
  "message": "Descripción del error",
  "error": "BAD_REQUEST | UNAUTHORIZED | FORBIDDEN",
  "timestamp": "2024-05-01T10:30:00Z"
}
```

## 🔄 Variables de Entorno Frontend

```env
VITE_API_URL=http://localhost:8080
```

## 🛠️ Estado de Implementación

### ✅ Completado
- [x] Autenticación
- [x] Gestión de Zonas
- [x] Gestión de Cultivos
- [x] Gestión de Umbrales
- [x] Gestión de Usuarios
- [x] Componentes UI
- [x] Rutas y Navegación

### 🟡 En Progreso (Esperando Endpoints)
- [ ] Alertas (endpoints finales)
- [ ] Actuadores (endpoints finales)
- [ ] Inventario (endpoints finales)

### ⏳ Futuro
- [ ] WebSockets en tiempo real
- [ ] Sensores/IoT
- [ ] Reportes y Analytics
- [ ] Exportación de datos

## 📊 Flujo de Datos

```
Usuario → Componente React
   ↓
Hook Personalizado (useZones, useCrops, etc)
   ↓
Servicio (zoneService, cropService, etc)
   ↓
Axios Client (api.js con interceptor JWT)
   ↓
Backend Spring Boot
```

## 🔐 Autenticación

1. **Login**:
   - User entra email/contraseña
   - Backend retorna: `{ token, tokenType }`
   - Frontend guarda en: `localStorage.invernadero_auth`

2. **Requests Autenticados**:
   - Axios interceptor agrega: `Authorization: Bearer {token}`
   - Automático en todos los requests

3. **Logout**:
   - Click botón logout
   - Limpia localStorage
   - Redirige a login

## 🧪 Cómo Probar

### Test Manual en Postman

1. **Login**:
   ```
   POST http://localhost:8080/api/auth/login
   Body: {
     "email": "admin@example.com",
     "password": "password"
   }
   ```

2. **Crear Zona**:
   ```
   POST http://localhost:8080/api/zones
   Headers: Authorization: Bearer {token}
   Body: {
     "name": "Test Zone",
     "description": "Test",
     "isActive": true
   }
   ```

3. **Listar Zonas**:
   ```
   GET http://localhost:8080/api/zones
   Headers: Authorization: Bearer {token}
   ```

### Test en Frontend

1. Inicia dev server: `npm run dev`
2. Accede a http://localhost:5173
3. Login con credentials
4. Navega a las secciones
5. Prueba crear/editar/eliminar

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "axios": "^1.6.0",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x"
  }
}
```

## 🐛 Debugging

### Ver Requests en Red
- Abre DevTools (F12)
- Pestaña Network
- Filtra por XHR
- Verifica headers y responses

### Ver Local Storage
- DevTools → Application → Local Storage
- Busca: `invernadero_auth`
- Contiene: `{ token, tokenType }`

### Logs en Consola
- Cada servicio hace console.log de request/response
- Busca en console cualquier error

### Error Handling
- Todos los servicios tienen try/catch
- Usuarios ven mensajes de error amigables
- Backend devuelve descriptivo message

## 🚀 Deploy

### Build Producción
```bash
npm run build
```

### Servir Archivos Estáticos
```bash
# dist/ contiene todo lo necesario
# Sirve con nginx, apache, node, etc.
```

### Variables para Producción
```env
VITE_API_URL=https://api.example.com
```

## 📞 Soporte Técnico

Para problemas de integración:
1. Verifica que Backend esté corriendo
2. Revisa CORS está permitido
3. Comprueba token JWT es válido
4. Usa Postman para aislar problemas
5. Revisa console del navegador

## 📚 Referencias

- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [JWT Auth](https://jwt.io/)

---

**Última actualización**: Mayo 16, 2026  
**Versión**: 1.0.0
