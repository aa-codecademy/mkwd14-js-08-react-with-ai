import type { Recipe } from '../types/recipe';

const BASE_URL = 'http://localhost:3000/api';

export async function fetchRecipes(): Promise<Recipe[]> {
	try {
		const response = await fetch(`${BASE_URL}/recipes`);

		const rawData = await response.json();

		if (!response.ok) {
			throw new Error(rawData.message);
		}

		return rawData.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
