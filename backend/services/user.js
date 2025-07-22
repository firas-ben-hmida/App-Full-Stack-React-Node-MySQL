import { db } from "../db.js";
import bcrypt from "bcryptjs";
import util from "util";

db.query = util.promisify(db.query);

export async function registerUser(userData) {
  const { nom, prenom, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      "INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, 'Utilisateur')",
      [nom, prenom, email, hashedPassword]
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function loginUser(email, password) {
  try {
    const results = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findUserByEmail(email) {
  try {
    const results = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return results[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUserProfile(userId, { nom, prenom, email }) {
  try {
    const result = await db.query(
      "UPDATE users SET nom = ?, prenom = ?, email = ? WHERE id = ?",
      [nom, prenom, email, userId]
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteUserById(userId) {
  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
