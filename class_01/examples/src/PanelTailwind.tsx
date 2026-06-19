type PanelTailwindProps = {
	title: string;
	description: string;
};

function PanelTailwind({ title, description }: PanelTailwindProps) {
	return (
		<article className='max-w-xs m-3 border border-emerald-900 rounded-lg p-3'>
			<h2 className='text-xl font-semibold text-emerald-700'>{title}</h2>
			<p className='mt-3 text-sm text-slate-400'>{description}</p>
		</article>
	);
}

export default PanelTailwind;
