import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const emojis = ["😀", "😂", "❤️", "🔥", "✨", "🎉", "🚀", "💯", "👍", "🎨", "💡", "🌟"];

	const { mutate: createPost, isPending } = useMutation({
		mutationFn: async ({ text, img }) => {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, img }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to create post");
			return data;
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			setShowEmojiPicker(false);
			toast.success("Post shared! 🚀");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!text.trim()) {
			toast.error("Say something! 💭");
			return;
		}
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setImg(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const addEmoji = (emoji) => {
		setText(text + emoji);
		setShowEmojiPicker(false);
	};

	return (
		<div className="card-base m-3 p-4 animate-fade-in">
			<form className="flex gap-3" onSubmit={handleSubmit}>
				{/* Avatar */}
				<div className="flex-shrink-0">
					<img
						src={authUser?.profileImg || "/avatar-placeholder.png"}
						alt={authUser?.fullName}
						className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-brand-primary/20"
					/>
				</div>

				{/* Form Content */}
				<div className="flex-1">
					<textarea
						className="input-base resize-none placeholder-gray-500 mb-3"
						placeholder="What's on your mind? 💭"
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={text ? 3 : 2}
					/>

					{/* Image Preview */}
					{img && (
						<div className="relative mb-3 group">
							<img
								src={img}
								alt="Preview"
								className="w-full rounded-lg object-cover max-h-64"
							/>
							<button
								type="button"
								onClick={() => {
									setImg(null);
									imgRef.current.value = null;
								}}
								className="absolute top-2 right-2 p-2 dark:bg-dark-surface/80 light:bg-white/80 rounded-full backdrop-blur-lg hover:dark:bg-red-500/20 hover:light:bg-red-500/20 transition-colors"
							>
								<IoCloseSharp className="w-5 h-5 text-red-500" />
							</button>
						</div>
					)}

					{/* Emoji Picker */}
					{showEmojiPicker && (
						<div className="mb-3 p-3 dark:bg-dark-surface light:bg-light-surface rounded-lg grid grid-cols-6 gap-2 animate-fade-in">
							{emojis.map((emoji, i) => (
								<button
									key={i}
									type="button"
									onClick={() => addEmoji(emoji)}
									className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:dark:bg-dark-card hover:light:bg-light-card"
								>
									{emoji}
								</button>
							))}
						</div>
					)}

					{/* Controls */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => imgRef.current?.click()}
								className="p-2 rounded-full dark:hover:bg-dark-surface light:hover:bg-light-surface transition-colors text-brand-accent"
								aria-label="Add image"
								title="Add image"
							>
								<CiImageOn className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								className="p-2 rounded-full dark:hover:bg-dark-surface light:hover:bg-light-surface transition-colors text-brand-accent"
								aria-label="Add emoji"
								title="Add emoji"
							>
								<BsEmojiSmileFill className="w-4 h-4" />
							</button>
						</div>
						<button
							type="submit"
							disabled={!text.trim() || isPending}
							className="btn-primary text-sm md:text-base"
						>
							{isPending ? "📤 Posting..." : "✨ Post"}
						</button>
					</div>
				</div>
			</form>

			<input
				type="file"
				accept="image/*"
				hidden
				ref={imgRef}
				onChange={handleImgChange}
			/>
		</div>
	);
};

export default CreatePost;