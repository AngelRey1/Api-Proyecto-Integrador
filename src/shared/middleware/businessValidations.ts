import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

export class BusinessValidations {
  
  /**
   * 🔍 Middleware para validar que solo se puedan crear reseñas después de sesiones completadas
   */
  static async validarReseñaPermitida(req: AuthRequest, res: Response, next: NextFunction) {
    const { id_reserva } = req.body;
    const usuario = req.user;
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado"
      });
    }
    
    try {
      // Verificar que la reserva pertenece al usuario y está completada
      const reservaValida = await BusinessValidations.verificarReservaCompletada(id_reserva, usuario.id);
      
      if (!reservaValida) {
        return res.status(400).json({
          success: false,
          error: "No puedes dejar una reseña para esta reserva",
          code: "RESERVA_NO_COMPLETADA",
          detalles: "Solo puedes reseñar sesiones que hayas completado"
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Error al validar la reserva"
      });
    }
  }
  
  /**
   * 🔍 Middleware para validar disponibilidad antes de crear reservas
   */
  static async validarDisponibilidadReserva(req: AuthRequest, res: Response, next: NextFunction) {
    const { id_sesion } = req.body;
    const usuario = req.user;
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: "Usuario no autenticado"
      });
    }
    
    try {
      // Verificar disponibilidad
      const disponible = await BusinessValidations.verificarSesionDisponible(id_sesion);
      
      if (!disponible) {
        return res.status(400).json({
          success: false,
          error: "La sesión ya no está disponible",
          code: "SESION_OCUPADA",
          detalles: "Este horario ya fue reservado por otro cliente"
        });
      }
      
      // Verificar conflictos de horario del usuario
      const conflicto = await BusinessValidations.verificarConflictoUsuario(usuario.id, id_sesion);
      
      if (conflicto) {
        return res.status(400).json({
          success: false,
          error: "Tienes un conflicto de horario",
          code: "CONFLICTO_HORARIO",
          detalles: "Ya tienes una reserva en el mismo horario"
        });
      }
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Error al validar disponibilidad"
      });
    }
  }
  
  /**
   * 🔍 Middleware para validar que solo entrenadores puedan acceder a ciertos endpoints
   */
  static validarRolEntrenador(req: AuthRequest, res: Response, next: NextFunction) {
    const usuario = req.user;
    
    if (!usuario || usuario.rol !== 'ENTRENADOR') {
      return res.status(403).json({
        success: false,
        error: "Solo los entrenadores pueden acceder a este recurso",
        code: "ROL_NO_AUTORIZADO"
      });
    }
    
    next();
  }
  
  /**
   * 🔍 Middleware para validar que solo clientes puedan hacer reservas
   */
  static validarRolCliente(req: AuthRequest, res: Response, next: NextFunction) {
    const usuario = req.user;
    
    if (!usuario || usuario.rol !== 'CLIENTE') {
      return res.status(403).json({
        success: false,
        error: "Solo los clientes pueden hacer reservas",
        code: "ROL_NO_AUTORIZADO"
      });
    }
    
    next();
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // 🔧 MÉTODOS AUXILIARES (En producción, conectar con base de datos)
  // ═══════════════════════════════════════════════════════════════════
  
  private static async verificarReservaCompletada(id_reserva: number, cliente_id: number): Promise<boolean> {
    // En producción:
    // SELECT r.*, s.estado as estado_sesion 
    // FROM reservas r 
    // JOIN sesiones s ON r.id_sesion = s.id_sesion 
    // WHERE r.id_reserva = ? AND r.id_cliente = ? AND s.estado = 'COMPLETADA'
    
    console.log(`🔍 Validando reserva completada: ${id_reserva} para cliente ${cliente_id}`);
    return true; // Mock
  }
  
  private static async verificarSesionDisponible(id_sesion: number): Promise<boolean> {
    // En producción:
    // SELECT COUNT(*) as reservas_activas 
    // FROM reservas 
    // WHERE id_sesion = ? AND estado IN ('PENDIENTE', 'CONFIRMADA')
    
    console.log(`🔍 Verificando disponibilidad de sesión: ${id_sesion}`);
    return true; // Mock
  }
  
  private static async verificarConflictoUsuario(cliente_id: number, id_sesion: number): Promise<boolean> {
    // En producción: Verificar solapamiento de horarios
    console.log(`🔍 Verificando conflictos para cliente ${cliente_id} en sesión ${id_sesion}`);
    return false; // Mock
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🎯 VALIDACIONES ESPECÍFICAS POR ENDPOINT
// ═══════════════════════════════════════════════════════════════════

/**
 * Validaciones para el flujo de reservas
 */
export const validacionesReserva = [
  BusinessValidations.validarRolCliente,
  BusinessValidations.validarDisponibilidadReserva
];

/**
 * Validaciones para el flujo de reseñas
 */
export const validacionesReseña = [
  BusinessValidations.validarRolCliente,
  BusinessValidations.validarReseñaPermitida
];

/**
 * Validaciones para endpoints de entrenadores
 */
export const validacionesEntrenador = [
  BusinessValidations.validarRolEntrenador
];