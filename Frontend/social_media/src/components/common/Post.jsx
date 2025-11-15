import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
	FaRegComment,
	FaRegHeart,
	FaHeart,
	FaTrash,
	FaRegBookmark,
	FaBookmark,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { formatPostDate } from "../../utils/date/index.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	if (!post || !post.user) {
		return <div className="card-base m-3 p-4"><LoadingSpinner /></div>;
	}

	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isSaved = authUser.bookmarkedPosts.includes(post._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/${post._id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to delete");
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/like/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
				if (!oldData) return oldData;
				if(Array.isArray(oldData)) {
					return oldData.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p));
				}
				if (oldData._id === post._id) {
					return { ...oldData, likes: updatedLikes };
				}
				return oldData;
			});
		},
	});

	const { mutate: bookmarkPost, isPending: isSaving } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/bookmark/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		onSuccess: (updatedBookmarks) => {
			queryClient.setQueryData(["authUser"], (oldUser) => ({
				...oldUser,
				bookmarkedPosts: updatedBookmarks,
			}));
			queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
			toast.success(isSaved ? "Post unbookmarked" : "Post bookmarked! 📌");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/posts/comment/${post._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to comment");
			return data;
		},
		onSuccess: (updatedPost) => {
			toast.success("Comment posted!");
			setComment("");
			queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
				if (!oldData) return oldData;
				if(Array.isArray(oldData)) {
					return oldData.map((p) => (p._id === post._id ? updatedPost : p));
				}
				if (oldData._id === post._id) {
					return updatedPost;
				}
				return oldData;
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleLikePost = () => !isLiking && likePost();
	const handleBookmarkPost = () => !isSaving && bookmarkPost();
	const handleCommentSubmit = (e) => {
		e.preventDefault();
		if (!comment.trim() || isCommenting) return;
		commentOnPost();
	};

	return (
		<article className="card-base m-3 p-4 hover:shadow-glow group transition-all">
			<div className="flex gap-3 mb-3 items-start">
				<Link to={`/profile/${postOwner.username}`} className="flex-shrink-0">
					<img
						src={postOwner.profileImg || "/avatar-placeholder.png"}
						alt={postOwner.fullName}
						className="w-10 h-10 rounded-full object-cover ring-1 ring-brand-primary/20 group-hover:ring-brand-primary transition-all"
					/>
				</Link>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<Link
							to={`/profile/${postOwner.username}`}
							className="font-semibold text-sm hover:text-brand-primary transition-colors"
						>
							{postOwner.fullName}
						</Link>
						<span className="dark:text-gray-500 light:text-gray-400 text-xs">
							@{postOwner.username}
						</span>
						<span className="dark:text-gray-600 light:text-gray-300">·</span>
						<span className="dark:text-gray-500 light:text-gray-400 text-xs">
							{formattedDate}
						</span>
					</div>
				</div>

				{isMyPost && (
					<button
						onClick={() => deletePost()}
						className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:dark:bg-red-900/20 hover:light:bg-red-100/20 rounded-full text-red-500 text-xs"
						title="Delete post"
					>
						{isDeleting ? <LoadingSpinner size="sm" /> : <FaTrash className="w-4 h-4" />}
					</button>
				)}
			</div>

			<div className="mb-3 pl-0">
				<p className="dark:text-gray-100 light:text-gray-900 text-sm leading-relaxed mb-3">
					{post.text}
				</p>

				{post.img && (
					<img
						src={post.img}
						alt="Post content"
						className="w-full rounded-lg object-cover max-h-80 mb-3 dark:bg-dark-surface light:bg-light-surface"
					/>
				)}
			</div>

			<div className="flex gap-4 text-xs dark:text-gray-500 light:text-gray-500 py-2 border-t border-b dark:border-dark-border border-light-border mb-2">
				<span>{post.comments?.length || 0} comments</span>
				<span>•</span>
				<span>{post.likes?.length || 0} likes</span>
			</div>

			<div className="flex justify-between items-center">
				<button
					onClick={() => document.getElementById("comments_modal" + post._id)?.showModal()}
					className="flex items-center gap-2 p-2 flex-1 justify-center rounded hover:dark:bg-blue-900/20 hover:light:bg-blue-100/20 hover:text-brand-accent transition-all group/comment text-xs dark:text-gray-500 light:text-gray-500"
					title="Comment"
				>
					<FaRegComment className="w-4 h-4 group-hover/comment:text-brand-accent" />
					<span className="hidden sm:inline">Reply</span>
				</button>

				<button
					className="flex items-center gap-2 p-2 flex-1 justify-center rounded hover:dark:bg-green-900/20 hover:light:bg-green-100/20 hover:text-brand-success transition-all group/repost text-xs dark:text-gray-500 light:text-gray-500"
					title="Repost"
				>
					<BiRepost className="w-4 h-4 group-hover/repost:text-brand-success" />
					<span className="hidden sm:inline">Repost</span>
				</button>

				<button
					onClick={handleLikePost}
					disabled={isLiking}
					className="flex items-center gap-2 p-2 flex-1 justify-center rounded hover:dark:bg-red-900/20 hover:light:bg-red-100/20 transition-all group/like text-xs"
					title="Like"
				>
					{isLiking ? (
						<LoadingSpinner size="xs" />
					) : isLiked ? (
						<FaHeart className="w-4 h-4 text-red-500 animate-heart-bounce" />
					) : (
						<FaRegHeart className="w-4 h-4 dark:text-gray-500 light:text-gray-500 group-hover/like:text-red-500" />
					)}
					<span className={`hidden sm:inline ${isLiked ? "text-red-500" : ""}`}>
						{isLiked ? "Liked" : "Like"}
					</span>
				</button>

				<button
					onClick={handleBookmarkPost}
					disabled={isSaving}
					className="flex items-center gap-2 p-2 flex-1 justify-center rounded hover:dark:bg-amber-900/20 hover:light:bg-amber-100/20 hover:text-brand-warning transition-all group/bookmark text-xs dark:text-gray-500 light:text-gray-500"
					title="Bookmark"
				>
					{isSaving ? (
						<LoadingSpinner size="xs" />
					) : isSaved ? (
						<FaBookmark className="w-4 h-4 text-brand-warning" />
					) : (
						<FaRegBookmark className="w-4 h-4 group-hover/bookmark:text-brand-warning" />
					)}
					<span className={`hidden sm:inline ${isSaved ? "text-brand-warning" : ""}`}>
						{isSaved ? "Saved" : "Save"}
					</span>
				</button>
			</div>

			<dialog id={`comments_modal${post._id}`} className="modal">
				<div className="modal-box card-base dark:border-dark-border light:border-light-border w-full max-w-md">
					<h3 className="font-bold text-lg mb-4">💬 Comments</h3>
					<div className="flex flex-col gap-3 max-h-60 overflow-y-auto mb-4">
						{post.comments?.length === 0 && (
							<p className="dark:text-gray-500 light:text-gray-400 text-sm text-center py-4">
								No comments yet 🤔 Be the first!
							</p>
						)}
						{post.comments?.map((c) => (
							<div key={c._id} className="flex gap-2 p-2 hover:dark:bg-dark-surface rounded-lg">
								<img
									src={c.user.profileImg || "/avatar-placeholder.png"}
									alt={c.user.fullName}
									className="w-8 h-8 rounded-full object-cover flex-shrink-0"
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-1 flex-wrap">
										<Link
											to={`/profile/${c.user.username}`}
											className="font-semibold text-sm hover:text-brand-primary"
											onClick={() => document.getElementById("comments_modal" + post._id)?.close()}
										>
											{c.user.fullName}
										</Link>
										<span className="dark:text-gray-500 light:text-gray-400 text-xs">
											@{c.user.username}
										</span>
									</div>
									<p className="text-sm mt-1 dark:text-gray-300 light:text-gray-700">
										{c.text}
									</p>
								</div>
							</div>
						))}
					</div>

					<form
						className="flex gap-2 pt-4 border-t dark:border-dark-border border-light-border"
						onSubmit={handleCommentSubmit}
					>
						<input
							type="text"
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="input-base flex-1 text-sm"
						/>
						<button
							type="submit"
							className="btn-primary text-xs px-3"
							disabled={isCommenting}
						>
							{isCommenting ? <LoadingSpinner size="xs" /> : "Post"}
						</button>
					</form>

					<form method="dialog" className="absolute top-2 right-2">
						<button className="text-gray-500 hover:text-gray-700">✕</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</article>
	);
};

export default Post;