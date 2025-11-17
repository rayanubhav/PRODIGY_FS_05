import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce any fast-changing value.
 * @param value The value to debounce (e.g., search query)
 * @param delay The delay in milliseconds (e.g., 300)
 * @returns The debounced value
 */
const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set up a timer to update the debounced value after the delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timer if the value changes (or component unmounts)
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // Only re-run if value or delay changes

	return debouncedValue;
};

export default useDebounce;