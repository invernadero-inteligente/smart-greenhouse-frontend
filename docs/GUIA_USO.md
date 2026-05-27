# 📚 Guía de Uso - Smart Greenhouse Frontend

## 🎯 Descripción General

Se ha implementado completamente la capa de frontend para el sistema Smart Greenhouse. Todas las funcionalidades del backend ahora están disponibles en una interfaz web intuitiva, responsiva y visualmente atractiva.

## 🔐 Autenticación

### Login
1. Accede a `/login`
2. Ingresa tu email y contraseña
3. El token se guarda automáticamente en localStorage
4. Serás redirigido a `/panel`

### Logout
- Haz click en "Cerrar sesión" en la barra de navegación

## 🏠 Panel Principal (/panel)

Contiene un resumen del sistema con:
- Estadísticas generales
- Alertas activas
- Estado de zonas y cultivos
- Información rápida

## 📍 Gestión de Zonas (/zonas)

### Ver Zonas
- La página muestra todas las zonas en un grid de tarjetas
- Cada tarjeta muestra:
  - Nombre de la zona
  - Descripción
  - Estado (activa/inactiva)

### Crear Zona (Admin)
1. Click "+ Nueva Zona"
2. Completa:
   - **Nombre**: Ej. "Zona 1 - Tomates" (obligatorio, mín 3 caracteres)
   - **Descripción**: Texto opcional
   - **Estado**: Checkbox para zona activa
3. Click "Crear"

### Editar Zona (Admin)
1. Click "Editar" en la tarjeta de la zona
2. Modifica los campos necesarios
3. Click "Actualizar"

### Filtrar Zonas
- **Todas**: Muestra todas las zonas
- **Activas**: Solo zonas en funcionamiento
- **Inactivas**: Solo zonas desactivadas

## 🌾 Gestión de Cultivos (/cultivos)

### Ver Cultivos
- Grid de tarjetas con cada cultivo
- Muestra:
  - Nombre y variedad
  - Cantidad de plantas
  - Zona asociada
  - Estado visual (colores por estado)
  - Fecha de siembra

### Crear Cultivo (Admin)
1. Click "+ Nuevo Cultivo"
2. Completa los campos:
   - **Nombre**: Ej. "Tomate Cherry" (obligatorio)
   - **Variedad**: Ej. "Cherry" (opcional)
   - **Zona**: Selecciona de las zonas disponibles (obligatorio)
   - **Plantas**: Número de plantas
   - **Fecha Siembra**: Calendario (opcional)
   - **Estado**: 
     - Plantado
     - Creciendo
     - Cosechando
     - Cosechado
3. Click "Crear"

### Editar Cultivo
1. Click "Editar" en la tarjeta
2. Modifica los datos
3. Click "Actualizar"

### Filtrar Cultivos
- Por estado: Todos, Creciendo, Cosechando
- Por zona: Selecciona una zona para ver solo sus cultivos

## ⚙️ Gestión de Umbrales (/umbrales)

Los umbrales definen los rangos óptimos de variables ambientales para cada zona.

### Variables Disponibles
- **TEMPERATURE**: Temperatura en °C
- **AIR_HUMIDITY**: Humedad del aire en %
- **SOIL_MOISTURE**: Humedad del suelo en %
- **PH**: pH en escala
- **WATER_FLOW**: Flujo de agua en L/min
- **LUMINOSITY**: Luminosidad en lux
- **WATER_LEVEL**: Nivel de agua en cm

### Crear Umbral (Admin)
1. Click "+ Nuevo Umbral"
2. Selecciona:
   - **Zona**: Obligatorio
   - **Variable**: Tipo de medida (obligatorio)
   - **Unidad**: Se llena automáticamente según la variable
   - **Valor Mínimo**: Ej. 18 para temperatura
   - **Valor Máximo**: Ej. 30 para temperatura
3. Click "Crear"

### Filtrar Umbrales
- Haz click en los nombres de las zonas para filtrar
- Click "Todas" para ver todos los umbrales

### Ejemplo de Umbrales
```
Zona 1 - Tomates:
- Temperatura: 18°C a 30°C
- Humedad: 40% a 70%
- pH: 6.0 a 6.8
```

## 👤 Gestión de Usuarios (/admin/usuarios) - ADMIN ONLY

### Ver Usuarios
- Lista de tarjetas con cada usuario
- Muestra:
  - Nombre completo
  - Email
  - Rol
  - Estado (activo/inactivo)

### Crear Usuario
1. Click "+ Nuevo Usuario"
2. Completa:
   - **Nombre Completo**: Obligatorio
   - **Email**: Formato válido, obligatorio
   - **Contraseña**: Mínimo 8 caracteres, solo al crear
   - **Rol**:
     - Visualizador: Solo lectura
     - Técnico: Puede crear/editar datos técnicos
     - Gestor: Control completo de zonas y cultivos
     - Administrador: Acceso total al sistema
   - **Estado**: Activo/Inactivo
3. Click "Crear"

### Editar Usuario
1. Click "Editar" en la tarjeta
2. Modifica datos (el email no se puede cambiar)
3. Click "Actualizar"

### Cambiar Estado de Usuario
- Click "Desactivar" para desactivar un usuario activo
- Click "Activar" para reactivar un usuario inactivo

### Filtrar y Buscar
- **Buscador**: Por nombre o email
- **Por estado**: Activos o Inactivos
- **Por rol**: Admin, Gestor, Técnico, Visualizador

## ⚠️ Alertas (/alertas)

Muestra todas las alertas activas del sistema.

### Información de Alerta
- **Severidad**: Crítica, Advertencia, Información
- **Variable**: Qué sensor disparó la alerta
- **Zona**: Dónde ocurre
- **Valor**: El valor actual que causó la alerta
- **Mensaje**: Descripción del problema
- **Timestamp**: Cuándo ocurrió

### Resolver Alerta
- Click "Resolver" para marcar como resuelta (placeholder)

### Estados de Severidad
- 🔴 **Crítica**: Requiere acción inmediata
- 🟠 **Advertencia**: Merece atención
- 🔵 **Información**: Notificación de bajo riesgo

## 💨 Control de Actuadores (/actuadores)

Control de válvulas, bombas y otros dispositivos.

### Ver Actuadores
- Grid de tarjetas con cada actuador
- Muestra:
  - Nombre del actuador
  - Zona a la que pertenece
  - Estado actual (On/Off)
  - Última actualización

### Controlar Actuador
- Click "Encender" para activar
- Click "Apagar" para desactivar

### Estados
- 🟢 **Encendido**: Dispositivo activo
- ⚫ **Apagado**: Dispositivo inactivo

## 📦 Inventario (/inventario)

Gestión de recursos e insumos.

### Ver Inventario
- Tabla con todos los items
- Columnas:
  - Nombre
  - Categoría
  - Cantidad
  - Unidad
  - Mínimo requerido
  - Estado de stock
  - Acciones

### Categorías
- **Fertilizante**: Abonos y nutrientes
- **Pesticida**: Productos para control de plagas
- **Semillas**: Semillas de plantas
- **Herramientas**: Equipos de trabajo
- **Otro**: Otros items

### Estado de Stock
- ✓ **Ok**: Stock suficiente
- ⚠️ **Stock bajo**: Cantidad ≤ mínimo requerido

### Agregar Item
1. Click "+ Agregar Item"
2. Completa datos
3. Click "Guardar"

### Editar Item
- Click "Editar" en la fila del item

## 🎨 Tema y Diseño

### Colores
- 🟢 **Verde moss** (#2f7f3c): Primario, acciones, confirmaciones
- 🟤 **Marrón soil** (#9f6b3d): Secundario, elementos tierra
- ⚫ **Rojo oscuro** (#b43a2f): Alertas, eliminación
- ⚪ **Blanco/Grises**: Fondos y textos

### Símbolos en Navbar
- 🏠 Panel
- 📍 Zonas
- 🌾 Cultivos
- ⚙️ Umbrales
- ⚠️ Alertas
- 💨 Actuadores
- 📦 Inventario

## 📱 Uso en Móvil

Todas las páginas son completamente responsivas:
- Grids se adaptan a pantalla
- Menú admin es desplegable en móvil
- Tablas son scrollables horizontalmente
- Touch-friendly buttons y inputs

## ⌨️ Atajos Útiles

- **Enter** en formularios: Envía el formulario
- **Tab**: Navega entre campos
- **Escape**: Cierra formularios (en algunos casos)

## 🔧 Resolución de Problemas

### No puedo crear una zona
- Verifica que tengas permiso de admin
- El nombre debe tener al menos 3 caracteres

### El cultivo no se crea
- Asegúrate de seleccionar una zona
- El nombre es obligatorio

### No veo los umbrales
- Primero crea una zona
- Luego selecciona la zona para ver sus umbrales

### No puedo gestionar usuarios
- Solo los administradores pueden acceder
- Verifica tu rol de usuario

## 💡 Consejos de Uso

1. **Empieza creando zonas** antes de cultivos
2. **Establece umbrales** después de crear zonas
3. **Revisa alertas regularmente** para reaccionar rápido
4. **Mantén actualizado el inventario** para no quedarse sin recursos
5. **Crea usuarios con roles apropiados** para mejor control

## 📞 Soporte

Para problemas técnicos o sugerencias:
- Revisa la documentación del backend
- Verifica los datos en la API con herramientas como Postman

## 🚀 Próximas Versiones

Se planea agregar:
- Gráficos de tendencias en tiempo real
- Exportación de reportes en PDF/Excel
- Notificaciones push
- Integración con más sensores
- Dark mode
- Multiidioma

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 16, 2026  
**Estado**: ✅ En Producción
