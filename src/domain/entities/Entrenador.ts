import { Usuario } from './User';

export interface Entrenador {
  id_entrenador: number;
  id_usuario: number;
  especialidad?: string;
  experiencia?: number;
  descripcion?: string;
  foto_url?: string;
  // Relación con usuario
  usuario?: Usuario;
}

export interface CreateEntrenadorData {
  id_usuario: number;
  especialidad?: string;
  experiencia?: number;
  descripcion?: string;
  foto_url?: string;
}

export interface UpdateEntrenadorData {
  especialidad?: string;
  experiencia?: number;
  descripcion?: string;
  foto_url?: string;
}