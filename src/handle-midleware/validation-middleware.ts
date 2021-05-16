import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationErrorItem } from 'joi';
import { userService } from '../routers/user-router';
import { loggerError } from '../handle-midleware/error-handler';

const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
    const errors = schemaErrors.map((error: ValidationErrorItem) => {
        const { path, message } = error;
        return { path, message };
    });

    return {
        status: 'failed',
        errors
    };
};

export const validateSchema = (schema: Schema) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            loggerError.error({ method: req.method, url: req.url, arguments: req.body, message: 'Invalid schema' });
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };

export const validateLogin = () =>
    async (req: Request, res: Response, next: NextFunction) => {
        const loginDb = await userService.getLogin(req.body.login);

        if (!loginDb) {
            const message = '"login" should exist';        
            loggerError.error({ method: req.method, url: req.url, arguments: req.body, message });
            res.status(400).json(errorResponse([{
                type: 'login.required',
                message,
                path: ['login']
            }]));
        } else {
            return next();
        }
    };
