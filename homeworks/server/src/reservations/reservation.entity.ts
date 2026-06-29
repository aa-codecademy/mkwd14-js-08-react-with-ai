import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @ApiProperty({ example: 1, description: 'Auto-generated reservation ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Jane Smith', description: 'Name of the guest' })
  @Column()
  guestName!: string;

  @ApiProperty({ example: 4, description: 'Number of guests in the party' })
  @Column()
  partySize!: number;

  @ApiProperty({
    example: '19:30',
    description: 'Arrival time in HH:MM format',
  })
  @Column()
  arrivalTime!: string;

  @ApiProperty({
    example: 5,
    description: 'Table number assigned to the reservation',
  })
  @Column()
  tableNumber!: number;

  @ApiProperty({
    example: 'Window seat preferred',
    description: 'Optional notes',
    required: false,
  })
  @Column({ nullable: true })
  notes!: string;

  @ApiProperty({ enum: ReservationStatus, default: ReservationStatus.PENDING })
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status!: ReservationStatus;

  @ApiProperty({ description: 'Timestamp when the reservation was created' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the reservation was last updated',
  })
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiProperty({
    description: 'Timestamp when the reservation was soft-deleted (null if active)',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt!: Date | null;
}
