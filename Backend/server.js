import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import statsRoutes from "./routes/stats.routes.js";

// ADDED: Import CORS
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
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ADDED: Use CORS
// This allows your frontend (on a different URL) to make requests to this backend
app.use(
	cors({
		// Make sure FRONTEND_URL is set in your Render environment variables
		origin: process.env.FRONTEND_URL, 
		credentials: true, // Allows cookies to be sent
	})
);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `windowMs`
	standardHeaders: true,
	legacyHeaders: false,
});

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