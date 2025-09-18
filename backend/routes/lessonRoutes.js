// backend/routes/lessonRoutes.js
import express from "express";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/lessons
 * Body: { title, contentType, contentUrl, bodyText, courseId, moduleIndex, order }
 * Protected: instructor
 */
router.post("/", verifyToken, requireRole("instructor"), async (req, res) => {
  try {
    const { title, contentType, contentUrl, bodyText, courseId, moduleIndex, order } = req.body;
    if (!title || !contentType || !courseId) {
      return res.status(400).json({ error: "title, contentType and courseId are required" });
    }

    // ensure course exists and is owned by instructor
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (String(course.instructor || course.createdBy) !== String(req.user.id)) {
      // depending on earlier Course schema you used; check both createdBy and instructor fields
      return res.status(403).json({ error: "You are not the owner of this course" });
    }

    // create lesson
    const lesson = await Lesson.create({
      title,
      contentType,
      contentUrl,
      bodyText,
      durationSeconds: req.body.durationSeconds || 0,
      courseId,
      moduleIndex: typeof moduleIndex === "number" ? moduleIndex : 0,
      order: typeof order === "number" ? order : 0,
    });

    // attach lesson id to course.modules[moduleIndex].lessons (create default module if needed)
    if (!course.modules || course.modules.length === 0) {
      course.modules = [{ title: "Default", description: "", lessons: [] }];
    }
    const idx = typeof moduleIndex === "number" ? moduleIndex : 0;
    if (!course.modules[idx]) {
      // add blank modules until idx exists
      while (course.modules.length <= idx) {
        course.modules.push({ title: `Module ${course.modules.length + 1}`, description: "", lessons: [] });
      }
    }
    course.modules[idx].lessons.push(lesson._id);
    await course.save();

    res.json({ message: "Lesson created", lesson });
  } catch (err) {
    console.error("Create lesson error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/lessons/course/:courseId
 * Protected: any logged-in user (student or instructor) can fetch lessons for a course
 */
router.get("/course/:courseId", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId }).sort({ order: 1, createdAt: 1 });
    res.json(lessons);
  } catch (err) {
    console.error("Fetch lessons error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/lessons/:id  -> get single lesson
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    console.error("Fetch lesson error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
