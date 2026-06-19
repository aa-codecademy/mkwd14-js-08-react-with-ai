import './App.css';
import Panel from './Panel';
import PanelTailwind from './PanelTailwind';
import User from './User';

function App() {
	const title = 'Hello World!';

	const johnDoe = {
		name: 'John Doe',
		age: 25,
		isMarried: true,
		children: ['Jane', 'Mike', 'George'],
	};

	const janeDoe = {
		name: 'Jane Doe',
		age: 35,
		isMarried: false,
		children: ['Lara'],
	};

	return (
		<div>
			{/* <h1 className='test'>{title}</h1> */}
			{/* <User
				name={johnDoe.name}
				age={johnDoe.age}
				isMarried={johnDoe.isMarried}
				children={johnDoe.children}
			/>

			<User {...janeDoe} /> */}

			<Panel
				title='CSS Example'
				description='This component is using css as styling'
			/>
			<PanelTailwind
				title='Tailwind Example'
				description='This component is using tailwind as styling'
			/>
		</div>
	);
}

export default App;
