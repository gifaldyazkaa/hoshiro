import { NextFunction, Response, Request } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(res.status(404).json({ status: 404, message: 'Requested entity is not found' }));
};
