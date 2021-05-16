import { Request, Response, NextFunction, Router } from 'express';
import asyncHandler from '../handle-midleware/utils';
import { validateSchema } from '../handle-midleware/validation-middleware';
import { groupSchema } from '../models/schema-validation';
import { Group } from '../models/group-modelDb';
import GroupService from '../services/group-service';
import { ErrorHandler } from '../handle-midleware/error-handler';

export const groupService = new GroupService(Group);
export const groupRouter = Router();

groupRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const groupsDb = await groupService.getAllGroups();
            const groups = groupsDb.map(group => group.toJSON());
            if(!groups.length) {
                throw new ErrorHandler(404, 'Groups are empty');
            }

            res.json(groups);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

groupRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            const groupById = await groupService.getGroupById(id);
            if(!groupById) {
                throw new ErrorHandler(404, 'Group ID not found');
            }

            res.json(groupById);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

groupRouter.post(
    '/',
    validateSchema(groupSchema),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { name, permissions } = req.body;
        try {
            const t = await groupService.createGroup({ name, permissions });

            res.status(201);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

groupRouter.put(
    '/:id',
    validateSchema(groupSchema),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const content = req.body;
        const { name, permissions } = content;
        try {
            const [rowsUpdate] = await groupService.updateGroup({ name, permissions }, id);
            if(!rowsUpdate) {
                throw new ErrorHandler(204, 'Group not updated');
            }

            res.status(200);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);

groupRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            const isDeleted = await groupService.deleteGroup(id);
            if(!isDeleted) {
                throw new ErrorHandler(404, 'Group not deleted');
            }

            res.status(204);
            res.end();
        } catch (err) {
            return next(err);
        }
    })
);
