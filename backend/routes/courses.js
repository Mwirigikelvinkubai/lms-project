import express from "express";

const router = express.Router();

// Dummy courses list (replace with DB later)
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "React Basics", instructor: "Admin" },
    { id: 2, title: "Node.js Intro", instructor: "Instructor A" }
  ]);
});

export default router;
