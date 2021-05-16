import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { createLogger, format, transports } from 'winston';
import { Request, Response } from 'express';

export const loggerError = createLogger({
    transports: [
        new transports.File({
            filename: 'MyError.log',
            format: format.combine(
                format.timestamp(),
                format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    const ts = timestamp.slice(0, 19).replace('T', ' ');
                    return `${ts} [${level}] ${Object.keys(args).length ? JSON.stringify(args) : ''} ${message}`;
                }),
            )
        })
    ]
});

export const loggerRequests = createLogger({
    transports: [
        new transports.File({
            filename: 'MyRequests.log',
            format: format.combine(
                format.timestamp(),
                format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    const ts = timestamp.slice(0, 19).replace('T', ' ');
                    return `${ts} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
                }),
            )
        }),
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true, colors: { info: 'yellow' }}),
                format.timestamp(),
                format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    const ts = timestamp.slice(0, 19).replace('T', ' ');
                    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
                }),
            )
        })
    ]
});

export class ErrorHandler extends Error {
    statCode: number;

    constructor(statCode: number, message: string) {
        super();
        this.statCode = statCode;
        this.message = message;
    }
}

export function handleError(req: Request, res: Response, err: ErrorHandler) {
    loggerError.error({ method: req.method, url: req.url, arguments: req.body, message: err.message });

    const { statCode, message } = err;

    if (statCode) {
        res.status(statCode).json({ status: 'error', statCode, message });
        return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
}