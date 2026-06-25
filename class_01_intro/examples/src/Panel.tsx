// ============================================================
// PANEL COMPONENT — demonstrates CSS file styling + inline styles
// ============================================================

// Importing a CSS file applies its rules globally when this component is used.
// The class names defined in Panel.css (.card, .title, .description) are
// applied via the className prop below.
import './Panel.css';

type PanelProps = {
	title: string;
	description: string;
};

function Panel({ title, description }: PanelProps) {
	const time = new Date().toISOString();

	return (
		// className maps to the HTML "class" attribute.
		// React uses "className" to avoid a conflict with the JS "class" keyword.
		<article className='card'>
			<h2 className='title'>{title}</h2>
			<p className='description'>{description}</p>

			{/* Inline styles in React use a JavaScript OBJECT, not a CSS string.
			    Keys are camelCase (e.g. fontSize instead of font-size).
			    Values are strings (or numbers for unitless properties like zIndex). */}
			<p
				style={{
					color: 'gray',
					fontSize: '12px',
				}}>
				Current time: {time}
			</p>
		</article>
	);
}

export default Panel;
