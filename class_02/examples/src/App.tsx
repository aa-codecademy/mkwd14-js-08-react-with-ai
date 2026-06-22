import { useState } from 'react';
import './App.css';

function AboutUs() {
	console.log('about us render');
	return (
		<div className='p-2 border border-slate-900 bg-amber-700'>
			<h2>About us page</h2>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur nisi
				maiores, possimus veritatis vel repellendus dolores non alias amet
				quaerat nulla, unde, et dolorem sequi omnis quas nesciunt eveniet ipsum!
			</p>
		</div>
	);
}

function Employees() {
	console.log('Employees render');
	return (
		<div className='p-2 border border-slate-900 bg-sky-600'>
			<h2>Employees page</h2>
			<ul>
				<li>John Doe</li>
				<li>Jane Doe</li>
				<li>Jack Doe</li>
				<li>Mike Doe</li>
			</ul>
		</div>
	);
}

type NavigationProps = {
	activePage: 'home' | 'about-us' | 'employees-list';
	setActivePage: (activePage: 'home' | 'about-us' | 'employees-list') => void;
};

function Navigation({ activePage, setActivePage }: NavigationProps) {
	console.log('Navigation render');
	return (
		<nav className='bg-emerald-700 border'>
			<ul className='flex justify-center gap-5'>
				<li
					style={{
						fontWeight: activePage === 'home' ? 'bold' : '',
					}}
					className='cursor-pointer'
					onClick={() => setActivePage('home')}>
					Home
				</li>
				<li
					style={{
						fontWeight: activePage === 'about-us' ? 'bold' : '',
					}}
					className='cursor-pointer'
					onClick={() => setActivePage('about-us')}>
					About us
				</li>
				<li
					style={{
						fontWeight: activePage === 'employees-list' ? 'bold' : '',
					}}
					className='cursor-pointer'
					onClick={() => setActivePage('employees-list')}>
					Employees List
				</li>
			</ul>
		</nav>
	);
}

function HomePage() {
	console.log('home render');
	return (
		<div>
			<h1>Home page</h1>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
				optio nam soluta obcaecati cum. Incidunt vitae magnam officiis
				accusamus? Nam quasi voluptates ducimus vitae aliquid sapiente numquam
				quibusdam doloribus nesciunt!
			</p>
		</div>
	);
}

function App() {
	console.log('app render');
	const [activePage, setActivePage] = useState<
		'home' | 'about-us' | 'employees-list'
	>('home');

	return (
		<div>
			<h1>Single Page Application (SPA)</h1>
			<Navigation activePage={activePage} setActivePage={setActivePage} />
			{activePage === 'home' ? (
				<HomePage />
			) : activePage === 'about-us' ? (
				<AboutUs />
			) : activePage === 'employees-list' ? (
				<Employees />
			) : (
				<div>Not found</div>
			)}
		</div>
	);
}

export default App;
