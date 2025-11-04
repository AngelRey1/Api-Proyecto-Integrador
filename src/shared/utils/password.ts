import bcrypt from 'bcrypt';

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña usando bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Valida que una contraseña cumpla con los requisitos mínimos
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!password) {
      errors.push('La contraseña es requerida');
      return { isValid: false, errors };
    }

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (!/[A-Za-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}