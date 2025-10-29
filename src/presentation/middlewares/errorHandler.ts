import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '@/shared/utils/response';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error('Error:', error);

  if (res.headersSent) {
    return next(error);
  }

  return ResponseUtil.error(
    res,
    error.message || 'Internal Server Error',
    500,
    'An unexpected error occurred'
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response
): Response => {
  return ResponseUtil.error(
    res,
    `Route ${req.method} ${req.path} not found`,
    404,
    'The requested resource was not found'
  );
};