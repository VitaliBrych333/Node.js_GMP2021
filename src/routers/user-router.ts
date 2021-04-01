import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import asyncHandler from '../handle-midleware/utils';
import { validateSchema, validateLogin } from '../validation/validation-middleware';

import * as users from '../../data/data.json';
import { userSchema } from '../validation/schema';

export const router = Router();

export interface User {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

const getAutoSuggestUsers = (loginSubstring: string, limit: string) =>
    users.users
        .filter((user: User) => !user.isDeleted && user.login.includes(loginSubstring))
        .sort((user1: User, user2: User) => {
            if (user1.login < user2.login) {
                return -1;
            }
            if (user1.login > user2.login) {
                return 1;
            }
            return 0;
        })
        .slice(0, +limit);


router.get(
    '/users',
    asyncHandler(async (req: Request, res: Response) => {
        if (users.users) {
            res.json(users.users);
        } else {
            res.status(404);
        }
        res.end();
    })
);

router.get(
    '/users/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const userById = users.users.find((item: User) => item.id === id);

        if (userById) {
            res.json(userById);
        } else {
            res.status(404);
        }
        res.end();
    })
);

router.get(
    '/suggestUsers',
    asyncHandler(async (req: Request, res: Response) => {

        const { loginSubstring, limit } = req.query as { [key: string]: string };
        const listUsers = getAutoSuggestUsers(loginSubstring, limit);

        if (listUsers.length) {
            res.json(listUsers);
        } else {
            res.status(404);
        }
        res.end();
    })
);

router.post(
    '/users',
    validateSchema(userSchema, users),
    validateLogin(users),
    asyncHandler(async (req: Request, res: Response) => {
        const content = req.body;
        content.id = uuidv4();
        users.users.push(content);

        res.status(201);
        res.end();
    })
);

router.put(
    '/users/:id',
    validateSchema(userSchema, users),
    validateLogin(users),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const content = req.body;
        const targetUser = users.users.find((item: User) => item.id === id);

        if (targetUser) {
            const { login, password, age, isDeleted } = content;
            targetUser.login = login;
            targetUser.password = password;
            targetUser.age = age;
            targetUser.isDeleted = isDeleted;

            res.status(200);
        } else {
            res.status(204);
        }
        res.end();
    })
);

router.delete(
    '/users/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const targetUser = users.users.find((item: User) => item.id === id);

        if (targetUser) {
            targetUser.isDeleted = true;
            res.status(204);
        } else {
            res.status(404);
        }
        res.end();
    })
);
