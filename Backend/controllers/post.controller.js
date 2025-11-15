import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		// --- ADDED: Hashtag Parsing ---
		const hashtagRegex = /#(\w+)/g;
		const hashtags = text.match(hashtagRegex) || [];
		// --- END ---

		const newPost = new Post({
			user: userId,
			text,
			img,
			// ADDED: Save parsed hashtags
			hashtags: hashtags.map((tag) => tag.substring(1).toLowerCase()),
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();
		
		// Return only the updated post, not all posts
		const updatedPost = await Post.findById(postId)
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(updatedPost);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			// Only send notification if liking someone else's post
			if (post.user.toString() !== userId.toString()) {
				const notification = new Notification({
					from: userId,
					to: post.user,
					type: "like",
				});
				await notification.save();
			}

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// --- NEW BOOKMARK FUNCTIONS ---

export const toggleBookmark = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		const isBookmarked = user.bookmarkedPosts.includes(postId);

		if (isBookmarked) {
			// Unbookmark
			await User.updateOne({ _id: userId }, { $pull: { bookmarkedPosts: postId } });
			user.bookmarkedPosts.pull(postId); // Update local copy
			res.status(200).json(user.bookmarkedPosts); // Send updated array
		} else {
			// Bookmark
			await User.updateOne({ _id: userId }, { $push: { bookmarkedPosts: postId } });
			user.bookmarkedPosts.push(postId); // Update local copy
			res.status(200).json(user.bookmarkedPosts); // Send updated array
		}
	} catch (error) {
		console.log("Error in toggleBookmark controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getBookmarkedPosts = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const bookmarkedPosts = await Post.find({ _id: { $in: user.bookmarkedPosts } })
			.sort({ createdAt: -1 }) // Show newest first
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(bookmarkedPosts);
	} catch (error) {
		console.log("Error in getBookmarkedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// --- END BOOKMARK FUNCTIONS ---

// --- REPLACED TRENDING FUNCTION ---
// Replaced the JS-based function with a more performant MongoDB Aggregation
export const getTrendingTopics = async (req, res) => {
	try {
		// 1. Calculate the timestamp for 24 hours ago
		const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

		// 2. Use MongoDB Aggregation
		const trending = await Post.aggregate([
			{
				// Find posts created in the last 24 hours with at least one hashtag
				$match: {
					createdAt: { $gte: twentyFourHoursAgo },
					hashtags: { $exists: true, $ne: [] },
				},
			},
			{
				// Separate each hashtag into its own document
				$unwind: "$hashtags",
			},
			{
				// Group by the hashtag and count occurrences
				$group: {
					_id: "$hashtags",
					count: { $sum: 1 },
				},
			},
			{
				// Sort by the highest count
				$sort: { count: -1 },
			},
			{
				// Return only the top 5
				$limit: 5,
			},
			{
				// Remap the output to be more friendly
				$project: {
					_id: 0,
					tag: "$_id",
					posts: "$count",
				},
			},
		]);

		res.status(200).json(trending);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch trending topics" });
		console.error("Error in getTrendingTopics: ", error);
	}
};
// --- END TRENDING FUNCTION ---

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};