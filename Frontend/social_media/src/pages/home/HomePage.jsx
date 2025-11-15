import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Posts from "../../components/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";
import useFollow from "../../hooks/useFollow.js";
import { BiSearch } from "react-icons/bi";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	// Fetch "Who to Follow"
	const { data: suggestedUsers, isLoading: isLoadingSuggested } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/users/suggested`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
	});

	// Fetch "Quick Stats"
	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: ["stats"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/stats/counts`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
	});

	// Fetch "Trending"
	const { data: trending, isLoading: isLoadingTrending } = useQuery({
		queryKey: ["trending"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/trending`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
	});

	const { follow, isPending } = useFollow();

	return (
		<>
			{/* Mobile & Tablet View (< 1024px) */}
			<div className="lg:hidden flex-1">
				{/* Feed Tabs - Sticky */}
				<div className="sticky top-16 md:top-0 dark:bg-dark-surface/95 light:bg-white/95 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10">
					<div className="flex">
						{[
							{ id: "forYou", label: "✨ For You" },
							{ id: "following", label: "👥 Following" },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setFeedType(tab.id)}
								className={`flex-1 py-3 font-medium transition-all duration-200 relative
									${
										feedType === tab.id
											? "dark:text-brand-primary light:text-brand-primary"
											: "dark:text-gray-500 light:text-gray-500"
									}`}
							>
								{tab.label}
								{feedType === tab.id && (
									<div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Create Post */}
				<CreatePost />

				{/* Posts Feed - ONLY THIS SCROLLS */}
				<div className="space-y-0.5">
					<Posts feedType={feedType} />
				</div>
			</div>

			{/* Desktop View (lg+) - PROPER FIXED LAYOUT */}
			<div className="hidden lg:flex lg:h-[calc(100vh-4rem)] lg:gap-4 lg:px-4 lg:pt-4 max-w-7xl lg:mx-auto">
				{/* Center Feed - ONLY THIS SCROLLS (Now wider) */}
				<div className="lg:flex-1 flex flex-col min-w-0">
					{/* Feed Tabs - FIXED AT TOP */}
					<div className="dark:bg-dark-surface light:bg-white border-b dark:border-dark-border border-light-border flex-shrink-0 mb-3">
						<div className="flex gap-8 px-4 py-3">
							{[
								{ id: "forYou", label: "✨ For You" },
								{ id: "following", label: "👥 Following" },
							].map((tab) => (
								<button
									key={tab.id}
									onClick={() => setFeedType(tab.id)}
									className={`py-2 font-semibold transition-all duration-200 border-b-2
										${
											feedType === tab.id
												? "dark:text-brand-primary light:text-brand-primary dark:border-brand-primary light:border-brand-primary"
												: "dark:text-gray-500 light:text-gray-500 dark:border-transparent light:border-transparent"
										}`}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* Create Post - FIXED */}
					<div className="flex-shrink-0 mb-2">
						<CreatePost />
					</div>

					{/* Posts Feed - ONLY SCROLLABLE AREA */}
					<div className="flex-1 overflow-y-auto space-y-1 pr-2">
						<Posts feedType={feedType} />
					</div>
				</div>

				{/* Right Sidebar - FIXED (NO SCROLL) */}
				<div className="lg:w-72 flex flex-col flex-shrink-0 gap-3">
					{/* Search Bar - FIXED */}
					<div className="card-base p-3 flex items-center gap-2 flex-shrink-0">
						<BiSearch className="text-brand-accent text-lg flex-shrink-0" />
						<input
							type="text"
							placeholder="Search..."
							className="flex-1 bg-transparent dark:text-white light:text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
						/>
					</div>

					{/* Who to Follow - Now handles its own loading state */}
					<div className="card-base p-3 max-h-96 overflow-hidden">
						<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
							👥 Who to Follow
						</h2>
						<div className="space-y-2 overflow-y-auto max-h-72 pr-2">
							{isLoadingSuggested && (
								<div className="flex justify-center">
									<LoadingSpinner size="sm" />
								</div>
							)}
							{!isLoadingSuggested &&
								suggestedUsers?.map((user) => (
									<div
										key={user._id}
										className="p-2 dark:hover:bg-dark-surface light:hover:bg-light-surface rounded-lg transition-all group"
									>
										<div className="flex items-start justify-between gap-2">
											<Link
												to={`/profile/${user.username}`}
												className="flex items-center gap-2 flex-shrink-0"
											>
												<img
													src={user.profileImg || "/avatar-placeholder.png"}
													alt={user.fullName}
													className="w-8 h-8 rounded-full object-cover"
												/>
											</Link>
											<div className="flex-1 min-w-0">
												<Link to={`/profile/${user.username}`} className="no-hover">
													<p className="font-bold text-xs group-hover:text-brand-primary truncate">
														{user.fullName}
													</p>
													<p className="text-xs dark:text-gray-500 light:text-gray-500 truncate">
														@{user.username}
													</p>
												</Link>
											</div>
											<button
												onClick={(e) => {
													e.preventDefault();
													follow(user._id);
												}}
												disabled={isPending}
												className="btn-primary text-xs px-2 py-1 flex-shrink-0 whitespace-nowrap"
											>
												{isPending ? "..." : "Follow"}
											</button>
										</div>
									</div>
								))}
						</div>
					</div>

					{/* Trending Section - Now dynamic */}
					<div className="card-base p-4 max-h-80 overflow-hidden">
						<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
							🔥 Trending Now
						</h2>
						<div className="space-y-2 overflow-y-auto max-h-64 pr-2">
							{isLoadingTrending && (
								<div className="flex justify-center">
									<LoadingSpinner size="sm" />
								</div>
							)}
							{!isLoadingTrending &&
								trending?.map((item) => (
									<div
										key={item.tag}
										className="p-2 rounded-lg dark:hover:bg-dark-surface light:hover:bg-light-surface transition-colors cursor-pointer group"
									>
										<p className="font-bold text-xs group-hover:text-brand-primary transition-colors">
											#{item.tag}
										</p>
										<p className="text-xs dark:text-gray-500 light:text-gray-500">
											{item.posts.toLocaleString()} post{item.posts > 1 ? "s" : ""}
										</p>
									</div>
								))}
							{!isLoadingTrending && trending?.length === 0 && (
								<p className="text-sm text-center dark:text-gray-500 light:text-gray-500">
									Nothing is trending right now.
								</p>
							)}
						</div>
					</div>

					{/* Quick Stats - Now dynamic */}
					<div className="card-base p-3 grid grid-cols-2 gap-2 flex-shrink-0">
						<div className="p-2 dark:bg-dark-surface light:bg-light-surface rounded-lg text-center">
							{isLoadingStats ? (
								<LoadingSpinner size="sm" />
							) : (
								<p className="text-xl font-bold text-brand-primary">
									{stats?.userCount.toLocaleString() || 0}
								</p>
							)}
							<p className="text-xs dark:text-gray-400 light:text-gray-600">Users</p>
						</div>
						<div className="p-2 dark:bg-dark-surface light:bg-light-surface rounded-lg text-center">
							{isLoadingStats ? (
								<LoadingSpinner size="sm" />
							) : (
								<p className="text-xl font-bold text-brand-accent">
									{stats?.postCount.toLocaleString() || 0}
								</p>
							)}
							<p className="text-xs dark:text-gray-400 light:text-gray-600">Posts</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;