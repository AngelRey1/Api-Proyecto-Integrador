import { UserRepository } from '@/domain/repositories/UserRepository';
import { Usuario, CreateUsuarioData, UpdateUsuarioData, RolUsuario } from '@/domain/entities/User';
import { PaginationParams } from '@/shared/types/api';
import { z } from 'zod';

const createUsuarioSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Formato de email inválido'),
  contrasena: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['CLIENTE', 'ENTRENADOR'], { message: 'Rol debe ser CLIENTE o ENTRENADOR' }),
});

const updateUsuarioSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').optional(),
  apellido: z.string().min(2, 'Apellido debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Formato de email inválido').optional(),
  rol: z.enum(['CLIENTE', 'ENTRENADOR'], { message: 'Rol debe ser CLIENTE o ENTRENADOR' }).optional(),
});

export class UserUseCases {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(params?: PaginationParams) {
    return await this.userRepository.findAll(params);
  }

  async getUserById(id: number): Promise<Usuario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de usuario válido es requerido');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<Usuario> {
    if (!email) {
      throw new Error('Email es requerido');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async createUser(userData: CreateUsuarioData): Promise<Usuario> {
    // Validate input data
    const validatedData = createUsuarioSchema.parse(userData);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(validatedData.email);
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }

    return await this.userRepository.create(validatedData);
  }

  async updateUser(id: number, userData: UpdateUsuarioData): Promise<Usuario> {
    if (!id || isNaN(id)) {
      throw new Error('ID de usuario válido es requerido');
    }

    // Validate input data
    const validatedData = updateUsuarioSchema.parse(userData);

    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    // Check email uniqueness if email is being updated
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(validatedData.email);
      if (userWithEmail) {
        throw new Error('Ya existe un usuario con este email');
      }
    }

    const updatedUser = await this.userRepository.update(id, validatedData);
    if (!updatedUser) {
      throw new Error('Error al actualizar usuario');
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('ID de usuario válido es requerido');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await this.userRepository.delete(id);
  }
}