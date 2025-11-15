import { Link } from "react-router-dom";
import { useState } from "react";
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
import { formatPostDate } from "../../utils/date";
import LoadingSpinner from "./LoadingSpinner";

const PostCard = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isSaved = post.savedBy?.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to delete");
			return data;
		},
		onSuccess: () => {
			toast.success("Post deleted");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			return data;
		},
		onSuccess: (updatedLikes) => {
			queryClient.setQueryData(["posts"], (oldData) =>
				oldData.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p))
			);
		},
	});

	const handleLikePost = () => {
		if (!isLiking) likePost();
	};

	return (
		<article className="card-base m-3 p-4 hover:shadow-glow group">
			{/* Header */}
			<div className="flex gap-3 mb-3">
				<Link to={`/profile/${postOwner.username}`}>
					<img
						src={postOwner.profileImg || "/avatar-placeholder.png"}
						alt={postOwner.fullName}
						className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-brand-primary transition-all"
					/>
				</Link>
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<Link
							to={`/profile/${postOwner.username}`}
							className="font-semibold hover:underline"
						>
							{postOwner.fullName}
						</Link>
						<span className="dark:text-gray-500 light:text-gray-400 text-sm">
							@{postOwner.username}
						</span>
						<span className="dark:text-gray-600 light:text-gray-300">·</span>
						<span className="dark:text-gray-500 light:text-gray-400 text-sm">
							{formattedDate}
						</span>
					</div>
				</div>
				{isMyPost && (
					<button
						onClick={() => deletePost()}
						className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:dark:bg-red-900 hover:light:bg-red-100 rounded-full text-red-500"
					>
						{isDeleting ? <LoadingSpinner size="sm" /> : <FaTrash className="w-4 h-4" />}
					</button>
				)}
			</div>

			{/* Content */}
			<div className="mb-3 pl-13">
				<p className="dark:text-gray-100 light:text-gray-900 mb-2">{post.text}</p>
				{post.img && (
					<img
						src={post.img}
						alt="Post content"
						className="w-full rounded-lg object-cover max-h-96 mb-3"
					/>
				)}
			</div>

			{/* Interactions */}
			<div className="flex justify-between dark:text-gray-500 light:text-gray-600 text-sm pl-13 pt-2 border-t dark:border-dark-border border-light-border">
				{/* Comment */}
				<button
					onClick={() => document.getElementById("comments_modal" + post._id)?.showModal()}
					className="flex items-center gap-2 p-2 rounded-full hover:dark:bg-blue-900 hover:light:bg-blue-100 hover:text-brand-accent transition-all group/comment"
				>
					<FaRegComment className="w-4 h-4 group-hover/comment:text-brand-accent" />
					<span className="text-xs">{post.comments.length}</span>
				</button>

				{/* Repost */}
				<button className="flex items-center gap-2 p-2 rounded-full hover:dark:bg-green-900 hover:light:bg-green-100 hover:text-brand-success transition-all group/repost">
					<BiRepost className="w-4 h-4 group-hover/repost:text-brand-success" />
					<span className="text-xs">0</span>
				</button>

				{/* Like */}
				<button
					onClick={handleLikePost}
					className="flex items-center gap-2 p-2 rounded-full hover:dark:bg-red-900 hover:light:bg-red-100 transition-all group/like"
					disabled={isLiking}
				>
					{isLiked ? (
						<FaHeart className="w-4 h-4 text-red-500 animate-heart-bounce" />
					) : (
						<FaRegHeart className="w-4 h-4 group-hover/like:text-red-500" />
					)}
					<span className={`text-xs ${isLiked ? "text-red-500" : ""}`}>
						{post.likes.length}
					</span>
				</button>

				{/* Bookmark */}
				<button className="flex items-center gap-2 p-2 rounded-full hover:dark:bg-amber-900 hover:light:bg-amber-100 transition-all group/bookmark">
					{isSaved ? (
						<FaBookmark className="w-4 h-4 text-brand-warning" />
					) : (
						<FaRegBookmark className="w-4 h-4 group-hover/bookmark:text-brand-warning" />
					)}
				</button>
			</div>

			{/* Comments Modal */}
			<dialog id={`comments_modal${post._id}`} className="modal">
				<div className="modal-box dark:bg-dark-card dark:border-dark-border light:bg-light-card light:border-light-border border rounded-brand">
					<h3 className="font-bold text-lg mb-4">💬 Comments</h3>
					<div className="flex flex-col gap-3 max-h-60 overflow-auto">
						{post.comments.length === 0 && (
							<p className="dark:text-gray-500 light:text-gray-400 text-sm">
								No comments yet 🤔 Be the first one 😉
							</p>
						)}
						{post.comments.map((c) => (
							<div key={c._id} className="flex gap-2 p-2 hover:dark:bg-dark-surface rounded-lg">
								<img
									src={c.user.profileImg || "/avatar-placeholder.png"}
									alt={c.user.fullName}
									className="w-8 h-8 rounded-full object-cover"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-1">
										<span className="font-semibold text-sm">{c.user.fullName}</span>
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

					<form className="flex gap-2 mt-4 pt-4 border-t dark:border-dark-border border-light-border">
						<input
							type="text"
							placeholder="Add a comment..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="input-base flex-1"
						/>
						<button className="btn-primary">Post</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</article>
	);
};

export default PostCard;