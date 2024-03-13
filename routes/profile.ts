import express, { Router } from 'express';
import { guard } from '../middleware/auth';
import { getProfile, updatePassword } from '../controllers/profile';

const router: Router = express.Router();

router.use(guard());
router.get('/', getProfile);
router.patch('/password', updatePassword);

export default router;
