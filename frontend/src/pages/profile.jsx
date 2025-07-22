import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setForm({
      nom: parsedUser.nom || "",
      prenom: parsedUser.prenom || "",
      email: parsedUser.email || ""
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
        setUser({ ...user, ...form });
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      });
      if (response.ok) {
        localStorage.clear();
        navigate("/register");
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-blue-100 mt-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Mon Profil</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-blue-200 focus:ring-blue-200"
              value={form.nom}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-blue-200 focus:ring-blue-200"
              value={form.prenom}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 border-blue-200 focus:ring-blue-200"
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour"}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="w-full mt-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition"
          >
            Supprimer le profil
          </button>
        </form>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
          <div className="bg-white border border-blue-300 rounded-lg shadow-lg px-8 py-6 text-center z-50">
            <span className="text-blue-700 text-lg font-semibold block mb-4">Voulez-vous vraiment modifier votre profil ?</span>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-blue-700 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition"
              >
                Oui
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
          <div className="bg-white border border-red-300 rounded-lg shadow-lg px-8 py-6 text-center z-50">
            <span className="text-red-700 text-lg font-semibold block mb-4">Voulez-vous vraiment supprimer votre profil ?</span>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Oui
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-red-700 font-semibold px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
