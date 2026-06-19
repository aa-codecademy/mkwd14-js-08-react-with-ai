import './App.css';
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
			<h1 className='test'>{title}</h1>
			<User
				name={johnDoe.name}
				age={johnDoe.age}
				isMarried={johnDoe.isMarried}
				children={johnDoe.children}
			/>

			<User {...janeDoe} />
		</div>
	);
}

export default App;
