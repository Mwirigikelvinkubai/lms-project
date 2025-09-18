// backend/models/Lesson.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  { title: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["video", "pdf", "image", "embed", "text"],
      required: true,
    },
    contentUrls: [String],   // 👈 allow multiple file URLs
    embedLink: String,       // YouTube, Vimeo, etc.
    bodyHtml: String,        // full rich text (instead of plain bodyText)
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    moduleIndex: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
