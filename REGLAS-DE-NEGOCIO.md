# 🔐 Reglas de Negocio - FitConnect API

## 📋 **Resumen de Validaciones Implementadas**

### **1. 📝 Reseñas - Solo después de sesiones completadas**

**Regla:** Un cliente solo puede dejar una reseña si ya completó una sesión con el entrenador.

**Validaciones:**
- ✅ La reserva debe existir y pertenecer al cliente
- ✅ La sesión debe estar marcada como "COMPLETADA"
- ✅ No debe existir ya una reseña para esa reserva
- ✅ Solo clientes pueden crear reseñas

**Endpoint:** `POST /api/v1/reseñas`

**Códigos de Error:**
- `RESERVA_INVALIDA` - La reserva no existe o no pertenece al usuario
- `SESION_NO_COMPLETADA` - La sesión aún no ha sido completada
- `RESENA_DUPLICADA` - Ya existe una reseña para esta reserva
- `ROL_NO_AUTORIZADO` - Solo clientes pueden crear reseñas

---

### **2. 📅 Reservas - Verificación de disponibilidad**

**Regla:** Solo se pueden crear reservas para sesiones disponibles y sin conflictos de horario.

**Validaciones:**
- ✅ La sesión debe existir y estar activa
- ✅ La sesión no debe estar ya reservada
- ✅ El cliente no debe tener conflictos de horario
- ✅ Límite máximo de 3 reservas pendientes por cliente
- ✅ Solo clientes pueden hacer reservas

**Endpoint:** `POST /api/v1/reservas`

**Códigos de Error:**
- `SESION_NO_ENCONTRADA` - La sesión solicitada no existe
- `SESION_NO_DISPONIBLE` - La sesión ya fue reservada
- `CONFLICTO_HORARIO` - El cliente ya tiene una reserva en ese horario
- `LIMITE_RESERVAS_EXCEDIDO` - Máximo 3 reservas pendientes
- `ROL_NO_AUTORIZADO` - Solo clientes pueden hacer reservas

---

### **3. 👨‍💼 Roles y Permisos**

**Reglas de Acceso:**

#### **🔐 Sin Autenticación:**
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `GET /entrenadores/buscar` - Búsqueda pública
- `GET /status` - Estado de la API
- `GET /health` - Health check

#### **👤 Solo Clientes:**
- `POST /reservas` - Crear reservas
- `POST /reseñas` - Crear reseñas
- `GET /reservas/mis-reservas` - Ver mis reservas

#### **👨‍💼 Solo Entrenadores:**
- `POST /horarios` - Configurar disponibilidad
- `PUT /entrenadores/{id}` - Actualizar perfil de entrenador

#### **🔑 Cualquier Usuario Autenticado:**
- `GET /usuarios` - Listar usuarios
- `GET /deportes` - Ver catálogo de deportes
- `GET /pagos` - Ver historial de pagos

---

## 🔧 **Implementación Técnica**

### **Middleware de Validaciones**

```typescript
// Validaciones para reservas
export const validacionesReserva = [
  BusinessValidations.validarRolCliente,
  BusinessValidations.validarDisponibilidadReserva
];

// Validaciones para reseñas
export const validacionesReseña = [
  BusinessValidations.validarRolCliente,
  BusinessValidations.validarReseñaPermitida
];
```

### **Uso en Rutas**

```typescript
// Crear reserva con validaciones
router.post('/reservas', 
  authenticateToken, 
  ...validacionesReserva, 
  (req, res) => reservaController.create(req, res)
);

// Crear reseña con validaciones
router.post('/reseñas', 
  authenticateToken, 
  ...validacionesReseña, 
  (req, res) => reseñaController.create(req, res)
);
```

---

## 🎯 **Flujo de Validación**

### **Para Crear una Reserva:**

1. **Autenticación** → Verificar token JWT válido
2. **Rol** → Verificar que sea CLIENTE
3. **Sesión** → Verificar que la sesión existe
4. **Disponibilidad** → Verificar que no esté ocupada
5. **Conflictos** → Verificar horarios del cliente
6. **Límites** → Verificar máximo de reservas pendientes
7. **✅ Crear** → Si todo está bien, crear la reserva

### **Para Crear una Reseña:**

1. **Autenticación** → Verificar token JWT válido
2. **Rol** → Verificar que sea CLIENTE
3. **Reserva** → Verificar que la reserva existe y es suya
4. **Estado** → Verificar que la sesión esté completada
5. **Duplicados** → Verificar que no haya reseña previa
6. **✅ Crear** → Si todo está bien, crear la reseña

---

## 🚀 **Próximas Mejoras**

### **Validaciones Adicionales a Implementar:**

- **Cancelación de Reservas:** Solo hasta 2 horas antes
- **Modificación de Horarios:** Solo entrenadores pueden cambiar su disponibilidad
- **Pagos:** Verificar que el pago esté completado antes de confirmar reserva
- **Notificaciones:** Enviar alertas automáticas de confirmación/cancelación
- **Límites de Tiempo:** Sesiones no pueden durar más de 3 horas
- **Blacklist:** Clientes con muchas cancelaciones tienen restricciones

### **Métricas y Monitoreo:**

- Contador de reservas fallidas por validaciones
- Tiempo promedio de validación
- Alertas por intentos de acceso no autorizado
- Dashboard de reglas de negocio más activadas

---

## 📞 **Testing de las Validaciones**

### **Probar Reseña Sin Sesión Completada:**

```bash
curl -X POST http://localhost:3000/api/v1/reseñas \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"id_reserva": 999, "calificacion": 5}'
```

**Respuesta Esperada:**
```json
{
  "success": false,
  "error": "No puedes dejar una reseña hasta que la sesión esté completada",
  "code": "SESION_NO_COMPLETADA"
}
```

### **Probar Reserva de Sesión Ocupada:**

```bash
curl -X POST http://localhost:3000/api/v1/reservas \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"id_sesion": 999}'
```

**Respuesta Esperada:**
```json
{
  "success": false,
  "error": "La sesión ya no está disponible para reservar",
  "code": "SESION_NO_DISPONIBLE"
}
```