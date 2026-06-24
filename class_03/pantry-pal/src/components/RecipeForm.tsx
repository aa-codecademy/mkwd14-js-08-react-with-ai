import { useFieldArray, useForm } from 'react-hook-form';
import type { Recipe } from '../types/recipe';

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

const DEFAULT_VALUES: FormValues = {
	title: '',
	description: '',
	imageUrl: '',
	prepMinutes: 20,
	servings: 2,
	tags: '',
	ingredients: [{ name: '', amount: '' }],
	steps: [{ text: '' }],
};

const URL_PATTERN =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const LABEL_CLASSES = 'block text-sm font-medium text-slate-700';

const INPUT_CLASSES =
	'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

const ERROR_FIELD_CLASSES = 'mt-1 text-xs text-red-600';

const DEFAULT_IMAGE_URL = 'https://placehold.co/400x300?text=Recipe';

function RecipeForm() {
	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: DEFAULT_VALUES,
	});

	const imageUrl = watch('imageUrl');
	const showPreview = imageUrl.trim() && !errors.imageUrl;

	const {
		fields: ingredientsFields,
		append: ingredientsAppend,
		remove: ingredientsRemove,
	} = useFieldArray<FormValues, 'ingredients'>({
		control,
		name: 'ingredients',
	});

	const {
		fields: stepsFields,
		append: stepsAppend,
		remove: stepsRemove,
	} = useFieldArray<FormValues, 'steps'>({
		control,
		name: 'steps',
	});

	const onSubmit = (data: FormValues) => {
		const recipe: Recipe = {
			id: crypto.randomUUID(),
			title: data.title,
			description: data.description,
			imageUrl: data.imageUrl,
			prepMinutes: data.prepMinutes,
			servings: data.servings,
			tags: data.tags
				.split(',')
				.map(tag => tag.trim())
				.filter(Boolean),
			ingredients: data.ingredients,
			steps: data.steps.map(step => step.text),
		};

		console.log(recipe);
		reset(DEFAULT_VALUES);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm'>
			<h2 className='text-lg font-semibold text-brand-900'>Add a recipe</h2>

			<div>
				<label className={LABEL_CLASSES}>Title *</label>
				<input
					{...register('title', { required: 'Title is required' })}
					className={INPUT_CLASSES}
				/>
				{errors.title && (
					<p className={ERROR_FIELD_CLASSES}>{errors.title?.message}</p>
				)}
			</div>

			<div>
				<label className={LABEL_CLASSES}>Description</label>
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
						validate: (value: string) =>
							!value.trim() ||
							URL_PATTERN.test(value.trim()) ||
							'Must be a valid URL',
					})}
					placeholder='https://...'
					className={INPUT_CLASSES}
				/>
				{errors.imageUrl && (
					<p className={ERROR_FIELD_CLASSES}>{errors.imageUrl?.message}</p>
				)}
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
				<input
					{...register('tags')}
					className={INPUT_CLASSES}
					placeholder='protein, meat, vegan'
				/>
			</div>

			<div>
				<div className='mb-2 flex items-center justify-between'>
					<label className={LABEL_CLASSES}>Ingredients</label>
					<button
						onClick={() => ingredientsAppend({ name: '', amount: '' })}
						className='text-xs font-medium text-brand-500 hover:text-brand-700 cursor-pointer'
						type='button'>
						+ Add ingredient
					</button>
				</div>
				<div className='space-y-2'>
					{ingredientsFields.map((field, index) => (
						<div className='flex gap-2' key={field.id}>
							<input
								placeholder='ingredient'
								{...register(`ingredients.${index}.name`)}
								className='min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
							/>
							<input
								placeholder='amount'
								{...register(`ingredients.${index}.amount`)}
								className='w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
							/>
							{ingredientsFields.length > 1 && (
								<button
									type='button'
									onClick={() => ingredientsRemove(index)}
									aria-label='Remove ingredient'
									className='px-1 text-slate-400 hover:text-red-500'>
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
						className='text-xs font-medium text-brand-500 hover:text-brand-700'
						type='button'
						onClick={() => stepsAppend({ text: '' })}>
						+ Add step
					</button>
				</div>
				<div className='space-y-2'>
					{stepsFields.map((field, index) => (
						<div key={field.id} className='flex gap-2'>
							<span className='mt-2 text-xs font-medium text-slate-400 '>
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

			<button
				type='submit'
				disabled={isSubmitting}
				className='bg-brand-700 py-1 px-2 rounded-lg text-white'>
				{!isSubmitting ? 'Save recipe' : 'Submitting...'}
			</button>
		</form>
	);
}

export default RecipeForm;
