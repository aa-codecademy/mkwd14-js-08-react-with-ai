import { useEffect, useState } from 'react';
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

type Employee = {
	id: number;
	name: string;
	isEmployeeOfTheMonth: boolean;
};

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
	const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
	console.log('Employees render');

	useEffect(() => {
		console.log('Employees mounted');

		const id = window.setInterval(() => {
			console.log('Employees count:', 10);
		}, 2000);

		return () => clearInterval(id);
	}, []);

	const handleEmployeeOfTheMonthChange = (newEmployeeOfTheMonthId: number) => {
		// Option 1:
		// const newEmployeeOfTheMonthList = employees.map(employee => {
		// 	if (employee.id === newEmployeeOfTheMonthId) {
		// 		employee.isEmployeeOfTheMonth = true;
		// 	} else {
		// 		employee.isEmployeeOfTheMonth = false;
		// 	}

		// 	return employee;
		// });

		// setEmployees(newEmployeeOfTheMonthList);

		// Option 2:
		setEmployees((employeesList: Employee[]) =>
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
				{employees.map(employee => (
					<li
						key={employee.id}
						className='flex justify-between'
						style={{
							color: employee.isEmployeeOfTheMonth ? 'yellow' : '',
						}}>
						{employee.name}
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

type NavigationProps = {
	activePage: 'home' | 'about-us' | 'employees-list';
	setActivePage: (activePage: 'home' | 'about-us' | 'employees-list') => void;
};

function Navigation({ activePage, setActivePage }: NavigationProps) {
	console.log('Navigation render');

	useEffect(() => {
		console.log('Navigation mounted');
	}, []);

	// Do not do this
	// useEffect(() => {
	// 	console.log('Navigation changes');
	// });

	useEffect(() => {
		console.log('Navigation changes', activePage);
	}, [activePage]);

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
