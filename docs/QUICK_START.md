# 🚀 QUICK START - Smart Greenhouse Frontend

**5 minutos para tener el proyecto corriendo**

---

## ⚡ Setup Rápido

### Paso 1: Instalar dependencias
```bash
cd c:\Github\smart-greenhouse-frontend
npm install
```
⏱️ Tiempo: 2-3 minutos

### Paso 2: Iniciar servidor de desarrollo
```bash
npm run dev
```

Verás:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Paso 3: Abrir en navegador
- Abre http://localhost:5173
- ✅ ¡Aplicación corriendo!

---

## 🔐 Primeros Pasos

### 1. Login
- Usa credenciales del backend
- Ejemplo: admin@example.com / password

### 2. Explorar módulos
- **Panel**: Dashboard principal
- **Zonas**: Crear tu primera zona
- **Cultivos**: Agregar cultivos
- **Umbrales**: Configurar variables
- **Usuarios**: Gestionar usuarios (admin)

### 3. Crear datos de prueba

#### Crear una Zona
1. Click "Zonas" en navbar
2. Click "+ Nueva Zona"
3. Nombre: "Zona 1"
4. Descripción: "Área principal"
5. Click "Crear"

#### Crear un Cultivo
1. Click "Cultivos" en navbar
2. Click "+ Nuevo Cultivo"
3. Nombre: "Tomate"
4. Zona: "Zona 1"
5. Click "Crear"

#### Crear un Umbral
1. Click "Umbrales" en navbar
2. Click "+ Nuevo Umbral"
3. Zona: "Zona 1"
4. Variable: "TEMPERATURE"
5. Mín: 18, Máx: 30
6. Click "Crear"

---

## 📚 Documentación

### Para Usuarios
→ Lee [GUIA_USO.md](./GUIA_USO.md)

### Para Desarrolladores
→ Lee [IMPLEMENTACION_FRONTEND.md](./IMPLEMENTACION_FRONTEND.md)

### Para Integración Backend
→ Lee [INTEGRACION_BACKEND.md](./INTEGRACION_BACKEND.md)

### Resumen Técnico
→ Lee [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)

---

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar dependencias
npm ci

# Actualizar dependencias
npm update
```

---

## 📁 Estructura de Carpetas

```
src/
├── app/              # Configuración de rutas
├── hooks/            # Hooks personalizados
├── services/         # Servicios de API
├── pages/            # Páginas y componentes
│   ├── admin/       # Páginas admin
│   ├── alerts/      # Módulo alertas
│   ├── crops/       # Módulo cultivos
│   ├── zones/       # Módulo zonas
│   └── ...
└── style/            # Estilos globales
```

---

## 🎯 Funcionalidades Principales

| Módulo | URL | Admin Only | Estado |
|--------|-----|-----------|--------|
| Dashboard | /panel | No | ✅ |
| Zonas | /zonas | No | ✅ |
| Cultivos | /cultivos | No | ✅ |
| Umbrales | /umbrales | No | ✅ |
| Alertas | /alertas | No | ✅ |
| Actuadores | /actuadores | No | ✅ |
| Inventario | /inventario | No | ✅ |
| Usuarios | /admin/usuarios | **Sí** | ✅ |
| Backoffice | /backoffice | **Sí** | ✅ |

---

## 🎨 Colores del Tema

```css
/* Primario */
Verde Moss: #2f7f3c

/* Secundario */
Marrón Soil: #9f6b3d

/* Alertas */
Rojo: #b43a2f

/* Neutrales */
Blanco: #ffffff
Gris claro: #f9fcf8
Gris oscuro: #666666
```

---

## 💻 Requisitos Mínimos

- Node.js 16+
- npm 8+
- Backend corriendo en http://localhost:8080

---

## 🐛 Solucionar Problemas

### "Cannot find module"
```bash
npm install
npm run build
```

### "Port 5173 in use"
```bash
npm run dev -- --port 3000
```

### "API connection error"
- Verificar backend está corriendo
- Verificar VITE_API_URL en .env

### "Build fails"
```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## 🌐 Variables de Entorno

Crear archivo `.env` (opcional):
```env
VITE_API_URL=http://localhost:8080
```

Valor por defecto: `http://localhost:8080`

---

## ✨ Tips Rápidos

1. **Desarrollo rápido**: Usa Vite DevServer (reload automático)
2. **Debugging**: Abre DevTools (F12) → Network tab para ver API calls
3. **Estilos**: Todos usan Tailwind CSS (no CSS adicional)
4. **Componentes**: Reutilizables en carpeta `components/`
5. **Servicios**: Toda la lógica de API en carpeta `services/`

---

## 📊 Build & Production

### Build Producción
```bash
npm run build
```

Genera carpeta `dist/` lista para deploy

### Deploy Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **AWS S3**: Upload `dist/` files
- **Nginx**: Servir `dist/index.html`

---

## 🎓 Siguiente Pasos

1. ✅ Instala y corre el proyecto
2. ✅ Crea datos de prueba
3. ✅ Explora la interfaz
4. ✅ Lee [GUIA_USO.md](./GUIA_USO.md) para detalles
5. ✅ Revisa [INTEGRACION_BACKEND.md](./INTEGRACION_BACKEND.md) si desarrollas

---

## 📞 Ayuda

- Documentación: Ver archivos `.md` en la raíz
- API Details: [INTEGRACION_BACKEND.md](./INTEGRACION_BACKEND.md)
- Troubleshooting: [GUIA_USO.md](./GUIA_USO.md#-resolución-de-problemas)

---

**¡Listo para comenzar! 🎉**

```bash
npm install && npm run dev
```

Accede a: http://localhost:5173
