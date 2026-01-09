import { Router } from 'express';
import {
    getLeaderboard,
    getCollegeLeaderboard,
} from '../controllers/leaderboard.controller';

const router = Router();

router.get('/', getLeaderboard);
router.get('/college/:collegeId', getCollegeLeaderboard);

export default router;
