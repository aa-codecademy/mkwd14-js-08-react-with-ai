import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '../reservation.entity';

// PartialType makes every field from CreateReservationDto optional
export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiPropertyOptional({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
    description: 'Updated status for the reservation',
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
