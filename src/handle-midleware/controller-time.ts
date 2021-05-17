import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { loggerError, loggerRequests } from '../handle-midleware/error-handler';

export const controllerTimeLogger = (handler: (req: Request, res: Response) => void) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let startTime: number;
        let runTime: number;
        startTime = performance.now();

        try {
            await handler(req, res);
            runTime = performance.now() - startTime;

            loggerRequests.info('Successful request', { executionTime: runTime });
        } catch(err) {
            runTime = performance.now() - startTime;

            loggerRequests.info('Unsuccessful request', { executionTime: runTime });
            loggerError.error({ method: req.method, url: req.url, arguments: req.body, message: err.message, executionTime: runTime });

            next(err);
        }
    };
};