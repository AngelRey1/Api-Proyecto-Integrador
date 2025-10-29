import { EntrenadorDeporteRepository } from '@/domain/repositories/EntrenadorDeporteRepository';
import { EntrenadorDeporte, CreateEntrenadorDeporteData, UpdateEntrenadorDeporteData } from '@/domain/entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';
import { supabaseConnection } from '@/infrastructure/database/supabase';

export class SupabaseEntrenadorDeporteRepository implements EntrenadorDeporteRepository {
  private supabase = supabaseConnection.getClient();

  async findAll(params: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'id_entrenador_deporte', sortOrder = 'asc' } = params;
    const offset = (page - 1) * limit;

    // Obtener total de registros
    const { count } = await this.supabase
      .from('entrenador_deporte')
      .select('*', { count: 'exact', head: true });

    // Obtener registros paginados con relaciones
    const { data, error } = await this.supabase
      .from('entrenador_deporte')
      .select(`
        *,
        entrenador:entrenador(id_entrenador, id_usuario, especialidad, experiencia, usuario:usuario(nombre, apellido, email)),
        deporte:deporte(id_deporte, nombre, descripcion, nivel)
      `)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error al obtener entrenador-deportes: ${error.message}`);
    }

    return {
      entrenadorDeportes: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<EntrenadorDeporte | null> {
    const { data, error } = await this.supabase
      .from('entrenador_deporte')
      .select(`
        *,
        entrenador:entrenador(id_entrenador, id_usuario, especialidad, experiencia, usuario:usuario(nombre, apellido, email)),
        deporte:deporte(id_deporte, nombre, descripcion, nivel)
      `)
      .eq('id_entrenador_deporte', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error al obtener entrenador-deporte: ${error.message}`);
    }

    return data;
  }

  async findByEntrenadorId(entrenadorId: number): Promise<EntrenadorDeporte[]> {
    const { data, error } = await this.supabase
      .from('entrenador_deporte')
      .select(`
        *,
        deporte:deporte(id_deporte, nombre, descripcion, nivel)
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error al obtener deportes del entrenador: ${error.message}`);
    }

    return data || [];
  }

  async findByDeporteId(deporteId: number): Promise<EntrenadorDeporte[]> {
    const { data, error } = await this.supabase
      .from('entrenador_deporte')
      .select(`
        *,
        entrenador:entrenador(id_entrenador, id_usuario, especialidad, experiencia, usuario:usuario(nombre, apellido, email))
      `)
      .eq('id_deporte', deporteId);

    if (error) {
      throw new Error(`Error al obtener entrenadores del deporte: ${error.message}`);
    }

    return data || [];
  }

  async create(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    const { data: newEntrenadorDeporte, error } = await this.supabase
      .from('entrenador_deporte')
      .insert(data)
      .select(`
        *,
        entrenador:entrenador(id_entrenador, id_usuario, especialidad, experiencia, usuario:usuario(nombre, apellido, email)),
        deporte:deporte(id_deporte, nombre, descripcion, nivel)
      `)
      .single();

    if (error) {
      throw new Error(`Error al crear entrenador-deporte: ${error.message}`);
    }

    return newEntrenadorDeporte;
  }

  async update(id: number, data: UpdateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    const { data: updatedEntrenadorDeporte, error } = await this.supabase
      .from('entrenador_deporte')
      .update(data)
      .eq('id_entrenador_deporte', id)
      .select(`
        *,
        entrenador:entrenador(id_entrenador, id_usuario, especialidad, experiencia, usuario:usuario(nombre, apellido, email)),
        deporte:deporte(id_deporte, nombre, descripcion, nivel)
      `)
      .single();

    if (error) {
      throw new Error(`Error al actualizar entrenador-deporte: ${error.message}`);
    }

    return updatedEntrenadorDeporte;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('entrenador_deporte')
      .delete()
      .eq('id_entrenador_deporte', id);

    if (error) {
      throw new Error(`Error al eliminar entrenador-deporte: ${error.message}`);
    }
  }
}