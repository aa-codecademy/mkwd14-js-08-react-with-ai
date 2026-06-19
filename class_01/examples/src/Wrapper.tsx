// ============================================================
// WRAPPER COMPONENT — demonstrates the "children" prop
// ============================================================
// The children prop is special: React automatically passes any JSX
// placed BETWEEN the opening and closing tags of a component as children.
//
// Example usage in App.tsx:
//   <Wrapper>
//     <button>Click me!</button>   ← this becomes "children"
//   </Wrapper>

// ReactNode is the TypeScript type for "anything React can render":
// JSX elements, strings, numbers, arrays, null, etc.
import type { ReactNode } from 'react';

// We define the prop type inline here. For a component with only one prop
// this is perfectly readable — no need for a separate type alias.
function Wrapper({ children }: { children: ReactNode }) {
	return (
		// This component acts as a styled container.
		// It adds a border, rounded corners, margin, padding, and a shadow
		// to whatever content is passed as children.
		<section className='border border-gray-950 rounded m-2 p-2 shadow-lg'>
			{/* {children} renders whatever was passed between the Wrapper tags */}
			{children}
		</section>
	);
}

export default Wrapper;
