export type NivelCatalogo = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';

export interface CatalogoEntrenamiento {
  id_catalogo: number;
  nombre: string;
  descripcion?: string;
  nivel: NivelCatalogo;
}

export interface CreateCatalogoEntrenamientoData {
  nombre: string;
  descripcion?: string;
  nivel: NivelCatalogo;
}

export interface UpdateCatalogoEntrenamientoData {
  nombre?: string;
  descripcion?: string;
  nivel?: NivelCatalogo;
}