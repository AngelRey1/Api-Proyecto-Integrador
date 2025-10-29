import { Usuario } from './User';

export interface Cliente {
  id_cliente: number;
  id_usuario: number;
  telefono?: string;
  direccion?: string;
  fecha_registro: Date;
  // Relación con usuario
  usuario?: Usuario;
}

export interface CreateClienteData {
  id_usuario: number;
  telefono?: string;
  direccion?: string;
}

export interface UpdateClienteData {
  telefono?: string;
  direccion?: string;
}