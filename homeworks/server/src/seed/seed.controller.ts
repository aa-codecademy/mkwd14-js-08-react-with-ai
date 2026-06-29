import { Controller, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({
    summary: 'Insert 50 sample reservations',
    description:
      'Populates the database with 50 randomly generated reservations. Safe to call multiple times — each call adds another 50 rows.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the number of inserted rows',
    schema: { example: { inserted: 50 } },
  })
  seed(): Promise<{ inserted: number }> {
    return this.seedService.seed();
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete all reservations',
    description:
      'Permanently removes every row from the reservations table. Useful for resetting the database to a clean state before re-seeding.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the number of deleted rows',
    schema: { example: { deleted: 50 } },
  })
  clear(): Promise<{ deleted: number }> {
    return this.seedService.clear();
  }
}
