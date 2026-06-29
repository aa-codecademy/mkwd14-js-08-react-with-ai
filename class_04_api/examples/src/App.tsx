import { useEffect, useState } from 'react';
import './App.css';

const API_URL = `https://jsonplaceholder.typicode.com/posts?_limit=5`;

type Post = {
	id: number;
	userId: number;
	title: string;
	body: string;
};

function App() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setIsLoading(true);
		fetch(API_URL)
			.then(res => res.json())
			.then(data => setPosts(data))
			.catch(err => {
				setError(err.message || 'Something went wrong');
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

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
