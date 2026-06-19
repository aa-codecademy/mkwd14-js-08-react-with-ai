import { Fragment } from 'react/jsx-runtime';

function List() {
	return (
		<div>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</div>
	);

	return (
		<>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</>
	);

	return (
		<Fragment>
			<p>Apple</p>
			<p>Banana</p>
			<p>Kiwi</p>
		</Fragment>
	);

	// return [<p>Apple</p>, <p>Banana</p>, <p>Kiwi</p>];
}

export default List;
