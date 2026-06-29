// `import type` tells TypeScript (and bundlers) this import is purely a type — no runtime value.
// It's a good practice: it makes imports self-documenting and can improve build performance.
import type { Recipe as RecipeType } from '../types/recipe';
import TagList from './TagList';

// Renaming the type to RecipeType avoids a name conflict — we can't call both the component and
// the type "Recipe" in the same file. A common convention: suffix the type with "Type" or "Props".
type RecipeProps = {
	recipe: RecipeType;
};

// Component composition: Recipe renders TagList as a child.
// Each component stays focused on one job — Recipe lays out the card, TagList handles the tag list.
function Recipe({ recipe }: RecipeProps) {
	return (
		// `article` is a semantic HTML element for self-contained content (a blog post, a product card, etc.).
		// Using the right HTML element matters for accessibility and SEO — screen readers understand article.
		<article className='flex flex-col overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-md'>
			<img
				src={recipe.imageUrl}
				alt={recipe.title}
				// object-cover prevents the image from stretching. It crops the image to fill h-48 without distorting it.
				className='h-48 w-full object-cover'
			/>
			<div className='flex flex-1 flex-col gap-3 p-5'>
				<h2 className='text-xl font-semibold text-brand-900'>{recipe.title}</h2>
				<p className='text-sm text-slate-600'>{recipe.description}</p>
				{/* Passing the full recipe object down — TagList only uses recipe.tags, but this keeps props simple. */}
				<TagList recipe={recipe} />
				{/* mt-auto pushes this element to the bottom of the flex container regardless of how much content is above it.
				    This ensures the prep/servings line is always aligned at the bottom across all cards. */}
				<p className='mt-auto text-sm font-medium text-brand-700'>
					{recipe.prepMinutes} min | serves {recipe.servings}
				</p>
			</div>
		</article>
	);
}

export default Recipe;
