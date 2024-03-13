import { NextFunction, Request, Response } from 'express';
import { app as config } from '../config.json';
import createHttpError from 'http-errors';
import User from '../models/auth/User';
import * as jwt from 'jsonwebtoken';

const secret: string = process.env.SECRET_SESSION as string;

export const auth = () => async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    try {
        if (accessToken) {
            req.user = jwt.verify(accessToken, secret);
        } else if (refreshToken) {
            const payload = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
            const user = await User.findOne({ token: payload.secret }).select('+token');

            if (!user) throw undefined;

            const token = await user.generateToken();

            const accessTokenNew = jwt.sign(user.toJSON(), secret, { expiresIn: '1h' });
            const refreshTokenNew = jwt.sign({ secret: token }, secret, { expiresIn: '7d' });

            res.cookie('access_token', accessTokenNew, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 1,
                domain: config.domain,
            });
            res.cookie('refresh_token', refreshTokenNew, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                domain: config.domain,
            });

            req.user = user.toJSON();
        }

        delete req.user.iat;
        delete req.user.exp;
    } catch (err) {
        req.user = undefined;
    } finally {
        next();
    }
};

export const guard = () => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(createHttpError.Unauthorized());
    next();
};
