import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationErrorItem } from 'joi';
import { User } from '../routers/user-router';

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

export const validateSchema = (schema: Schema, users: { users: User[] }) =>
    (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };

export const validateLogin = (users: { users: User[] }) =>
    (req: Request, res: Response, next: NextFunction) => {
        const login = users.users.find((item: User) => item.login === req.body.login);

        if (!login) {
            res.status(400).json(errorResponse([{
                type: 'login.required',
                message: '"login" should exist',
                path: ['login']
            }]));
        } else {
            return next();
        }
    };
