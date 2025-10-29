import { ClienteRepository } from '@/domain/repositories/ClienteRepository';
import { Cliente, CreateClienteData, UpdateClienteData } from '@/domain/entities/Cliente';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createClienteSchema = z.object({
  id_usuario: z.number().positive('ID de usuario debe ser un número positivo'),
  telefono: z.string().min(8, 'Teléfono debe tener al menos 8 caracteres').optional(),
  direccion: z.string().min(5, 'Dirección debe tener al menos 5 caracteres').optional(),
});

const updateClienteSchema = z.object({
  telefono: z.string().min(8, 'Teléfono debe tener al menos 8 caracteres').optional(),
  direccion: z.string().min(5, 'Dirección debe tener al menos 5 caracteres').optional(),
});

export class ClienteUseCases {
  constructor(private clienteRepository: ClienteRepository) {}

  async getAllClientes(params?: PaginationParams) {
    return await this.clienteRepository.findAll(params);
  }

  async getClienteById(id: number): Promise<Cliente> {
    if (!id || isNaN(id)) {
      throw new Error('ID de cliente válido es requerido');
    }

    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    return cliente;
  }

  async getClienteByUsuarioId(usuarioId: number): Promise<Cliente> {
    if (!usuarioId || isNaN(usuarioId)) {
      throw new Error('ID de usuario válido es requerido');
    }

    const cliente = await this.clienteRepository.findByUsuarioId(usuarioId);
    if (!cliente) {
      throw new Error('Cliente no encontrado para este usuario');
    }

    return cliente;
  }

  async createCliente(clienteData: CreateClienteData): Promise<Cliente> {
    const validatedData = createClienteSchema.parse(clienteData);

    // Verificar que no exista ya un cliente para este usuario
    const existingCliente = await this.clienteRepository.findByUsuarioId(validatedData.id_usuario);
    if (existingCliente) {
      throw new Error('Ya existe un perfil de cliente para este usuario');
    }

    return await this.clienteRepository.create(validatedData);
  }

  async updateCliente(id: number, clienteData: UpdateClienteData): Promise<Cliente> {
    if (!id || isNaN(id)) {
      throw new Error('ID de cliente válido es requerido');
    }

    const validatedData = updateClienteSchema.parse(clienteData);

    const existingCliente = await this.clienteRepository.findById(id);
    if (!existingCliente) {
      throw new Error('Cliente no encontrado');
    }

    const updatedCliente = await this.clienteRepository.update(id, validatedData);
    if (!updatedCliente) {
      throw new Error('Error al actualizar cliente');
    }

    return updatedCliente;
  }

  async deleteCliente(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de cliente válido es requerido');
    }

    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    await this.clienteRepository.delete(id);
  }
}