import { NotificacionRepository } from '@/domain/repositories/NotificacionRepository';
import { Notificacion, CreateNotificacionData, UpdateNotificacionData } from '@/domain/entities/Notificacion';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseNotificacionRepository implements NotificacionRepository {
  private readonly tableName = 'notificacion';

  async findAll(params?: PaginationParams): Promise<{ notificaciones: Notificacion[]; total: number }> {
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
      throw new Error(`Error fetching notificaciones: ${error.message}`);
    }

    return { notificaciones: data || [], total: count || 0 };
  }

  async findById(id: number): Promise<Notificacion | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('id_notificacion', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching notificacion: ${error.message}`);
    }

    return data;
  }

  async findByUsuarioId(usuarioId: number): Promise<Notificacion[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('id_usuario', usuarioId)
      .order('fecha_envio', { ascending: false });

    if (error) {
      throw new Error(`Error fetching notificaciones: ${error.message}`);
    }

    return data || [];
  }

  async findNoLeidas(usuarioId: number): Promise<Notificacion[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .eq('id_usuario', usuarioId)
      .eq('leido', false)
      .order('fecha_envio', { ascending: false });

    if (error) {
      throw new Error(`Error fetching notificaciones no leídas: ${error.message}`);
    }

    return data || [];
  }

  async create(notificacionData: CreateNotificacionData): Promise<Notificacion> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([notificacionData])
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .single();

    if (error) {
      throw new Error(`Error creating notificacion: ${error.message}`);
    }

    return data;
  }

  async update(id: number, notificacionData: UpdateNotificacionData): Promise<Notificacion | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(notificacionData)
      .eq('id_notificacion', id)
      .select(`*, usuario:id_usuario(nombre, apellido, email)`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating notificacion: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_notificacion', id);

    if (error) {
      throw new Error(`Error deleting notificacion: ${error.message}`);
    }

    return true;
  }
}