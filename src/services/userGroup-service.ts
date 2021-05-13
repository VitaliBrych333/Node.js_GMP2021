
import { ModelCtor, Model, WhereOptions } from 'sequelize';
import { sq } from '../data-access/db';
import { groupService } from '../routers/group-router';
import { userService } from '../routers/user-router';

export default class UserGroupService<T extends Model<T>> {
    constructor(private userGroupModel: ModelCtor<T>) {}

    async addUsersToGroup(groupId: number, userIds: number[]) {
        const groupDb = await groupService.findGroup(groupId);
        if (groupDb) {
            userIds.forEach(async (user) => {
                const userById = await userService.getUserById(`${user}`);

                if(userById) {
                    const t = await sq.transaction();

                    try {
                        await this.userGroupModel.create({ user_id: user, group_id: groupId } as unknown as T, { transaction: t });
                        await t.commit();
                    } catch {
                        await t.rollback();
                    }
                } else {
                    console.log('No such user:', user);
                }
            })
        } else {
            console.log('No such group:', groupId)
            return new Error('No such group!');
        }
    }

    deleteUserGroup(id: string) {
        return this.userGroupModel.destroy({ where: { user_id: id } as WhereOptions });
    }
}