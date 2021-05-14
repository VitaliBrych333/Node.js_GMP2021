import { ModelCtor, Model, WhereOptions } from 'sequelize';
import { sq } from '../data-access/db';

export default class UserGroupService<T extends Model<T>> {
    constructor(private userGroupModel: ModelCtor<T>) {}

    async addUsersToGroup(groupId: number, userIds: number[]) {
        return sq.transaction((t) => {
            return this.userGroupModel.bulkCreate(
                userIds.map(user => { return { user_id: user, group_id: groupId } as unknown as T; }),
                { transaction: t });
        }).catch((err) => {
            console.log('Error:', err);
            return new Error();
        });
    }

    deleteUserGroup(id: string) {
        return this.userGroupModel.destroy({ where: { user_id: id } as WhereOptions });
    }
}