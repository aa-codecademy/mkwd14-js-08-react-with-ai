import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ListRecipesQueryDto } from './dto/list-recipes-query.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './recipe.entity';
import { PaginatedRecipes, RecipesService } from './recipes.service';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
	constructor(private readonly service: RecipesService) {}

	@Get()
	@ApiOperation({
		summary: 'List recipes with pagination, sorting and filtering',
	})
	@ApiOkResponse({
		description: '{ data: Recipe[], total, page, limit, totalPages }',
	})
	findAll(@Query() query: ListRecipesQueryDto): Promise<PaginatedRecipes> {
		// to be used just for testing purposes to see error message in component
		// throw new BadRequestException('Issue while fetching the recipes');
		return this.service.findAll(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a single recipe by ID' })
	@ApiOkResponse({ type: Recipe })
	@ApiNotFoundResponse({ description: 'Recipe not found' })
	findOne(@Param('id') id: string): Promise<Recipe> {
		return this.service.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Create a new recipe' })
	@ApiCreatedResponse({ type: Recipe })
	create(@Body() dto: CreateRecipeDto): Promise<Recipe> {
		return this.service.create(dto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Partially update a recipe' })
	@ApiOkResponse({ type: Recipe })
	@ApiNotFoundResponse({ description: 'Recipe not found' })
	update(
		@Param('id') id: string,
		@Body() dto: UpdateRecipeDto,
	): Promise<Recipe> {
		return this.service.update(id, dto);
	}

	@Delete(':id')
	@HttpCode(204)
	@ApiOperation({ summary: 'Delete a recipe' })
	@ApiNoContentResponse({ description: 'Deleted successfully' })
	@ApiNotFoundResponse({ description: 'Recipe not found' })
	remove(@Param('id') id: string): Promise<void> {
		return this.service.remove(id);
	}

	@Post('seed')
	@ApiOperation({
		summary: 'Seed 100 sample recipes — re-seeds if fewer than 100 exist',
	})
	@ApiCreatedResponse({ description: '{ created: number }' })
	seed(): Promise<{ created: number }> {
		return this.service.seed();
	}
}
