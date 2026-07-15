// `import type` tells TypeScript (and bundlers) this import is purely a type — no runtime value.
// It's a good practice: it makes imports self-documenting and can improve build performance.
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/favorites-context';
import type { Recipe } from '../../types/recipe';
import TagList from '../TagList';
import { Button } from '../ui/button';
type RecipeProps = {
	recipe: Recipe;
	handleDeleteRecipe: (id: string) => void;
};

// Component composition: Recipe renders TagList as a child.
// Each component stays focused on one job — Recipe lays out the card, TagList handles the tag list.
function RecipeCard({ recipe, handleDeleteRecipe }: RecipeProps) {
	const { isFavorite, toggleFavorite } = useFavorites();
	// useNavigate gives you an imperative way to change routes (e.g. after a click handler
	// runs some logic), unlike <Link>/<NavLink> which are declarative and rendered as elements.
	const navigate = useNavigate();

	const isInFavorites = isFavorite(recipe.id);

	return (
		// `article` is a semantic HTML element for self-contained content (a blog post, a product card, etc.).
		// Using the right HTML element matters for accessibility and SEO — screen readers understand article.
		<article
			className='group relative flex flex-col overflow-hidden rounded-2xl border-emerald-100 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:bg-slate-800'
			// The whole card is clickable and navigates to the dynamic route recipe/:id.
			// Gotcha: the favorite/edit/delete buttons live inside this element, so their
			// onClick handlers must call e.stopPropagation() — otherwise clicking them would
			// also bubble up and trigger this card-level navigate().
			onClick={() => navigate(`/recipe/${recipe.id}`)}>
			<button
				type='button'
				onClick={() => toggleFavorite(recipe.id)}
				className='absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2.5 text-lg text-rose-500 shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 dark:bg-slate-900/90'>
				{isInFavorites ? '♥' : '♡'}
			</button>
			<img
				src={recipe.imageUrl}
				alt={recipe.title}
				// object-cover prevents the image from stretching. It crops the image to fill h-48 without distorting it.
				className='h-48 w-full object-cover'
			/>
			<div className='flex flex-1 flex-col gap-3 p-5'>
				<h2 className='text-xl font-semibold text-brand-900 dark:text-emerald-100'>
					{recipe.title}
				</h2>
				<p className='text-sm text-slate-600 dark:text-emerald-300'>
					{recipe.description}
				</p>
				{/* Passing the full recipe object down — TagList only uses recipe.tags, but this keeps props simple. */}
				<TagList recipe={recipe} />
				{/* mt-auto pushes this element to the bottom of the flex container regardless of how much content is above it.
				    This ensures the prep/servings line is always aligned at the bottom across all cards. */}
				<p className='mt-auto text-sm font-medium text-brand-700 dark:text-emerald-300'>
					{recipe.prepMinutes} min | serves {recipe.servings}
				</p>
				<div className='flex gap-2 pt-1 justify-end'>
					<Button
						variant='outline'
						size='lg'
						onClick={e => {
							e.stopPropagation();
							navigate(`/recipe/${recipe.id}/edit`);
						}}>
						Edit
					</Button>
					<Button
						variant='destructive'
						size='lg'
						onClick={e => {
							e.stopPropagation();
							handleDeleteRecipe(recipe.id);
						}}>
						Delete
					</Button>
				</div>
			</div>
		</article>
	);
}

export default RecipeCard;
