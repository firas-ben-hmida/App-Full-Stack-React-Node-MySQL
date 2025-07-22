import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isValidEmail, isValidPassword } from "../utils/cds";


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.nom) newErrors.nom = "Le nom est requis.";
    if (!form.prenom) newErrors.prenom = "Le prénom est requis.";
    if (!isValidEmail(form.email)) newErrors.email = "Veuillez entrer un email valide.";
    if (!isValidPassword(form.password)) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        if (data.message && data.message.includes("existe déjà")) {
          setRegisterError("Cet email existe déjà.");
        } else {
          setRegisterError(data.message || "Erreur lors de l'inscription.");
        }
      }
    } catch (err) {
      setRegisterError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Inscription</h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-blue-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.nom ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"}`}
              value={form.nom}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Votre nom"
            />
            {errors.nom && <div className="text-red-500 text-sm mt-1">{errors.nom}</div>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.prenom ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"}`}
              value={form.prenom}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Votre prénom"
            />
            {errors.prenom && <div className="text-red-500 text-sm mt-1">{errors.prenom}</div>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"}`}
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="exemple@email.com"
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"}`}
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-blue-700"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"}`}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Confirmez le mot de passe"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-blue-700"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
          {registerError && <div className="text-red-500 text-center mt-2">{registerError}</div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-700">Déjà un compte ? </span>
          <Link to="/login" className="text-blue-900 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
} 