import { NextFunction, Request, Response } from 'express';
import User from '../models/auth/User';

export const getProfile = (req: Request, res: Response) => {
    res.json({ user: req.user });
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { newPassword } = req.body;

        const usr = await User.findById(user.id);

        usr?.hash(newPassword);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
