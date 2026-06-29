import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  QueryReservationsDto,
  SortField,
  SortOrder,
} from './dto/query-reservations.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(
    query: QueryReservationsDto,
  ): Promise<PaginatedResult<Reservation>> {
    const {
      search,
      status,
      sortBy = SortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    const where: { [key: string]: unknown } = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.guestName = ILike(`%${search}%`);
    }

    const [data, total] = await this.reservationRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  create(dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(dto);
    return this.reservationRepository.save(reservation);
  }

  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    Object.assign(reservation, dto);
    return this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.softRemove(reservation);
  }
}
