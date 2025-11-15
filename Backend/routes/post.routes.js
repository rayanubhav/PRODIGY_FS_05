import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	// ADDED: New controller functions
	toggleBookmark,
	getBookmarkedPosts,
	// RENAMED: getTrending to getTrendingTopics
	getTrendingTopics,
} from "../controllers/post.controller.js";
// ADDED: Validation
import { param, validationResult } from "express-validator";

const router = express.Router();

// Middleware to handle validation errors
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// ADDED: New routes for trending and bookmarks
router.get("/trending", protectRoute, getTrendingTopics); // Updated function name
router.get("/bookmarks", protectRoute, getBookmarkedPosts);
router.post(
	"/:id/bookmark", // Toggle bookmark
	protectRoute,
	[param("id").isMongoId()],
	validate,
	toggleBookmark
);

// Existing routes with validation added
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, [param("id").isMongoId()], validate, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, [param("id").isMongoId()], validate, likeUnlikePost);
router.post("/comment/:id", protectRoute, [param("id").isMongoId()], validate, commentOnPost);
router.delete("/:id", protectRoute, [param("id").isMongoId()], validate, deletePost);

export default router;