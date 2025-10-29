import { ComentarioRepository } from '@/domain/repositories/ComentarioRepository';
import { Comentario, CreateComentarioData, UpdateComentarioData } from '@/domain/entities/Comentario';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseComentarioRepository implements ComentarioRepository {
  private readonly tableName = 'comentario';

  async findAll(params?: PaginationParams): Promise<{ comentarios: Comentario[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching comentarios: ${error.message}`);
    }

    return { comentarios: data || [], total: count || 0 };
  }

  async findById(id: number): Promise<Comentario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_comentario', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching comentario: ${error.message}`);
    }

    return data;
  }

  async findByReseñaId(reseñaId: number): Promise<Comentario[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_reseña', reseñaId);

    if (error) {
      throw new Error(`Error fetching comentarios: ${error.message}`);
    }

    return data || [];
  }

  async findByClienteId(clienteId: number): Promise<Comentario[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `)
      .eq('id_cliente', clienteId);

    if (error) {
      throw new Error(`Error fetching comentarios: ${error.message}`);
    }

    return data || [];
  }

  async create(comentarioData: CreateComentarioData): Promise<Comentario> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([comentarioData])
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `)
      .single();

    if (error) {
      throw new Error(`Error creating comentario: ${error.message}`);
    }

    return data;
  }

  async update(id: number, comentarioData: UpdateComentarioData): Promise<Comentario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(comentarioData)
      .eq('id_comentario', id)
      .select(`
        *,
        cliente:id_cliente(*, usuario:id_usuario(nombre, apellido))
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating comentario: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_comentario', id);

    if (error) {
      throw new Error(`Error deleting comentario: ${error.message}`);
    }

    return true;
  }
}