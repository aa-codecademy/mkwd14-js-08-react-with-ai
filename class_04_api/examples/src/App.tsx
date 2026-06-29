import { useEffect, useState } from 'react';
import './App.css';

// Define the API URL as a constant outside the component — it never changes,
// so there's no reason to recreate it on every render.
const API_URL = `https://jsonplaceholder.typicode.com/posts?_limit=5`;

// Defining a TypeScript type for the API response gives you autocomplete
// and catches typos at compile time, not at runtime.
type Post = {
	id: number;
	userId: number;
	title: string;
	body: string;
};

function App() {
	// Three separate state variables model the three possible states of an async operation:
	// "what data do we have?", "are we waiting?", "did something go wrong?"
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// useEffect with an empty dependency array [] runs once after the first render.
	// This is the standard pattern for fetching data when a component mounts.
	// Think of [] as saying "do this once, not on every re-render".
	useEffect(() => {
		setIsLoading(true);
		// fetch() returns a Promise. .then() chains let you handle each step:
		// 1. the raw HTTP response arrives → 2. parse the JSON body → 3. store in state.
		fetch(API_URL)
			.then(res => res.json()) // res.json() is itself async — it reads the response body stream
			.then(data => setPosts(data))
			.catch(err => {
				// .catch() runs if ANY .then() above throws — network failure, bad JSON, etc.
				setError(err.message || 'Something went wrong');
			})
			.finally(() => {
				// .finally() always runs regardless of success or failure — perfect for cleanup.
				setIsLoading(false);
			});
	}, []); // empty array = "run on mount only". Missing this causes an infinite fetch loop.

	// Early return pattern: return different UI for loading/error BEFORE the main render.
	// This avoids deeply nested ternaries inside the JSX below.
	if (isLoading) {
		return <p className='p-8 text-slate-500'>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div className='p-5'>
			<h1 className='text-xl font-bold'>Fetch Example</h1>
			<ul className='space-y-3'>
				{/* Always use a stable, unique value as the key — post.id comes from the API
				    and is guaranteed unique. Never use the array index as a key if items can be reordered or removed. */}
				{posts.map(post => (
					<li key={post.id}>
						<h2 className='font-medium capitalize'>{post.title}</h2>
						<p className='mt-1 text-sm'>{post.body}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
