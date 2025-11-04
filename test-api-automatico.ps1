# 🧪 TEST AUTOMATIZADO COMPLETO DE LA API FITCONNECT
# =====================================================

param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$Verbose
)

# Configuración
$ApiUrl = "$BaseUrl/api/v1"
$TestLog = "test-results.log"

# Variables globales para tokens e IDs
$script:TokenCliente = ""
$script:TokenEntrenador = ""
$script:TokenAdmin = ""
$script:IdCliente = ""
$script:IdEntrenador = ""
$script:IdAdmin = ""
$script:IdUsuarioAdicional = ""
$script:IdDeporteYoga = ""
$script:IdDeporteCrossFit = ""
$script:IdDeportePilates = ""
$script:IdDeporteNatacion = ""
$script:IdClientePerfil = ""
$script:IdEntrenadorPerfil = ""

# Contadores
$script:TestCount = 0
$script:PassCount = 0
$script:FailCount = 0

# Función para logging
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "$timestamp - $Message"
    Write-Host $logEntry
    Add-Content -Path $TestLog -Value $logEntry
}

# Función para hacer requests HTTP
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus,
        [string]$TestName
    )
    
    $script:TestCount++
    
    Write-Host "`n[TEST $($script:TestCount)] $TestName" -ForegroundColor Blue
    Write-Host "$Method $Url" -ForegroundColor Yellow
    
    try {
        # Preparar headers
        $requestHeaders = $Headers.Clone()
        if ($Body) {
            $requestHeaders["Content-Type"] = "application/json"
        }
        
        # Hacer request
        $response = $null
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $requestHeaders -StatusCodeVariable statusCode
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $requestHeaders -StatusCodeVariable statusCode
        }
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "✅ PASS - Status: $statusCode" -ForegroundColor Green
            $script:PassCount++
            
            # Extraer datos importantes de la respuesta
            Extract-DataFromResponse -Response $response -TestName $TestName
            
            # Mostrar respuesta
            $responseJson = $response | ConvertTo-Json -Depth 3 -Compress
            if ($responseJson.Length -lt 500) {
                Write-Host "Response: $responseJson"
            } else {
                Write-Host "Response: $($responseJson.Substring(0, 200))..."
            }
        } else {
            Write-Host "❌ FAIL - Expected: $ExpectedStatus, Got: $statusCode" -ForegroundColor Red
            $script:FailCount++
        }
        
        Write-Log "$TestName - Status: $statusCode - $(if ($statusCode -eq $ExpectedStatus) { 'PASS' } else { 'FAIL' })"
        
    } catch {
        $actualStatus = $_.Exception.Response.StatusCode.value__
        if ($actualStatus -eq $ExpectedStatus) {
            Write-Host "✅ PASS - Status: $actualStatus (Expected error)" -ForegroundColor Green
            $script:PassCount++
        } else {
            Write-Host "❌ FAIL - Expected: $ExpectedStatus, Got: $actualStatus" -ForegroundColor Red
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
            $script:FailCount++
        }
        
        Write-Log "$TestName - Status: $actualStatus - $(if ($actualStatus -eq $ExpectedStatus) { 'PASS' } else { 'FAIL' })"
    }
    
    Start-Sleep -Milliseconds 500  # Pequeña pausa entre requests
}

# Función para extraer datos de respuestas
function Extract-DataFromResponse {
    param(
        [object]$Response,
        [string]$TestName
    )
    
    switch -Wildcard ($TestName) {
        "*Registrar Usuario Cliente*" {
            if ($Response.data.token) {
                $script:TokenCliente = $Response.data.token
                $script:IdCliente = $Response.data.id_usuario
                Write-Host "📝 Guardado: TOKEN_CLIENTE y ID_CLIENTE=$($script:IdCliente)" -ForegroundColor Cyan
            }
        }
        "*Registrar Usuario Entrenador*" {
            if ($Response.data.token) {
                $script:TokenEntrenador = $Response.data.token
                $script:IdEntrenador = $Response.data.id_usuario
                Write-Host "📝 Guardado: TOKEN_ENTRENADOR y ID_ENTRENADOR=$($script:IdEntrenador)" -ForegroundColor Cyan
            }
        }
        "*Registrar Usuario Administrador*" {
            if ($Response.data.token) {
                $script:TokenAdmin = $Response.data.token
                $script:IdAdmin = $Response.data.id_usuario
                Write-Host "📝 Guardado: TOKEN_ADMIN y ID_ADMIN=$($script:IdAdmin)" -ForegroundColor Cyan
            }
        }
        "*Login con Cliente*" {
            if ($Response.data.token) {
                $script:TokenCliente = $Response.data.token
                Write-Host "📝 Actualizado: TOKEN_CLIENTE" -ForegroundColor Cyan
            }
        }
        "*Login con Entrenador*" {
            if ($Response.data.token) {
                $script:TokenEntrenador = $Response.data.token
                Write-Host "📝 Actualizado: TOKEN_ENTRENADOR" -ForegroundColor Cyan
            }
        }
        "*Crear Usuario Adicional*" {
            if ($Response.data.id_usuario) {
                $script:IdUsuarioAdicional = $Response.data.id_usuario
                Write-Host "📝 Guardado: ID_USUARIO_ADICIONAL=$($script:IdUsuarioAdicional)" -ForegroundColor Cyan
            }
        }
        "*Crear Deporte - Yoga*" {
            if ($Response.data.id_deporte) {
                $script:IdDeporteYoga = $Response.data.id_deporte
                Write-Host "📝 Guardado: ID_DEPORTE_YOGA=$($script:IdDeporteYoga)" -ForegroundColor Cyan
            }
        }
        "*Crear Deporte - CrossFit*" {
            if ($Response.data.id_deporte) {
                $script:IdDeporteCrossFit = $Response.data.id_deporte
                Write-Host "📝 Guardado: ID_DEPORTE_CROSSFIT=$($script:IdDeporteCrossFit)" -ForegroundColor Cyan
            }
        }
        "*Crear Deporte - Pilates*" {
            if ($Response.data.id_deporte) {
                $script:IdDeportePilates = $Response.data.id_deporte
                Write-Host "📝 Guardado: ID_DEPORTE_PILATES=$($script:IdDeportePilates)" -ForegroundColor Cyan
            }
        }
        "*Crear Deporte - Natación*" {
            if ($Response.data.id_deporte) {
                $script:IdDeporteNatacion = $Response.data.id_deporte
                Write-Host "📝 Guardado: ID_DEPORTE_NATACION=$($script:IdDeporteNatacion)" -ForegroundColor Cyan
            }
        }
        "*Crear Perfil de Cliente Completo*" {
            if ($Response.data.id_cliente) {
                $script:IdClientePerfil = $Response.data.id_cliente
                Write-Host "📝 Guardado: ID_CLIENTE_PERFIL=$($script:IdClientePerfil)" -ForegroundColor Cyan
            }
        }
        "*Crear Perfil de Entrenador Completo*" {
            if ($Response.data.id_entrenador) {
                $script:IdEntrenadorPerfil = $Response.data.id_entrenador
                Write-Host "📝 Guardado: ID_ENTRENADOR_PERFIL=$($script:IdEntrenadorPerfil)" -ForegroundColor Cyan
            }
        }
    }
}# Func
ión principal de testing
function Start-ApiTests {
    Write-Host "🧪 INICIANDO TEST AUTOMATIZADO COMPLETO DE LA API FITCONNECT" -ForegroundColor Blue
    Write-Host "================================================================" -ForegroundColor Blue
    Write-Host "Fecha: $(Get-Date)"
    Write-Host "URL Base: $BaseUrl"
    Write-Host ""
    
    # Limpiar log anterior
    if (Test-Path $TestLog) {
        Remove-Item $TestLog
    }
    
    # FASE 1: VERIFICACIÓN INICIAL
    Write-Host "`n🔥 FASE 1: VERIFICACIÓN INICIAL DEL SISTEMA" -ForegroundColor Yellow
    Write-Host "============================================="
    
    Invoke-ApiRequest -Method "GET" -Url "$BaseUrl/" -ExpectedStatus 200 -TestName "1.1 Verificar que la API esté funcionando"
    
    # FASE 2: AUTENTICACIÓN Y USUARIOS
    Write-Host "`n🔐 FASE 2: AUTENTICACIÓN Y USUARIOS" -ForegroundColor Yellow
    Write-Host "==================================="
    
    # 2.1 Registrar Usuario Cliente
    $clienteData = @{
        nombre = "Juan Carlos"
        apellido = "Pérez García"
        email = "juan.perez@email.com"
        contrasena = "password123"
        rol = "CLIENTE"
    } | ConvertTo-Json
    
    Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/auth/register" -Body $clienteData -ExpectedStatus 201 -TestName "2.1 Registrar Usuario Cliente"
    
    # 2.2 Registrar Usuario Entrenador
    $entrenadorData = @{
        nombre = "María Elena"
        apellido = "González Ruiz"
        email = "maria.gonzalez@email.com"
        contrasena = "trainer456"
        rol = "ENTRENADOR"
    } | ConvertTo-Json
    
    Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/auth/register" -Body $entrenadorData -ExpectedStatus 201 -TestName "2.2 Registrar Usuario Entrenador"
    
    # 2.3 Login con Cliente
    $loginClienteData = @{
        email = "juan.perez@email.com"
        contrasena = "password123"
    } | ConvertTo-Json
    
    Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/auth/login" -Body $loginClienteData -ExpectedStatus 200 -TestName "2.3 Login con Cliente"
    
    # 2.4 Login con Entrenador
    $loginEntrenadorData = @{
        email = "maria.gonzalez@email.com"
        contrasena = "trainer456"
    } | ConvertTo-Json
    
    Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/auth/login" -Body $loginEntrenadorData -ExpectedStatus 200 -TestName "2.4 Login con Entrenador"
    
    # 2.5 Obtener Perfil del Cliente
    if ($script:TokenCliente) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/auth/profile" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "2.5 Obtener Perfil del Cliente"
    }
    
    # 2.6 Obtener Perfil del Entrenador
    if ($script:TokenEntrenador) {
        $entrenadorHeaders = @{ Authorization = "Bearer $($script:TokenEntrenador)" }
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/auth/profile" -Headers $entrenadorHeaders -ExpectedStatus 200 -TestName "2.6 Obtener Perfil del Entrenador"
    }
    
    # FASE 3: GESTIÓN DE USUARIOS
    Write-Host "`n👥 FASE 3: GESTIÓN DE USUARIOS" -ForegroundColor Yellow
    Write-Host "=============================="
    
    if ($script:TokenCliente) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        
        # 3.1 Listar Todos los Usuarios
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/usuarios?page=1&limit=10" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "3.1 Listar Todos los Usuarios"
        
        # 3.2 Obtener Usuario por ID
        if ($script:IdCliente) {
            Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/usuarios/$($script:IdCliente)" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "3.2 Obtener Usuario por ID"
        }
    }
    
    # FASE 4: GESTIÓN DE DEPORTES
    Write-Host "`n🏆 FASE 4: GESTIÓN DE DEPORTES" -ForegroundColor Yellow
    Write-Host "=============================="
    
    if ($script:TokenCliente -and $script:TokenEntrenador) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        $entrenadorHeaders = @{ Authorization = "Bearer $($script:TokenEntrenador)" }
        
        # 4.1 Listar Deportes
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/deportes?page=1&limit=10" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "4.1 Listar Deportes"
        
        # 4.2 Crear Deporte - Yoga
        $yogaData = @{
            nombre = "Yoga"
            descripcion = "Disciplina física y mental que combina posturas, respiración y meditación"
            nivel = "PRINCIPIANTE"
        } | ConvertTo-Json
        
        Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/deportes" -Body $yogaData -Headers $entrenadorHeaders -ExpectedStatus 201 -TestName "4.2 Crear Deporte - Yoga"
        
        # 4.3 Crear Deporte - CrossFit
        $crossfitData = @{
            nombre = "CrossFit"
            descripcion = "Entrenamiento funcional de alta intensidad que combina cardio y fuerza"
            nivel = "AVANZADO"
        } | ConvertTo-Json
        
        Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/deportes" -Body $crossfitData -Headers $entrenadorHeaders -ExpectedStatus 201 -TestName "4.3 Crear Deporte - CrossFit"
        
        # 4.4 Obtener Deporte por ID
        if ($script:IdDeporteYoga) {
            Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/deportes/$($script:IdDeporteYoga)" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "4.4 Obtener Deporte por ID"
        }
    }
    
    # FASE 5: GESTIÓN DE CLIENTES
    Write-Host "`n👤 FASE 5: GESTIÓN DE CLIENTES" -ForegroundColor Yellow
    Write-Host "=============================="
    
    if ($script:TokenCliente -and $script:TokenEntrenador) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        $entrenadorHeaders = @{ Authorization = "Bearer $($script:TokenEntrenador)" }
        
        # 5.1 Listar Clientes
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/clientes?page=1&limit=10" -Headers $entrenadorHeaders -ExpectedStatus 200 -TestName "5.1 Listar Clientes"
        
        # 5.2 Crear Perfil de Cliente Completo
        if ($script:IdCliente) {
            $clientePerfilData = @{
                id_usuario = [int]$script:IdCliente
                telefono = "+34 612 345 678"
                direccion = "Calle Gran Vía 123, 4º B, 28013 Madrid, España"
                fecha_nacimiento = "1990-05-15"
                genero = "MASCULINO"
                peso = 75.5
                altura = 178
                nivel_experiencia = "INTERMEDIO"
                objetivos = "Perder peso y ganar masa muscular"
                condiciones_medicas = "Ninguna"
                preferencias_entrenamiento = "Mañanas, ejercicios funcionales"
            } | ConvertTo-Json
            
            Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/clientes" -Body $clientePerfilData -Headers $clienteHeaders -ExpectedStatus 201 -TestName "5.2 Crear Perfil de Cliente Completo"
        }
    }
    
    # FASE 6: GESTIÓN DE ENTRENADORES
    Write-Host "`n🏃‍♂️ FASE 6: GESTIÓN DE ENTRENADORES" -ForegroundColor Yellow
    Write-Host "===================================="
    
    if ($script:TokenCliente -and $script:TokenEntrenador) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        $entrenadorHeaders = @{ Authorization = "Bearer $($script:TokenEntrenador)" }
        
        # 6.1 Listar Entrenadores
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/entrenadores?page=1&limit=10" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "6.1 Listar Entrenadores"
        
        # 6.2 Crear Perfil de Entrenador Completo
        if ($script:IdEntrenador) {
            $entrenadorPerfilData = @{
                id_usuario = [int]$script:IdEntrenador
                especialidad = "Yoga, Pilates y Mindfulness"
                experiencia = 8
                descripcion = "Entrenadora certificada con 8 años de experiencia en yoga y pilates."
                certificaciones = "Certificación Internacional de Yoga Alliance (RYT-500)"
                tarifa_por_hora = 45.00
                ubicacion = "Madrid Centro"
                disponibilidad = "Lunes a Viernes: 7:00-20:00"
                foto_url = "https://example.com/photos/maria-gonzalez.jpg"
                telefono = "+34 654 987 321"
                idiomas = "Español, Inglés, Francés"
                modalidad = "Presencial y Online"
            } | ConvertTo-Json
            
            Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/entrenadores" -Body $entrenadorPerfilData -Headers $entrenadorHeaders -ExpectedStatus 201 -TestName "6.2 Crear Perfil de Entrenador Completo"
        }
        
        # 6.3 Buscar Entrenadores
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/entrenadores/buscar" -Headers $clienteHeaders -ExpectedStatus 200 -TestName "6.3 Buscar Entrenadores - Sin filtros"
    }
    
    # FASE 7: PRUEBAS DE VALIDACIÓN Y ERRORES
    Write-Host "`n🔍 FASE 7: PRUEBAS DE VALIDACIÓN Y ERRORES" -ForegroundColor Yellow
    Write-Host "==========================================="
    
    # 7.1 Probar Autenticación Inválida
    Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/usuarios" -ExpectedStatus 401 -TestName "7.1 Sin token - Debe fallar"
    
    $invalidHeaders = @{ Authorization = "Bearer token_invalido" }
    Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/usuarios" -Headers $invalidHeaders -ExpectedStatus 401 -TestName "7.2 Token inválido - Debe fallar"
    
    # 7.2 Probar Validaciones de Datos
    $emailDuplicadoData = @{
        nombre = "Test"
        apellido = "Duplicado"
        email = "juan.perez@email.com"
        contrasena = "password123"
        rol = "CLIENTE"
    } | ConvertTo-Json
    
    Invoke-ApiRequest -Method "POST" -Url "$ApiUrl/auth/register" -Body $emailDuplicadoData -ExpectedStatus 400 -TestName "7.3 Email duplicado - Debe fallar"
    
    # 7.3 Probar IDs Inexistentes
    if ($script:TokenCliente) {
        $clienteHeaders = @{ Authorization = "Bearer $($script:TokenCliente)" }
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/usuarios/99999" -Headers $clienteHeaders -ExpectedStatus 404 -TestName "7.4 Usuario inexistente - Debe fallar"
        Invoke-ApiRequest -Method "GET" -Url "$ApiUrl/deportes/99999" -Headers $clienteHeaders -ExpectedStatus 404 -TestName "7.5 Deporte inexistente - Debe fallar"
    }
}

# Función para mostrar resumen final
function Show-TestSummary {
    Write-Host "`n📊 RESUMEN FINAL DEL TEST" -ForegroundColor Blue
    Write-Host "=========================" -ForegroundColor Blue
    Write-Host "Total de pruebas: $($script:TestCount)" -ForegroundColor Yellow
    Write-Host "Pruebas exitosas: $($script:PassCount)" -ForegroundColor Green
    Write-Host "Pruebas fallidas: $($script:FailCount)" -ForegroundColor Red
    
    if ($script:TestCount -gt 0) {
        $successRate = [math]::Round(($script:PassCount * 100 / $script:TestCount), 2)
        Write-Host "Tasa de éxito: $successRate%" -ForegroundColor Yellow
    }
    
    if ($script:FailCount -eq 0) {
        Write-Host "`n🎉 ¡TODOS LOS TESTS PASARON! LA API ESTÁ COMPLETAMENTE FUNCIONAL" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Algunos tests fallaron. Revisar el log: $TestLog" -ForegroundColor Yellow
    }
    
    Write-Host "`n📝 Log completo guardado en: $TestLog" -ForegroundColor Blue
}

# Verificar dependencias
function Test-Dependencies {
    # Verificar que el servidor esté corriendo
    try {
        $response = Invoke-RestMethod -Uri $BaseUrl -Method GET -TimeoutSec 5
        Write-Host "✅ Servidor detectado en $BaseUrl" -ForegroundColor Green
    } catch {
        Write-Host "❌ El servidor no está corriendo en $BaseUrl" -ForegroundColor Red
        Write-Host "Por favor, ejecuta: npm start" -ForegroundColor Yellow
        exit 1
    }
}

# Función principal
function Main {
    Write-Host "🚀 Iniciando test automatizado de la API FitConnect..." -ForegroundColor Green
    
    Test-Dependencies
    Start-ApiTests
    Show-TestSummary
    
    Write-Host "`n✅ Test completado!" -ForegroundColor Green
}

# Ejecutar si se llama directamente
if ($MyInvocation.InvocationName -ne '.') {
    Main
}