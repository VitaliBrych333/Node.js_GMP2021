import { ModelCtor, Model, WhereOptions, Op } from 'sequelize';

export default class GroupService<T extends Model<T>> {
    constructor(private groupModel: ModelCtor<T>) {}

    getAllGroups() {
        return this.groupModel.findAll();
    }

    getGroupById(id: string) {
        return this.groupModel.findByPk(id);
    }

    findGroup(id: number) {
        return this.groupModel.findOne({
            where: {
                id: {
                    [Op.eq]: id
                },
            } as WhereOptions,
        });
    }

    createGroup(data: object) {
        return this.groupModel.create(data as T);
    }

    updateGroup(newData: object, id: string) {
        return this.groupModel.update(newData, { where: { id } as WhereOptions });
    }

    deleteGroup(id: string) {
        return this.groupModel.destroy({ where: { id } as WhereOptions });
    }
}