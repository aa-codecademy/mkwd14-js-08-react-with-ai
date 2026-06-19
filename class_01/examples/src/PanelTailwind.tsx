// ============================================================
// PANEL TAILWIND COMPONENT — same card, styled with Tailwind CSS
// ============================================================
// Compare this file with Panel.tsx. The component does the same thing
// but instead of a separate CSS file, all styles live directly in className.
//
// Tailwind is a "utility-first" CSS framework. Each class name applies
// exactly one CSS rule, and you compose them together to build your UI.
//
// Handy reference: https://tailwindcss.com/docs

type PanelTailwindProps = {
	title: string;
	description: string;
};

function PanelTailwind({ title, description }: PanelTailwindProps) {
	return (
		// max-w-xs  → max-width: 20rem  (limits card width)
		// m-3       → margin: 0.75rem   (space around the card)
		// border border-emerald-900 → a dark green 1px border
		// rounded-lg → border-radius: 0.5rem
		// p-3       → padding: 0.75rem  (inner spacing)
		<article className='max-w-xs m-3 border border-emerald-900 rounded-lg p-3'>
			{/* text-xl → font-size: 1.25rem  |  font-semibold → font-weight: 600
			    text-emerald-700 → a medium green color */}
			<h2 className='text-xl font-semibold text-emerald-700'>{title}</h2>

			{/* mt-3 → margin-top: 0.75rem  |  text-sm → font-size: 0.875rem
			    text-slate-400 → a light gray color */}
			<p className='mt-3 text-sm text-slate-400'>{description}</p>
		</article>
	);
}

export default PanelTailwind;
