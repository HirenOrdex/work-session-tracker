import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();
router.post('/login', login); // Assuming register is used for login in this context
router.post('/register', register); // Register endpoint
export default router;