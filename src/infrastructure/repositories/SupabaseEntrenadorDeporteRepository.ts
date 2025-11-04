import { EntrenadorDeporteRepository } from '@/domain/repositories/EntrenadorDeporteRepository';
import { EntrenadorDeporte, CreateEntrenadorDeporteData } from '@/domain/entities/EntrenadorDeporte';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseEntrenadorDeporteRepository implements EntrenadorDeporteRepository {
  private readonly tableName = 'entrenador_deporte';

  async findAll(params?: PaginationParams): Promise<{ entrenadorDeportes: EntrenadorDeporte[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*)
      `, { count: 'exact' });

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching entrenador deportes: ${error.message}`);
    }

    return {
      entrenadorDeportes: data || [],
      total: count || 0,
    };
  }

  async findByEntrenadorId(entrenadorId: number): Promise<EntrenadorDeporte[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*)
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error fetching entrenador deportes: ${error.message}`);
    }

    return data || [];
  }

  async findByDeporteId(deporteId: number): Promise<EntrenadorDeporte[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*)
      `)
      .eq('id_deporte', deporteId);

    if (error) {
      throw new Error(`Error fetching entrenador deportes: ${error.message}`);
    }

    return data || [];
  }

  async create(data: CreateEntrenadorDeporteData): Promise<EntrenadorDeporte> {
    const { data: result, error } = await supabaseClient
      .from(this.tableName)
      .insert([data])
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*)
      `)
      .single();

    if (error) {
      throw new Error(`Error creating entrenador deporte: ${error.message}`);
    }

    return result;
  }

  async delete(entrenadorId: number, deporteId: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_entrenador', entrenadorId)
      .eq('id_deporte', deporteId);

    if (error) {
      throw new Error(`Error deleting entrenador deporte: ${error.message}`);
    }

    return true;
  }
}