import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaChevronDown } from "react-icons/fa";
import useFollow from "../../hooks/useFollow.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const RightPanel = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/users/suggested`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
	});

	const { follow, isPending } = useFollow();

	if (!suggestedUsers?.length) return null;

	// ONLY show on mobile (hidden on desktop since we have it in HomePage)
	return (
		<aside className="lg:hidden fixed bottom-20 left-0 right-0 dark:bg-dark-surface light:bg-white border-t dark:border-dark-border border-light-border z-40">
			{/* Header with Toggle */}
			<div
				className="flex items-center justify-between px-4 py-3 cursor-pointer hover:dark:bg-dark-card hover:light:bg-light-surface transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<h2 className="text-lg font-bold">👥 Who to Follow</h2>
				<FaChevronDown
					className={`w-4 h-4 transition-transform duration-200 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</div>

			{/* Collapsible Content */}
			{isExpanded && (
				<div className="max-w-2xl mx-auto px-4 pb-4 max-h-56 overflow-y-auto">
					<div className="space-y-3">
						{isLoading && <LoadingSpinner size="sm" />}

						{!isLoading &&
							suggestedUsers?.slice(0, 5).map((user) => (
								<div
									key={user._id}
									className="p-3 dark:hover:bg-dark-card light:hover:bg-light-surface rounded-lg transition-all group cursor-pointer flex items-start gap-3"
								>
									{/* Avatar */}
									<img
										src={user.profileImg || "/avatar-placeholder.png"}
										alt={user.fullName}
										className="w-10 h-10 rounded-full object-cover flex-shrink-0"
									/>

									{/* User Info */}
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm truncate group-hover:text-brand-primary dark:group-hover:text-brand-primary light:group-hover:text-brand-primary">
											{user.fullName}
										</p>
										<p className="dark:text-gray-400 light:text-gray-500 text-xs truncate">
											@{user.username}
										</p>
									</div>

									{/* Follow Button */}
									<button
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
										disabled={isPending}
										className="btn-primary text-xs px-3 py-1 flex-shrink-0 whitespace-nowrap"
									>
										{isPending ? "..." : "Follow"}
									</button>
								</div>
							))}
					</div>
				</div>
			)}
		</aside>
	);
};

export default RightPanel;