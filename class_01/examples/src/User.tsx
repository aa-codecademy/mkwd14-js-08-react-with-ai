// ============================================================
// USER COMPONENT — demonstrates props and conditional rendering
// ============================================================

// TypeScript lets us define exactly what shape the props object must have.
// This gives us autocomplete and catches mistakes at compile time — not at runtime.
type UserProps = {
	name: string;
	age: number;
	isMarried: boolean;
	children: string[];  // an array of strings
};

// Props are destructured directly in the function signature.
// This is equivalent to: function User(props) { const { name, age, ... } = props; }
function User({ name, age, isMarried, children }: UserProps) {
	return (
		<div>
			<h2>Name: {name}</h2>
			<h2>Age: {age}</h2>

			{/* Conditional rendering with a ternary operator.
			    If isMarried is true → show "Married", otherwise → show "Single".
			    This is the most common pattern for inline conditions in JSX. */}
			<h2>Married status: {isMarried ? 'Married' : 'Single'}</h2>

			{/* Array.join() converts the array to a comma-separated string.
			    React can render strings and numbers directly inside JSX. */}
			<h3>Children: {children.join(', ')}.</h3>
		</div>
	);
}

export default User;
