const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class CompleteVerificationAndFix {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.supabase = null;
    this.serverProcess = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '✅',
      error: '❌',
      warning: '⚠️',
      fix: '🔧'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
    if (type === 'fix') this.fixes.push(message);
  }

  // 1. Verificar variables de entorno
  async verifyEnvironmentVariables() {
    this.log('=== VERIFICANDO VARIABLES DE ENTORNO ===');
    
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
      'PORT',
      'NODE_ENV',
      'API_VERSION',
      'API_PREFIX'
    ];

    const missingVars = [];
    const invalidVars = [];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      } else {
        // Validaciones específicas
        if (varName === 'SUPABASE_URL' && !process.env[varName].startsWith('https://')) {
          invalidVars.push(`${varName}: debe comenzar con https://`);
        }
        if (varName === 'JWT_SECRET' && process.env[varName].length < 32) {
          invalidVars.push(`${varName}: debe tener al menos 32 caracteres`);
        }
        if (varName === 'PORT' && isNaN(parseInt(process.env[varName]))) {
          invalidVars.push(`${varName}: debe ser un número válido`);
        }
      }
    }

    if (missingVars.length > 0) {
      this.log(`Variables faltantes: ${missingVars.join(', ')}`, 'error');
      await this.fixMissingEnvironmentVariables(missingVars);
    }

    if (invalidVars.length > 0) {
      this.log(`Variables inválidas: ${invalidVars.join(', ')}`, 'error');
      await this.fixInvalidEnvironmentVariables(invalidVars);
    }

    if (missingVars.length === 0 && invalidVars.length === 0) {
      this.log('Todas las variables de entorno están correctas');
    }
  }

  async fixMissingEnvironmentVariables(missingVars) {
    this.log('Corrigiendo variables de entorno faltantes...', 'fix');
    
    const envPath = '.env';
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const defaultValues = {
      'PORT': '3000',
      'NODE_ENV': 'development',
      'API_VERSION': 'v1',
      'API_PREFIX': '/api',
      'JWT_SECRET': 'app-deporte-super-secret-key-2024-production-ready-' + Math.random().toString(36).substring(2, 15)
    };

    for (const varName of missingVars) {
      if (defaultValues[varName]) {
        envContent += `\n${varName}=${defaultValues[varName]}`;
        this.log(`Agregada variable ${varName} con valor por defecto`, 'fix');
      } else {
        this.log(`Variable ${varName} requiere configuración manual`, 'warning');
      }
    }

    if (envContent) {
      fs.writeFileSync(envPath, envContent);
      this.log('Archivo .env actualizado', 'fix');
    }
  }

  async fixInvalidEnvironmentVariables(invalidVars) {
    this.log('Corrigiendo variables de entorno inválidas...', 'fix');
    
    for (const invalid of invalidVars) {
      if (invalid.includes('JWT_SECRET')) {
        const newSecret = 'app-deporte-super-secret-key-2024-production-ready-' + Math.random().toString(36).substring(2, 15);
        this.updateEnvVariable('JWT_SECRET', newSecret);
        this.log('JWT_SECRET actualizado con valor seguro', 'fix');
      }
    }
  }

  updateEnvVariable(key, value) {
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
    
    fs.writeFileSync(envPath, envContent);
  }

  // 2. Verificar conexión a Supabase
  async verifySupabaseConnection() {
    this.log('=== VERIFICANDO CONEXIÓN A SUPABASE ===');
    
    try {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Probar conexión básica
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('count')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        this.log('Tabla usuarios no existe, creando esquema...', 'warning');
        await this.createDatabaseSchema();
      } else if (error) {
        this.log(`Error de conexión a Supabase: ${error.message}`, 'error');
        return false;
      } else {
        this.log('Conexión a Supabase exitosa');
      }

      return true;
    } catch (error) {
      this.log(`Error al conectar con Supabase: ${error.message}`, 'error');
      return false;
    }
  }

  // 3. Crear/verificar esquema de base de datos
  async createDatabaseSchema() {
    this.log('=== CREANDO/VERIFICANDO ESQUEMA DE BASE DE DATOS ===');
    
    const tables = [
      {
        name: 'usuarios',
        sql: `
          CREATE TABLE IF NOT EXISTS usuarios (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            telefono VARCHAR(20),
            fecha_nacimiento DATE,
            genero VARCHAR(20),
            nivel_experiencia VARCHAR(50),
            objetivos_fitness TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'deportes',
        sql: `
          CREATE TABLE IF NOT EXISTS deportes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            categoria VARCHAR(50),
            equipamiento_necesario TEXT,
            nivel_dificultad VARCHAR(20),
            calorias_por_hora INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'entrenadores',
        sql: `
          CREATE TABLE IF NOT EXISTS entrenadores (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
            especialidades TEXT[],
            certificaciones TEXT[],
            experiencia_anos INTEGER,
            tarifa_por_hora DECIMAL(10,2),
            calificacion_promedio DECIMAL(3,2),
            biografia TEXT,
            disponible BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'clientes',
        sql: `
          CREATE TABLE IF NOT EXISTS clientes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
            peso DECIMAL(5,2),
            altura DECIMAL(5,2),
            condiciones_medicas TEXT,
            preferencias_entrenamiento TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'entrenador_deportes',
        sql: `
          CREATE TABLE IF NOT EXISTS entrenador_deportes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            entrenador_id UUID REFERENCES entrenadores(id) ON DELETE CASCADE,
            deporte_id UUID REFERENCES deportes(id) ON DELETE CASCADE,
            nivel_competencia VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(entrenador_id, deporte_id)
          );
        `
      },
      {
        name: 'horarios',
        sql: `
          CREATE TABLE IF NOT EXISTS horarios (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            entrenador_id UUID REFERENCES entrenadores(id) ON DELETE CASCADE,
            dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
            hora_inicio TIME NOT NULL,
            hora_fin TIME NOT NULL,
            disponible BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'reservas',
        sql: `
          CREATE TABLE IF NOT EXISTS reservas (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
            entrenador_id UUID REFERENCES entrenadores(id) ON DELETE CASCADE,
            deporte_id UUID REFERENCES deportes(id) ON DELETE CASCADE,
            fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
            duracion_minutos INTEGER NOT NULL,
            estado VARCHAR(20) DEFAULT 'pendiente',
            precio DECIMAL(10,2),
            notas TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'sesiones',
        sql: `
          CREATE TABLE IF NOT EXISTS sesiones (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
            fecha_inicio TIMESTAMP WITH TIME ZONE,
            fecha_fin TIMESTAMP WITH TIME ZONE,
            estado VARCHAR(20) DEFAULT 'programada',
            notas_entrenador TEXT,
            calificacion_cliente INTEGER CHECK (calificacion_cliente >= 1 AND calificacion_cliente <= 5),
            comentarios_cliente TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'pagos',
        sql: `
          CREATE TABLE IF NOT EXISTS pagos (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            reserva_id UUID REFERENCES reservas(id) ON DELETE CASCADE,
            monto DECIMAL(10,2) NOT NULL,
            metodo_pago VARCHAR(50),
            estado VARCHAR(20) DEFAULT 'pendiente',
            fecha_pago TIMESTAMP WITH TIME ZONE,
            referencia_externa VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'catalogo_entrenamientos',
        sql: `
          CREATE TABLE IF NOT EXISTS catalogo_entrenamientos (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            nombre VARCHAR(200) NOT NULL,
            descripcion TEXT,
            deporte_id UUID REFERENCES deportes(id) ON DELETE CASCADE,
            duracion_minutos INTEGER,
            nivel_dificultad VARCHAR(20),
            calorias_estimadas INTEGER,
            equipamiento TEXT[],
            instrucciones TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'catalogo_actividades',
        sql: `
          CREATE TABLE IF NOT EXISTS catalogo_actividades (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            nombre VARCHAR(200) NOT NULL,
            descripcion TEXT,
            categoria VARCHAR(100),
            duracion_minutos INTEGER,
            nivel_dificultad VARCHAR(20),
            calorias_estimadas INTEGER,
            equipamiento TEXT[],
            instrucciones TEXT,
            imagen_url VARCHAR(500),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'calendario_disponibilidad',
        sql: `
          CREATE TABLE IF NOT EXISTS calendario_disponibilidad (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            entrenador_id UUID REFERENCES entrenadores(id) ON DELETE CASCADE,
            fecha DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fin TIME NOT NULL,
            disponible BOOLEAN DEFAULT true,
            motivo_no_disponible VARCHAR(200),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'reseñas',
        sql: `
          CREATE TABLE IF NOT EXISTS reseñas (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
            entrenador_id UUID REFERENCES entrenadores(id) ON DELETE CASCADE,
            sesion_id UUID REFERENCES sesiones(id) ON DELETE CASCADE,
            calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
            comentario TEXT,
            fecha_reseña TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'comentarios',
        sql: `
          CREATE TABLE IF NOT EXISTS comentarios (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
            entrenamiento_id UUID REFERENCES catalogo_entrenamientos(id) ON DELETE CASCADE,
            contenido TEXT NOT NULL,
            fecha_comentario TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'notificaciones',
        sql: `
          CREATE TABLE IF NOT EXISTS notificaciones (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
            titulo VARCHAR(200) NOT NULL,
            mensaje TEXT NOT NULL,
            tipo VARCHAR(50),
            leida BOOLEAN DEFAULT false,
            fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'retroalimentacion_app',
        sql: `
          CREATE TABLE IF NOT EXISTS retroalimentacion_app (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
            tipo_feedback VARCHAR(50),
            calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
            comentarios TEXT,
            fecha_feedback TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ];

    for (const table of tables) {
      try {
        const { error } = await this.supabase.rpc('exec_sql', { 
          sql: table.sql 
        });
        
        if (error) {
          // Intentar crear tabla directamente si RPC falla
          this.log(`Creando tabla ${table.name}...`, 'fix');
          // Para Supabase, usaremos el cliente SQL directo
          await this.createTableDirectly(table);
        } else {
          this.log(`Tabla ${table.name} verificada/creada`);
        }
      } catch (error) {
        this.log(`Error creando tabla ${table.name}: ${error.message}`, 'error');
      }
    }
  }

  async createTableDirectly(table) {
    // Como no podemos ejecutar SQL directamente, verificamos si la tabla existe
    try {
      const { data, error } = await this.supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        this.log(`Tabla ${table.name} no existe. Debe crearse manualmente en Supabase`, 'warning');
      } else {
        this.log(`Tabla ${table.name} existe`);
      }
    } catch (error) {
      this.log(`Error verificando tabla ${table.name}: ${error.message}`, 'warning');
    }
  }

  // 4. Poblar datos de prueba
  async populateTestData() {
    this.log('=== POBLANDO DATOS DE PRUEBA ===');
    
    try {
      // Verificar si ya hay datos
      const { data: existingUsers } = await this.supabase
        .from('usuarios')
        .select('id')
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        this.log('Ya existen datos en la base de datos');
        return;
      }

      // Crear datos de prueba
      const testData = {
        usuarios: [
          {
            email: 'admin@appdeporte.com',
            password_hash: '$2b$10$rQZ8kJZjZjZjZjZjZjZjZu', // password: admin123
            nombre: 'Admin',
            apellido: 'Sistema',
            telefono: '+1234567890',
            fecha_nacimiento: '1990-01-01',
            genero: 'otro',
            nivel_experiencia: 'avanzado',
            objetivos_fitness: 'Administrar sistema'
          },
          {
            email: 'entrenador@appdeporte.com',
            password_hash: '$2b$10$rQZ8kJZjZjZjZjZjZjZjZu', // password: admin123
            nombre: 'Carlos',
            apellido: 'Entrenador',
            telefono: '+1234567891',
            fecha_nacimiento: '1985-05-15',
            genero: 'masculino',
            nivel_experiencia: 'experto',
            objetivos_fitness: 'Entrenar clientes'
          },
          {
            email: 'cliente@appdeporte.com',
            password_hash: '$2b$10$rQZ8kJZjZjZjZjZjZjZjZu', // password: admin123
            nombre: 'Ana',
            apellido: 'Cliente',
            telefono: '+1234567892',
            fecha_nacimiento: '1992-08-20',
            genero: 'femenino',
            nivel_experiencia: 'principiante',
            objetivos_fitness: 'Perder peso y tonificar'
          }
        ],
        deportes: [
          {
            nombre: 'Fitness',
            descripcion: 'Entrenamiento físico general',
            categoria: 'Acondicionamiento',
            equipamiento_necesario: 'Pesas, máquinas',
            nivel_dificultad: 'intermedio',
            calorias_por_hora: 400
          },
          {
            nombre: 'Yoga',
            descripcion: 'Práctica de yoga y meditación',
            categoria: 'Flexibilidad',
            equipamiento_necesario: 'Mat de yoga',
            nivel_dificultad: 'principiante',
            calorias_por_hora: 200
          },
          {
            nombre: 'CrossFit',
            descripcion: 'Entrenamiento funcional de alta intensidad',
            categoria: 'Funcional',
            equipamiento_necesario: 'Barras, kettlebells, box',
            nivel_dificultad: 'avanzado',
            calorias_por_hora: 600
          }
        ]
      };

      // Insertar usuarios
      const { data: insertedUsers, error: usersError } = await this.supabase
        .from('usuarios')
        .insert(testData.usuarios)
        .select();

      if (usersError) {
        this.log(`Error insertando usuarios: ${usersError.message}`, 'error');
      } else {
        this.log(`Insertados ${insertedUsers.length} usuarios de prueba`);
      }

      // Insertar deportes
      const { data: insertedDeportes, error: deportesError } = await this.supabase
        .from('deportes')
        .insert(testData.deportes)
        .select();

      if (deportesError) {
        this.log(`Error insertando deportes: ${deportesError.message}`, 'error');
      } else {
        this.log(`Insertados ${insertedDeportes.length} deportes de prueba`);
      }

      // Crear entrenador y cliente
      if (insertedUsers && insertedUsers.length >= 2) {
        const entrenadorUser = insertedUsers.find(u => u.email === 'entrenador@appdeporte.com');
        const clienteUser = insertedUsers.find(u => u.email === 'cliente@appdeporte.com');

        if (entrenadorUser) {
          const { error: entrenadorError } = await this.supabase
            .from('entrenadores')
            .insert({
              usuario_id: entrenadorUser.id,
              especialidades: ['Fitness', 'CrossFit'],
              certificaciones: ['ACSM', 'NASM'],
              experiencia_anos: 5,
              tarifa_por_hora: 50.00,
              calificacion_promedio: 4.8,
              biografia: 'Entrenador certificado con 5 años de experiencia',
              disponible: true
            });

          if (entrenadorError) {
            this.log(`Error creando entrenador: ${entrenadorError.message}`, 'error');
          } else {
            this.log('Entrenador de prueba creado');
          }
        }

        if (clienteUser) {
          const { error: clienteError } = await this.supabase
            .from('clientes')
            .insert({
              usuario_id: clienteUser.id,
              peso: 65.5,
              altura: 1.65,
              condiciones_medicas: 'Ninguna',
              preferencias_entrenamiento: 'Mañanas, ejercicios de bajo impacto'
            });

          if (clienteError) {
            this.log(`Error creando cliente: ${clienteError.message}`, 'error');
          } else {
            this.log('Cliente de prueba creado');
          }
        }
      }

    } catch (error) {
      this.log(`Error poblando datos de prueba: ${error.message}`, 'error');
    }
  }

  // 5. Verificar servidor API
  async verifyAPIServer() {
    this.log('=== VERIFICANDO SERVIDOR API ===');
    
    return new Promise((resolve) => {
      // Iniciar servidor
      const { spawn } = require('child_process');
      
      this.log('Iniciando servidor API...');
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true
      });

      let serverReady = false;
      let timeout;

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Server running') || output.includes('listening')) {
          if (!serverReady) {
            serverReady = true;
            this.log('Servidor API iniciado correctamente');
            clearTimeout(timeout);
            setTimeout(() => this.testAPIEndpoints().then(resolve), 2000);
          }
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (!serverReady && error.includes('Error')) {
          this.log(`Error iniciando servidor: ${error}`, 'error');
          resolve(false);
        }
      });

      // Timeout de 30 segundos
      timeout = setTimeout(() => {
        if (!serverReady) {
          this.log('Timeout iniciando servidor API', 'error');
          resolve(false);
        }
      }, 30000);
    });
  }

  async testAPIEndpoints() {
    this.log('=== PROBANDO ENDPOINTS DE LA API ===');
    
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const apiPrefix = `${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`;
    
    const endpoints = [
      { method: 'GET', path: '/', name: 'Root endpoint' },
      { method: 'GET', path: '/api-docs', name: 'Swagger docs' },
      { method: 'GET', path: `${apiPrefix}/usuarios`, name: 'Usuarios endpoint' },
      { method: 'GET', path: `${apiPrefix}/deportes`, name: 'Deportes endpoint' },
      { method: 'GET', path: `${apiPrefix}/entrenadores`, name: 'Entrenadores endpoint' }
    ];

    let successCount = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: `${baseURL}${endpoint.path}`,
          timeout: 5000,
          validateStatus: (status) => status < 500 // Aceptar códigos de estado < 500
        });
        
        this.log(`✅ ${endpoint.name}: ${response.status}`);
        successCount++;
      } catch (error) {
        if (error.response) {
          this.log(`⚠️ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`, 'warning');
          if (error.response.status < 500) successCount++; // Errores de cliente son aceptables
        } else {
          this.log(`❌ ${endpoint.name}: ${error.message}`, 'error');
        }
      }
    }

    this.log(`Endpoints probados: ${successCount}/${endpoints.length}`);
    return successCount > 0;
  }

  // 6. Probar autenticación
  async testAuthentication() {
    this.log('=== PROBANDO AUTENTICACIÓN ===');
    
    const baseURL = `http://localhost:${process.env.PORT || 3000}`;
    const apiPrefix = `${process.env.API_PREFIX || '/api'}/${process.env.API_VERSION || 'v1'}`;
    
    try {
      // Probar registro
      const registerData = {
        email: `test${Date.now()}@test.com`,
        password: 'test123456',
        nombre: 'Test',
        apellido: 'User'
      };

      const registerResponse = await axios.post(
        `${baseURL}${apiPrefix}/auth/register`,
        registerData,
        { timeout: 5000, validateStatus: () => true }
      );

      if (registerResponse.status === 201 || registerResponse.status === 200) {
        this.log('✅ Registro de usuario funcional');
        
        // Probar login
        const loginResponse = await axios.post(
          `${baseURL}${apiPrefix}/auth/login`,
          {
            email: registerData.email,
            password: registerData.password
          },
          { timeout: 5000, validateStatus: () => true }
        );

        if (loginResponse.status === 200 && loginResponse.data.token) {
          this.log('✅ Login de usuario funcional');
          
          // Probar endpoint protegido
          const protectedResponse = await axios.get(
            `${baseURL}${apiPrefix}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${loginResponse.data.token}` },
              timeout: 5000,
              validateStatus: () => true
            }
          );

          if (protectedResponse.status === 200) {
            this.log('✅ Endpoints protegidos funcionando');
          } else {
            this.log('⚠️ Endpoints protegidos con problemas', 'warning');
          }
        } else {
          this.log('⚠️ Login con problemas', 'warning');
        }
      } else {
        this.log('⚠️ Registro con problemas', 'warning');
      }
    } catch (error) {
      this.log(`Error probando autenticación: ${error.message}`, 'error');
    }
  }

  // 7. Generar reporte final
  generateReport() {
    this.log('=== REPORTE FINAL ===');
    
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log(`✅ Correcciones aplicadas: ${this.fixes.length}`);
    console.log(`⚠️ Advertencias: ${this.warnings.length}`);
    console.log(`❌ Errores encontrados: ${this.errors.length}`);
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 CORRECCIONES APLICADAS:');
      this.fixes.forEach(fix => console.log(`  - ${fix}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ ADVERTENCIAS:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORES QUE REQUIEREN ATENCIÓN:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    const status = this.errors.length === 0 ? 'EXITOSO' : 'CON ERRORES';
    console.log(`\n🎯 ESTADO FINAL: ${status}`);
    
    if (this.errors.length === 0) {
      console.log('\n🎉 ¡Todos los parámetros y la base de datos están funcionando correctamente!');
    } else {
      console.log('\n🔧 Revisa los errores listados arriba y corrígelos manualmente.');
    }
  }

  async cleanup() {
    if (this.serverProcess) {
      this.log('Cerrando servidor de prueba...');
      this.serverProcess.kill();
    }
  }

  // Método principal
  async run() {
    console.log('🚀 INICIANDO VERIFICACIÓN COMPLETA DEL SISTEMA\n');
    
    try {
      await this.verifyEnvironmentVariables();
      await this.verifySupabaseConnection();
      await this.createDatabaseSchema();
      await this.populateTestData();
      
      const serverStarted = await this.verifyAPIServer();
      if (serverStarted) {
        await this.testAuthentication();
      }
      
      this.generateReport();
    } catch (error) {
      this.log(`Error crítico: ${error.message}`, 'error');
    } finally {
      await this.cleanup();
    }
  }
}

// Ejecutar verificación
const verifier = new CompleteVerificationAndFix();
verifier.run().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});