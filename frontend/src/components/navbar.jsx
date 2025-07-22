import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-blue-700 py-3 px-6 flex justify-between items-center mb-8">
      <span className="text-white font-bold text-xl">Mon Application</span>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition"
      >
        Déconnexion
      </button>
    </nav>
  );
}
