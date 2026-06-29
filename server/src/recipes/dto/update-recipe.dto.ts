import { PartialType } from '@nestjs/swagger';
import { CreateRecipeDto } from './create-recipe.dto';

// PartialType makes every field from CreateRecipeDto optional
// and copies all Swagger + validation decorators automatically.
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
