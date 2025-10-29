import { PagoRepository } from '@/domain/repositories/PagoRepository';
import { Pago, CreatePagoData, UpdatePagoData } from '@/domain/entities/Pago';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabasePagoRepository implements PagoRepository {
  private readonly tableName = 'pago';

  async findAll(params?: PaginationParams): Promise<{ pagos: Pago[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(
          *,
          cliente:id_cliente(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching pagos: ${error.message}`);
    }

    return {
      pagos: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Pago | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(
          *,
          cliente:id_cliente(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .eq('id_pago', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching pago: ${error.message}`);
    }

    return data;
  }

  async findByReservaId(reservaId: number): Promise<Pago[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        reserva:id_reserva(
          *,
          cliente:id_cliente(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .eq('id_reserva', reservaId);

    if (error) {
      throw new Error(`Error fetching pagos: ${error.message}`);
    }

    return data || [];
  }

  async create(pagoData: CreatePagoData): Promise<Pago> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([pagoData])
      .select(`
        *,
        reserva:id_reserva(
          *,
          cliente:id_cliente(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating pago: ${error.message}`);
    }

    return data;
  }

  async update(id: number, pagoData: UpdatePagoData): Promise<Pago | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(pagoData)
      .eq('id_pago', id)
      .select(`
        *,
        reserva:id_reserva(
          *,
          cliente:id_cliente(
            *,
            usuario:id_usuario(nombre, apellido)
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating pago: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_pago', id);

    if (error) {
      throw new Error(`Error deleting pago: ${error.message}`);
    }

    return true;
  }
}