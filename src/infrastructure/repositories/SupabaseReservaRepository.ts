import { ReservaRepository } from '@/domain/repositories/ReservaRepository';
import { Reserva, CreateReservaData, UpdateReservaData } from '@/domain/entities/Reserva';
import { PaginationParams } from '@/shared/types/api';
import { supabaseClient } from '@/infrastructure/database/supabase';

export class SupabaseReservaRepository implements ReservaRepository {
  private readonly tableName = 'reserva';

  async findAll(params?: PaginationParams): Promise<{ reservas: Reserva[]; total: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `, { count: 'exact' });

    if (params?.sortBy) {
      const ascending = params.sortOrder === 'asc';
      query = query.order(params.sortBy, { ascending });
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching reservas: ${error.message}`);
    }

    return {
      reservas: data || [],
      total: count || 0,
    };
  }

  async findById(id: number): Promise<Reserva | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `)
      .eq('id_reserva', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error fetching reserva: ${error.message}`);
    }

    return data;
  }

  async findByClienteId(clienteId: number): Promise<Reserva[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `)
      .eq('id_cliente', clienteId);

    if (error) {
      throw new Error(`Error fetching reservas: ${error.message}`);
    }

    return data || [];
  }

  async findBySesionId(sesionId: number): Promise<Reserva[]> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `)
      .eq('id_sesion', sesionId);

    if (error) {
      throw new Error(`Error fetching reservas: ${error.message}`);
    }

    return data || [];
  }

  async create(reservaData: CreateReservaData): Promise<Reserva> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .insert([reservaData])
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `)
      .single();

    if (error) {
      throw new Error(`Error creating reserva: ${error.message}`);
    }

    return data;
  }

  async update(id: number, reservaData: UpdateReservaData): Promise<Reserva | null> {
    const { data, error } = await supabaseClient
      .from(this.tableName)
      .update(reservaData)
      .eq('id_reserva', id)
      .select(`
        *,
        cliente:id_cliente(
          *,
          usuario:id_usuario(nombre, apellido, email)
        ),
        sesion:id_sesion(
          *,
          horario:id_horario(
            *,
            entrenador:id_entrenador(
              *,
              usuario:id_usuario(nombre, apellido)
            )
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error updating reserva: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabaseClient
      .from(this.tableName)
      .delete()
      .eq('id_reserva', id);

    if (error) {
      throw new Error(`Error deleting reserva: ${error.message}`);
    }

    return true;
  }
}