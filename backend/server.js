import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import uploadRoutes from "./routes/uploadRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courseRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/uploads", uploadRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// lessons
app.use("/api/lessons", lessonRoutes);

// existing: app.use("/api/courses", courseRoutes); etc.

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(5000, () => console.log("Backend running on port 5000")))
.catch(err => console.error(err));
