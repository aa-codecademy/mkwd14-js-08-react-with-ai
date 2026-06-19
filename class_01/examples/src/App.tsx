// ============================================================
// APP COMPONENT — the root component of our application
// ============================================================
// A component is just a JavaScript function that returns JSX.
// By convention, component names start with a capital letter.

import { useState } from 'react';
import './App.css';
import Panel from './Panel';
import PanelTailwind from './PanelTailwind';
import User from './User';
import List from './List';
import Wrapper from './Wrapper';

function App() {
	// Regular JavaScript variables can be used inside JSX.
	// However, changing them does NOT re-render the component — for that you need state (see below).
	const title = 'Hello World!';

	// Plain JavaScript objects — we use these as props for the <User> component below.
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

	// --------------------------------------------------------
	// STATE — useState hook
	// --------------------------------------------------------
	// useState() returns a pair: [currentValue, setterFunction].
	// When you call the setter, React re-renders the component with the new value.
	// This is the fundamental mechanism that makes the UI "reactive".
	//
	// ❌ A plain variable like `let count = 0` would NOT trigger a re-render.
	// ✅ State always triggers a re-render when updated.
	const [buttonClickedCount, setButtonClickedCount] = useState(0);
	const [inputText, setInputText] = useState('');

	// This is the "wrong" approach — commented out to show the contrast:
	// let buttonClickedCount = 0;

	// --------------------------------------------------------
	// EVENT HANDLERS
	// --------------------------------------------------------
	// Event handlers are regular functions passed to JSX elements as props.
	// Notice: state updates are ASYNCHRONOUS — the console.log after
	// setButtonClickedCount still shows the OLD value. React batches updates
	// and applies them before the next render.
	const onButtonClick = () => {
		console.log('Button has been clicked!', buttonClickedCount);
		setButtonClickedCount(buttonClickedCount + 1);
		console.log('After update!', buttonClickedCount); // still the old value!
	};

	// `e` is the browser's SyntheticEvent object. We read e.target.value
	// to get the current text from the input field.
	const handleInputText = (e: any) => {
		setInputText(e.target.value);
	};

	// --------------------------------------------------------
	// JSX — what the component renders
	// --------------------------------------------------------
	// The return value must be a single root element.
	// JSX looks like HTML but it is actually JavaScript — every tag
	// is compiled to a React.createElement() call under the hood.
	return (
		<div className='p-2'>
			{/* Wrapper is a layout component that accepts children.
			    Any JSX placed between its opening and closing tags
			    is passed in as the special "children" prop. */}
			<Wrapper>
				{/* Inline arrow function as event handler — fine for simple cases */}
				<button onClick={() => alert('Hello!')}>say hello</button>
			</Wrapper>

			{/* Tailwind utility classes are applied via className (not "class" — that's HTML).
			    bg-amber-400 = amber background, rounded-lg = rounded corners, p-1 = padding */}
			<button className='bg-amber-400 rounded-lg p-1' onClick={onButtonClick}>
				Click me!
			</button>

			{/* Curly braces { } let you embed any JavaScript expression inside JSX */}
			<p>Button has been clicked {buttonClickedCount} times.</p>

			<input
				className='border border-gray-500 rounded-2xl'
				// onChange fires every time the user types a character
				onChange={e => handleInputText(e)}
			/>

			{/* The || operator is used here for a fallback value:
			    if inputText is empty (falsy), show 'No input text' instead */}
			<p>{inputText || 'No input text'}</p>

			<Wrapper>
				<List />
			</Wrapper>

			{/* --------------------------------------------------------
			    COMMENTED-OUT EXAMPLES — uncomment them one by one to explore!
			    -------------------------------------------------------- */}

			{/* Basic JSX expression — renders the title variable */}
			{/* <h1 className='test'>{title}</h1> */}

			{/* Passing props explicitly, one by one */}
			{/* <User
					name={johnDoe.name}
					age={johnDoe.age}
					isMarried={johnDoe.isMarried}
					children={johnDoe.children}
				/> */}

			{/* Spread operator shorthand — spreads all object properties as props.
			    {...janeDoe} is exactly the same as writing each prop manually. */}
			{/* <User {...janeDoe} /> */}

			{/* A component styled with a plain CSS file */}
			{/* <Panel
					title='CSS Example'
					description='This component is using css as styling'
				/> */}

			{/* The same component re-created using Tailwind utility classes */}
			{/* <PanelTailwind
					title='Tailwind Example'
					description='This component is using tailwind as styling'
				/> */}
		</div>
	);
}

export default App;
