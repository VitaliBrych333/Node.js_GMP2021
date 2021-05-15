import { Request, Response, Router } from 'express';
import asyncHandler from '../handle-midleware/utils';
import { validateSchema } from '../handle-midleware/validation-middleware';
import { groupSchema } from '../models/schema-validation';
import { Group } from '../models/group-modelDb';
import GroupService from '../services/group-service';

export const groupService = new GroupService(Group);
export const groupRouter = Router();

groupRouter.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        try {
            const groupsDb = await groupService.getAllGroups();
            const groups = groupsDb.map(group => group.toJSON());

            groups.length ? res.json(groups)
                          : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

groupRouter.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const groupById = await groupService.getGroupById(id);

            groupById ? res.json(groupById)
                      : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

groupRouter.post(
    '/',
    validateSchema(groupSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const { name, permissions } = req.body;
        try {
            await groupService.createGroup({ name, permissions });

            res.status(201);
            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

groupRouter.put(
    '/:id',
    validateSchema(groupSchema),
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        const content = req.body;
        const { name, permissions } = content;
        try {
            const [rowsUpdate] = await groupService.updateGroup({ name, permissions }, id);

            rowsUpdate ? res.status(200)
                       : res.status(204);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);

groupRouter.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const isDeleted = await groupService.deleteGroup(id);

            isDeleted ? res.status(204)
                      : res.status(404);

            res.end();
        } catch {
            res.status(422);
            res.end();
        }
    })
);
