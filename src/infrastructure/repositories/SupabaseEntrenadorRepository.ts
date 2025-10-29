import { EntrenadorRepository } from '@/domain/repositories/EntrenadorRepository';
import { Entrenador, CreateEntrenadorData, UpdateEntrenadorData } from '@/domain/entities/Entrenador';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseEntrenadorRepository implements EntrenadorRepository {
  private readonly tableName = 'entrenador';

  async findAll(params?: PaginationParams): Promise<{ entrenadores: Entrenador[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching entrenadores: ${error.message}`);
    }

    return {
      entrenadores: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Entrenador | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .eq('id_entrenador', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching entrenador: ${error.message}`);
    }

    return data;
  }

  async findByUsuarioId(usuarioId: number): Promise<Entrenador | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .eq('id_usuario', usuarioId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching entrenador: ${error.message}`);
    }

    return data;
  }

  async create(entrenadorData: CreateEntrenadorData): Promise<Entrenador> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([entrenadorData])
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .single();

    if (error) {
      throw new Error(`Error creating entrenador: ${error.message}`);
    }

    return data;
  }

  async update(id: number, entrenadorData: UpdateEntrenadorData): Promise<Entrenador | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(entrenadorData)
      .eq('id_entrenador', id)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating entrenador: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_entrenador', id);

    if (error) {
      throw new Error(`Error deleting entrenador: ${error.message}`);
    }

    return true;
  }
}