import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReservationsService, PaginatedResult } from './reservations.service';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { QueryReservationsDto } from './dto/query-reservations.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all reservations',
    description:
      'Supports search, status filter, pagination, and sorting via query parameters.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of reservations' })
  findAll(
    @Query() query: QueryReservationsDto,
  ): Promise<PaginatedResult<Reservation>> {
    return this.reservationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The reservation',
    type: Reservation,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'The created reservation',
    type: Reservation,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The updated reservation',
    type: Reservation,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft-delete a reservation',
    description:
      'Marks the reservation as deleted without removing it from the database. The record is excluded from all future queries.',
  })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'Reservation soft-deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reservationsService.remove(id);
  }
}
