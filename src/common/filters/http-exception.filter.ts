import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // اگر HttpException باشه، status رو از خودش بگیر
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // پیام و جزئیات خطا
    const errorResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as
            | string
            | { message: string | string[]; error?: string })
        : 'Internal server error';

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : Array.isArray(errorResponse.message)
          ? errorResponse.message.join(', ')
          : errorResponse.message || 'Unexpected error occurred';

    // لاگ خطا
    this.logger.error(
      `[${request.method}] ${request.url} → ${status} : ${message}`,
    );

    // ساخت خروجی استاندارد
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}
