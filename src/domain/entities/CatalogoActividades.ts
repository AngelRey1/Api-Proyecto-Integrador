import { Entrenador } from './Entrenador';
import { Cliente } from './Cliente';
import { Deporte } from './Deporte';
import { CatalogoEntrenamiento } from './CatalogoEntrenamiento';

export type EstadoActividad = 'EN_CURSO' | 'FINALIZADO' | 'PENDIENTE';

export interface CatalogoActividades {
  id_actividad: number;
  id_entrenador?: number;
  id_cliente?: number;
  id_deporte?: number;
  id_catalogo?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado: EstadoActividad;
  notas?: string;
  // Relaciones
  entrenador?: Entrenador;
  cliente?: Cliente;
  deporte?: Deporte;
  catalogo?: CatalogoEntrenamiento;
}

export interface CreateCatalogoActividadesData {
  id_entrenador?: number;
  id_cliente?: number;
  id_deporte?: number;
  id_catalogo?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: EstadoActividad;
  notas?: string;
}

export interface UpdateCatalogoActividadesData {
  id_entrenador?: number;
  id_cliente?: number;
  id_deporte?: number;
  id_catalogo?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: EstadoActividad;
  notas?: string;
}