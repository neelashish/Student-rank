import { Router } from 'express';
import {
    githubOAuth,
    googleOAuth,
    completeOAuthRegistration,
} from '../controllers/oauth.controller';

const router = Router();

router.post('/github', githubOAuth);
router.post('/google', googleOAuth);
router.post('/complete-registration', completeOAuthRegistration);

export default router;
