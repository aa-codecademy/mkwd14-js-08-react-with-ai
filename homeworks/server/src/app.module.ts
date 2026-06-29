import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from './reservations/reservations.module';
import { SeedModule } from './seed/seed.module';
import { Reservation } from './reservations/reservation.entity';

@Module({
  imports: [
    // Load .env file and make ConfigService available everywhere
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection using values from ConfigService (not hardcoded)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'saveur_db'),
        entities: [Reservation],
        // Automatically create/update tables based on entity definitions.
        // Set to false in production and use migrations instead.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    ReservationsModule,
    SeedModule,
  ],
})
export class AppModule {}
