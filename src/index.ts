import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import config from './config/config';
import { userRouter } from './routers/user-router';
import { groupRouter } from './routers/group-router';
import { loggerError, handleError, loggerRequests, ErrorHandler } from './handle-midleware/error-handler';

const app = express();

app.set('port', (config.port || 4200));

app.use(express.static(path.join(__dirname, '../src')));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    next();
});

app.use((req, res, next) => {
    loggerRequests.info('Calling a request', {
        method: req.method,
        url: req.url,
        arguments: req.body
    });
    next();
});

app.use('/users', userRouter);
app.use('/groups', groupRouter);

app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(res, err);
    next();
});

process.on('uncaughtException', err => {
    loggerError.error({ method: 'uncaughtException', statCode: 500, message: err.message });
    loggerError.on('finish', () => process.exit(1));
});

process.on('unhandledRejection', reason => {
    loggerError.error({ method: 'unhandledRejection', statCode: 500, message: reason });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
