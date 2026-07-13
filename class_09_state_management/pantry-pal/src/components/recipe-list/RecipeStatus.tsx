import type { HttpStatus } from '../../types/http-status';

type RecipeStatusProps = {
	recipesLength: number;
	total: number;
	status: HttpStatus;
	error: string;
};

function RecipeStatus({
	recipesLength,
	total,
	status,
	error,
}: RecipeStatusProps) {
	return (
		<>
			{status === 'success' && (
				<p className='text-sm text-slate-500 dark:text-slate-300'>
					Showing {recipesLength} out of {total} recipes
				</p>
			)}

			{status === 'loading' && (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{/* Array.from({ length: 6 }) creates an array of 6 empty slots — a quick
							way to render N placeholder skeleton cards without storing count in state. */}
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='h-64 rounded-xl bg-slate-300' />
					))}
				</div>
			)}

			{status === 'error' && (
				<p className='text-red-700 p-4 text-sm bg-red-50 border-red-200 border rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'>
					{error}
				</p>
			)}
		</>
	);
}

export default RecipeStatus;
