// src/pages/Home.js
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (user?.role === "student") {
      navigate("/student-dashboard");
    } else if (user?.role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mohi-navy text-white">
      <div className="bg-white text-mohi-navy p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-mohi-blue">
          Welcome to the Learning Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Transforming lives through the hope of Christ — powered by MOHI.
        </p>

        {!user ? (
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn btn-blue w-1/2">
              Login
            </Link>
            <Link to="/register" className="btn btn-orange w-1/2">
              Register
            </Link>
          </div>
        ) : (
          <button
            onClick={handleGoToDashboard}
            className="btn btn-blue w-full"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
