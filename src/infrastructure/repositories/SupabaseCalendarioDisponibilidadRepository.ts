import { CalendarioDisponibilidadRepository } from '@/domain/repositories/CalendarioDisponibilidadRepository';
import { CalendarioDisponibilidad, CreateCalendarioDisponibilidadData, UpdateCalendarioDisponibilidadData } from '@/domain/entities/CalendarioDisponibilidad';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseCalendarioDisponibilidadRepository implements CalendarioDisponibilidadRepository {
  private readonly tableName = 'calendariodisponibilidad';

  async findAll(params?: PaginationParams): Promise<{ disponibilidades: CalendarioDisponibilidad[]; total: number }> {
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
        )
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching disponibilidades: ${error.message}`);
    }

    return {
      disponibilidades: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<CalendarioDisponibilidad | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .eq('id_disponibilidad', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching disponibilidad: ${error.message}`);
    }

    return data;
  }

  async findByEntrenadorId(entrenadorId: number): Promise<CalendarioDisponibilidad[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error fetching disponibilidades: ${error.message}`);
    }

    return data || [];
  }

  async findByFecha(fecha: Date): Promise<CalendarioDisponibilidad[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .eq('fecha', fecha.toISOString().split('T')[0]);

    if (error) {
      throw new Error(`Error fetching disponibilidades: ${error.message}`);
    }

    return data || [];
  }

  async create(data: CreateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad> {
    const { data: result, error } = await supabaseClient
      .from(this.tableName)
      .insert([data])
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating disponibilidad: ${error.message}`);
    }

    return result;
  }

  async update(id: number, data: UpdateCalendarioDisponibilidadData): Promise<CalendarioDisponibilidad | null> {
    const { data: result, error } = await supabaseClient
      .from(this.tableName)
      .update(data)
      .eq('id_disponibilidad', id)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating disponibilidad: ${error.message}`);
    }

    return result;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_disponibilidad', id);

    if (error) {
      throw new Error(`Error deleting disponibilidad: ${error.message}`);
    }

    return true;
  }
}