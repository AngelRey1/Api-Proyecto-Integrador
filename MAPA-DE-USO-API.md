# 🎯 Mapa de Uso - API Deportes

## 📱 Flujos Principales de la Aplicación

### 🔐 1. AUTENTICACIÓN Y ONBOARDING
**Base URL:** `/api/v1/auth`

#### 👤 Registro y Login
```
POST /auth/register     - Registrar nuevo usuario
POST /auth/login        - Iniciar sesión
POST /auth/logout       - Cerrar sesión
GET  /auth/profile      - Obtener perfil actual
PUT  /auth/profile      - Actualizar perfil
```

#### 🎯 Flujo de Uso:
1. **Cliente nuevo:** `POST /auth/register` → `POST /perfil/clientes`
2. **Entrenador nuevo:** `POST /auth/register` → `POST /perfil/entrenadores` → `POST /especialidades`
3. **Login:** `POST /auth/login` → `GET /auth/profile`

---

### 🎯 2. AGENDAMIENTO PRINCIPAL (Core de la App)
**Base URL:** `/api/v1/agendamiento`

#### 🔍 Buscar y Agendar
```
GET  /agendamiento/buscar-sesiones     - Buscar entrenadores disponibles
POST /agendamiento/agendar             - Agendar nueva cita
GET  /agendamiento/mis-reservas        - Ver mis reservas
PATCH /agendamiento/reserva/:id/cancelar - Cancelar reserva
```

#### 🎯 Flujo de Uso Completo:
1. **Buscar entrenador:** `GET /agendamiento/buscar-sesiones?deporte=futbol&fecha=2025-11-05`
2. **Agendar cita:** `POST /agendamiento/agendar`
3. **Confirmar pago:** `POST /pagos` 
4. **Ver mis citas:** `GET /agendamiento/mis-reservas`
5. **Después de la sesión:** `POST /seguimiento` (reseña)

---

### 💰 3. GESTIÓN DE PAGOS
**Base URL:** `/api/v1/pagos`

#### 💳 Procesar Pagos
```
GET  /pagos                    - Listar pagos
POST /pagos                    - Procesar nuevo pago
GET  /pagos/:id                - Detalles de pago
PUT  /pagos/:id                - Actualizar pago
GET  /pagos/reserva/:reservaId - Pagos de una reserva
```

#### 🎯 Flujo de Uso:
1. **Después de agendar:** `POST /pagos` con `id_reserva`
2. **Verificar estado:** `GET /pagos/:id`
3. **Historial:** `GET /pagos?usuario_id=123`

---

### 📊 4. SEGUIMIENTO Y EVALUACIÓN
**Base URL:** `/api/v1/seguimiento` y `/api/v1/comentarios`

#### ⭐ Reseñas y Comentarios
```
GET  /seguimiento              - Ver reseñas
POST /seguimiento              - Crear reseña
GET  /seguimiento/:id          - Reseña específica
PUT  /seguimiento/:id          - Actualizar reseña
GET  /seguimiento/entrenador/:id - Reseñas de entrenador

GET  /comentarios              - Ver comentarios
POST /comentarios              - Crear comentario
```

#### 🎯 Flujo de Uso:
1. **Después de sesión:** `POST /seguimiento` (calificar entrenador)
2. **Comentar reseña:** `POST /comentarios`
3. **Ver historial:** `GET /seguimiento?cliente_id=123`

---

### 🔔 5. NOTIFICACIONES Y COMUNICACIÓN
**Base URL:** `/api/v1/notificaciones`

#### 📱 Sistema de Notificaciones
```
GET  /notificaciones           - Listar notificaciones
POST /notificaciones           - Crear notificación
PUT  /notificaciones/:id/leer  - Marcar como leída
GET  /notificaciones/no-leidas - Notificaciones pendientes
```

#### 🎯 Flujo de Uso:
1. **Ver notificaciones:** `GET /notificaciones`
2. **Marcar leída:** `PUT /notificaciones/:id/leer`
3. **Contador:** `GET /notificaciones/no-leidas`

---

### 📱 6. RETROALIMENTACIÓN DE LA APP
**Base URL:** `/api/v1/feedback`

#### 💬 Feedback y Soporte
```
GET  /feedback                 - Ver feedback
POST /feedback                 - Enviar feedback
GET  /feedback/tipo/:tipo      - Por tipo (SUGERENCIA/REPORTE_ERROR)
```

---

## 🏗️ GESTIÓN DE PERFILES Y CONFIGURACIÓN

### 👤 PERFILES DE USUARIO
**Base URLs:** `/api/v1/perfil/clientes` y `/api/v1/perfil/entrenadores`

#### 🏃‍♂️ Para Entrenadores
```
GET  /perfil/entrenadores      - Listar entrenadores
POST /perfil/entrenadores      - Crear perfil entrenador
GET  /perfil/entrenadores/:id  - Ver perfil específico
PUT  /perfil/entrenadores/:id  - Actualizar perfil

POST /especialidades           - Agregar deporte especialidad
GET  /especialidades/entrenador/:id - Ver especialidades
DELETE /especialidades/:entrenadorId/:deporteId - Quitar especialidad

GET  /disponibilidad/entrenador/:id - Ver disponibilidad
POST /disponibilidad           - Crear disponibilidad
PUT  /disponibilidad/:id       - Actualizar disponibilidad
```

#### 👥 Para Clientes
```
GET  /perfil/clientes          - Listar clientes
POST /perfil/clientes          - Crear perfil cliente
GET  /perfil/clientes/:id      - Ver perfil específico
PUT  /perfil/clientes/:id      - Actualizar perfil
```

---

## 📚 CATÁLOGOS Y CONFIGURACIÓN

### 🏆 CATÁLOGOS DEPORTIVOS
```
GET /catalogo/deportes         - Listar deportes disponibles
GET /catalogo/entrenamientos   - Tipos de entrenamientos
GET /catalogo/actividades      - Actividades personalizadas
```

---

## 🎯 CASOS DE USO PRINCIPALES

### 📱 Como Cliente - Agendar una Sesión
```
1. POST /auth/login
2. GET  /agendamiento/buscar-sesiones?deporte=yoga&fecha=2025-11-05
3. POST /agendamiento/agendar
4. POST /pagos
5. GET  /notificaciones (confirmación)
6. [Después de la sesión]
7. POST /seguimiento (reseña)
```

### 🏃‍♂️ Como Entrenador - Configurar Perfil
```
1. POST /auth/register
2. POST /perfil/entrenadores
3. POST /especialidades (agregar deportes)
4. POST /disponibilidad (configurar horarios)
5. GET  /agendamiento/mis-reservas (ver citas)
```

### 👨‍💼 Como Admin - Gestionar Catálogos
```
1. POST /catalogo/deportes
2. POST /catalogo/entrenamientos
3. GET  /feedback (ver sugerencias)
4. GET  /seguimiento (ver reseñas generales)
```

---

## 🔧 ENDPOINTS TÉCNICOS (Para Compatibilidad)

Estos endpoints mantienen la funcionalidad técnica pero no son parte del flujo principal:
- `/api/v1/sesiones` - Gestión técnica de sesiones
- `/api/v1/reservas` - Gestión técnica de reservas
- `/api/v1/horarios` - Gestión técnica de horarios

---

## 🎯 SWAGGER TESTING

En Swagger UI, los endpoints están organizados por **casos de uso reales**:

1. **🔐 Autenticación** - Registro y login
2. **🎯 Agendamiento** - Buscar y agendar citas
3. **💰 Pagos** - Procesar pagos
4. **📊 Seguimiento** - Reseñas y evaluaciones
5. **🔔 Notificaciones** - Comunicación
6. **👤 Perfiles** - Gestión de usuarios
7. **📚 Catálogos** - Configuración

Cada sección tiene los endpoints necesarios para completar el flujo de usuario correspondiente.