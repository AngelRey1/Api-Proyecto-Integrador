# 🏋️ App Deporte - Documentación de API

## 📋 Descripción General

API REST completa para gestión de agendamiento entre clientes y entrenadores personales. Sistema profesional con autenticación JWT, gestión de pagos y sistema de reseñas.

---

## 🚀 URL Base

```
http://localhost:3000/api/v1
```

**Documentación Interactiva Swagger:**
```
http://localhost:3000/api-docs
```

---

## 🔐 Autenticación

### Tipo: Bearer Token (JWT)
- **Duración:** 24 horas
- **Formato:** `Authorization: Bearer <token>`
- **Obtención:** Login o Registro

### Roles Disponibles:
- `CLIENTE` - Usuarios que agendan sesiones
- `ENTRENADOR` - Profesionales que ofrecen servicios

---

## 🎯 FLUJO COMPLETO DE USO (PASO A PASO)

### 📌 PASO 1: Autenticación

#### 1A. Registrar Nuevo Usuario
```http
POST /api/v1/usuarios/register
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "González",
  "email": "maria.gonzalez@ejemplo.com",
  "contrasena": "password123",
  "rol": "CLIENTE"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id_usuario": 1,
      "nombre": "María",
      "apellido": "González",
      "email": "maria.gonzalez@ejemplo.com",
      "rol": "CLIENTE",
      "creado_en": "2025-11-03T14:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1B. Iniciar Sesión
```http
POST /api/v1/usuarios/login
Content-Type: application/json

{
  "email": "maria.gonzalez@ejemplo.com",
  "contrasena": "password123"
}
```

---

### 📌 PASO 2: Crear Perfil

#### 2A. Crear Perfil de Cliente
```http
POST /api/v1/clientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_usuario": 1,
  "telefono": "+52 555 1234567",
  "direccion": "Calle Principal 123, CDMX"
}
```

#### 2B. Crear Perfil de Entrenador
```http
POST /api/v1/entrenadores
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_usuario": 2,
  "especialidad": "Entrenamiento funcional",
  "experiencia": 5,
  "descripcion": "Entrenador certificado con 5 años de experiencia",
  "foto_url": "https://ejemplo.com/foto.jpg"
}
```

---

### 📌 PASO 3: Configurar Disponibilidad (Solo Entrenadores)

#### 3A. Crear Horario Semanal
```http
POST /api/v1/horarios
Authorization: Bearer <token_entrenador>
Content-Type: application/json

{
  "id_entrenador": 1,
  "dia": "LUNES",
  "hora_inicio": "09:00",
  "hora_fin": "18:00"
}
```

#### 3B. Asignar Deportes
```http
POST /api/v1/entrenador-deportes
Authorization: Bearer <token_entrenador>
Content-Type: application/json

{
  "id_entrenador": 1,
  "id_deporte": 1,
  "nivel_experiencia": "AVANZADO",
  "certificado": true
}
```

#### 3C. Crear Sesiones Disponibles
```http
POST /api/v1/sesiones
Authorization: Bearer <token_entrenador>
Content-Type: application/json

{
  "id_horario": 1,
  "fecha": "2025-11-05T10:00:00Z",
  "cupos_disponibles": 5
}
```

---

### 📌 PASO 4: Agendamiento (⭐ CORE DE LA APP)

#### 4A. Buscar Sesiones Disponibles
```http
GET /api/v1/agendamiento/buscar-sesiones?fecha=2025-11-05&especialidad=yoga
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sesiones encontradas",
  "data": [
    {
      "id_sesion": 1,
      "fecha": "2025-11-05T10:00:00Z",
      "cupos_disponibles": 5,
      "cupos_ocupados": 3,
      "entrenador": {
        "id_entrenador": 1,
        "especialidad": "Entrenamiento funcional",
        "experiencia": 5,
        "descripcion": "Entrenador certificado",
        "usuario": {
          "nombre": "Juan",
          "apellido": "Pérez"
        }
      }
    }
  ]
}
```

#### 4B. Agendar Cita (⭐ ENDPOINT PRINCIPAL)
```http
POST /api/v1/agendamiento/agendar
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "sesion_id": 1,
  "fecha_hora": "2025-11-05T10:00:00Z",
  "notas": "Primera sesión. Tengo experiencia previa en gimnasio."
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reserva agendada exitosamente",
  "data": {
    "id_reserva": 15,
    "cliente": {
      "id_cliente": 5,
      "nombre": "María",
      "apellido": "González",
      "telefono": "+52 555 1234567"
    },
    "sesion": {
      "id_sesion": 1,
      "fecha": "2025-11-05T10:00:00Z",
      "cupos_disponibles": 4,
      "entrenador": {
        "id_entrenador": 1,
        "especialidad": "Entrenamiento funcional",
        "nombre": "Juan",
        "apellido": "Pérez"
      }
    },
    "estado": "PENDIENTE",
    "fecha_reserva": "2025-11-03T14:30:00Z",
    "notas": "Primera sesión. Tengo experiencia previa en gimnasio.",
    "codigo_confirmacion": "RES-2025110315"
  }
}
```

#### 4C. Ver Mis Reservas
```http
GET /api/v1/agendamiento/mis-reservas
Authorization: Bearer <token_cliente>
```

#### 4D. Cancelar Reserva
```http
PATCH /api/v1/agendamiento/reserva/15/cancelar
Authorization: Bearer <token_cliente>
```

---

### 📌 PASO 5: Procesar Pago

```http
POST /api/v1/pagos
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "id_reserva": 15,
  "monto": 350.00,
  "metodo_pago": "tarjeta",
  "referencia_pago": "TXN-20251103-ABC123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Pago registrado exitosamente",
  "data": {
    "id_pago": 8,
    "id_reserva": 15,
    "monto": 350.00,
    "metodo_pago": "tarjeta",
    "estado_pago": "COMPLETADO",
    "fecha_pago": "2025-11-03T15:00:00Z",
    "comprobante_url": "https://storage.ejemplo.com/comprobantes/pago-8.pdf"
  }
}
```

---

### 📌 PASO 6: Dejar Reseña (Después de la Sesión)

```http
POST /api/v1/resenas
Authorization: Bearer <token_cliente>
Content-Type: application/json

{
  "id_entrenador": 1,
  "id_cliente": 5,
  "calificacion": 5,
  "comentario": "Excelente entrenador, muy profesional y atento."
}
```

---

## 📊 MAPA COMPLETO DE RUTAS

### 🔐 Autenticación (Sin token requerido)
- `POST /usuarios/register` - Registrar usuario
- `POST /usuarios/login` - Iniciar sesión
- `GET /usuarios` - Listar usuarios (con token)
- `GET /usuarios/{id}` - Ver usuario específico (con token)

### 👤 Perfiles (Requieren token)
- `POST /clientes` - Crear perfil de cliente
- `GET /clientes` - Listar clientes
- `GET /clientes/{id}` - Ver cliente
- `PUT /clientes/{id}` - Actualizar cliente
- `DELETE /clientes/{id}` - Eliminar cliente

- `POST /entrenadores` - Crear perfil de entrenador
- `GET /entrenadores` - Listar entrenadores
- `GET /entrenadores/{id}` - Ver entrenador
- `PUT /entrenadores/{id}` - Actualizar entrenador
- `DELETE /entrenadores/{id}` - Eliminar entrenador

### 🎯 Agendamiento (CORE)
- `GET /agendamiento/buscar-sesiones` - Buscar sesiones (sin token)
- `POST /agendamiento/agendar` - Agendar cita (con token)
- `GET /agendamiento/mis-reservas` - Ver mis reservas (con token)
- `PATCH /agendamiento/reserva/{id}/cancelar` - Cancelar reserva (con token)

### 💰 Pagos (Requieren token)
- `POST /pagos` - Crear pago
- `GET /pagos` - Listar pagos
- `GET /pagos/{id}` - Ver pago
- `GET /pagos/reserva/{reservaId}` - Pagos de una reserva

### ⭐ Reseñas (Requieren token)
- `POST /resenas` - Crear reseña
- `GET /resenas` - Listar reseñas
- `GET /resenas/entrenador/{id}` - Reseñas de un entrenador
- `PUT /resenas/{id}` - Actualizar reseña
- `DELETE /resenas/{id}` - Eliminar reseña

### 📅 Horarios (Solo entrenadores)
- `POST /horarios` - Crear horario
- `GET /horarios` - Listar horarios
- `GET /horarios/entrenador/{id}` - Horarios de un entrenador
- `PUT /horarios/{id}` - Actualizar horario
- `DELETE /horarios/{id}` - Eliminar horario

### 🏆 Deportes (Requieren token)
- `POST /deportes` - Crear deporte
- `GET /deportes` - Listar deportes
- `GET /deportes/{id}` - Ver deporte
- `PUT /deportes/{id}` - Actualizar deporte
- `DELETE /deportes/{id}` - Eliminar deporte

### 🔧 Sesiones (Técnico - Entrenadores)
- `POST /sesiones` - Crear sesión
- `GET /sesiones` - Listar sesiones
- `GET /sesiones/{id}` - Ver sesión
- `PUT /sesiones/{id}` - Actualizar sesión
- `DELETE /sesiones/{id}` - Eliminar sesión

### 🔔 Notificaciones (Requieren token)
- `GET /notificaciones` - Ver notificaciones
- `POST /notificaciones` - Crear notificación
- `PATCH /notificaciones/{id}/leer` - Marcar como leída

---

## 💾 MODELOS DE BASE DE DATOS

### Usuario
```typescript
{
  id_usuario: number
  nombre: string
  apellido: string
  email: string (único)
  contrasena: string (hasheada)
  rol: "CLIENTE" | "ENTRENADOR"
  creado_en: Date
}
```

### Cliente
```typescript
{
  id_cliente: number
  id_usuario: number (FK)
  telefono: string
  direccion: string
  fecha_registro: Date
}
```

### Entrenador
```typescript
{
  id_entrenador: number
  id_usuario: number (FK)
  especialidad: string
  experiencia: number (años)
  descripcion: string
  foto_url: string
}
```

### Sesion
```typescript
{
  id_sesion: number
  id_horario: number (FK)
  fecha: Date
  cupos_disponibles: number
}
```

### Reserva
```typescript
{
  id_reserva: number
  id_cliente: number (FK)
  id_sesion: number (FK)
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA"
  fecha_reserva: Date
  notas: string
}
```

### Pago
```typescript
{
  id_pago: number
  id_reserva: number (FK)
  monto: decimal
  metodo_pago: string
  estado_pago: "PENDIENTE" | "COMPLETADO" | "FALLIDO"
  fecha_pago: Date
  referencia_pago: string
}
```

---

## ⚠️ CÓDIGOS DE ERROR

| Código | Descripción |
|--------|-------------|
| 200 | ✅ Solicitud exitosa |
| 201 | ✅ Recurso creado exitosamente |
| 400 | ❌ Datos inválidos o faltantes |
| 401 | ❌ No autenticado (token faltante o inválido) |
| 403 | ❌ No autorizado (permisos insuficientes) |
| 404 | ❌ Recurso no encontrado |
| 500 | ❌ Error interno del servidor |

---

## 🧪 EJEMPLOS DE PRUEBA EN SWAGGER

### Flujo Completo para Demostración:

1. **Registrar Cliente:**
   - Endpoint: `POST /usuarios/register`
   - Guardar el token

2. **Crear Perfil de Cliente:**
   - Endpoint: `POST /clientes`
   - Usar el token del paso 1

3. **Buscar Sesiones:**
   - Endpoint: `GET /agendamiento/buscar-sesiones`
   - Copiar un `id_sesion`

4. **Agendar Cita:**
   - Endpoint: `POST /agendamiento/agendar`
   - Usar el `id_sesion` del paso 3
   - Guardar el `id_reserva`

5. **Procesar Pago:**
   - Endpoint: `POST /pagos`
   - Usar el `id_reserva` del paso 4

6. **Verificar en Base de Datos:**
   - Los datos se guardan automáticamente en Supabase
   - Puedes verificar en la consola de Supabase

---

## 🔧 CONFIGURACIÓN DE AMBIENTE

```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# JWT
JWT_SECRET=tu_secreto_jwt_minimo_32_caracteres

# API
API_VERSION=v1
API_PREFIX=/api
```

---

## 📞 SOPORTE

Para más información o dudas:
- Documentación Swagger: `http://localhost:3000/api-docs`
- Repository: https://github.com/AngelRey1/Api-Proyecto-Integrador

---

**Última actualización:** 3 de Noviembre de 2025
**Versión:** 1.0.0
