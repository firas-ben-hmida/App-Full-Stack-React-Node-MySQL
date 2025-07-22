import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { isValidEmail, isValidPassword } from "../utils/cds";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/acceuil", { replace: true });
    }
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      navigate("/login", { replace: true });
    };
    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;
    if (!isValidEmail(email)) {
      setEmailError("Veuillez entrer un email valide.");
      hasError = true;
    }
    if (!isValidPassword(password)) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          if (data.user.role === "Utilisateur") {
            navigate("/profile");
          } else {
            navigate("/back");
          }
        }, 100);
      } else {
        setLoginError("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setLoginError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-blue-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                emailError ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="exemple@email.com"
            />
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-400 focus:ring-red-200" : "border-blue-200 focus:ring-blue-200"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Votre mot de passe"
            />
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
          {loginError && <div className="text-red-500 text-center mt-2">{loginError}</div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-blue-700">Pas de compte ? </span>
          <Link to="/register" className="text-blue-900 font-semibold hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
} 