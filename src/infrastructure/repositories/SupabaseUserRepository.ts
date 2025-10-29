import { UserRepository } from '@/domain/repositories/UserRepository';
import { Usuario, CreateUsuarioData, UpdateUsuarioData } from '@/domain/entities/User';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseUserRepository implements UserRepository {
  private readonly tableName = 'usuario';

  async findAll(params?: PaginationParams): Promise<{ users: Usuario[]; total: number }> {
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

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }

    return {
      users: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Usuario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('id_usuario', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  }

  async create(userData: CreateUsuarioData): Promise<Usuario> {
    // No devolver la contraseña en la respuesta
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([userData])
      .select('id_usuario, nombre, apellido, email, rol, creado_en')
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return data;
  }

  async update(id: number, userData: UpdateUsuarioData): Promise<Usuario | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(userData)
      .eq('id_usuario', id)
      .select('id_usuario, nombre, apellido, email, rol, creado_en')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Error updating user: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_usuario', id);

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }

    return true;
  }
}