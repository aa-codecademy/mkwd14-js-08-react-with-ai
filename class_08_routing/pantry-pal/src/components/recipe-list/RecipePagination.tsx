import type { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import {
	SelectContent,
	SelectItem,
	SelectValue,
	Select,
	SelectTrigger,
} from '../ui/select';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48, 96];

type RecipePaginationProps = {
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	totalPages: number;
	limit: number;
	setLimit: Dispatch<SetStateAction<number>>;
};

function RecipePagination({
	page,
	setPage,
	totalPages,
	limit,
	setLimit,
}: RecipePaginationProps) {
	return (
		<div className='flex items-center justify-center gap-4'>
			<Button
				variant='outline'
				disabled={page === 1}
				onClick={() => {
					setPage(currentPage => Math.max(1, currentPage - 1));
				}}>
				← Previous
			</Button>
			<span>
				Page {page} / {totalPages}
			</span>
			<Button
				variant='outline'
				disabled={page === totalPages}
				onClick={() =>
					setPage(currentPage => Math.min(totalPages, currentPage + 1))
				}>
				Next →
			</Button>
			<div className='max-w-md'>
				<Select
					value={String(limit)}
					onValueChange={value => setLimit(Number(value))}>
					<SelectTrigger className='w-full'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{PAGE_SIZE_OPTIONS.map(option => (
							<SelectItem key={option} value={String(option)}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

export default RecipePagination;
