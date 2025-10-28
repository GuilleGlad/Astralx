import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'astralx'),
  password: configService.get<string>('DB_PASSWORD', 'astralx123'),
  database: configService.get<string>('DB_NAME', 'astralx_dev'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations in production
  logging: configService.get<string>('NODE_ENV') === 'development',
  charset: 'utf8mb4',
});
