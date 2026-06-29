import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/recipe.entity';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get('DATABASE_HOST', 'localhost'),
				port: config.get<number>('DATABASE_PORT', 5432),
				username: config.get('DATABASE_USER', 'postgres'),
				password: config.get('DATABASE_PASSWORD', 'postgres'),
				database: config.get('DATABASE_NAME', 'pantrypal'),
				entities: [Recipe],
				// Auto-creates tables in development — never use in production
				synchronize: true,
			}),
		}),
		RecipesModule,
	],
})
export class AppModule {}
