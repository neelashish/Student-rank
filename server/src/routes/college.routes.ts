import { Router } from 'express';
import {
    getAllColleges,
    getCollegeById,
    createCollege,
} from '../controllers/stats.controller';

const router = Router();

router.get('/', getAllColleges);
router.get('/:id', getCollegeById);
router.post('/', createCollege);

export default router;
