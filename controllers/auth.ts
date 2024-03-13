import { NextFunction, Response, Request } from 'express';
import { app as config } from '../config.json';
import createHttpError from 'http-errors';
import User from '../models/auth/User';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

const secret: string = process.env.SECRET_SESSION as string;

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password +token');
        if (!user) throw createHttpError(404, 'User not found');

        const auth = await user.comparePassword(password);
        if (!auth) throw createHttpError(401, 'Password is incorrect');

        const token = await user.generateToken();

        const accessToken = jwt.sign(user.toJSON(), secret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ secret: token }, secret, { expiresIn: '7d' });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 1,
            domain: config.domain,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            domain: config.domain,
        });

        res.status(201).json({ message: 'Login success' });
    } catch (err) {
        next(err);
    }
}

export async function loginDiscord(req: Request, res: Response, next: NextFunction) {
    try {
        const { code } = req.body;
        console.log(code);

        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID as string,
            client_secret: process.env.DISCORD_CLIENT_SECRET as string,
            redirect_uri: process.env.DISCORD_REDIRECT_URI as string,
            grant_type: 'authorization_code',
            code,
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/x-www-form-urlencoded',
        };

        const { data: discordAuth } = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers,
        });
        const { data: discordUser } = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${discordAuth.access_token}`,
                ...headers,
            },
        });

        let user = await User.findOne({ discordId: discordUser.id }).select('+token');
        const pictureUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}`;

        if (!user) {
            user = await User.create({
                username: discordUser.username,
                email: discordUser.email,
                discordId: discordUser.id,
                picture: pictureUrl,
            });
        }

        await user.syncPicture(pictureUrl);
        const token = await user.generateToken();

        const accessToken = jwt.sign(user.toJSON(), secret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ secret: token }, secret, { expiresIn: '7d' });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 1,
            domain: config.domain,
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            domain: config.domain,
        });

        res.status(201).json({ message: 'Login success' });
    } catch (err) {
        console.log(err);
        next(createHttpError(401, 'Login failed'));
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: '' });

        res.clearCookie('access_token', { httpOnly: true, domain: config.domain });
        res.clearCookie('refresh_token', { httpOnly: true, domain: config.domain });

        res.status(200).json({ message: 'Logout success' });
    } catch (err) {
        next(err);
    }
}
