// A union type that models the four possible states of any async operation.
// Using a single `status` string is cleaner than three separate booleans
// (isLoading, isError, isSuccess) that can get out of sync with each other.
// Rule: only ONE of these four values is valid at any given moment.
export type HttpStatus = 'idle' | 'loading' | 'success' | 'error';
