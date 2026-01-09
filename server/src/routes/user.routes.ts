import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getMe,
    getUserByUsername,
    updateProfile,
    connectPlatforms,
    syncStats,
} from '../controllers/user.controller';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.get('/:username', getUserByUsername);
router.put('/profile', authMiddleware, updateProfile);
router.post('/connect-platforms', authMiddleware, connectPlatforms);
router.post('/sync', authMiddleware, syncStats);

export default router;
