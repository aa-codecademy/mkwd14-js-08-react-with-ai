import './Panel.css';

type PanelProps = {
	title: string;
	description: string;
};

function Panel({ title, description }: PanelProps) {
	const time = new Date().toISOString();

	return (
		<article className='card'>
			<h2 className='title'>{title}</h2>
			<p className='description'>{description}</p>
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
