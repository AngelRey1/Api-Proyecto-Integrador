import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/shared/types/api';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    error: string,
    statusCode: number = 500,
    message?: string
  ): Response<ApiResponse> {
    return res.status(statusCode).json({
      success: false,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message?: string
  ): Response<PaginatedResponse<T>> {
    return res.status(200).json({
      success: true,
      data,
      message,
      pagination,
      timestamp: new Date().toISOString(),
    });
  }
}