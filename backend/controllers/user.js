import * as userService from "../services/user.js";
import { generateAccessToken } from "../server.js";

export const register = async (req, res) => {
  try {
    const userData = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: req.body.password
    };
    const existingUser = await userService.findUserByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email existe déjà." });
    }
    await userService.registerUser(userData);
    const user = await userService.loginUser(userData.email, userData.password);
    const userPayload = { id: user.id, name: user.nom, email: user.email, role: user.role };
    const accessToken = generateAccessToken(userPayload);
    res.status(201).json({ message: "Inscription réussie !", user, accessToken });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }
    const userPayload = { id: user.id, name: user.nom, email: user.email, role: user.role };
    const accessToken = generateAccessToken(userPayload);
    res.status(200).json({ user, accessToken });
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, prenom, email } = req.body;
    await userService.updateUserProfile(userId, { nom, prenom, email });
    res.status(200).json({ message: "Profil mis à jour avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    await userService.deleteUserById(userId);
    res.status(200).json({ message: "Profil supprimé avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la suppression du profil:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du profil." });
  }
};
