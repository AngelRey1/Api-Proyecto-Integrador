import { Router } from 'express';
import { usuarioRoutes } from './usuarioRoutes';
import { entrenadorRoutes } from './entrenadorRoutes';
import { clienteRoutes } from './clienteRoutes';
import { deporteRoutes } from './deporteRoutes';
import { catalogoEntrenamientoRoutes } from './catalogoEntrenamientoRoutes';
import { horarioRoutes } from './horarioRoutes';
import { sesionRoutes } from './sesionRoutes';
import { reservaRoutes } from './reservaRoutes';
import { pagoRoutes } from './pagoRoutes';
import { reseñaRoutes } from './reseñaRoutes';
import { comentarioRoutes } from './comentarioRoutes';
import { catalogoActividadesRoutes } from './catalogoActividadesRoutes';
import { calendarioDisponibilidadRoutes } from './calendarioDisponibilidadRoutes';
import { notificacionRoutes } from './notificacionRoutes';
import { retroalimentacionAppRoutes } from './retroalimentacionAppRoutes';
import { entrenadorDeporteRoutes } from './entrenadorDeporteRoutes';
import { authenticateToken, authorizeRoles } from '@/shared/middleware/auth';

const router = Router();

// 1️⃣ AUTENTICACIÓN Y USUARIOS (Orden lógico: primero registro/login)
router.use('/usuarios', usuarioRoutes);

// 2️⃣ GESTIÓN DE PERFILES (Después de crear usuario, crear perfil)
router.use('/entrenadores', authenticateToken, entrenadorRoutes);
router.use('/clientes', authenticateToken, clienteRoutes);
router.use('/entrenador-deportes', authenticateToken, entrenadorDeporteRoutes);

// 3️⃣ CATÁLOGOS (Configuración inicial del sistema) - REQUIEREN AUTENTICACIÓN
router.use('/deportes', authenticateToken, deporteRoutes);
router.use('/catalogos-entrenamiento', authenticateToken, catalogoEntrenamientoRoutes);

// 4️⃣ HORARIOS Y DISPONIBILIDAD (Entrenadores configuran horarios)
router.use('/horarios', authenticateToken, authorizeRoles('ENTRENADOR'), horarioRoutes);
router.use('/calendario-disponibilidad', authenticateToken, authorizeRoles('ENTRENADOR'), calendarioDisponibilidadRoutes);

// 5️⃣ SESIONES (Entrenadores crean sesiones basadas en horarios)
router.use('/sesiones', authenticateToken, sesionRoutes);

// 6️⃣ RESERVAS (Clientes reservan sesiones)
router.use('/reservas', authenticateToken, reservaRoutes);

// 7️⃣ PAGOS (Clientes pagan reservas)
router.use('/pagos', authenticateToken, pagoRoutes);

// 8️⃣ RESEÑAS Y COMENTARIOS (Después del servicio)
router.use('/resenas', authenticateToken, reseñaRoutes);
router.use('/comentarios', authenticateToken, comentarioRoutes);

// 9️⃣ ACTIVIDADES PERSONALIZADAS (Entrenadores)
router.use('/catalogo-actividades', authenticateToken, authorizeRoles('ENTRENADOR'), catalogoActividadesRoutes);

// 🔟 NOTIFICACIONES Y FEEDBACK (Sistema)
router.use('/notificaciones', authenticateToken, notificacionRoutes);
router.use('/retroalimentacion-app', authenticateToken, retroalimentacionAppRoutes);

export { router as apiRoutes };