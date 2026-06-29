import {
  IsString,
  IsInt,
  IsOptional,
  MinLength,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Full name of the guest' })
  @IsString()
  @MinLength(2, { message: 'Guest name must be at least 2 characters' })
  guestName!: string;

  @ApiProperty({ example: 4, description: 'Number of guests (1–20)' })
  @IsInt()
  @Min(1, { message: 'Party size must be at least 1' })
  @Max(20, { message: 'Party size cannot exceed 20' })
  partySize!: number;

  @ApiProperty({
    example: '19:30',
    description: 'Arrival time in HH:MM 24-hour format',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Arrival time must be in HH:MM format (e.g. 19:30)',
  })
  arrivalTime!: string;

  @ApiProperty({ example: 5, description: 'Table number (1–20)' })
  @IsInt()
  @Min(1, { message: 'Table number must be at least 1' })
  @Max(20, { message: 'Table number cannot exceed 20' })
  tableNumber!: number;

  @ApiProperty({
    example: 'Window seat preferred',
    description: 'Optional notes for the reservation',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
