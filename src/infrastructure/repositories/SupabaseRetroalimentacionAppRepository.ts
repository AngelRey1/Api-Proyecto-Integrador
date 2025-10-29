import { RetroalimentacionAppRepository } from '@/domain/repositories/RetroalimentacionAppRepository';
import { RetroalimentacionApp, CreateRetroalimentacionAppData, UpdateRetroalimentacionAppData } from '@/domain/entities/RetroalimentacionApp';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseRetroalimentacionAppRepository implements RetroalimentacionAppRepository {
  private readonly tableName = 'retroalimentacionapp';

  async findAll(params?: PaginationParams): Promise<{ retroalimentaciones: RetroalimentacionApp[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching retroalimentaciones: ${error.message}`);
    }

    return { retroalimentaciones: data || [], total: count || 0 };
  }

  async findById(id: number): Promise<RetroalimentacionApp | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('id_feedback', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching retroalimentacion: ${error.message}`);
    }

    return data;
  }

  async findByUsuarioId(usuarioId: number): Promise<RetroalimentacionApp[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('id_usuario', usuarioId)
      .order('fecha_feedback', { ascending: false });

    if (error) {
      throw new Error(`Error fetching retroalimentaciones: ${error.message}`);
    }

    return data || [];
  }

  async findByTipo(tipo: string): Promise<RetroalimentacionApp[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('tipo', tipo)
      .order('fecha_feedback', { ascending: false });

    if (error) {
      throw new Error(`Error fetching retroalimentaciones: ${error.message}`);
    }

    return data || [];
  }

  async create(retroalimentacionData: CreateRetroalimentacionAppData): Promise<RetroalimentacionApp> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([retroalimentacionData])
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .single();

    if (error) {
      throw new Error(`Error creating retroalimentacion: ${error.message}`);
    }

    return data;
  }

  async update(id: number, retroalimentacionData: UpdateRetroalimentacionAppData): Promise<RetroalimentacionApp | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(retroalimentacionData)
      .eq('id_feedback', id)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating retroalimentacion: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_feedback', id);

    if (error) {
      throw new Error(`Error deleting retroalimentacion: ${error.message}`);
    }

    return true;
  }
}