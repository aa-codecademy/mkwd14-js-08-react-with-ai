// ============================================================
// LIST COMPONENT — demonstrates the three ways to return multiple elements
// ============================================================
// A React component must return a SINGLE root element.
// But what if you don't want an extra <div> in your HTML?
// That's where Fragments come in.

import { Fragment } from 'react/jsx-runtime';

function List() {
	// ✅ Option 1: Wrap everything in a real HTML element (e.g. <div>)
	// Downside: adds an extra element to the DOM that might break your layout or CSS.
	return (
		<div>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</div>
	);

	// ✅ Option 2: Use the Fragment shorthand syntax <>...</>
	// This groups elements without adding any real DOM node.
	// This is the most common approach — clean and concise.
	return (
		<>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</>
	);

	// ✅ Option 3: Use <Fragment> explicitly
	// Identical to the shorthand above, but useful when you need to pass a "key" prop
	// (required when rendering lists dynamically — more on this in future classes!).
	return (
		<Fragment>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</Fragment>
	);

	// ✅ Option 4 (rare): Return an array of elements
	// React can render arrays, but each element needs a unique "key" prop.
	// return [<p key="apple">Apple</p>, <p key="banana">Banana</p>, <p key="kiwi">Kiwi</p>];
}

export default List;
