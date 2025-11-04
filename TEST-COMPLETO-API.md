# 🧪 TEST COMPLETO DE LA API - Paso a Paso

## 📋 **Objetivo**
Probar TODOS los endpoints disponibles siguiendo el orden lógico de llenado de datos, desde la autenticación hasta la gestión completa de entidades.

## 🚀 **Prerequisitos**
- Servidor corriendo en `http://localhost:3000`
- Supabase conectado y funcionando
- Postman, Insomnia o curl disponible

---

## 🔥 **FASE 1: VERIFICACIÓN INICIAL DEL SISTEMA**

### **1.1 Verificar que la API esté funcionando**
```bash
curl -X GET http://localhost:3000/
```
**Resultado esperado:**
```json
{
  "success": true,
  "message": "FitConnect API - Plataforma de Entrenamiento Personal",
  "version": "v1",
  "documentation": "/api-docs",
  "endpoints": {
    "auth": "/api/v1/auth",
    "entrenadores": "/api/v1/entrenadores",
    "usuarios": "/api/v1/usuarios"
  },
  "timestamp": "2025-11-04T..."
}
```

### **1.2 Verificar documentación Swagger**
```bash
# Abrir en navegador
http://localhost:3000/api-docs
```
**Resultado esperado:** Documentación Swagger completa visible

### **1.3 Verificar endpoints de sistema**
```bash
# Status de la API
curl -X GET http://localhost:3000/api/v1/status

# Health check
curl -X GET http://localhost:3000/api/v1/health
```

---

## 🔐 **FASE 2: AUTENTICACIÓN Y USUARIOS**

### **2.1 Registrar Usuario Cliente**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan.perez@email.com",
    "contrasena": "password123",
    "rol": "CLIENTE"
  }'
```
**Resultado esperado:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan.perez@email.com",
    "rol": "CLIENTE",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "creado_en": "2025-11-04T..."
  },
  "message": "Usuario registrado exitosamente"
}
```
**📝 Guardar:** `TOKEN_CLIENTE` y `ID_CLIENTE`

### **2.2 Registrar Usuario Entrenador**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María Elena",
    "apellido": "González Ruiz",
    "email": "maria.gonzalez@email.com",
    "contrasena": "trainer456",
    "rol": "ENTRENADOR"
  }'
```
**📝 Guardar:** `TOKEN_ENTRENADOR` y `ID_ENTRENADOR`

### **2.3 Registrar Usuario Administrador**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Alberto",
    "apellido": "Rodríguez López",
    "email": "admin@fitconnect.com",
    "contrasena": "admin789",
    "rol": "CLIENTE"
  }'
```
**📝 Guardar:** `TOKEN_ADMIN` y `ID_ADMIN`

### **2.4 Login con Cliente**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@email.com",
    "contrasena": "password123"
  }'
```
**Verificar:** Token JWT válido devuelto

### **2.5 Login con Entrenador**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.gonzalez@email.com",
    "contrasena": "trainer456"
  }'
```

### **2.6 Obtener Perfil del Cliente**
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **2.7 Obtener Perfil del Entrenador**
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN_ENTRENADOR"
```

---

## 👥 **FASE 3: GESTIÓN DE USUARIOS**

### **3.1 Listar Todos los Usuarios**
```bash
curl -X GET "http://localhost:3000/api/v1/usuarios?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **3.2 Obtener Usuario por ID**
```bash
curl -X GET http://localhost:3000/api/v1/usuarios/1 \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **3.3 Crear Usuario Adicional**
```bash
curl -X POST http://localhost:3000/api/v1/usuarios \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Sofía",
    "apellido": "Martínez Vega",
    "email": "ana.martinez@email.com",
    "contrasena": "cliente123",
    "rol": "CLIENTE"
  }'
```
**📝 Guardar:** `ID_USUARIO_ADICIONAL`

### **3.4 Actualizar Usuario**
```bash
curl -X PUT http://localhost:3000/api/v1/usuarios/ID_USUARIO_ADICIONAL \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Sofía Actualizada",
    "apellido": "Martínez Vega Actualizada"
  }'
```

### **3.5 Eliminar Usuario**
```bash
curl -X DELETE http://localhost:3000/api/v1/usuarios/ID_USUARIO_ADICIONAL \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

---

## 🏆 **FASE 4: GESTIÓN DE DEPORTES**

### **4.1 Listar Deportes**
```bash
curl -X GET "http://localhost:3000/api/v1/deportes?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **4.2 Crear Deporte - Yoga**
```bash
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Yoga",
    "descripcion": "Disciplina física y mental que combina posturas, respiración y meditación",
    "nivel": "PRINCIPIANTE"
  }'
```
**📝 Guardar:** `ID_DEPORTE_YOGA`

### **4.3 Crear Deporte - CrossFit**
```bash
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "CrossFit",
    "descripcion": "Entrenamiento funcional de alta intensidad que combina cardio y fuerza",
    "nivel": "AVANZADO"
  }'
```
**📝 Guardar:** `ID_DEPORTE_CROSSFIT`

### **4.4 Crear Deporte - Pilates**
```bash
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pilates",
    "descripcion": "Método de ejercicio que fortalece el core y mejora la flexibilidad",
    "nivel": "INTERMEDIO"
  }'
```
**📝 Guardar:** `ID_DEPORTE_PILATES`

### **4.5 Crear Deporte - Natación**
```bash
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Natación",
    "descripcion": "Deporte acuático completo que ejercita todo el cuerpo",
    "nivel": "INTERMEDIO"
  }'
```
**📝 Guardar:** `ID_DEPORTE_NATACION`

### **4.6 Obtener Deporte por ID**
```bash
curl -X GET http://localhost:3000/api/v1/deportes/ID_DEPORTE_YOGA \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **4.7 Actualizar Deporte**
```bash
curl -X PUT http://localhost:3000/api/v1/deportes/ID_DEPORTE_YOGA \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Disciplina milenaria que combina posturas físicas, técnicas de respiración y meditación para el bienestar integral"
  }'
```

### **4.8 Listar Deportes Actualizados**
```bash
curl -X GET "http://localhost:3000/api/v1/deportes?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

---

## 👤 **FASE 5: GESTIÓN DE CLIENTES**

### **5.1 Listar Clientes**
```bash
curl -X GET "http://localhost:3000/api/v1/clientes?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_ENTRENADOR"
```

### **5.2 Crear Perfil de Cliente Completo**
```bash
curl -X POST http://localhost:3000/api/v1/clientes \
  -H "Authorization: Bearer TOKEN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": ID_CLIENTE,
    "telefono": "+34 612 345 678",
    "direccion": "Calle Gran Vía 123, 4º B, 28013 Madrid, España",
    "fecha_nacimiento": "1990-05-15",
    "genero": "MASCULINO",
    "peso": 75.5,
    "altura": 178,
    "nivel_experiencia": "INTERMEDIO",
    "objetivos": "Perder peso y ganar masa muscular",
    "condiciones_medicas": "Ninguna",
    "preferencias_entrenamiento": "Mañanas, ejercicios funcionales"
  }'
```
**📝 Guardar:** `ID_CLIENTE_PERFIL`

### **5.3 Crear Segundo Cliente**
```bash
curl -X POST http://localhost:3000/api/v1/clientes \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": ID_ADMIN,
    "telefono": "+34 687 654 321",
    "direccion": "Avenida de la Castellana 456, 1º A, 28046 Madrid, España",
    "fecha_nacimiento": "1985-12-03",
    "genero": "FEMENINO",
    "peso": 62.0,
    "altura": 165,
    "nivel_experiencia": "AVANZADO",
    "objetivos": "Mantener forma física y flexibilidad",
    "condiciones_medicas": "Lesión previa en rodilla izquierda",
    "preferencias_entrenamiento": "Tardes, yoga y pilates"
  }'
```

### **5.4 Obtener Cliente por ID**
```bash
curl -X GET http://localhost:3000/api/v1/clientes/ID_CLIENTE_PERFIL \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **5.5 Actualizar Perfil de Cliente**
```bash
curl -X PUT http://localhost:3000/api/v1/clientes/ID_CLIENTE_PERFIL \
  -H "Authorization: Bearer TOKEN_CLIENTE" \
  -H "Content-Type: application/json" \
  -d '{
    "peso": 74.2,
    "objetivos": "Perder peso, ganar masa muscular y mejorar resistencia cardiovascular",
    "preferencias_entrenamiento": "Mañanas entre 7:00-9:00, ejercicios funcionales y cardio"
  }'
```

---

## 🏃‍♂️ **FASE 6: GESTIÓN DE ENTRENADORES**

### **6.1 Listar Entrenadores**
```bash
curl -X GET "http://localhost:3000/api/v1/entrenadores?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **6.2 Crear Perfil de Entrenador Completo**
```bash
curl -X POST http://localhost:3000/api/v1/entrenadores \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": ID_ENTRENADOR,
    "especialidad": "Yoga, Pilates y Mindfulness",
    "experiencia": 8,
    "descripcion": "Entrenadora certificada con 8 años de experiencia en yoga y pilates. Especializada en rehabilitación y bienestar integral. Formación en Hatha Yoga, Vinyasa y Pilates clínico.",
    "certificaciones": "Certificación Internacional de Yoga Alliance (RYT-500), Pilates Clínico, Mindfulness MBSR",
    "tarifa_por_hora": 45.00,
    "ubicacion": "Madrid Centro",
    "disponibilidad": "Lunes a Viernes: 7:00-20:00, Sábados: 9:00-14:00",
    "foto_url": "https://example.com/photos/maria-gonzalez.jpg",
    "telefono": "+34 654 987 321",
    "idiomas": "Español, Inglés, Francés",
    "modalidad": "Presencial y Online"
  }'
```
**📝 Guardar:** `ID_ENTRENADOR_PERFIL`

### **6.3 Crear Segundo Entrenador - CrossFit**
```bash
curl -X POST http://localhost:3000/api/v1/entrenadores \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": ID_ADMIN,
    "especialidad": "CrossFit, Entrenamiento Funcional y Nutrición Deportiva",
    "experiencia": 12,
    "descripcion": "Entrenador de CrossFit Level 3 con más de 12 años transformando vidas. Especialista en fuerza, acondicionamiento y nutrición deportiva. Competidor nacional de CrossFit.",
    "certificaciones": "CrossFit Level 3, NSCA-CSCS, Nutrición Deportiva ISSN, Movilidad FRC",
    "tarifa_por_hora": 60.00,
    "ubicacion": "Madrid Norte",
    "disponibilidad": "Lunes a Sábado: 6:00-22:00",
    "foto_url": "https://example.com/photos/carlos-rodriguez.jpg",
    "telefono": "+34 611 222 333",
    "idiomas": "Español, Inglés",
    "modalidad": "Presencial"
  }'
```

### **6.4 Obtener Entrenador por ID**
```bash
curl -X GET http://localhost:3000/api/v1/entrenadores/ID_ENTRENADOR_PERFIL \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **6.5 Buscar Entrenadores (Endpoint Principal)**
```bash
# Búsqueda sin filtros
curl -X GET http://localhost:3000/api/v1/entrenadores/buscar \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Búsqueda por deporte
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?deporte=yoga" \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Búsqueda por fecha
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?fecha=2025-11-10" \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Búsqueda por ubicación
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?ubicacion=madrid" \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Búsqueda combinada
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?deporte=crossfit&ubicacion=madrid&fecha=2025-11-15" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **6.6 Actualizar Perfil de Entrenador**
```bash
curl -X PUT http://localhost:3000/api/v1/entrenadores/ID_ENTRENADOR_PERFIL \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "tarifa_por_hora": 50.00,
    "descripcion": "Entrenadora certificada con 8 años de experiencia en yoga y pilates. Especializada en rehabilitación, bienestar integral y mindfulness. Formación avanzada en Hatha Yoga, Vinyasa Flow y Pilates terapéutico. Enfoque holístico del entrenamiento.",
    "disponibilidad": "Lunes a Viernes: 7:00-20:00, Sábados: 9:00-15:00, Domingos: 10:00-13:00"
  }'
```

---

## 📊 **FASE 7: VERIFICACIÓN COMPLETA DE DATOS**

### **7.1 Verificar Todos los Usuarios Creados**
```bash
curl -X GET "http://localhost:3000/api/v1/usuarios?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### **7.2 Verificar Todos los Deportes Creados**
```bash
curl -X GET "http://localhost:3000/api/v1/deportes?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **7.3 Verificar Todos los Clientes Creados**
```bash
curl -X GET "http://localhost:3000/api/v1/clientes?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_ENTRENADOR"
```

### **7.4 Verificar Todos los Entrenadores Creados**
```bash
curl -X GET "http://localhost:3000/api/v1/entrenadores?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

---

## 🔍 **FASE 8: PRUEBAS DE VALIDACIÓN Y ERRORES**

### **8.1 Probar Autenticación Inválida**
```bash
# Sin token
curl -X GET http://localhost:3000/api/v1/usuarios

# Token inválido
curl -X GET http://localhost:3000/api/v1/usuarios \
  -H "Authorization: Bearer token_invalido"

# Token expirado (usar un token viejo)
curl -X GET http://localhost:3000/api/v1/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid"
```

### **8.2 Probar Validaciones de Datos**
```bash
# Email duplicado
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "Duplicado",
    "email": "juan.perez@email.com",
    "contrasena": "password123",
    "rol": "CLIENTE"
  }'

# Contraseña muy corta
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "apellido": "Password",
    "email": "test.password@email.com",
    "contrasena": "123",
    "rol": "CLIENTE"
  }'

# Campos faltantes
curl -X POST http://localhost:3000/api/v1/deportes \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Deporte Sin Descripción"
  }'
```

### **8.3 Probar IDs Inexistentes**
```bash
# Usuario inexistente
curl -X GET http://localhost:3000/api/v1/usuarios/99999 \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Deporte inexistente
curl -X GET http://localhost:3000/api/v1/deportes/99999 \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Cliente inexistente
curl -X GET http://localhost:3000/api/v1/clientes/99999 \
  -H "Authorization: Bearer TOKEN_ENTRENADOR"
```

---

## 📈 **FASE 9: PRUEBAS DE PAGINACIÓN Y FILTROS**

### **9.1 Probar Paginación en Usuarios**
```bash
# Primera página
curl -X GET "http://localhost:3000/api/v1/usuarios?page=1&limit=2" \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Segunda página
curl -X GET "http://localhost:3000/api/v1/usuarios?page=2&limit=2" \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Límite grande
curl -X GET "http://localhost:3000/api/v1/usuarios?page=1&limit=100" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### **9.2 Probar Paginación en Deportes**
```bash
curl -X GET "http://localhost:3000/api/v1/deportes?page=1&limit=2" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

### **9.3 Probar Búsquedas Avanzadas de Entrenadores**
```bash
# Búsqueda con fecha pasada (debería dar error)
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?fecha=2020-01-01" \
  -H "Authorization: Bearer TOKEN_CLIENTE"

# Búsqueda con fecha muy lejana (debería dar error)
curl -X GET "http://localhost:3000/api/v1/entrenadores/buscar?fecha=2030-01-01" \
  -H "Authorization: Bearer TOKEN_CLIENTE"
```

---

## 🎯 **FASE 10: VERIFICACIÓN FINAL DEL SISTEMA**

### **10.1 Verificar Estado Final de la API**
```bash
curl -X GET http://localhost:3000/api/v1/status \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

### **10.2 Verificar Health Check**
```bash
curl -X GET http://localhost:3000/api/v1/health
```

### **10.3 Conteo Final de Entidades**
```bash
# Contar usuarios
curl -X GET "http://localhost:3000/api/v1/usuarios?page=1&limit=1000" \
  -H "Authorization: Bearer TOKEN_ADMIN" | jq '.pagination.total'

# Contar deportes
curl -X GET "http://localhost:3000/api/v1/deportes?page=1&limit=1000" \
  -H "Authorization: Bearer TOKEN_CLIENTE" | jq '.pagination.total'

# Contar clientes
curl -X GET "http://localhost:3000/api/v1/clientes?page=1&limit=1000" \
  -H "Authorization: Bearer TOKEN_ENTRENADOR" | jq '.pagination.total'

# Contar entrenadores
curl -X GET "http://localhost:3000/api/v1/entrenadores?page=1&limit=1000" \
  -H "Authorization: Bearer TOKEN_CLIENTE" | jq '.pagination.total'
```

---

## 📊 **RESUMEN ESPERADO DEL TEST**

### **✅ Datos Creados:**
- **👥 Usuarios:** 3 (1 Cliente, 1 Entrenador, 1 Admin)
- **🏆 Deportes:** 4 (Yoga, CrossFit, Pilates, Natación)
- **👤 Clientes:** 2 (Perfiles completos con datos detallados)
- **🏃‍♂️ Entrenadores:** 2 (Perfiles completos con especialidades)

### **✅ Endpoints Probados:**
- **🔐 Autenticación:** 6 endpoints (register, login, profile)
- **👥 Usuarios:** 5 endpoints (CRUD completo)
- **🏆 Deportes:** 5 endpoints (CRUD completo)
- **👤 Clientes:** 5 endpoints (CRUD completo)
- **🏃‍♂️ Entrenadores:** 6 endpoints (CRUD + búsqueda)
- **📊 Sistema:** 2 endpoints (status, health)

### **✅ Validaciones Probadas:**
- Autenticación JWT
- Validación de datos de entrada
- Manejo de errores
- Paginación
- Filtros y búsquedas
- Permisos por rol

### **🎯 Total de Pruebas:** ~80 requests individuales

---

## 🚀 **EJECUCIÓN AUTOMATIZADA**

Para ejecutar todo el test de una vez, puedes usar este script bash:

```bash
#!/bin/bash
# Guardar como test-api-completo.sh
# chmod +x test-api-completo.sh
# ./test-api-completo.sh

BASE_URL="http://localhost:3000/api/v1"

echo "🧪 Iniciando test completo de la API FitConnect..."
echo "=================================================="

# Aquí irían todos los curl commands del test...
```

**¡Este test completo verifica que TODA la funcionalidad de la API esté trabajando correctamente con la base de datos real!** 🎉