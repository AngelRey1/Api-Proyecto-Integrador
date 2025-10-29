import { Cliente } from './Cliente';
import { Reseña } from './Reseña';

export interface Comentario {
  id_comentario: number;
  id_cliente: number;
  id_reseña: number;
  contenido: string;
  fecha_comentario: Date;
  // Relaciones
  cliente?: Cliente;
  reseña?: Reseña;
}

export interface CreateComentarioData {
  id_cliente: number;
  id_reseña: number;
  contenido: string;
}

export interface UpdateComentarioData {
  contenido?: string;
}