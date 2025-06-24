import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { startSession, endSession, startBreak, endBreak, getActiveSession } from '../controllers/sessionController';

const router = express.Router();

router.post('/start', authMiddleware, startSession);
router.post('/end', authMiddleware, endSession);
router.post('/break/start', authMiddleware, startBreak);
router.post('/break/end', authMiddleware, endBreak);
router.get('/active', authMiddleware, getActiveSession);

export default router;
