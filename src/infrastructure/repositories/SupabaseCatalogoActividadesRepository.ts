import { CatalogoActividadesRepository } from '@/domain/repositories/CatalogoActividadesRepository';
import { CatalogoActividades, CreateCatalogoActividadesData, UpdateCatalogoActividadesData } from '@/domain/entities/CatalogoActividades';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseCatalogoActividadesRepository implements CatalogoActividadesRepository {
  private readonly tableName = 'catalogoactividades';

  async findAll(params?: PaginationParams): Promise<{ actividades: CatalogoActividades[]; total: number }> {
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
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching actividades: ${error.message}`);
    }

    return {
      actividades: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<CatalogoActividades | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .eq('id_actividad', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching actividad: ${error.message}`);
    }

    return data;
  }

  async findByEntrenadorId(entrenadorId: number): Promise<CatalogoActividades[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .eq('id_entrenador', entrenadorId);

    if (error) {
      throw new Error(`Error fetching actividades: ${error.message}`);
    }

    return data || [];
  }

  async findByClienteId(clienteId: number): Promise<CatalogoActividades[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .eq('id_cliente', clienteId);

    if (error) {
      throw new Error(`Error fetching actividades: ${error.message}`);
    }

    return data || [];
  }

  async findByEstado(estado: string): Promise<CatalogoActividades[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .eq('estado', estado);

    if (error) {
      throw new Error(`Error fetching actividades: ${error.message}`);
    }

    return data || [];
  }

  async create(data: CreateCatalogoActividadesData): Promise<CatalogoActividades> {
    const { data: result, error } = await supabaseClient
      .from(this.tableName)
      .insert([data])
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .single();

    if (error) {
      throw new Error(`Error creating actividad: ${error.message}`);
    }

    return result;
  }

  async update(id: number, data: UpdateCatalogoActividadesData): Promise<CatalogoActividades | null> {
    const { data: result, error } = await supabaseClient
      .from(this.tableName)
      .update(data)
      .eq('id_actividad', id)
      .select(`
        *,
        entrenador:id_entrenador(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido)
        ),
        deporte:id_deporte(*),
        catalogo:id_catalogo(*)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating actividad: ${error.message}`);
    }

    return result;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_actividad', id);

    if (error) {
      throw new Error(`Error deleting actividad: ${error.message}`);
    }

    return true;
  }
}