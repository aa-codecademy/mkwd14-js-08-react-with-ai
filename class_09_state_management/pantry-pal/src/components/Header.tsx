function Header() {
	return (
		// `header` is a semantic HTML element — it tells browsers and screen readers this is the page header.
		// backdrop-blur applies a frosted-glass effect when content scrolls behind this element.
		// bg-white/80 means white with 80% opacity — the /80 syntax is Tailwind's opacity modifier.
		<header className='border-b border-emerald-100 bg-white/80 px-6 py-8 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80'>
		<h1 className='mt-1 text-4xl font-bold text-brand-900 dark:text-emerald-100'>Pantry Pal</h1>
		<p className='mt-2 max-w-2xl text-slate-600 dark:text-emerald-300'>
				Your personal recipe collection
			</p>
		</header>
	);
}

export default Header;
