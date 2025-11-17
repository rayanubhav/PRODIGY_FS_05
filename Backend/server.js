import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import statsRoutes from "./routes/stats.routes.js";

import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import rateLimit from "express-rate-limit";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// --- UPDATED CORS CONFIGURATION ---
// Define your CORS options
const corsOptions = {
	origin: true,
	credentials: true,
	optionsSuccessStatus: 200, // For legacy browsers
};

// 1. Enable CORS for all requests
app.use(cors(corsOptions));

// 2. Explicitly handle preflight (OPTIONS) requests
// This will respond to the browser's "permission slip" request (the 404 error)
app.options("*", cors(corsOptions));
// --- END UPDATED CORS ---

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

// Apply limiter *after* CORS handling
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
	connectMongoDB();
});