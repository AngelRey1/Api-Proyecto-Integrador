import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseUtil } from '@/shared/utils/response';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return ResponseUtil.error(res, 'Token de acceso requerido', 401);
  }

  // Extraer token - manejar casos como "Bearer Bearer token" o "Bearer token"
  let token = '';
  if (authHeader.startsWith('Bearer ')) {
    const parts = authHeader.split(' ');
    // Si hay "Bearer Bearer token", tomar el último elemento
    // Si hay "Bearer token", tomar el segundo elemento
    token = parts[parts.length - 1];
  } else {
    // Si no tiene Bearer, asumir que es solo el token
    token = authHeader;
  }

  // Debug logs (remover en producción)
  console.log('🔍 Auth Debug - Header:', authHeader.substring(0, 50) + '...');
  console.log('🔍 Auth Debug - Token extracted:', token ? token.substring(0, 20) + '...' : 'No token');

  if (!token || token === 'Bearer') {
    return ResponseUtil.error(res, 'Token de acceso requerido', 401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('🔍 Auth Debug - JWT Error:', err.message);
      console.log('🔍 Auth Debug - JWT Secret length:', JWT_SECRET.length);
      return ResponseUtil.error(res, 'Token inválido o expirado', 403);
    }

    console.log('🔍 Auth Debug - User verified:', user.email);
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.error(res, 'Usuario no autenticado', 401);
    }

    if (!roles.includes(req.user.rol)) {
      return ResponseUtil.error(res, 'No tienes permisos para acceder a este recurso', 403);
    }

    next();
  };
};

export const generateToken = (user: { id: number; email: string; rol: string }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};