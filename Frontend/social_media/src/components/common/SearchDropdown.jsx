import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.jsx'; // <-- FIX: Added .jsx extension

/**
 * A dropdown component to display search results.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the dropdown is visible.
 * @param {function} props.setIsOpen - Function to set the open state.
 * @param {boolean} props.isLoading - Whether the search query is loading.
 * @param {Array} props.results - The array of user results.
 * @param {function} props.clearSearch - Function to clear the search input.
 */
const SearchDropdown = ({ isOpen, setIsOpen, isLoading, results, clearSearch }) => {
	const dropdownRef = useRef(null);

	// Effect to handle closing the dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				// Check if the click was on the search input itself (which we get by ID)
				if (event.target.id !== 'desktop-search-input') {
					setIsOpen(false);
				}
			}
		};
		// Add event listener
		document.addEventListener('mousedown', handleClickOutside);
		// Clean up
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownRef, setIsOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			ref={dropdownRef}
			className="absolute top-full left-0 right-0 mt-2 card-base p-3 z-50 animate-fade-in max-h-96 overflow-y-auto"
		>
			{isLoading && (
				<div className="flex justify-center p-4">
					<LoadingSpinner size="sm" />
				</div>
			)}
			{!isLoading && results?.length === 0 && (
				<p className="text-sm text-center dark:text-gray-500 light:text-gray-500 p-4">
					No users found.
				</p>
			)}
			{!isLoading && results?.length > 0 && (
				<div className="space-y-2">
					{results.map((user) => (
						<Link
							key={user._id}
							to={`/profile/${user.username}`}
							onClick={() => {
								setIsOpen(false); // Close dropdown on click
								clearSearch(); // Clear the search input
							}}
							className="p-2 dark:hover:bg-dark-surface light:hover:bg-light-surface rounded-lg transition-all group flex items-center gap-3"
						>
							<img
								src={user.profileImg || '/avatar-placeholder.png'}
								alt={user.fullName}
								className="w-8 h-8 rounded-full object-cover"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-bold text-xs group-hover:text-brand-primary truncate">
									{user.fullName}
								</p>
								<p className="text-xs dark:text-gray-500 light:text-gray-500 truncate">
									@{user.username}
								</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchDropdown;