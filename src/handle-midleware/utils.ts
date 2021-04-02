import { Request, Response, NextFunction } from 'express';

export default function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const promise = fn(req, res, next);

    promise.catch(next);
    };
}
