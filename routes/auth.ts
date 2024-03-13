import express, { Request, Response, Router } from 'express';
import { login, loginDiscord, logout } from '../controllers/auth';
import { guard } from '../middleware/auth';

const router: Router = express.Router();

router.get('/', guard(), (req: Request, res: Response) => res.status(204).send());
router.get('/me', guard(), (req: Request, res: Response) => {
    res.send({ user: req.user });
});
router.post('/login', login);
router.post('/login/discord', loginDiscord);
router.post('/logout', guard(), logout);

export default router;
