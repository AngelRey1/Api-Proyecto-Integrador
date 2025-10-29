import { HorarioRepository } from '@/domain/repositories/HorarioRepository';
import { Horario, CreateHorarioData, UpdateHorarioData } from '@/domain/entities/Horario';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseHorarioRepository implements HorarioRepository {
  private readonly tableName = 'horario';

  async findAll(params?: PaginationParams): Promise<{ horarios: Horario[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido, email)
        )
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching horarios: ${error.message}`);
    }

    return {
      horarios: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Horario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido, email)
        )
      `)
      .eq('id_horario', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching horario: ${error.message}`);
    }

    return data;
  }

  async findByEntrenadorId(entrenadorId: number): Promise<Horario[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido, email)
        )
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error fetching horarios: ${error.message}`);
    }

    return data || [];
  }

  async create(horarioData: CreateHorarioData): Promise<Horario> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([horarioData])
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido, email)
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating horario: ${error.message}`);
    }

    return data;
  }

  async update(id: number, horarioData: UpdateHorarioData): Promise<Horario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(horarioData)
      .eq('id_horario', id)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido, email)
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating horario: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_horario', id);

    if (error) {
      throw new Error(`Error deleting horario: ${error.message}`);
    }

    return true;
  }
}