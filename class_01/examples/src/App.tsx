import { useState } from 'react';
import './App.css';
import Panel from './Panel';
import PanelTailwind from './PanelTailwind';
import User from './User';
import List from './List';
import Wrapper from './Wrapper';

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

	const [buttonClickedCount, setButtonClickedCount] = useState(0);
	const [inputText, setInputText] = useState('');

	// let buttonClickedCount = 0;

	const onButtonClick = () => {
		console.log('Button has been clicked!', buttonClickedCount);
		setButtonClickedCount(buttonClickedCount + 1);
		console.log('After update!', buttonClickedCount);
	};

	const handleInputText = (e: any) => {
		setInputText(e.target.value);
	};

	return (
		<div className='p-2'>
			<Wrapper>
				<button onClick={() => alert('Hello!')}>say hello</button>
			</Wrapper>
			<button className='bg-amber-400 rounded-lg p-1' onClick={onButtonClick}>
				Click me!
			</button>
			<p>Button has been clicked {buttonClickedCount} times.</p>
			<input
				className='border border-gray-500 rounded-2xl'
				onChange={e => handleInputText(e)}
			/>
			<p>{inputText || 'No input text'}</p>

			<Wrapper>
				<List />
			</Wrapper>

			{/* <h1 className='test'>{title}</h1> */}
			{/* <User
				name={johnDoe.name}
				age={johnDoe.age}
				isMarried={johnDoe.isMarried}
				children={johnDoe.children}
			/>

			<User {...janeDoe} /> */}

			{/* <Panel
				title='CSS Example'
				description='This component is using css as styling'
			/> */}
			{/* <PanelTailwind
				title='Tailwind Example'
				description='This component is using tailwind as styling'
			/> */}
		</div>
	);
}

export default App;
