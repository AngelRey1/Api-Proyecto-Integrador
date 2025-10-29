import { CatalogoEntrenamientoRepository } from '@/domain/repositories/CatalogoEntrenamientoRepository';
import { CatalogoEntrenamiento, CreateCatalogoEntrenamientoData, UpdateCatalogoEntrenamientoData } from '@/domain/entities/CatalogoEntrenamiento';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseCatalogoEntrenamientoRepository implements CatalogoEntrenamientoRepository {
  private readonly tableName = 'catalogoentrenamiento';

  async findAll(params?: PaginationParams): Promise<{ catalogos: CatalogoEntrenamiento[]; total: number }> {
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
      throw new Error(`Error fetching catalogos: ${error.message}`);
    }

    return {
      catalogos: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<CatalogoEntrenamiento | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id_catalogo', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching catalogo: ${error.message}`);
    }

    return data;
  }

  async findByNombre(nombre: string): Promise<CatalogoEntrenamiento | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('nombre', nombre)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching catalogo: ${error.message}`);
    }

    return data;
  }

  async create(catalogoData: CreateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([catalogoData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating catalogo: ${error.message}`);
    }

    return data;
  }

  async update(id: number, catalogoData: UpdateCatalogoEntrenamientoData): Promise<CatalogoEntrenamiento | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(catalogoData)
      .eq('id_catalogo', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating catalogo: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_catalogo', id);

    if (error) {
      throw new Error(`Error deleting catalogo: ${error.message}`);
    }

    return true;
  }
}