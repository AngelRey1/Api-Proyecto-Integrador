# Clean Architecture API con Supabase

API REST desarrollada con arquitectura limpia, TypeScript, Express y Supabase.

## 🏗️ Arquitectura

```
src/
├── application/          # Casos de uso y lógica de aplicación
│   ├── interfaces/      # Interfaces de aplicación
│   └── use-cases/       # Casos de uso
├── domain/              # Entidades y reglas de negocio
│   ├── entities/        # Entidades del dominio
│   └── repositories/    # Interfaces de repositorios
├── infrastructure/      # Implementaciones externas
│   ├── database/        # Configuración de base de datos
│   ├── repositories/    # Implementaciones de repositorios
│   └── web/            # Configuración web (Swagger, etc.)
├── presentation/        # Capa de presentación
│   ├── controllers/     # Controladores HTTP
│   ├── middlewares/     # Middlewares de Express
│   └── routes/         # Definición de rutas
└── shared/             # Código compartido
    ├── config/         # Configuración
    ├── types/          # Tipos TypeScript
    └── utils/          # Utilidades
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y configura tus credenciales de Supabase:

```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# API Configuration
API_VERSION=v1
API_PREFIX=/api
```

### 3. Configurar tabla en Supabase
Crea la tabla `users` en tu base de datos de Supabase:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 🏃‍♂️ Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📚 Documentación API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación de Swagger en:
- **Swagger UI**: http://localhost:3000/api-docs

## 🛠️ Endpoints Disponibles (Orden lógico de uso)

### 1️⃣ Autenticación (Integrada en usuarios)
- `POST /api/v1/usuarios/register` - Registrar nuevo usuario (devuelve JWT)
- `POST /api/v1/usuarios/login` - Iniciar sesión (devuelve JWT)

### 2️⃣ Gestión de Usuarios (Requiere JWT)
- `GET /api/v1/usuarios` - Obtener todos los usuarios (con paginación)
- `GET /api/v1/usuarios/:id` - Obtener usuario por ID
- `POST /api/v1/usuarios` - Crear nuevo usuario (admin)
- `PUT /api/v1/usuarios/:id` - Actualizar usuario
- `DELETE /api/v1/usuarios/:id` - Eliminar usuario

### 🏃‍♂️ Entrenadores (Requiere autenticación)
- `GET /api/v1/entrenadores` - Obtener todos los entrenadores (con paginación)
- `GET /api/v1/entrenadores/:id` - Obtener entrenador por ID
- `POST /api/v1/entrenadores` - Crear nuevo entrenador
- `PUT /api/v1/entrenadores/:id` - Actualizar entrenador
- `DELETE /api/v1/entrenadores/:id` - Eliminar entrenador

### 👥 Clientes (Requiere autenticación)
- `GET /api/v1/clientes` - Obtener todos los clientes (con paginación)
- `GET /api/v1/clientes/:id` - Obtener cliente por ID
- `POST /api/v1/clientes` - Crear nuevo cliente
- `PUT /api/v1/clientes/:id` - Actualizar cliente
- `DELETE /api/v1/clientes/:id` - Eliminar cliente

### ⚽ Deportes (Público para consulta)
- `GET /api/v1/deportes` - Obtener todos los deportes (con paginación)
- `GET /api/v1/deportes/:id` - Obtener deporte por ID
- `POST /api/v1/deportes` - Crear nuevo deporte
- `PUT /api/v1/deportes/:id` - Actualizar deporte
- `DELETE /api/v1/deportes/:id` - Eliminar deporte

### 🕐 Horarios (Solo entrenadores)
- `GET /api/v1/horarios` - Obtener todos los horarios (con paginación)
- `GET /api/v1/horarios/:id` - Obtener horario por ID
- `GET /api/v1/horarios/entrenador/:entrenadorId` - Obtener horarios por entrenador
- `POST /api/v1/horarios` - Crear nuevo horario
- `PUT /api/v1/horarios/:id` - Actualizar horario
- `DELETE /api/v1/horarios/:id` - Eliminar horario

### Reservas
- `GET /api/v1/reservas` - Obtener todas las reservas (con paginación)
- `GET /api/v1/reservas/:id` - Obtener reserva por ID
- `POST /api/v1/reservas` - Crear nueva reserva
- `PUT /api/v1/reservas/:id` - Actualizar reserva
- `DELETE /api/v1/reservas/:id` - Eliminar reserva

### Catálogos de Entrenamiento
- `GET /api/v1/catalogos-entrenamiento` - Obtener todos los catálogos (con paginación)
- `GET /api/v1/catalogos-entrenamiento/:id` - Obtener catálogo por ID
- `POST /api/v1/catalogos-entrenamiento` - Crear nuevo catálogo
- `PUT /api/v1/catalogos-entrenamiento/:id` - Actualizar catálogo
- `DELETE /api/v1/catalogos-entrenamiento/:id` - Eliminar catálogo

### Sesiones
- `GET /api/v1/sesiones` - Obtener todas las sesiones (con paginación)
- `GET /api/v1/sesiones/:id` - Obtener sesión por ID
- `GET /api/v1/sesiones/horario/:horarioId` - Obtener sesiones por horario
- `GET /api/v1/sesiones/fecha/:fecha` - Obtener sesiones por fecha
- `POST /api/v1/sesiones` - Crear nueva sesión
- `PUT /api/v1/sesiones/:id` - Actualizar sesión
- `DELETE /api/v1/sesiones/:id` - Eliminar sesión

### Pagos
- `GET /api/v1/pagos` - Obtener todos los pagos (con paginación)
- `GET /api/v1/pagos/:id` - Obtener pago por ID
- `POST /api/v1/pagos` - Crear nuevo pago
- `PUT /api/v1/pagos/:id` - Actualizar pago
- `DELETE /api/v1/pagos/:id` - Eliminar pago

### Catálogo de Actividades
- `GET /api/v1/catalogo-actividades` - Obtener todas las actividades (con paginación)
- `GET /api/v1/catalogo-actividades/:id` - Obtener actividad por ID
- `POST /api/v1/catalogo-actividades` - Crear nueva actividad
- `PUT /api/v1/catalogo-actividades/:id` - Actualizar actividad
- `DELETE /api/v1/catalogo-actividades/:id` - Eliminar actividad

### Calendario de Disponibilidad
- `GET /api/v1/calendario-disponibilidad` - Obtener todas las disponibilidades (con paginación)
- `GET /api/v1/calendario-disponibilidad/:id` - Obtener disponibilidad por ID
- `POST /api/v1/calendario-disponibilidad` - Crear nueva disponibilidad
- `PUT /api/v1/calendario-disponibilidad/:id` - Actualizar disponibilidad
- `DELETE /api/v1/calendario-disponibilidad/:id` - Eliminar disponibilidad

### Reseñas
- `GET /api/v1/reseñas` - Obtener todas las reseñas (con paginación)
- `GET /api/v1/reseñas/:id` - Obtener reseña por ID
- `POST /api/v1/reseñas` - Crear nueva reseña
- `PUT /api/v1/reseñas/:id` - Actualizar reseña
- `DELETE /api/v1/reseñas/:id` - Eliminar reseña

### Comentarios
- `GET /api/v1/comentarios` - Obtener todos los comentarios (con paginación)
- `GET /api/v1/comentarios/:id` - Obtener comentario por ID
- `POST /api/v1/comentarios` - Crear nuevo comentario
- `PUT /api/v1/comentarios/:id` - Actualizar comentario
- `DELETE /api/v1/comentarios/:id` - Eliminar comentario

### Notificaciones
- `GET /api/v1/notificaciones` - Obtener todas las notificaciones (con paginación)
- `GET /api/v1/notificaciones/:id` - Obtener notificación por ID
- `GET /api/v1/notificaciones/usuario/:usuarioId/no-leidas` - Obtener notificaciones no leídas
- `PUT /api/v1/notificaciones/:id/marcar-leida` - Marcar notificación como leída
- `POST /api/v1/notificaciones` - Crear nueva notificación
- `PUT /api/v1/notificaciones/:id` - Actualizar notificación
- `DELETE /api/v1/notificaciones/:id` - Eliminar notificación

### Retroalimentación de App
- `GET /api/v1/retroalimentacion-app` - Obtener todas las retroalimentaciones (con paginación)
- `GET /api/v1/retroalimentacion-app/:id` - Obtener retroalimentación por ID
- `POST /api/v1/retroalimentacion-app` - Crear nueva retroalimentación
- `PUT /api/v1/retroalimentacion-app/:id` - Actualizar retroalimentación
- `DELETE /api/v1/retroalimentacion-app/:id` - Eliminar retroalimentación

### Parámetros de paginación
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)
- `sortBy`: Campo para ordenar
- `sortOrder`: Orden (asc/desc, default: asc)

## 🔐 Autenticación JWT (Integrada)

### 1. Registrar usuario (devuelve JWT automáticamente)
```bash
curl -X POST http://localhost:3000/api/v1/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "usuario@ejemplo.com",
    "contrasena": "password123",
    "rol": "CLIENTE"
  }'
```

### 2. Iniciar sesión (devuelve JWT)
```bash
curl -X POST http://localhost:3000/api/v1/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "contrasena": "password123"
  }'
```

### 3. Usar token en endpoints protegidos
```bash
curl -X GET http://localhost:3000/api/v1/usuarios \
  -H "Authorization: Bearer TU_JWT_TOKEN_AQUI"
```

## 🧪 Ejemplo de uso

### Crear entrenador
```bash
curl -X POST http://localhost:3000/api/v1/entrenadores \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "especialidad": "Fitness y Cardio",
    "experiencia": 5,
    "descripcion": "Entrenador especializado en fitness"
  }'
```

### Crear deporte
```bash
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fútbol",
    "descripcion": "Deporte de equipo",
    "nivel": "INTERMEDIO"
  }'
```

### Crear horario
```bash
curl -X POST http://localhost:3000/api/v1/horarios \
  -H "Content-Type: application/json" \
  -d '{
    "id_entrenador": 1,
    "dia": "LUNES",
    "hora_inicio": "08:00",
    "hora_fin": "09:00"
  }'
```

### Crear reserva
```bash
curl -X POST http://localhost:3000/api/v1/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_sesion": 1,
    "estado": "PENDIENTE"
  }'
```

### Obtener usuarios con paginación
```bash
curl "http://localhost:3000/api/v1/usuarios?page=1&limit=5&sortBy=nombre&sortOrder=asc"
```

## 🏛️ Principios de Arquitectura Limpia

1. **Independencia de frameworks**: La lógica de negocio no depende de Express o Supabase
2. **Testeable**: Cada capa puede ser probada independientemente
3. **Independiente de la UI**: La API puede ser consumida por cualquier cliente
4. **Independiente de la base de datos**: Fácil cambio entre diferentes proveedores
5. **Independiente de agentes externos**: La lógica de negocio no conoce el mundo exterior

## 🔧 Tecnologías Utilizadas

- **Node.js** + **TypeScript** - Runtime y lenguaje
- **Express** - Framework web
- **Supabase** - Base de datos y backend
- **Swagger** - Documentación de API
- **Zod** - Validación de esquemas
- **Helmet** + **CORS** - Seguridad

## 📝 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar versión compilada
- `npm test` - Ejecutar tests (cuando se implementen)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request