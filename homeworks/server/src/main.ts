import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the React dev server can reach the API
  app.enableCors();

  app.setGlobalPrefix('api');

  // Validate all incoming request bodies automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger / OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Saveur Reservations API')
    .setDescription('REST API for managing restaurant reservations at Saveur')
    .setVersion('1.0')
    .addTag('reservations')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`\n🚀 Server running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/docs\n`);
}

bootstrap();
