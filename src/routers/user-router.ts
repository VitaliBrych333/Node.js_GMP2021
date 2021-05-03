import { Request, Response, Router } from 'express';
import asyncHandler from '../handle-midleware/utils';
import { validateSchema, validateLogin } from '../handle-midleware/validation-middleware';
import { User } from '../models/user-modelDb';
import { UserGroup } from '../models/userGroup-modelDb';
import { userSchema } from '../models/schema-validation';
import { userGroupSchema } from '../models/schema-validation';
import UserService from '../services/user-service';
import UserGroupService from '../services/userGroup-service';

export const userService = new UserService(User);
export const userGroupService = new UserGroupService(UserGroup);
export const userRouter = Router();

userRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        try {
            const usersDb = await userService.getAllUsers();
            const users = usersDb.map(user => user.toJSON());

            users.length ? res.json(users)
                         : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const userById = await userService.getUserById(id);

            userById ? res.json(userById)
                     : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.get(
    '/suggestUsers',
    asyncHandler(async (req: Request, res: Response) => {
        const { loginSubstring, limit } = req.query as { [key: string]: string };
        try {
            const usersDb = await userService.getSuggestUsers(loginSubstring, +limit, 'login');
            const users = usersDb.map(user => user.toJSON());

            users.length ? res.json(users)
                         : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.post(
    '/',
    validateSchema(userSchema),
    validateLogin(),
    asyncHandler(async (req: Request, res: Response) => {
        const { login, password, age, isDeleted } = req.body;
        try {
            await userService.createUser({ login, password, age, isDeleted });

            res.status(201);
            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.put(
    '/:id',
    validateSchema(userSchema),
    validateLogin(),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const content = req.body;
        const { login, password, age, isDeleted } = content;
        try {
            const [rowsUpdate] = await userService.updateUser({ login, password, age, isDeleted }, id);

            rowsUpdate ? res.status(200)
                       : res.status(204);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const [isDeleted] = await userService.updateUser({ isDeleted: true }, id);

            if (isDeleted) {
                await userGroupService.deleteUserGroup(id);
                res.status(204);
            } else {
                res.status(404);
            }

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

userRouter.post(
    '/addUsersToGroup',
    validateSchema(userGroupSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { groupId, userIds } = req.body;
        try {
            const resultTransaction = await userGroupService.addUsersToGroup(groupId, userIds) as unknown as string[];
            resultTransaction.every(call => call === 'INSERT') ? res.status(201)
                                                               : res.status(422);
            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);
