import type { Recipe } from '../types/recipe';
import TagList from './TagList';
import { Button } from './ui/button';

type RecipeDetailsProps = {
	recipe: Recipe;
};

function RecipeDetails({ recipe }: RecipeDetailsProps) {
	return (
		<article className='space-y-4'>
			<img
				src={recipe.imageUrl}
				alt={recipe.title}
				className='h-56 w-full rounded-xl object-cover shadow-md'
			/>
			<h2 className='text-2xl font-bold text-brand-900'>{recipe.title}</h2>
			<p className='text-slate-600'>{recipe.description}</p>
			<TagList recipe={recipe} />
			<p className='text-sm font-medium text-brand-700'>
				{recipe.prepMinutes} min | serves {recipe.servings}
			</p>

			<section>
				<h3 className='font-semibold text-brand-900'>Ingredients</h3>
				<ul className='mt-2 list-inside list-disc text-sm text-slate-700'>
					{recipe.ingredients.map(ingredient => (
						<li key={ingredient.name}>
							{ingredient.amount} {ingredient.name}
						</li>
					))}
				</ul>
			</section>

			<section>
				<h3 className='font-semibold text-brand-900'>Steps</h3>
				<ol className='mt-2 list-inside list-decimal text-sm text-slate-700'>
					{recipe.steps.map(step => (
						<li key={step}>{step}</li>
					))}
				</ol>
			</section>

			<div className='flex gap-2 pt-2'>
				<Button variant='outline'>Edit</Button>
				<Button variant='destructive'>Delete</Button>
			</div>
		</article>
	);
}

export default RecipeDetails;
