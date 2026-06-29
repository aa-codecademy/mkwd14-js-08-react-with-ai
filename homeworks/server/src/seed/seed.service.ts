import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/reservation.entity';

const GUEST_NAMES = [
  'Elena Vasquez',
  'Marcus Webb',
  'Yuki Tanaka',
  'Nneka Obi',
  'Thomas Laurent',
  'Priya Mehta',
  'Dmitri Volkov',
  'Amara Diallo',
  'Sophie Chen',
  'Luca Romano',
  'Fatima Al-Hassan',
  'James Okafor',
  'Ingrid Larsen',
  'Carlos Mendez',
  'Aisha Patel',
  'Noah Fischer',
  'Mei Lin',
  'Kwame Asante',
  'Isabelle Dupont',
  'Tariq Hussain',
];

const NOTES = [
  'Window seat preferred',
  'Anniversary dinner, please add a candle',
  'Birthday celebration',
  'Allergic to nuts',
  'Vegetarian menu please',
  'High chair needed',
  'Celebrating promotion',
  null,
  null,
  null,
];

const ARRIVAL_TIMES = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
];

const STATUSES = [
  ReservationStatus.PENDING,
  ReservationStatus.PENDING,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CONFIRMED,
  ReservationStatus.CANCELLED,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async seed(): Promise<{ inserted: number }> {
    const reservations = Array.from({ length: 50 }, (_, i) => {
      const entity = this.reservationRepository.create({
        guestName: pick(GUEST_NAMES),
        partySize: randomInt(1, 10),
        arrivalTime: pick(ARRIVAL_TIMES),
        tableNumber: randomInt(1, 20),
        notes: pick(NOTES) ?? undefined,
        status: pick(STATUSES),
      });
      return entity;
    });

    await this.reservationRepository.save(reservations);
    return { inserted: reservations.length };
  }

  async clear(): Promise<{ deleted: number }> {
    const count = await this.reservationRepository.count();
    await this.reservationRepository.query('DELETE FROM reservations');
    return { deleted: count };
  }
}
