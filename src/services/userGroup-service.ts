import { ModelCtor, Model, WhereOptions } from 'sequelize';
import { pool } from '../data-access/db';

export default class UserGroupService<T extends Model<T>> {
    constructor(private userGroupModel: ModelCtor<T>) {}

    async addUsersToGroup(groupId: number, userIds: number[]) {
        const transactionCalls: Promise<T>[] = [];

        userIds.forEach(userId => {
            transactionCalls.push(
                pool.query('INSERT INTO UserGroup (user_id, group_id) VALUES ($1, $2);', [userId, groupId])
                    .then(res => {
                        console.log(`Added ${userId} to ${groupId} successfully.`);
                        return res.command;
                    })
                    .catch(err => {
                        console.log('Error executing query', err.stack);
                        return err.severity;
                    })
            );
        });

        return Promise.all(transactionCalls);
    }

    deleteUserGroup(id: string) {
        return this.userGroupModel.destroy({ where: { user_id: id } as WhereOptions });
    }
}