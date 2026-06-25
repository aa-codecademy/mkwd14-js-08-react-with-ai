import { useEffect, useState } from 'react';
import './App.css';

function AboutUs() {
	// Every console.log here fires on every render — useful for understanding when React re-renders a component.
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

// Defining the shape of data with a TypeScript type keeps components and data in sync.
// If EMPLOYEES ever gains a new field, TypeScript will warn every place that uses Employee.
type Employee = {
	id: number;
	name: string;
	isEmployeeOfTheMonth: boolean;
};

// UPPERCASE convention signals this is module-level constant data, not component state.
// It lives outside the component so it is created once, not on every render.
const EMPLOYEES: Employee[] = [
	{ id: 1, name: 'Alice Smith', isEmployeeOfTheMonth: false },
	{ id: 2, name: 'Bob Johnson', isEmployeeOfTheMonth: false },
	{ id: 3, name: 'Carol Williams', isEmployeeOfTheMonth: true },
	{ id: 4, name: 'David Brown', isEmployeeOfTheMonth: false },
	{ id: 5, name: 'Eve Davis', isEmployeeOfTheMonth: false },
	{ id: 6, name: 'Frank Miller', isEmployeeOfTheMonth: false },
	{ id: 7, name: 'Grace Wilson', isEmployeeOfTheMonth: false },
	{ id: 8, name: 'Hank Moore', isEmployeeOfTheMonth: false },
	{ id: 9, name: 'Ivy Taylor', isEmployeeOfTheMonth: false },
	{ id: 10, name: 'Jack Anderson', isEmployeeOfTheMonth: false },
];

function Employees() {
	// State is initialised with the EMPLOYEES constant — the component now "owns" its own copy.
	const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
	console.log('Employees render');

	useEffect(() => {
		// This effect runs ONCE after the first render because the dependency array [] is empty.
		// An empty [] means "run this only when the component mounts" — the equivalent of componentDidMount in class components.
		console.log('Employees mounted');

		const id = window.setInterval(() => {
			console.log('Employees count:', 10);
		}, 2000);

		// The function returned from useEffect is the CLEANUP function.
		// React calls it when the component is removed from the screen (unmounted).
		// Without clearInterval here, the interval keeps firing even after the component is gone — a memory leak.
		return () => clearInterval(id);
	}, []);

	const handleEmployeeOfTheMonthChange = (newEmployeeOfTheMonthId: number) => {
		// Option 1 (commented out): passes the current employees array directly.
		// The problem: if multiple setState calls happen quickly, React might batch them
		// and Option 1 could read a stale version of the array.

		// Option 2 (active): the functional updater form. React guarantees that
		// `employeesList` here is always the latest state, even when updates are batched.
		// Prefer this pattern whenever your new state depends on the previous state.
		setEmployees((employeesList: Employee[]) =>
			// .map() returns a brand-new array — we never mutate state directly.
			// Mutating state in place (e.g. employees[0].isEmployeeOfTheMonth = true) would not trigger a re-render.
			employeesList.map(employee => {
				if (employee.id === newEmployeeOfTheMonthId) {
					employee.isEmployeeOfTheMonth = true;
				} else {
					employee.isEmployeeOfTheMonth = false;
				}

				return employee;
			}),
		);
	};

	return (
		<div className='p-2 border border-slate-900 bg-sky-600'>
			<h2>Employees page</h2>
			<ul>
				{/* .map() turns an array of data into an array of JSX elements. */}
				{employees.map(employee => (
					// The `key` prop is REQUIRED for list items. React uses it to match
					// old and new items during re-renders — without it, React can't tell which
					// item changed and may update the wrong one. Use a stable unique ID, not the array index.
					<li
						key={employee.id}
						className='flex justify-between'
						// Inline style for dynamic values — the colour depends on runtime data, so a static CSS class won't work here.
						style={{
							color: employee.isEmployeeOfTheMonth ? 'yellow' : '',
						}}>
						{employee.name}
						{/* Pass a function REFERENCE — () => handleEmployeeOfTheMonthChange(...) — NOT handleEmployeeOfTheMonthChange(...).
						    Adding () would call the function immediately on every render instead of waiting for a click. */}
						<button
							className='ml-2 px-2 cursor-pointer border rounded-md bg-emerald-500 text-black'
							onClick={() => handleEmployeeOfTheMonthChange(employee.id)}>
							Mark as EOTM
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

// This is "lifting state up" — activePage lives in App (the parent) and is passed down as props.
// Both Navigation (reads it to highlight the active link) and App (reads it to decide which page to render) need it,
// so it must live in their common ancestor.
type NavigationProps = {
	activePage: 'home' | 'about-us' | 'employees-list';
	// setActivePage is a function prop — the parent passes its own state setter so the child can update it.
	setActivePage: (activePage: 'home' | 'about-us' | 'employees-list') => void;
};

function Navigation({ activePage, setActivePage }: NavigationProps) {
	console.log('Navigation render');

	// Empty dependency array [] → runs once on mount. Good for one-time setup (fetching data, subscriptions, logging).
	useEffect(() => {
		console.log('Navigation mounted');
	}, []);

	// Avoid this pattern (useEffect with NO dependency array) — it runs after EVERY render,
	// which is almost never what you want and can cause infinite loops if the effect triggers a state update.
	// useEffect(() => {
	// 	console.log('Navigation changes');
	// });

	// [activePage] in the dependency array means: re-run this effect whenever activePage changes.
	// React compares the previous and new value — if they differ, the effect fires again.
	useEffect(() => {
		console.log('Navigation changes', activePage);
	}, [activePage]);

	return (
		<nav className='bg-emerald-700 border'>
			<ul className='flex justify-center gap-5'>
				{/* Conditional inline style: bold when this is the active page.
				    The ternary reads activePage from props — the parent always controls which page is active. */}
				<li
					style={{
						fontWeight: activePage === 'home' ? 'bold' : '',
					}}
					className='cursor-pointer'
					// Clicking calls setActivePage from the parent — the child never owns the state, it only signals the parent.
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
	// The union type 'home' | 'about-us' | 'employees-list' restricts activePage to only those three strings.
	// TypeScript will error if you try to set it to anything else — great for catching typos.
	const [activePage, setActivePage] = useState<
		'home' | 'about-us' | 'employees-list'
	>('home');

	return (
		<div>
			<h1>Single Page Application (SPA)</h1>
			{/* setActivePage is passed as a prop so Navigation can change the state that lives here in App. */}
			<Navigation activePage={activePage} setActivePage={setActivePage} />
			{/* Chained ternary — this is React's version of a router. No page changes happen in the browser;
			    React just swaps which component is rendered based on the activePage state value. */}
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
