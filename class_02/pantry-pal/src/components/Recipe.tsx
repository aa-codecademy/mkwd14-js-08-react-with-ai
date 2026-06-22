import type { Recipe as RecipeType } from '../types/recipe';
import TagList from './TagList';

type RecipeProps = {
	recipe: RecipeType;
};

function Recipe({ recipe }: RecipeProps) {
	return (
		<article className='flex flex-col overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-md'>
			<img
				src={recipe.imageUrl}
				alt={recipe.title}
				className='h-48 w-full object-cover'
			/>
			<div className='flex flex-1 flex-col gap-3 p-5'>
				<h2 className='text-xl font-semibold text-brand-900'>{recipe.title}</h2>
				<p className='text-sm text-slate-600'>{recipe.description}</p>
				<TagList recipe={recipe} />
				<p className='mt-auto text-sm font-medium text-brand-700'>
					{recipe.prepMinutes} min | serves {recipe.servings}
				</p>
			</div>
		</article>
	);
}

export default Recipe;
