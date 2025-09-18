import express from "express";
import Course from "../models/Course.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify instructor role
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Only instructors allowed here
    if (req.user.role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can access this route" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Create a new course
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const course = new Course({
      title,
      description,
      createdBy: req.user.id,
    });

    await course.save();

    res.json({ message: "Course created successfully", course });
  } catch (err) {
    console.error("❌ Create Course Error:", err);
    res.status(500).json({ error: "Server error, please try again" });
  }
});

// ✅ Get all courses created by the logged-in instructor
router.get("/", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error("❌ Fetch Courses Error:", err);
    res.status(500).json({ error: "Server error, please try again" });
  }
});

export default router;
