import { ReseñaRepository } from '@/domain/repositories/ReseñaRepository';
import { Reseña, CreateReseñaData, UpdateReseñaData } from '@/domain/entities/Reseña';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseReseñaRepository implements ReseñaRepository {
  private readonly tableName = 'reseña';

  async findAll(params?: PaginationParams): Promise<{ reseñas: Reseña[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching reseñas: ${error.message}`);
    }

    return { reseñas: data || [], total: count || 0 };
  }

  async findById(id: number): Promise<Reseña | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_reseña', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching reseña: ${error.message}`);
    }

    return data;
  }

  async findByEntrenadorId(entrenadorId: number): Promise<Reseña[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error fetching reseñas: ${error.message}`);
    }

    return data || [];
  }

  async findByClienteId(clienteId: number): Promise<Reseña[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_cliente', clienteId);

    if (error) {
      throw new Error(`Error fetching reseñas: ${error.message}`);
    }

    return data || [];
  }

  async create(reseñaData: CreateReseñaData): Promise<Reseña> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([reseñaData])
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `)
      .single();

    if (error) {
      throw new Error(`Error creating reseña: ${error.message}`);
    }

    return data;
  }

  async update(id: number, reseñaData: UpdateReseñaData): Promise<Reseña | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(reseñaData)
      .eq('id_reseña', id)
      .select(`
        *,
        reserva:id_reserva(*),
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido)),
        entrenador:id_entrenador(*, usuario:id_usuario(nombre, apellido))
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating reseña: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_reseña', id);

    if (error) {
      throw new Error(`Error deleting reseña: ${error.message}`);
    }

    return true;
  }
}