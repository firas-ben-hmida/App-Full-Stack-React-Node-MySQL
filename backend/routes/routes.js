import express from 'express';
import * as userController from '../controllers/user.js';
import { authenticateToken } from '../server.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile', authenticateToken, userController.updateProfile);
router.delete('/profile', authenticateToken, userController.deleteProfile);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Accès autorisé', user: req.user });
});

export default router;
