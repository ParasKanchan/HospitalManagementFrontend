import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold hover:text-gray-200">
        HealthCare
      </Link>

      <div className="space-x-4 flex items-center">
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            {user.role === "patient" ? (
              <>
                <Link to="/appointments" className="hover:underline">
                  Appointments
                </Link>
                <Link to="/wellness" className="hover:underline">
                  Wellness
                </Link>
              </>
            ) : null}
            <Link to="/tips" className="hover:underline">
              Tips
            </Link>
            <span className="text-sm">
              {user.role === "doctor" ? "Dr. " : ""}{user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
