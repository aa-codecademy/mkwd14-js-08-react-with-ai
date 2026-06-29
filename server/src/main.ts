import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Allow requests from the Vite dev server
	app.enableCors({ origin: 'http://localhost:5173' }); // https://facebook.com - while BE server would be on // https://facebook.com/api

	app.setGlobalPrefix('api');

	// Validate all incoming DTOs automatically
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	// Swagger UI at /api
	const config = new DocumentBuilder()
		.setTitle('PantryPal API')
		.setDescription('Recipe CRUD API for the PantryPal React course')
		.setVersion('1.0')
		.build();
	SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

	const port = process.env.PORT ?? 3000;
	await app.listen(port);
	console.log(`API listening on http://localhost:${port}`);
	console.log(`Swagger UI at  http://localhost:${port}/docs`);
}

bootstrap();
