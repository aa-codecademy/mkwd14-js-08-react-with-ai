import type { Recipe } from '../types/recipe';

type TagListProps = {
	recipe: Recipe;
};

function TagList({ recipe }: TagListProps) {
	return (
		<ul className='flex flex-wrap gap-2'>
			{recipe.tags.map(tag => (
				<li
					className='rounded-full bg-emerald-100 px-3 py-0.5 font-medium text-brand-900'
					key={tag}>
					{tag}
				</li>
			))}
		</ul>
	);
}

export default TagList;
