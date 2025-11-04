#!/bin/bash

# 🧪 TEST AUTOMATIZADO COMPLETO DE LA API FITCONNECT
# =====================================================

set -e  # Salir si hay algún error

# Configuración
BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/v1"
TEST_LOG="test-results.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables globales para tokens e IDs
TOKEN_CLIENTE=""
TOKEN_ENTRENADOR=""
TOKEN_ADMIN=""
ID_CLIENTE=""
ID_ENTRENADOR=""
ID_ADMIN=""
ID_USUARIO_ADICIONAL=""
ID_DEPORTE_YOGA=""
ID_DEPORTE_CROSSFIT=""
ID_DEPORTE_PILATES=""
ID_DEPORTE_NATACION=""
ID_CLIENTE_PERFIL=""
ID_ENTRENADOR_PERFIL=""

# Contadores
TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

# Función para logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$TEST_LOG"
}

# Función para hacer requests y validar respuestas
make_request() {
    local method="$1"
    local url="$2"
    local data="$3"
    local headers="$4"
    local expected_status="$5"
    local test_name="$6"
    
    TEST_COUNT=$((TEST_COUNT + 1))
    
    echo -e "\n${BLUE}🧪 Test $TEST_COUNT: $test_name${NC}"
    echo -e "${YELLOW}$method $url${NC}"
    
    # Construir comando curl
    local curl_cmd="curl -s -w '%{http_code}' -X $method '$url'"
    
    if [ ! -z "$headers" ]; then
        curl_cmd="$curl_cmd $headers"
    fi
    
    if [ ! -z "$data" ] && [ "$data" != "null" ]; then
        curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    
    # Ejecutar request
    local response=$(eval $curl_cmd)
    local status_code="${response: -3}"
    local body="${response%???}"
    
    # Validar status code
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS - Status: $status_code${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
        
        # Extraer datos importantes de la respuesta
        extract_data "$body" "$test_name"
        
        # Mostrar respuesta si es exitosa
        if [ ${#body} -lt 500 ]; then
            echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
        else
            echo "Response: [Large response - ${#body} chars]"
        fi
        
        echo "$body"
    else
        echo -e "${RED}❌ FAIL - Expected: $expected_status, Got: $status_code${NC}"
        echo "Response: $body"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        echo ""
    fi
}

# Función para extraer datos de respuestas
extract_data() {
    local response="$1"
    local test_name="$2"
    
    if [ -z "$response" ]; then
        return
    fi
    
    case "$test_name" in
        *"Registrar Usuario Cliente"*)
            TOKEN_CLIENTE=$(echo "$response" | jq -r '.data.token // empty' 2>/dev/null)
            ID_CLIENTE=$(echo "$response" | jq -r '.data.id_usuario // empty' 2>/dev/null)
            ;;
        *"Registrar Usuario Entrenador"*)
            TOKEN_ENTRENADOR=$(echo "$response" | jq -r '.data.token // empty' 2>/dev/null)
            ID_ENTRENADOR=$(echo "$response" | jq -r '.data.id_usuario // empty' 2>/dev/null)
            ;;
        *"Registrar Usuario Administrador"*)
            TOKEN_ADMIN=$(echo "$response" | jq -r '.data.token // empty' 2>/dev/null)
            ID_ADMIN=$(echo "$response" | jq -r '.data.id_usuario // empty' 2>/dev/null)
            ;;
        *"Login con Cliente"*)
            TOKEN_CLIENTE=$(echo "$response" | jq -r '.data.token // empty' 2>/dev/null)
            ;;
        *"Login con Entrenador"*)
            TOKEN_ENTRENADOR=$(echo "$response" | jq -r '.data.token // empty' 2>/dev/null)
            ;;
        *"Crear Usuario Adicional"*)
            ID_USUARIO_ADICIONAL=$(echo "$response" | jq -r '.data.id_usuario // empty' 2>/dev/null)
            ;;
        *"Crear Deporte - Yoga"*)
            ID_DEPORTE_YOGA=$(echo "$response" | jq -r '.data.id_deporte // empty' 2>/dev/null)
            ;;
        *"Crear Deporte - CrossFit"*)
            ID_DEPORTE_CROSSFIT=$(echo "$response" | jq -r '.data.id_deporte // empty' 2>/dev/null)
            ;;
        *"Crear Deporte - Pilates"*)
            ID_DEPORTE_PILATES=$(echo "$response" | jq -r '.data.id_deporte // empty' 2>/dev/null)
            ;;
        *"Crear Deporte - Natación"*)
            ID_DEPORTE_NATACION=$(echo "$response" | jq -r '.data.id_deporte // empty' 2>/dev/null)
            ;;
        *"Crear Perfil de Cliente"*)
            ID_CLIENTE_PERFIL=$(echo "$response" | jq -r '.data.id_cliente // empty' 2>/dev/null)
            ;;
        *"Crear Perfil de Entrenador"*)
            ID_ENTRENADOR_PERFIL=$(echo "$response" | jq -r '.data.id_entrenador // empty' 2>/dev/null)
            ;;
    esac
}

# Función para mostrar resumen
show_summary() {
    echo -e "\n${CYAN}============================================================${NC}"
    echo -e "${CYAN}📊 RESUMEN DEL TEST AUTOMATIZADO${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo -e "Total Tests: $TEST_COUNT"
    echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
    echo -e "${RED}Failed: $FAIL_COUNT${NC}"
    
    if [ $TEST_COUNT -gt 0 ]; then
        success_rate=$(echo "scale=2; ($PASS_COUNT / $TEST_COUNT) * 100" | bc -l)
        echo -e "Success Rate: ${success_rate}%"
    fi
    
    echo -e "\n${CYAN}📋 DATOS EXTRAÍDOS:${NC}"
    echo -e "TOKEN_CLIENTE: ${TOKEN_CLIENTE:0:20}..."
    echo -e "TOKEN_ENTRENADOR: ${TOKEN_ENTRENADOR:0:20}..."
    echo -e "TOKEN_ADMIN: ${TOKEN_ADMIN:0:20}..."
    echo -e "ID_CLIENTE: $ID_CLIENTE"
    echo -e "ID_ENTRENADOR: $ID_ENTRENADOR"
    echo -e "ID_ADMIN: $ID_ADMIN"
    echo -e "${CYAN}============================================================${NC}"
}

# Inicializar log
> "$TEST_LOG"
log "🚀 Iniciando test automatizado completo de la API FitConnect"

echo -e "${CYAN}🧪 TEST AUTOMATIZADO COMPLETO DE LA API FITCONNECT${NC}"
echo -e "${CYAN}====================================================${NC}"
echo -e "${YELLOW}🔗 Base URL: $API_URL${NC}"
echo -e "${YELLOW}📝 Log File: $TEST_LOG${NC}"

# ============================================================================
# FASE 1: VERIFICAR SERVIDOR
# ============================================================================
echo -e "\n${MAGENTA}🔍 FASE 1: VERIFICACIÓN DEL SERVIDOR${NC}"

make_request "GET" "$API_URL/health" "null" "" "200" "Health Check"

# ============================================================================
# FASE 2: AUTENTICACIÓN Y REGISTRO
# ============================================================================
echo -e "\n${MAGENTA}🔐 FASE 2: AUTENTICACIÓN Y REGISTRO${NC}"

# 2.1 Registrar Usuario Cliente
cliente_data='{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "email": "juan.perez@email.com",
    "contrasena": "password123",
    "rol": "CLIENTE"
}'

make_request "POST" "$API_URL/auth/register" "$cliente_data" "" "201" "Registrar Usuario Cliente"

# 2.2 Registrar Usuario Entrenador
entrenador_data='{
    "nombre": "María Elena",
    "apellido": "González Ruiz",
    "email": "maria.gonzalez@email.com",
    "contrasena": "trainer456",
    "rol": "ENTRENADOR"
}'

make_request "POST" "$API_URL/auth/register" "$entrenador_data" "" "201" "Registrar Usuario Entrenador"

# 2.3 Registrar Usuario Administrador
admin_data='{
    "nombre": "Carlos Alberto",
    "apellido": "Rodríguez López",
    "email": "admin@fitconnect.com",
    "contrasena": "admin789",
    "rol": "CLIENTE"
}'

make_request "POST" "$API_URL/auth/register" "$admin_data" "" "201" "Registrar Usuario Administrador"

# 2.4 Login con Cliente
login_cliente_data='{
    "email": "juan.perez@email.com",
    "contrasena": "password123"
}'

make_request "POST" "$API_URL/auth/login" "$login_cliente_data" "" "200" "Login con Cliente"

# 2.5 Login con Entrenador
login_entrenador_data='{
    "email": "maria.gonzalez@email.com",
    "contrasena": "trainer456"
}'

make_request "POST" "$API_URL/auth/login" "$login_entrenador_data" "" "200" "Login con Entrenador"

# 2.6 Obtener Perfil del Cliente
if [ ! -z "$TOKEN_CLIENTE" ]; then
    make_request "GET" "$API_URL/auth/profile" "null" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "200" "Obtener Perfil del Cliente"
fi

# 2.7 Obtener Perfil del Entrenador
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    make_request "GET" "$API_URL/auth/profile" "null" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "200" "Obtener Perfil del Entrenador"
fi

# ============================================================================
# FASE 3: GESTIÓN DE USUARIOS
# ============================================================================
echo -e "\n${MAGENTA}👥 FASE 3: GESTIÓN DE USUARIOS${NC}"

# 3.1 Listar Todos los Usuarios
if [ ! -z "$TOKEN_CLIENTE" ]; then
    make_request "GET" "$API_URL/usuarios?page=1&limit=10" "null" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "200" "Listar Todos los Usuarios"
fi

# 3.2 Obtener Usuario por ID
if [ ! -z "$TOKEN_CLIENTE" ] && [ ! -z "$ID_CLIENTE" ]; then
    make_request "GET" "$API_URL/usuarios/$ID_CLIENTE" "null" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "200" "Obtener Usuario por ID"
fi

# 3.3 Crear Usuario Adicional
if [ ! -z "$TOKEN_ADMIN" ]; then
    usuario_adicional_data='{
        "nombre": "Ana Sofía",
        "apellido": "Martínez Vega",
        "email": "ana.martinez@email.com",
        "contrasena": "cliente123",
        "rol": "CLIENTE"
    }'
    
    make_request "POST" "$API_URL/usuarios" "$usuario_adicional_data" "-H 'Authorization: Bearer $TOKEN_ADMIN'" "201" "Crear Usuario Adicional"
fi

# ============================================================================
# FASE 4: GESTIÓN DE DEPORTES
# ============================================================================
echo -e "\n${MAGENTA}🏆 FASE 4: GESTIÓN DE DEPORTES${NC}"

# 4.1 Listar Deportes
if [ ! -z "$TOKEN_CLIENTE" ]; then
    make_request "GET" "$API_URL/deportes?page=1&limit=10" "null" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "200" "Listar Deportes"
fi

# 4.2 Crear Deporte - Yoga
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    yoga_data='{
        "nombre": "Yoga",
        "descripcion": "Disciplina física y mental que combina posturas, respiración y meditación",
        "nivel": "PRINCIPIANTE"
    }'
    
    make_request "POST" "$API_URL/deportes" "$yoga_data" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "201" "Crear Deporte - Yoga"
fi

# 4.3 Crear Deporte - CrossFit
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    crossfit_data='{
        "nombre": "CrossFit",
        "descripcion": "Entrenamiento funcional de alta intensidad que combina cardio y fuerza",
        "nivel": "AVANZADO"
    }'
    
    make_request "POST" "$API_URL/deportes" "$crossfit_data" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "201" "Crear Deporte - CrossFit"
fi

# 4.4 Crear Deporte - Pilates
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    pilates_data='{
        "nombre": "Pilates",
        "descripcion": "Método de ejercicio que fortalece el core y mejora la flexibilidad",
        "nivel": "INTERMEDIO"
    }'
    
    make_request "POST" "$API_URL/deportes" "$pilates_data" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "201" "Crear Deporte - Pilates"
fi

# 4.5 Crear Deporte - Natación
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    natacion_data='{
        "nombre": "Natación",
        "descripcion": "Deporte acuático completo que ejercita todo el cuerpo",
        "nivel": "INTERMEDIO"
    }'
    
    make_request "POST" "$API_URL/deportes" "$natacion_data" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "201" "Crear Deporte - Natación"
fi

# ============================================================================
# FASE 5: GESTIÓN DE CLIENTES
# ============================================================================
echo -e "\n${MAGENTA}👤 FASE 5: GESTIÓN DE CLIENTES${NC}"

# 5.1 Listar Clientes
if [ ! -z "$TOKEN_ENTRENADOR" ]; then
    make_request "GET" "$API_URL/clientes?page=1&limit=10" "null" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "200" "Listar Clientes"
fi

# 5.2 Crear Perfil de Cliente Completo
if [ ! -z "$TOKEN_CLIENTE" ] && [ ! -z "$ID_CLIENTE" ]; then
    cliente_perfil_data="{
        \"id_usuario\": $ID_CLIENTE,
        \"telefono\": \"+34 612 345 678\",
        \"direccion\": \"Calle Gran Vía 123, 4º B, 28013 Madrid, España\",
        \"fecha_nacimiento\": \"1990-05-15\",
        \"genero\": \"MASCULINO\",
        \"peso\": 75.5,
        \"altura\": 178,
        \"nivel_experiencia\": \"INTERMEDIO\",
        \"objetivos\": \"Perder peso y ganar masa muscular\",
        \"condiciones_medicas\": \"Ninguna\",
        \"preferencias_entrenamiento\": \"Mañanas, ejercicios funcionales\"
    }"
    
    make_request "POST" "$API_URL/clientes" "$cliente_perfil_data" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "201" "Crear Perfil de Cliente Completo"
fi

# ============================================================================
# FASE 6: GESTIÓN DE ENTRENADORES
# ============================================================================
echo -e "\n${MAGENTA}🏃‍♂️ FASE 6: GESTIÓN DE ENTRENADORES${NC}"

# 6.1 Listar Entrenadores
if [ ! -z "$TOKEN_CLIENTE" ]; then
    make_request "GET" "$API_URL/entrenadores?page=1&limit=10" "null" "-H 'Authorization: Bearer $TOKEN_CLIENTE'" "200" "Listar Entrenadores"
fi

# 6.2 Crear Perfil de Entrenador Completo
if [ ! -z "$TOKEN_ENTRENADOR" ] && [ ! -z "$ID_ENTRENADOR" ]; then
    entrenador_perfil_data="{
        \"id_usuario\": $ID_ENTRENADOR,
        \"especialidad\": \"Yoga, Pilates y Mindfulness\",
        \"experiencia\": 8,
        \"descripcion\": \"Entrenadora certificada con 8 años de experiencia en yoga y pilates\",
        \"certificaciones\": \"Certificación Internacional de Yoga Alliance (RYT-500), Pilates Clínico\",
        \"tarifa_por_hora\": 45.00,
        \"ubicacion\": \"Madrid Centro\",
        \"disponibilidad\": \"Lunes a Viernes: 7:00-20:00, Sábados: 9:00-14:00\",
        \"telefono\": \"+34 654 987 321\",
        \"idiomas\": \"Español, Inglés, Francés\",
        \"modalidad\": \"Presencial y Online\"
    }"
    
    make_request "POST" "$API_URL/entrenadores" "$entrenador_perfil_data" "-H 'Authorization: Bearer $TOKEN_ENTRENADOR'" "201" "Crear Perfil de Entrenador Completo"
fi

# ============================================================================
# FASE 7: PRUEBAS DE VALIDACIÓN Y ERRORES
# ============================================================================
echo -e "\n${MAGENTA}🔍 FASE 7: PRUEBAS DE VALIDACIÓN Y ERRORES${NC}"

# 7.1 Probar Autenticación Inválida - Sin token
make_request "GET" "$API_URL/usuarios" "null" "" "401" "Sin Token de Autenticación"

# 7.2 Probar Token Inválido
make_request "GET" "$API_URL/usuarios" "null" "-H 'Authorization: Bearer token_invalido'" "401" "Token Inválido"

# 7.3 Email Duplicado
duplicate_email_data='{
    "nombre": "Test",
    "apellido": "Duplicado",
    "email": "juan.perez@email.com",
    "contrasena": "password123",
    "rol": "CLIENTE"
}'

make_request "POST" "$API_URL/auth/register" "$duplicate_email_data" "" "400" "Email Duplicado"

# ============================================================================
# FASE 8: VERIFICACIÓN FINAL
# ============================================================================
echo -e "\n${MAGENTA}📊 FASE 8: VERIFICACIÓN FINAL DEL SISTEMA${NC}"

# 8.1 Verificar Health Check Final
make_request "GET" "$API_URL/health" "null" "" "200" "Health Check Final"

# 8.2 Conteo Final de Usuarios
if [ ! -z "$TOKEN_ADMIN" ]; then
    make_request "GET" "$API_URL/usuarios?page=1&limit=1000" "null" "-H 'Authorization: Bearer $TOKEN_ADMIN'" "200" "Conteo Final de Usuarios"
fi

# Mostrar resumen final
show_summary

echo -e "\n${GREEN}🎉 Test automatizado completado!${NC}"
echo -e "${YELLOW}📄 Revisa el archivo $TEST_LOG para detalles completos.${NC}"