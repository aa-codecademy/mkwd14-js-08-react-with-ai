type UserProps = {
	name: string;
	age: number;
	isMarried: boolean;
	children: string[];
};

function User({ name, age, isMarried, children }: UserProps) {
	return (
		<div>
			<h2>Name: {name}</h2>
			<h2>Age: {age}</h2>
			<h2>Married status: {isMarried ? 'Married' : 'Single'}</h2>
			<h3>Children: {children.join(', ')}.</h3>
		</div>
	);
}

export default User;
