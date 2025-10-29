import { SesionRepository } from '@/domain/repositories/SesionRepository';
import { Sesion, CreateSesionData, UpdateSesionData } from '@/domain/entities/Sesion';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseSesionRepository implements SesionRepository {
  private readonly tableName = 'sesion';

  async findAll(params?: PaginationParams): Promise<{ sesiones: Sesion[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching sesiones: ${error.message}`);
    }

    return {
      sesiones: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Sesion | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .eq('id_sesion', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching sesion: ${error.message}`);
    }

    return data;
  }

  async findByHorarioId(horarioId: number): Promise<Sesion[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .eq('id_horario', horarioId);

    if (error) {
      throw new Error(`Error fetching sesiones: ${error.message}`);
    }

    return data || [];
  }

  async findByFecha(fecha: Date): Promise<Sesion[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .eq('fecha', fecha.toISOString().split('T')[0]);

    if (error) {
      throw new Error(`Error fetching sesiones: ${error.message}`);
    }

    return data || [];
  }

  async create(sesionData: CreateSesionData): Promise<Sesion> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([sesionData])
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating sesion: ${error.message}`);
    }

    return data;
  }

  async update(id: number, sesionData: UpdateSesionData): Promise<Sesion | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(sesionData)
      .eq('id_sesion', id)
      .select(`
        *,
        horario:id_horario(
          *,
          entrenador:id_entrenador(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating sesion: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_sesion', id);

    if (error) {
      throw new Error(`Error deleting sesion: ${error.message}`);
    }

    return true;
  }
}