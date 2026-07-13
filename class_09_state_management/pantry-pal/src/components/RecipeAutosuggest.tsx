import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from './ui/combobox';

function RecipeAutosuggest() {
	return (
		<Combobox items={['test 1', 'test, 2']}>
			<ComboboxInput />
			<ComboboxContent>
				<ComboboxEmpty>No recipes for this search...</ComboboxEmpty>
				<ComboboxList>
					{item => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export default RecipeAutosuggest;
