import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from '../handle-midleware/utils';
import { validateSchema, validateLogin } from '../handle-midleware/validation-middleware';
import { User } from '../models/user-modelDb';
import { UserGroup } from '../models/userGroup-modelDb';
import { userSchema } from '../models/schema-validation';
import { userGroupSchema } from '../models/schema-validation';
import UserService from '../services/user-service';
import UserGroupService from '../services/userGroup-service';
import { ErrorHandler } from '../handle-midleware/error-handler';

export const userService = new UserService(User);
export const userGroupService = new UserGroupService(UserGroup);
export const userRouter = Router();

userRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usersDb = await userService.getAllUsers();
            const users = usersDb.map(user => user.toJSON());
            if(!users.length) {
                throw new ErrorHandler(404, 'Users are empty');
            }

            res.json(users);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            const userById = await userService.getUserById(id);
            if(!userById) {
                throw new ErrorHandler(404, 'User ID not found');
            }

            res.json(userById);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.get(
    '/suggestUsers',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { loginSubstring, limit } = req.query as { [key: string]: string };
        try {
            const usersDb = await userService.getSuggestUsers(loginSubstring, +limit, 'login');
            const users = usersDb.map(user => user.toJSON());
            if(!users.length) {
                throw new ErrorHandler(404, 'Suggested users are empty');
            }

            res.json(users);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.post(
    '/',
    validateSchema(userSchema),
    validateLogin(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { login, password, age, isDeleted } = req.body;
        try {
            await userService.createUser({ login, password, age, isDeleted });

            res.status(201);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.put(
    '/:id',
    validateSchema(userSchema),
    validateLogin(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const content = req.body;
        const { login, password, age, isDeleted } = content;
        try {
            const [rowsUpdate] = await userService.updateUser({ login, password, age, isDeleted }, id);
            if(!rowsUpdate) {
                throw new ErrorHandler(204, 'User not updated');
            }

            res.status(200);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            const [isDeleted] = await userService.updateUser({ isDeleted: true }, id);
            if(!isDeleted) {
                throw new ErrorHandler(404, 'User not deleted');
            }

            await userGroupService.deleteUserGroup(id);
            res.status(204);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

userRouter.post(
    '/addUsersToGroup',
    validateSchema(userGroupSchema),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { groupId, userIds } = req.body;
        try {
            await userGroupService.addUsersToGroup(groupId, userIds);
            res.status(201);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);
