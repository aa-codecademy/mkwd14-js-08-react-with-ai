import type { CreateRecipe, Recipe, UpdateRecipe } from '../types/recipe';

// Centralising the base URL means you change it in one place when you deploy.
// In a real app this often comes from an environment variable (import.meta.env.VITE_API_URL).
const BASE_URL = 'http://localhost:3000/api';

// Keeping API calls in a separate file ("service layer" or "lib") keeps your
// components clean — they just call a function and handle the result; they don't
// need to know about URLs, headers, or JSON parsing.
export async function fetchRecipes(): Promise<Recipe[]> {
	try {
		// fetch() only rejects (throws) on network errors — a 404 or 500 still "resolves".
		// That's why we MUST check response.ok after awaiting the response.
		const response = await fetch(`${BASE_URL}/recipes`);

		// We parse the JSON BEFORE checking response.ok because the error body
		// (with the useful message) is also JSON — we need to read it either way.
		const rawData = await response.json();

		if (!response.ok) {
			// Throw with the server's error message so the caller can show it to the user.
			throw new Error(rawData.message);
		}

		// Our API wraps the array in a `data` property: { data: Recipe[] }.
		// We unwrap it here so callers receive a plain Recipe[] — cleaner to work with.
		return rawData.data;
	} catch (error) {
		console.error(error);
		// Re-throwing propagates the error to the caller (e.g. RecipeList's .catch() handler).
		// Without this, the error would be silently swallowed here.
		throw error;
	}
}

export async function createRecipe(body: CreateRecipe): Promise<Recipe> {
	try {
		const rawResponse = await fetch(`${BASE_URL}/recipes`, {
			method: 'POST',
			// Content-Type: application/json tells the server how to parse the request body.
			// Without this header, Express (and most backends) won't know it's JSON.
			headers: { 'Content-Type': 'application/json' },
			// JSON.stringify converts the JS object to a JSON string — fetch can only send strings/blobs.
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

export async function updateRecipe(
	id: string,
	body: UpdateRecipe,
): Promise<Recipe> {
	try {
		const rawResponse = await fetch(`${BASE_URL}/recipes/${id}`, {
			method: 'PATCH',
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

export async function deleteRecipe(id: string): Promise<void> {
	await fetch(`${BASE_URL}/recipes/${id}`, {
		method: 'DELETE',
	});
}
