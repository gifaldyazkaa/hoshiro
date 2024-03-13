import express, { Router } from 'express';
import { guard } from '../middleware/auth';
import { index } from '../controllers/user';

const router: Router = express.Router();

router.get('/', guard(), index);

export default router;
