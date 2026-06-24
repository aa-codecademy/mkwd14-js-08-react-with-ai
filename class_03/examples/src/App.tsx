import { useState, type FormEvent } from 'react';
import './App.css';

// This commented-out block shows an alternative: one state object for the whole form.
// Advantage: fewer useState calls. Disadvantage: every keystroke must spread the old object:
//   setFormValues(prev => ({ ...prev, firstName: 'John' }))
// The individual-useState approach below is easier to read for a small number of fields.
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
	// Controlled inputs: React owns the value. The DOM is just a display.
	// Without `value={firstName}`, the input would track its own value (uncontrolled).
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	// `number | undefined` lets us distinguish "not filled in yet" from "typed 0".
	// Starting at 0 would trigger the age >= 18 check immediately.
	const [age, setAge] = useState<number | undefined>(undefined);

	// Two separate pieces of state for the global error and the first-name field error.
	// Keeping them separate lets us reset them independently.
	const [error, setError] = useState('');
	const [firstNameError, setFirstNameError] = useState('Missing first name');
	// "touched" pattern: don't show the error until the user has visited the field.
	// Showing errors immediately (before any interaction) feels hostile to the user.
	const [shouldShowFirstNameError, setShouldShowFirstNameError] =
		useState(false);
	const [shouldMakeFirstNameReadOnly, setShouldMakeFirstNameReadOnly] =
		useState(false);

	// `FormEvent` is TypeScript's type for a native form submit event.
	// e.preventDefault() is critical — without it the browser reloads the page on submit.
	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError('');
		console.log(e);

		// Manual validation: if any required field is empty, show a message and bail out early.
		// The `return` statement after setError prevents the success alert from running.
		if (!firstName || !lastName || !age) {
			setError('Missing values. Please fill out the form');
			return;
		}

		alert('Form submitted successfully');
	};

	return (
		<div>
			<h1>Uncontrolled form</h1>
			{/* onSubmit lives on the <form>, not the button — this means pressing Enter in any
			    input also triggers submission (standard browser behaviour). */}
			<form onSubmit={handleFormSubmit}>
				{/* htmlFor must match the input's id — it links the label to the input.
				    Clicking the label focuses the input, which matters for accessibility. */}
				<label htmlFor='first_name'>First Name</label>
				{/* Controlled input pattern:
				    - `value={firstName}` makes React the source of truth for this input's value.
				    - `onChange` keeps state in sync as the user types.
				    Without both, the input would show stale data or not update state. */}
				<input
					id='first_name'
					value={firstName}
					readOnly={shouldMakeFirstNameReadOnly}
					// e.target.value is always a string — even for number inputs. Convert if needed.
					onChange={e => setFirstName(e.target.value)}
					// onBlur fires when the user leaves the field (tabs away or clicks elsewhere).
					// This is the standard way to implement "validate on leave" behaviour.
					onBlur={() => {
						setShouldShowFirstNameError(!firstName);
						setShouldMakeFirstNameReadOnly(true);
					}}
					placeholder='John'
					className='border'
				/>
				{/* Short-circuit (&&): when shouldShowFirstNameError is false, nothing renders.
				    When it's true, the second operand (the <p>) renders. */}
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
					// Number() converts the string from e.target.value into an actual number.
					// Without this, `age >= 18` would compare a string to a number (unreliable).
					onChange={e => setAge(Number(e.target.value))}
					placeholder='18'
					className='border'
				/>
				<br />
				{/* Conditional rendering: this input only mounts when age is a truthy number >= 18.
				    !! converts undefined/0/NaN to false. Without !! you'd risk rendering `0` as text. */}
				{!!age && age >= 18 && (
					<input
						id='isMarried'
						placeholder='Are you married?'
						className='border'
					/>
				)}
				<br />
				{/* type='submit' is what triggers the form's onSubmit when clicked.
				    A button inside a form defaults to type='submit' — but being explicit is clearer. */}
				<button type='submit' className='bg-green-700'>
					Submit
				</button>
				<p className='mt-2 text-red-500'>{error}</p>
			</form>

			{/* Live preview: because firstName/lastName/age are in state, this section
			    re-renders automatically every time the user types — no extra code needed. */}
			<div>
				<h2>Preview values:</h2>
				<p>FirstName: {firstName}</p>
				<p>LastName: {lastName}</p>
				<p>Age: {age}</p>
			</div>
		</div>
	);
}

// touched  — the user has visited (focused then left) a field at least once
// dirty    — the user has changed a field's value from its initial default

export default App;
