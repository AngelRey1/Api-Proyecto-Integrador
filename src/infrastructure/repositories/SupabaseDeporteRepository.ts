import { DeporteRepository } from '@/domain/repositories/DeporteRepository';
import { Deporte, CreateDeporteData, UpdateDeporteData } from '@/domain/entities/Deporte';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseDeporteRepository implements DeporteRepository {
  private readonly tableName = 'deporte';

  async findAll(params?: PaginationParams): Promise<{ deportes: Deporte[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select('*', { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching deportes: ${error.message}`);
    }

    return {
      deportes: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Deporte | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id_deporte', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching deporte: ${error.message}`);
    }

    return data;
  }

  async findByNombre(nombre: string): Promise<Deporte | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('nombre', nombre)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching deporte: ${error.message}`);
    }

    return data;
  }

  async create(deporteData: CreateDeporteData): Promise<Deporte> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([deporteData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating deporte: ${error.message}`);
    }

    return data;
  }

  async update(id: number, deporteData: UpdateDeporteData): Promise<Deporte | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(deporteData)
      .eq('id_deporte', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating deporte: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_deporte', id);

    if (error) {
      throw new Error(`Error deleting deporte: ${error.message}`);
    }

    return true;
  }
}