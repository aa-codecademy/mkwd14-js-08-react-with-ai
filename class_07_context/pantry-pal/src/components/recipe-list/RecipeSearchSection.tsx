import { Search } from 'lucide-react';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import type { SortBy, SortDirection } from '../../types/recipe';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'title', label: 'Title' },
	{ value: 'prepMinutes', label: 'Prep time' },
	{ value: 'servings', label: 'Servings' },
];

type RecipeSearchSectionProps = {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	maxPrepMin: number | undefined;
	setMaxPrepMin: (min: number) => void;
	sortBy: SortBy;
	setSortBy: (value: SortBy) => void;
	sortOrder: SortDirection;
	setSortOrder: (value: SortDirection) => void;
	availableTags: string[];
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	onTagToggle: (tag: string) => void;
};

function RecipeSearchSection({
	searchTerm,
	setSearchTerm,
	maxPrepMin,
	setMaxPrepMin,
	sortBy,
	setSortBy,
	sortOrder,
	setSortOrder,
	availableTags,
	selectedTags,
	setSelectedTags,
	onTagToggle,
}: RecipeSearchSectionProps) {
	return (
		<>
			<InputGroup>
				<InputGroupInput
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder='Search for a recipe...'
					type='search'
				/>
				<InputGroupAddon align='inline-start'>
					<Search />
				</InputGroupAddon>
			</InputGroup>

			<div className='space-y-1'>
				<Label htmlFor='max-prep-min'>Max pep (min)</Label>
				<Input
					id='max-prep-min'
					type='number'
					min={1}
					value={maxPrepMin}
					onChange={e => setMaxPrepMin(Number(e.target.value))}
				/>
			</div>

			<div className='space-y-1'>
				<Label>Sort by</Label>
				<div className='flex gap-2'>
					<Select
						value={sortBy}
						onValueChange={value => setSortBy(value as SortBy)}>
						<SelectTrigger className='w-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SORT_OPTIONS.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type='button'
						variant='outline'
						title='Toggle sort direction'
						onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}>
						{sortOrder === 'ASC' ? '↑' : '↓'}
					</Button>
				</div>
			</div>

			{availableTags.length > 0 && (
				<div className='flex flex-wrap items-center gap-2'>
					{availableTags.map(tag => {
						const isSelected = selectedTags.includes(tag);
						return (
							<button onClick={() => onTagToggle(tag)} key={tag} type='button'>
								<Badge variant={isSelected ? 'outline' : 'default'}>
									{tag}
								</Badge>
							</button>
						);
					})}
					{selectedTags.length > 0 && (
						<Button
							type='button'
							variant='link'
							size='sm'
							onClick={() => setSelectedTags([])}>
							clear tags
						</Button>
					)}
				</div>
			)}
		</>
	);
}

export default RecipeSearchSection;
