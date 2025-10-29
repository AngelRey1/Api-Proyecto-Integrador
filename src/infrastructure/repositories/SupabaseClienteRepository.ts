import { ClienteRepository } from '@/domain/repositories/ClienteRepository';
import { Cliente, CreateClienteData, UpdateClienteData } from '@/domain/entities/Cliente';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseClienteRepository implements ClienteRepository {
  private readonly tableName = 'cliente';

  async findAll(params?: PaginationParams): Promise<{ clientes: Cliente[]; total: number }> {
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
      throw new Error(`Error fetching clientes: ${error.message}`);
    }

    return {
      clientes: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Cliente | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .eq('id_cliente', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching cliente: ${error.message}`);
    }

    return data;
  }

  async findByUsuarioId(usuarioId: number): Promise<Cliente | null> {
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
      throw new Error(`Error fetching cliente: ${error.message}`);
    }

    return data;
  }

  async create(clienteData: CreateClienteData): Promise<Cliente> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([clienteData])
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .single();

    if (error) {
      throw new Error(`Error creating cliente: ${error.message}`);
    }

    return data;
  }

  async update(id: number, clienteData: UpdateClienteData): Promise<Cliente | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(clienteData)
      .eq('id_cliente', id)
      .select(`
        *,
        usuario:id_usuario(id_usuario, nombre, apellido, email, rol, creado_en)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating cliente: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_cliente', id);

    if (error) {
      throw new Error(`Error deleting cliente: ${error.message}`);
    }

    return true;
  }
}