// Tipos ENUM basados en tu esquema
export type RolUsuario = 'CLIENTE' | 'ENTRENADOR';
export type NivelDeporte = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

// Entidad Usuario principal
export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena?: string; // Optional para responses (no devolver password)
  rol: RolUsuario;
  creado_en: Date;
}

export interface CreateUsuarioData {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rol: RolUsuario;
}

export interface UpdateUsuarioData {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: RolUsuario;
}

// Entidad Cliente
export interface Cliente {
  id_cliente: number;
  id_usuario: number;
  telefono?: string;
  direccion?: string;
  fecha_registro: Date;
  // Datos del usuario relacionado
  usuario?: Usuario;
}

// Entidad Entrenador
export interface Entrenador {
  id_entrenador: number;
  id_usuario: number;
  especialidad?: string;
  experiencia?: number;
  descripcion?: string;
  foto_url?: string;
  // Datos del usuario relacionado
  usuario?: Usuario;
}

// Entidad Deporte
export interface Deporte {
  id_deporte: number;
  nombre: string;
  descripcion?: string;
  nivel: NivelDeporte;
}