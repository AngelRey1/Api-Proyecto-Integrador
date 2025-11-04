import { Router } from 'express';
import { usuarioRoutes } from './usuarioRoutes';
// 🎯 FUNCIONALIDADES PRINCIPALES
import { agendamientoRoutes } from './agendamientoRoutes';
// NUEVAS FUNCIONALIDADES
import entrenadorDeporteRoutes from './entrenadorDeporteRoutes';
import calendarioDisponibilidadRoutes from './calendarioDisponibilidadRoutes';
import catalogoEntrenamientoRoutes from './catalogoEntrenamientoRoutes';
import catalogoActividadesRoutes from './catalogoActividadesRoutes';
import retroalimentacionAppRoutes from './retroalimentacionAppRoutes';
import documentacionRoutes from './documentacionRoutes';
// LEGACY ROUTES
import { entrenadorRoutes } from './entrenadorRoutes';
import { clienteRoutes } from './clienteRoutes';
import { deporteRoutes } from './deporteRoutes';
import { horarioRoutes } from './horarioRoutes';
import { sesionRoutes } from './sesionRoutes';
import { reservaRoutes } from './reservaRoutes';
import { pagoRoutes } from './pagoRoutes';
import { reseñaRoutes } from './reseñaRoutes';
import { comentarioRoutes } from './comentarioRoutes';
import { notificacionRoutes } from './notificacionRoutes';
import { authenticateToken, authorizeRoles } from '@/shared/middleware/auth';

const router = Router();

// ═══════════════════════════════════════════════════════════════════
// 🎯 FLUJO PRINCIPAL DE LA APLICACIÓN (ORDENADO POR PASOS)
// ═══════════════════════════════════════════════════════════════════

// 🔐 PASO 1: AUTENTICACIÓN (registro y login - SIN autenticación requerida)
router.use('/usuarios', usuarioRoutes);

// 👤 PASO 2: CREAR PERFIL (requiere autenticación)
router.use('/clientes', authenticateToken, clienteRoutes);
router.use('/entrenadores', authenticateToken, entrenadorRoutes);

// 📅 PASO 3: CONFIGURAR DISPONIBILIDAD (solo entrenadores)
router.use('/horarios', authenticateToken, authorizeRoles('ENTRENADOR'), horarioRoutes);
router.use('/entrenador-deportes', authenticateToken, authorizeRoles('ENTRENADOR'), entrenadorDeporteRoutes);
router.use('/calendario-disponibilidad', authenticateToken, authorizeRoles('ENTRENADOR'), calendarioDisponibilidadRoutes);

// 🎯 PASO 4: AGENDAMIENTO (CORE DE LA APP) ⭐
router.use('/agendamiento', agendamientoRoutes);

// 💰 PASO 5: GESTIÓN DE PAGOS (requiere autenticación)
router.use('/pagos', authenticateToken, pagoRoutes);

// ⭐ PASO 6: RESEÑAS Y FEEDBACK (después de la sesión)
router.use('/resenas', authenticateToken, reseñaRoutes);
router.use('/comentarios', authenticateToken, comentarioRoutes);

// 🔔 PASO 7: NOTIFICACIONES Y COMUNICACIÓN
router.use('/notificaciones', authenticateToken, notificacionRoutes);

// ═══════════════════════════════════════════════════════════════════
// 📚 CATÁLOGOS Y CONFIGURACIÓN DEL SISTEMA
// ═══════════════════════════════════════════════════════════════════

// 🏆 CATÁLOGOS (requieren autenticación)
router.use('/deportes', authenticateToken, deporteRoutes);
router.use('/catalogos-entrenamiento', authenticateToken, catalogoEntrenamientoRoutes);
router.use('/catalogo-actividades', authenticateToken, authorizeRoles('ENTRENADOR'), catalogoActividadesRoutes);

// ═══════════════════════════════════════════════════════════════════
// � ENDPOINTS TÉCNICOS Y ADMINISTRATIVOS
// ═══════════════════════════════════════════════════════════════════

// 🔧 GESTIÓN TÉCNICA (para desarrolladores y administradores)
router.use('/sesiones', authenticateToken, sesionRoutes);
router.use('/reservas', authenticateToken, reservaRoutes);
router.use('/retroalimentacion-app', authenticateToken, retroalimentacionAppRoutes);

// ═══════════════════════════════════════════════════════════════════
// 📚 DOCUMENTACIÓN Y AYUDA
// ═══════════════════════════════════════════════════════════════════

// 📖 GUÍAS DE USO Y ESTADÍSTICAS
router.use('/documentacion', documentacionRoutes);

// ═══════════════════════════════════════════════════════════════════
// 🔧 ENDPOINTS TÉCNICOS (Para compatibilidad)
// ═══════════════════════════════════════════════════════════════════

// SESIONES TÉCNICAS
router.use('/sesiones', authenticateToken, sesionRoutes);

// RESERVAS TÉCNICAS
router.use('/reservas', authenticateToken, reservaRoutes);

export { router as apiRoutes };