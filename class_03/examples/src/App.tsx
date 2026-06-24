import { useState, type FormEvent } from 'react';
import './App.css';

// 'joh' > 'john'
// {
// 	firstName: 'Joh',
// 	lastName: '',
// 	age: 0,
// }
// >
// {
// 	firstName: 'John',
// 	lastName: '',
// 	age: 0,
// }
// const [formValues, setFormValues] = useState<{
// 	firstName: string;
// 	lastName: string;
// 	age: number;
// }>({
// 	firstName: '',
// 	lastName: '',
// 	age: 0,
// });

function App() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [age, setAge] = useState<number | undefined>(undefined);
	const [error, setError] = useState('');
	const [firstNameError, setFirstNameError] = useState('Missing first name');
	const [shouldShowFirstNameError, setShouldShowFirstNameError] =
		useState(false);
	const [shouldMakeFirstNameReadOnly, setShouldMakeFirstNameReadOnly] =
		useState(false);

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError('');
		console.log(e);

		if (!firstName || !lastName || !age) {
			setError('Missing values. Please fill out the form');
			return;
		}

		alert('Form submitted successfully');
	};

	return (
		<div>
			<h1>Uncontrolled form</h1>
			<form onSubmit={handleFormSubmit}>
				<label htmlFor='first_name'>First Name</label>
				<input
					id='first_name'
					value={firstName}
					readOnly={shouldMakeFirstNameReadOnly}
					onChange={e => setFirstName(e.target.value)}
					onBlur={() => {
						setShouldShowFirstNameError(!firstName);
						setShouldMakeFirstNameReadOnly(true);
					}}
					placeholder='John'
					className='border'
				/>
				<p className='mt-2 text-red-500 text-sm'>
					{shouldShowFirstNameError && firstNameError}
				</p>
				<br />
				<label htmlFor='last_name'>Last Name</label>
				<input
					id='last_name'
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					placeholder='Doe'
					className='border'
				/>
				<br />
				<label htmlFor='age'>Age</label>
				<input
					id='age'
					value={age}
					onChange={e => setAge(Number(e.target.value))}
					placeholder='18'
					className='border'
				/>
				<br />
				{!!age && age >= 18 && (
					<input
						id='isMarried'
						placeholder='Are you married?'
						className='border'
					/>
				)}
				<br />
				<button type='submit' className='bg-green-700'>
					Submit
				</button>
				<p className='mt-2 text-red-500'>{error}</p>
			</form>

			<div>
				<h2>Preview values:</h2>
				<p>FirstName: {firstName}</p>
				<p>LastName: {lastName}</p>
				<p>Age: {age}</p>
			</div>
		</div>
	);
}

// touched -
// dirty -

export default App;
