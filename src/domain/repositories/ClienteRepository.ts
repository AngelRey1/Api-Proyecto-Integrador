import { Cliente, CreateClienteData, UpdateClienteData } from '@/domain/entities/Cliente';
import { PaginationParams } from '@/shared/types/api';

export interface ClienteRepository {
  findAll(params?: PaginationParams): Promise<{ clientes: Cliente[]; total: number }>;
  findById(id: number): Promise<Cliente | null>;
  findByUsuarioId(usuarioId: number): Promise<Cliente | null>;
  create(clienteData: CreateClienteData): Promise<Cliente>;
  update(id: number, clienteData: UpdateClienteData): Promise<Cliente | null>;
  delete(id: number): Promise<boolean>;
}