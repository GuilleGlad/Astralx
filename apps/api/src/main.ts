/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Setup OpenAPI/Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Astralx API')
    .setDescription(
      'API para conectar propietarios de vehículos con talleres especializados'
    )
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📚 OpenAPI documentation available at: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
