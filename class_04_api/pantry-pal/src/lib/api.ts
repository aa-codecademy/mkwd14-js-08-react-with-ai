import type { CreateRecipe, Recipe } from '../types/recipe';

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

export async function createRecipe(body: CreateRecipe): Promise<Recipe> {
	try {
		const rawResponse = await fetch(`${BASE_URL}/recipes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});

		const response = await rawResponse.json();

		if (!rawResponse.ok) {
			throw new Error(response.message);
		}

		return response;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
