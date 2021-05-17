import { Request, Response, Router } from 'express';
import { groupSchema } from '../models/schema-validation';
import { Group } from '../models/group-modelDb';
import GroupService from '../services/group-service';
import { validateSchema } from '../handle-midleware/validation-middleware';
import { ErrorHandler } from '../handle-midleware/error-handler';
import { controllerTimeLogger } from '../handle-midleware/controller-time';

export const groupService = new GroupService(Group);
export const groupRouter = Router();

groupRouter.get(
    '/',
    controllerTimeLogger(async (req: Request, res: Response) => {
        try {
            const groupsDb = await groupService.getAllGroups();
            const groups = groupsDb.map(group => group.toJSON());
            if(!groups.length) {
                throw new ErrorHandler(404, 'Groups are empty');
            }

            res.json(groups);
            res.end();
        } catch (err) {
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

groupRouter.get(
    '/:id',
    controllerTimeLogger(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const groupById = await groupService.getGroupById(id);
            if(!groupById) {
                throw new ErrorHandler(404, 'Group ID not found');
            }

            res.json(groupById);
            res.end();
        } catch (err) {
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

groupRouter.post(
    '/',
    validateSchema(groupSchema),
    controllerTimeLogger(async (req: Request, res: Response) => {
        const { name, permissions } = req.body;
        try {
            await groupService.createGroup({ name, permissions });

            res.status(201);
            res.end();
        } catch (err) {
            throw new ErrorHandler(500, err.message);
        }
    })
);

groupRouter.put(
    '/:id',
    validateSchema(groupSchema),
    controllerTimeLogger(async (req: Request, res: Response) => {
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
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);

groupRouter.delete(
    '/:id',
    controllerTimeLogger(async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const isDeleted = await groupService.deleteGroup(id);
            if(!isDeleted) {
                throw new ErrorHandler(404, 'Group not deleted');
            }

            res.status(204);
            res.end();
        } catch (err) {
            throw new ErrorHandler(err.statCode || 500, err.message);
        }
    })
);
