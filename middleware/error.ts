import { NextFunction, Response, Request } from 'express';
import createError from 'http-errors';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(createError.NotFound());
};
