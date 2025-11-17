import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaBookmark } from "react-icons/fa";
import Post from "../../components/common/Post.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const BookmarksPage = () => {
	const { data: bookmarkedPosts, isLoading } = useQuery({
		queryKey: ["bookmarks"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/bookmarks`, {
				credentials: "include", // <-- CRITICAL FIX
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to load bookmarks");
			return data;
		},
	});

	return (
		<div className="flex-1">
			{/* Header */}
			<div className="sticky top-16 md:top-0 dark:bg-dark-surface/80 light:bg-white/80 backdrop-blur-lg border-b dark:border-dark-border border-light-border z-10">
				<div className="flex items-center gap-4 px-4 py-4">
					<Link to="/" className="flex items-center gap-2 group">
						<FaArrowLeft className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
						<p className="font-bold text-lg">Bookmarks</p>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-2xl mx-auto">
				{isLoading && (
					<div className="flex justify-center py-20">
						<LoadingSpinner size="lg" />
					</div>
				)}

				{!isLoading && bookmarkedPosts?.length === 0 && (
					<div className="card-base m-4 p-8 text-center animate-fade-in">
						<FaBookmark className="w-16 h-16 mx-auto text-brand-primary/30 mb-4" />
						<h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
						<p className="dark:text-gray-400 light:text-gray-600">
							Save posts to read them later. Click the bookmark icon on any post.
						</p>
					</div>
				)}

				{!isLoading && bookmarkedPosts?.length > 0 && (
					<div>
						{bookmarkedPosts.map((post) => (
							<Post key={post._id} post={post} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default BookmarksPage;