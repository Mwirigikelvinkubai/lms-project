import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CourseLessons() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState({
    title: "",
    contentType: "text",
    files: [],
    embedLink: "",
    bodyHtml: "",
  });

  const fetchLessons = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/lessons/course/${courseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLessons(res.data);
  };

  const handleFileChange = (e) => {
    setLesson({ ...lesson, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let contentUrls = [];

      // upload multiple files
      if (lesson.files.length > 0) {
        for (const file of lesson.files) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await axios.post(
            "http://localhost:5000/api/uploads",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          contentUrls.push(uploadRes.data.url);
        }
      }

      await axios.post(
        "http://localhost:5000/api/lessons",
        {
          title: lesson.title,
          contentType: lesson.contentType,
          contentUrls,
          embedLink: lesson.embedLink,
          bodyHtml: lesson.bodyHtml,
          courseId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Lesson created!");
      setLesson({
        title: "",
        contentType: "text",
        files: [],
        embedLink: "",
        bodyHtml: "",
      });
      fetchLessons();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create lesson");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Lesson</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        <input
          type="text"
          placeholder="Lesson Title"
          value={lesson.title}
          onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={lesson.contentType}
          onChange={(e) =>
            setLesson({ ...lesson, contentType: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="text">Text</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="embed">Embed Link</option>
        </select>

        {["pdf", "video", "image"].includes(lesson.contentType) && (
          <input type="file" multiple onChange={handleFileChange} />
        )}

        {lesson.contentType === "embed" && (
          <input
            type="url"
            placeholder="Embed Link (YouTube, Vimeo...)"
            value={lesson.embedLink}
            onChange={(e) =>
              setLesson({ ...lesson, embedLink: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        )}

        <ReactQuill
          theme="snow"
          value={lesson.bodyHtml}
          onChange={(value) => setLesson({ ...lesson, bodyHtml: value })}
          className="bg-white"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Lesson
        </button>
      </form>

      {/* Lesson list */}
      <div className="mt-8 bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Lessons</h3>
        {lessons.length === 0 ? (
          <p>No lessons yet.</p>
        ) : (
          <ul className="space-y-4">
            {lessons.map((l) => (
              <li key={l._id} className="border rounded p-3">
                <h4 className="font-bold">{l.title}</h4>
                {l.embedLink && (
                  <iframe
                    src={l.embedLink}
                    title={l.title}
                    className="mt-2 w-full h-64"
                  ></iframe>
                )}
                {l.contentUrls?.map((url, i) => (
                  <div key={i} className="mt-2">
                    {l.contentType === "pdf" && (
                      <a
                        href={`http://localhost:5000${url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        View PDF {i + 1}
                      </a>
                    )}
                    {l.contentType === "video" && (
                      <video
                        src={`http://localhost:5000${url}`}
                        controls
                        className="w-full rounded"
                      />
                    )}
                    {l.contentType === "image" && (
                      <img
                        src={`http://localhost:5000${url}`}
                        alt="Lesson"
                        className="w-full rounded"
                      />
                    )}
                  </div>
                ))}
                {l.bodyHtml && (
                  <div
                    className="prose mt-2"
                    dangerouslySetInnerHTML={{ __html: l.bodyHtml }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
