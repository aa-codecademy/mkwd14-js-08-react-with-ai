import { Link } from 'react-router-dom';

type NotFoundPageProps = {
	title?: string;
	message?: string;
	backTo?: string;
	backLabel?: string;
};

// Every prop has a default, so this component works two ways: as the catch-all route
// (`<Route path='*' element={<NotFoundPage />} />` in App.tsx) with generic copy, AND
// rendered directly with custom text (see RecipeDetailsPage.tsx) for a more specific
// "this recipe doesn't exist" message — one component, two use cases.
function NotFoundPage({
	title = 'Page not found',
	message = "We couldn't find the page you were looking for. It may have been moved or never existed.",
	backTo = '/',
	backLabel = 'Back to home',
}: NotFoundPageProps) {
	return (
		<div className='mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center animate-in fade-in zoom-in-95 duration-300'>
			<p className='text-6xl font-bold text-brand-500'>404</p>
			<h1 className='text-2xl font-semibold text-brand-900 dark:text-emerald-100'>
				{title}
			</h1>
			<p className='text-slate-600 dark:text-slate-300'>{message}</p>
			<Link
				to={backTo}
				className='mt-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-900'>
				{backLabel}
			</Link>
		</div>
	);
}

export default NotFoundPage;
