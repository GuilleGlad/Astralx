import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            JSON.stringify({
              method,
              url,
              statusCode,
              responseTime: `${responseTime}ms`,
              ip,
              userAgent,
              timestamp: new Date().toISOString(),
            })
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          this.logger.error(
            JSON.stringify({
              method,
              url,
              statusCode: error.status || 500,
              responseTime: `${responseTime}ms`,
              error: error.message,
              ip,
              userAgent,
              timestamp: new Date().toISOString(),
            })
          );
        },
      })
    );
  }
}
