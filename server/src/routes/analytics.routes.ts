import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getScoreHistory,
    getPlatformHistory,
    getStatsSummary,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/summary', authMiddleware, getStatsSummary);
router.get('/history/:userId', getScoreHistory);
router.get('/platform-history/:userId', getPlatformHistory);

export default router;
