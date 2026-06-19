import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<section className='border border-gray-950 rounded m-2 p-2 shadow-lg'>
			{children}
		</section>
	);
}

export default Wrapper;
