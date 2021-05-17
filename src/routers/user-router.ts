import { Request, Response, Router } from 'express';
import { User } from '../models/user-modelDb';
import { UserGroup } from '../models/userGroup-modelDb';
import { userSchema } from '../models/schema-validation';
import { userGroupSchema } from '../models/schema-validation';
import UserService from '../services/user-service';
import UserGroupService from '../services/userGroup-service';
import { validateSchema, validateLogin } from '../handle-midleware/validation-middleware';
import { ErrorHandler } from '../handle-midleware/error-handler';
import { controllerTimeLogger } from '../handle-midleware/controller-time';

export const userService = new UserService(User);
export const userGroupService = new UserGroupService(UserGroup);
export const userRouter = Router();

userRouter.get(
    '/',
    controllerTimeLogger(async (req: Request, res: Response) => {
        try {
            const usersDb = await userService.getAllUsers();
            const users = usersDb.map(user => user.toJSON());
            if(!users.length) {
                throw new ErrorHandler(404, 'Users are empty');
            }

            res.json(users);
            res.end();
        } catch (err) {
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

userRouter.get(
    '/:id',
    controllerTimeLogger(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const userById = await userService.getUserById(id);
            if(!userById) {
                throw new ErrorHandler(404, 'User ID not found');
            }

            res.json(userById);
            res.end();
        } catch (err) {
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

userRouter.get(
    '/suggestUsers',
    controllerTimeLogger(async (req: Request, res: Response) => {
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
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

userRouter.post(
    '/',
    validateSchema(userSchema),
    validateLogin(),
    controllerTimeLogger(async (req: Request, res: Response) => {
        const { login, password, age, isDeleted } = req.body;
        try {
            await userService.createUser({ login, password, age, isDeleted });

            res.status(201);
            res.end();
        } catch (err) {
            throw new ErrorHandler(500, err.message);
        }
    })
);

userRouter.put(
    '/:id',
    validateSchema(userSchema),
    validateLogin(),
    controllerTimeLogger(async (req: Request, res: Response) => {
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
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

userRouter.delete(
    '/:id',
    controllerTimeLogger(async (req: Request, res: Response) => {
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
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

userRouter.post(
    '/addUsersToGroup',
    validateSchema(userGroupSchema),
    controllerTimeLogger(async (req: Request, res: Response) => {
        const { groupId, userIds } = req.body;
        try {
            await userGroupService.addUsersToGroup(groupId, userIds);

            res.status(201);
            res.end();
        } catch (err) {
            throw new ErrorHandler(500, err.message);
        }
    })
);
