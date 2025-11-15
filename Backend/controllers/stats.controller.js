import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getStats = async (req, res) => {
	try {
		// These are very fast, optimized database operations
		const userCount = await User.countDocuments();
		const postCount = await Post.countDocuments();

		res.status(200).json({
			userCount,
			postCount,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch stats" });
		console.error("Error in getStats controller: ", error);
	}
};