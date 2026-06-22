export type Ingredient = {
	name: string;
	amount: string;
};

export type Recipe = {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	prepMinutes: number;
	servings: number;
	tags: string[];
	ingredients: Ingredient[];
	steps: string[];
};
