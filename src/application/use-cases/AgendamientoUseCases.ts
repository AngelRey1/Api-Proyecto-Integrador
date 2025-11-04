import { z } from 'zod';

// Esquemas de validación basados en la estructura real
const agendarReservaSchema = z.object({
    cliente_id: z.number().positive('ID de cliente inválido'),
    sesion_id: z.number().positive('ID de sesión inválido'),
    fecha_hora: z.string().datetime('Fecha y hora inválida'),
    notas: z.string().optional(),
});

export interface ReservaAgendada {
    id_reserva: number;
    cliente: {
        id_cliente: number;
        nombre: string;
        apellido: string;
        telefono?: string;
    };
    sesion: {
        id_sesion: number;
        fecha: string;
        cupos_disponibles: number;
        entrenador: {
            id_entrenador: number;
            especialidad: string;
            nombre: string;
            apellido: string;
        };
    };
    estado: string;
    fecha_reserva: string;
    notas?: string;
}

export interface SesionDisponible {
    id_sesion: number;
    fecha: string;
    cupos_disponibles: number;
    cupos_ocupados: number;
    entrenador: {
        id_entrenador: number;
        especialidad: string;
        experiencia: number;
        descripcion: string;
        usuario: {
            nombre: string;
            apellido: string;
        };
    };
}

export class AgendamientoUseCases {
    private supabase: any;

    constructor() {
        const { createClient } = require('@supabase/supabase-js');
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }

    async buscarSesionesDisponibles(filtros: {
        fecha?: string;
        especialidad?: string;
        entrenador_id?: number;
    }): Promise<SesionDisponible[]> {
        try {
            let query = this.supabase
                .from('sesion')
                .select(`
                    id_sesion,
                    fecha,
                    cupos_disponibles,
                    entrenador!inner(
                        id_entrenador,
                        especialidad,
                        experiencia,
                        descripcion,
                        usuario!inner(
                            nombre,
                            apellido
                        )
                    )
                `);

            // Aplicar filtros
            if (filtros.fecha) {
                query = query.gte('fecha', filtros.fecha);
            }

            if (filtros.especialidad) {
                query = query.ilike('entrenador.especialidad', `%${filtros.especialidad}%`);
            }

            if (filtros.entrenador_id) {
                query = query.eq('entrenador.id_entrenador', filtros.entrenador_id);
            }

            const { data: sesiones, error } = await query;

            if (error) {
                throw new Error(`Error consultando sesiones: ${error.message}`);
            }

            // Calcular cupos ocupados para cada sesión
            const sesionesConCupos = await Promise.all(
                (sesiones || []).map(async (sesion: any) => {
                    const { data: reservas } = await this.supabase
                        .from('reserva')
                        .select('id_reserva')
                        .eq('id_sesion', sesion.id_sesion)
                        .eq('estado', 'CONFIRMADA');

                    const cuposOcupados = reservas?.length || 0;

                    return {
                        ...sesion,
                        cupos_ocupados: cuposOcupados,
                        cupos_disponibles: Math.max(0, sesion.cupos_disponibles - cuposOcupados)
                    };
                })
            );

            // Filtrar solo sesiones con cupos disponibles
            return sesionesConCupos.filter(sesion => sesion.cupos_disponibles > 0);

        } catch (error) {
            throw new Error(`Error buscando sesiones: ${(error as Error).message}`);
        }
    }

    async agendarReserva(datosReserva: any): Promise<ReservaAgendada> {
        try {
            // 1. VALIDAR DATOS DE ENTRADA
            const datosValidados = agendarReservaSchema.parse(datosReserva);

            // 2. VALIDAR FECHA Y HORA
            const fechaReserva = new Date(datosValidados.fecha_hora);
            const ahora = new Date();
            
            if (fechaReserva <= ahora) {
                throw new Error('No se puede agendar una reserva en el pasado');
            }

            const dosHorasEnMs = 2 * 60 * 60 * 1000;
            if (fechaReserva.getTime() - ahora.getTime() < dosHorasEnMs) {
                throw new Error('Las reservas deben agendarse con al menos 2 horas de anticipación');
            }

            // 3. VERIFICAR DISPONIBILIDAD DE LA SESIÓN
            const disponibilidad = await this.verificarDisponibilidadSesion(
                datosValidados.sesion_id,
                datosValidados.fecha_hora
            );

            if (!disponibilidad.disponible) {
                throw new Error(`La sesión no está disponible. ${disponibilidad.razon}`);
            }

            // 4. VERIFICAR CONFLICTOS DEL CLIENTE
            const tieneConflicto = await this.verificarConflictoCliente(
                datosValidados.cliente_id,
                datosValidados.sesion_id,
                datosValidados.fecha_hora
            );

            if (tieneConflicto) {
                throw new Error('Ya tienes una reserva para esta sesión o en este horario');
            }

            // 5. CREAR LA RESERVA EN LA BASE DE DATOS
            const { data: nuevaReserva, error: errorReserva } = await this.supabase
                .from('reserva')
                .insert({
                    id_cliente: datosValidados.cliente_id,
                    id_sesion: datosValidados.sesion_id,
                    estado: 'CONFIRMADA',
                    fecha_reserva: new Date().toISOString()
                })
                .select()
                .single();

            if (errorReserva || !nuevaReserva) {
                throw new Error(`Error creando reserva: ${errorReserva?.message || 'Error desconocido'}`);
            }

            // 6. OBTENER DATOS COMPLETOS PARA LA RESPUESTA
            const reservaCompleta = await this.obtenerReservaCompleta(nuevaReserva.id_reserva);

            return reservaCompleta;

        } catch (error) {
            if (error instanceof z.ZodError) {
                const errores = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                throw new Error(`Datos inválidos: ${errores}`);
            }
            throw new Error(`Error agendando reserva: ${(error as Error).message}`);
        }
    }

    async obtenerReservasCliente(clienteId: number, estado?: string): Promise<ReservaAgendada[]> {
        try {
            let query = this.supabase
                .from('reserva')
                .select(`
                    id_reserva,
                    estado,
                    fecha_reserva,
                    cliente!inner(
                        id_cliente,
                        usuario!inner(
                            nombre,
                            apellido,
                            telefono
                        )
                    ),
                    sesion!inner(
                        id_sesion,
                        fecha,
                        cupos_disponibles,
                        entrenador!inner(
                            id_entrenador,
                            especialidad,
                            usuario!inner(
                                nombre,
                                apellido
                            )
                        )
                    )
                `)
                .eq('id_cliente', clienteId);

            if (estado) {
                query = query.eq('estado', estado);
            }

            const { data: reservas, error } = await query.order('fecha_reserva', { ascending: false });

            if (error) {
                throw new Error(`Error consultando reservas: ${error.message}`);
            }

            return reservas || [];

        } catch (error) {
            throw new Error(`Error obteniendo reservas: ${(error as Error).message}`);
        }
    }

    async cancelarReserva(reservaId: number, clienteId: number): Promise<void> {
        try {
            // Verificar que la reserva pertenece al cliente
            const { data: reserva, error: errorVerificar } = await this.supabase
                .from('reserva')
                .select('id_cliente, estado')
                .eq('id_reserva', reservaId)
                .single();

            if (errorVerificar || !reserva) {
                throw new Error('Reserva no encontrada');
            }

            if (reserva.id_cliente !== clienteId) {
                throw new Error('No tienes permisos para cancelar esta reserva');
            }

            if (reserva.estado === 'CANCELADA') {
                throw new Error('La reserva ya está cancelada');
            }

            // Cancelar la reserva
            const { error: errorCancelar } = await this.supabase
                .from('reserva')
                .update({ estado: 'CANCELADA' })
                .eq('id_reserva', reservaId);

            if (errorCancelar) {
                throw new Error(`Error cancelando reserva: ${errorCancelar.message}`);
            }

        } catch (error) {
            throw new Error(`Error cancelando reserva: ${(error as Error).message}`);
        }
    }

    // MÉTODOS PRIVADOS DE VALIDACIÓN

    private async verificarDisponibilidadSesion(
        sesionId: number,
        fechaHora: string
    ): Promise<{ disponible: boolean; razon?: string }> {
        try {
            // Obtener datos de la sesión
            const { data: sesion, error: errorSesion } = await this.supabase
                .from('sesion')
                .select('id_sesion, fecha, cupos_disponibles')
                .eq('id_sesion', sesionId)
                .single();

            if (errorSesion || !sesion) {
                return { disponible: false, razon: 'Sesión no encontrada' };
            }

            // Verificar fecha
            const fechaSesion = new Date(sesion.fecha);
            const fechaSolicitada = new Date(fechaHora);
            
            if (fechaSesion.toDateString() !== fechaSolicitada.toDateString()) {
                return { disponible: false, razon: 'La fecha no coincide con la sesión' };
            }

            // Contar reservas confirmadas
            const { data: reservas, error: errorReservas } = await this.supabase
                .from('reserva')
                .select('id_reserva')
                .eq('id_sesion', sesionId)
                .eq('estado', 'CONFIRMADA');

            if (errorReservas) {
                throw new Error(`Error consultando reservas: ${errorReservas.message}`);
            }

            const reservasActuales = reservas?.length || 0;
            const cuposRestantes = sesion.cupos_disponibles - reservasActuales;

            if (cuposRestantes <= 0) {
                return { disponible: false, razon: 'No hay cupos disponibles' };
            }

            return { disponible: true, razon: `${cuposRestantes} cupos disponibles` };

        } catch (error) {
            throw new Error(`Error verificando disponibilidad: ${(error as Error).message}`);
        }
    }

    private async verificarConflictoCliente(
        clienteId: number,
        sesionId: number,
        fechaHora: string
    ): Promise<boolean> {
        try {
            // Verificar si ya tiene reserva para esta sesión
            const { data: reservaExistente, error } = await this.supabase
                .from('reserva')
                .select('id_reserva')
                .eq('id_cliente', clienteId)
                .eq('id_sesion', sesionId)
                .in('estado', ['CONFIRMADA']);

            if (error) {
                throw new Error(`Error verificando conflictos: ${error.message}`);
            }

            return reservaExistente && reservaExistente.length > 0;

        } catch (error) {
            throw new Error(`Error verificando conflictos: ${(error as Error).message}`);
        }
    }

    private async obtenerReservaCompleta(reservaId: number): Promise<ReservaAgendada> {
        try {
            const { data: reserva, error } = await this.supabase
                .from('reserva')
                .select(`
                    id_reserva,
                    estado,
                    fecha_reserva,
                    cliente!inner(
                        id_cliente,
                        usuario!inner(
                            nombre,
                            apellido,
                            telefono
                        )
                    ),
                    sesion!inner(
                        id_sesion,
                        fecha,
                        cupos_disponibles,
                        entrenador!inner(
                            id_entrenador,
                            especialidad,
                            usuario!inner(
                                nombre,
                                apellido
                            )
                        )
                    )
                `)
                .eq('id_reserva', reservaId)
                .single();

            if (error || !reserva) {
                throw new Error('Error obteniendo datos de la reserva');
            }

            return {
                id_reserva: reserva.id_reserva,
                cliente: {
                    id_cliente: reserva.cliente.id_cliente,
                    nombre: reserva.cliente.usuario.nombre,
                    apellido: reserva.cliente.usuario.apellido,
                    telefono: reserva.cliente.usuario.telefono,
                },
                sesion: {
                    id_sesion: reserva.sesion.id_sesion,
                    fecha: reserva.sesion.fecha,
                    cupos_disponibles: reserva.sesion.cupos_disponibles,
                    entrenador: {
                        id_entrenador: reserva.sesion.entrenador.id_entrenador,
                        especialidad: reserva.sesion.entrenador.especialidad,
                        nombre: reserva.sesion.entrenador.usuario.nombre,
                        apellido: reserva.sesion.entrenador.usuario.apellido,
                    },
                },
                estado: reserva.estado,
                fecha_reserva: reserva.fecha_reserva,
            };

        } catch (error) {
            throw new Error(`Error obteniendo reserva completa: ${(error as Error).message}`);
        }
    }
}