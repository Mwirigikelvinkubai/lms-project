import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { logout } from "../utils/auth";

export default function InstructorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState({ title: "", description: "" });
  const [courses, setCourses] = useState([]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/courses", course, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course created successfully!");
      setCourse({ title: "", description: "" });
      fetchCourses(); // reload list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create course");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mohi-green">
          Welcome, {user?.name}
        </h2>
        <button onClick={() => logout(navigate)} className="btn btn-orange">
          Logout
        </button>
      </div>

      <p className="text-mohi-navy mb-4">
        You are logged in as an <strong>Instructor</strong>.
      </p>

      {/* Create Course Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-mohi-blue">Create New Course</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Course Title"
            value={course.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mohi-blue"
            required
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={course.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mohi-blue"
            required
          ></textarea>
          <button type="submit" className="btn btn-blue w-full">
            Create Course
          </button>
        </form>
      </div>

      {/* List of Courses */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-mohi-blue">Your Courses</h3>
        {courses.length === 0 ? (
          <p className="text-gray-600">You haven’t created any courses yet.</p>
        ) : (
          <ul className="space-y-3">
            {courses.map((c) => (
              <li key={c._id} className="border rounded-lg p-4 hover:shadow transition">
                <h4 className="text-lg font-bold text-mohi-navy">{c.title}</h4>
                <p className="text-gray-600">{c.description}</p>
                <Link
                  to={`/course/${c._id}/lessons`}
                  className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Manage Lessons
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}