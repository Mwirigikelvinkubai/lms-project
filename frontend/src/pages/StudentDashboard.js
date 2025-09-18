import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mohi-blue">
          Welcome, {user?.name}
        </h2>
        <button
          onClick={() => logout(navigate)}
          className="btn btn-orange"
        >
          Logout
        </button>
      </div>

      <p className="text-mohi-navy">
        You are logged in as a <strong>Student</strong>.
      </p>
      <p className="text-gray-700 mt-2">
        Here you will see your courses, lessons, and quizzes.
      </p>
    </div>
  );
}
