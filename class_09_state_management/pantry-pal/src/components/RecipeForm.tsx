// react-hook-form manages form state, validation, and submission for you.
// Instead of dozens of useState calls (one per field + one per error + one per "touched" flag),
// useForm gives you a single object with everything pre-wired.
import { useFieldArray, useForm } from 'react-hook-form';
import type { CreateRecipe, Recipe } from '../types/recipe';
import { createRecipe, updateRecipe } from '../lib/api';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// FormValues describes the shape of the data as the form sees it.
// This can differ from the final Recipe type — e.g. `tags` is a comma-separated string here
// but will become string[] when we process it in onSubmit.
type FormValues = {
	title: string;
	description: string;
	imageUrl: string;
	prepMinutes: number;
	servings: number;
	tags: string;
	ingredients: { name: string; amount: string }[];
	steps: { text: string }[];
};

// Centralising default values in a constant makes it easy to reset the form later (reset(DEFAULT_VALUES)).
// It also documents which fields exist and what "empty" means for each type.
// const DEFAULT_VALUES: FormValues = {
// 	title: '',
// 	description: '',
// 	imageUrl: '',
// 	prepMinutes: 20,
// 	servings: 2,
// 	tags: '',
// 	ingredients: [{ name: '', amount: '' }],
// 	steps: [{ text: '' }],
// };

function toFormValues(recipe?: Recipe): FormValues {
	return {
		title: recipe?.title ?? '',
		description: recipe?.description ?? '',
		imageUrl: recipe?.imageUrl ?? '',
		prepMinutes: recipe?.prepMinutes ?? 20,
		servings: recipe?.servings ?? 2,
		tags: recipe?.tags.join(', ') ?? '',
		ingredients: recipe?.ingredients.length
			? recipe.ingredients
			: [{ name: '', amount: '' }],
		steps: recipe?.steps.length
			? recipe.steps.map(step => ({ text: step }))
			: [{ text: '' }],
	};
}

// URL validation regex. Defined outside the component so it's not recreated on every render.
// The `validate` function in register() calls this to check the field value before submission.
const URL_PATTERN =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

// Shared class name strings extracted into constants — the DRY principle applied to Tailwind.
// If you need to update the label style, you change it in one place, not 10.
const LABEL_CLASSES =
	'block text-sm font-medium text-slate-700 dark:text-emerald-200';

const INPUT_CLASSES =
	'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-brand-400';

const ERROR_FIELD_CLASSES = 'mt-1 text-xs text-red-600';

type RecipeFormProps = {
	recipe?: Recipe;
	onClose?: () => void;
};

function RecipeForm({ recipe, onClose }: RecipeFormProps) {
	// useForm returns an object with everything you need to manage the form.
	// Destructure only what you need — the full API is larger.
	const {
		register, // connects a native input to react-hook-form
		handleSubmit, // wraps your onSubmit with validation — calls onSubmit only if all rules pass
		reset, // resets all fields back to defaultValues
		control, // the bridge that non-native inputs (like useFieldArray) need
		watch, // subscribes to a field's value so you can use it in render
		formState: { errors, isSubmitting }, // derived metadata — errors is a nested object, isSubmitting is a boolean
	} = useForm<FormValues>({
		defaultValues: toFormValues(recipe),
	});

	const navigate = useNavigate();

	const isEditing = !!recipe;

	// watch('imageUrl') returns the current value of imageUrl on every render.
	// We use it to show a live image preview while the user types.
	const imageUrl = watch('imageUrl');
	// Only show the preview if the URL field has content AND has no validation error.
	const showPreview = imageUrl.trim() && !errors.imageUrl;

	// useFieldArray manages a dynamic list of objects (ingredients here).
	// It gives you: fields (current array), append (add item), remove (delete item).
	// `control` connects it to the same form instance created by useForm above.
	const {
		fields: ingredientsFields,
		append: ingredientsAppend,
		remove: ingredientsRemove,
	} = useFieldArray<FormValues, 'ingredients'>({
		control,
		name: 'ingredients',
	});

	// Same pattern for the steps array — each step is an object { text: string }
	// (not a plain string) because useFieldArray requires objects to attach a stable `id`.
	const {
		fields: stepsFields,
		append: stepsAppend,
		remove: stepsRemove,
	} = useFieldArray<FormValues, 'steps'>({
		control,
		name: 'steps',
	});

	// onSubmit receives validated, fully typed form data — react-hook-form only calls this
	// function if ALL validation rules pass. No need to manually check for empty fields here.
	const onSubmit = async (data: FormValues) => {
		const payload: CreateRecipe = {
			title: data.title,
			description: data.description,
			imageUrl: data.imageUrl,
			prepMinutes: data.prepMinutes,
			servings: data.servings,
			// tags arrive as a comma-separated string — split, trim each piece, and drop empties.
			tags: data.tags
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean), // filter(Boolean) removes empty strings ('') that result from trailing commas
			ingredients: data.ingredients,
			// steps are objects { text: string } in the form but plain strings in the Recipe type.
			steps: data.steps.map(step => step.text),
		};

		const savedRecipe = isEditing
			? await updateRecipe(recipe.id, payload)
			: await createRecipe(payload);

		if (isEditing) {
			onClose?.();
		} else {
			reset(toFormValues(recipe));
		}

		navigate(`/recipe/${savedRecipe.id}`);
	};

	return (
		// handleSubmit(onSubmit) returns a new function — pass it to onSubmit, not onSubmit directly.
		// handleSubmit intercepts the submit event, runs validation, then calls onSubmit if all rules pass.
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100'>
			<h2 className='text-lg font-semibold text-brand-900 dark:text-emerald-100'>
				{isEditing ? 'Edit recipe' : 'Add a recipe'}
			</h2>

			<div>
				<label className={LABEL_CLASSES}>Title *</label>
				{/* {...register('title', { required: ... })} spreads ref, name, onChange, onBlur onto the input.
				    This is how react-hook-form hooks into a native <input> without controlling its value directly.
				    The second argument is the validation rules object. */}
				<input
					{...register('title', { required: 'Title is required' })}
					className={INPUT_CLASSES}
				/>
				{/* errors.title is only defined when validation failed — so this paragraph only mounts on error. */}
				{errors.title && (
					<p className={ERROR_FIELD_CLASSES}>{errors.title?.message}</p>
				)}
			</div>

			<div>
				<label className={LABEL_CLASSES}>Description</label>
				{/* No validation rules here — description is optional. register() still tracks it. */}
				<textarea
					{...register('description')}
					rows={3}
					className={INPUT_CLASSES}></textarea>
			</div>

			<div>
				<label className={LABEL_CLASSES}>Image URL *</label>
				<input
					{...register('imageUrl', {
						required: 'Must provide image URL',
						// `validate` accepts a custom function — return true (valid) or an error string (invalid).
						// The first condition `!value.trim()` short-circuits to true when the field is empty,
						// letting the `required` rule show its message instead of the URL format message.
						validate: (value: string) =>
							!value.trim() ||
							URL_PATTERN.test(value.trim()) ||
							'Must be a valid URL',
					})}
					type='url'
					placeholder='https://...'
					className={INPUT_CLASSES}
				/>
				{errors.imageUrl && (
					<p className={ERROR_FIELD_CLASSES}>{errors.imageUrl?.message}</p>
				)}
				{/* Live image preview — showPreview is true only when imageUrl is valid.
				    This gives users instant feedback that their URL points to a real image. */}
				{showPreview && (
					<img
						src={imageUrl}
						alt='Preview image'
						className='mt-2 h-32 w-full rounded-lg object-cover'
					/>
				)}
			</div>

			<div>
				<label className={LABEL_CLASSES}>Prep minutes *</label>
				<input
					type='number'
					className={INPUT_CLASSES}
					{...register('prepMinutes', {
						required: 'Prep minutes value is required',
						min: { value: 1, message: 'Must be at least 1 minute' },
						// valueAsNumber: true tells react-hook-form to cast the string value to a number.
						// Without this, prepMinutes would arrive in onSubmit as a string like "20", not the number 20.
						valueAsNumber: true,
					})}
				/>
				{errors.prepMinutes && (
					<p className={ERROR_FIELD_CLASSES}>{errors.prepMinutes?.message}</p>
				)}
			</div>

			<div>
				<label className={LABEL_CLASSES}>Servings *</label>
				<input
					type='number'
					className={INPUT_CLASSES}
					{...register('servings', {
						required: 'Servings value is required',
						min: { value: 1, message: 'Must be at least for 1 person' },
						valueAsNumber: true,
					})}
				/>
				{errors.servings && (
					<p className={ERROR_FIELD_CLASSES}>{errors.servings?.message}</p>
				)}
			</div>

			<div>
				<label className={LABEL_CLASSES}>Tags (comma-separated)</label>
				{/* No validation — tags are optional. We'll split this string in onSubmit. */}
				<input
					{...register('tags')}
					className={INPUT_CLASSES}
					placeholder='protein, meat, vegan'
				/>
			</div>

			<div>
				<div className='mb-2 flex items-center justify-between'>
					<label className={LABEL_CLASSES}>Ingredients</label>
					{/* IMPORTANT: type='button' prevents this button from submitting the form.
					    A <button> inside a <form> defaults to type='submit'. Forgetting this
					    causes the form to submit prematurely when the user clicks "+ Add ingredient". */}
					<button
						onClick={() => ingredientsAppend({ name: '', amount: '' })}
						className='text-xs font-medium text-brand-500 hover:text-brand-700 cursor-pointer dark:text-emerald-200 dark:hover:text-emerald-100'
						type='button'>
						+ Add ingredient
					</button>
				</div>
				<div className='space-y-2'>
					{/* ingredientsFields is the live array from useFieldArray.
					    Each item has a stable `field.id` generated by react-hook-form — use it as the key,
					    not the array index. Index keys cause bugs when items are removed from the middle. */}
					{ingredientsFields.map((field, index) => (
						<div className='flex gap-2' key={field.id}>
							{/* Dynamic field names use template literals: `ingredients.${index}.name`
							    react-hook-form uses these dot-notation paths to build a nested data object. */}
							<input
								placeholder='ingredient'
								{...register(`ingredients.${index}.name`)}
								className='min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-brand-400'
							/>
							<input
								placeholder='amount'
								{...register(`ingredients.${index}.amount`)}
								className='w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-brand-400'
							/>
							{/* Only show the remove button when there is more than one ingredient.
							    We always keep at least one row so the form isn't confusingly empty. */}
							{ingredientsFields.length > 1 && (
								<button
									type='button'
									onClick={() => ingredientsRemove(index)}
									aria-label='Remove ingredient'
									className='px-1 text-slate-400 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400'>
									x
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			<div>
				<div className='mb-2 flex items-center justify-between'>
					<label className={LABEL_CLASSES}>Steps</label>
					<button
						className='text-xs font-medium text-brand-500 hover:text-brand-700 dark:text-emerald-200 dark:hover:text-emerald-100'
						type='button'
						onClick={() => stepsAppend({ text: '' })}>
						+ Add step
					</button>
				</div>
				<div className='space-y-2'>
					{stepsFields.map((field, index) => (
						// field.id (not index) as key — react-hook-form guarantees this is stable across removals.
						<div key={field.id} className='flex gap-2'>
							{/* Visual step number — derived from the index, not stored in state. */}
							<span className='mt-2 text-xs font-medium text-slate-400 dark:text-slate-300'>
								{index + 1}
							</span>
							<input
								{...register(`steps.${index}.text`)}
								placeholder={`Step ${index + 1}`}
								className='min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
							/>
							{stepsFields.length > 1 && (
								<button
									type='button'
									onClick={() => stepsRemove(index)}
									className='px-1 text-slate-400 hover:text-red-500'
									aria-label='Remove step'>
									x
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			{/* disabled={isSubmitting} prevents double-submits (e.g. from clicking twice quickly).
			    isSubmitting is automatically managed by react-hook-form during async onSubmit calls. */}
			<div className='flex gap-2 justify-end'>
				{isEditing && (
					<Button type='button' variant='ghost' onClick={onClose}>
						Cancel
					</Button>
				)}
				<Button type='submit' disabled={isSubmitting} variant='default'>
					{isSubmitting
						? 'Saving...'
						: isEditing
							? 'Save changes'
							: 'Save recipe'}
				</Button>
			</div>
		</form>
	);
}

export default RecipeForm;
