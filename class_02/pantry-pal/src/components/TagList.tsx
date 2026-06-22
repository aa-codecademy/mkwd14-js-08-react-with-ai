import type { Recipe } from '../types/recipe';

type TagListProps = {
	recipe: Recipe;
};

function TagList({ recipe }: TagListProps) {
	return (
		<ul className='flex flex-wrap gap-2'>
			{/* .map() turns an array of strings into an array of <li> elements.
			    Each tag is just a string, so we use the tag value itself as the key.
			    Using the value as a key is only safe when values in the array are guaranteed unique — tags usually are. */}
			{recipe.tags.map(tag => (
				<li
					// `key` is placed on the outermost element returned by .map(), not inside it.
					// React needs key at the list level to track which item is which.
					className='rounded-full bg-emerald-100 px-3 py-0.5 font-medium text-brand-900'
					key={tag}>
					{tag}
				</li>
			))}
		</ul>
	);
}

export default TagList;
