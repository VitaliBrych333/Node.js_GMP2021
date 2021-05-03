import { Op, ModelCtor, Model, WhereOptions } from 'sequelize';

export default class UserService<T extends Model<T>> {
    constructor(private userModel: ModelCtor<T>) {}

    getAllUsers() {
        return this.userModel.findAll();
    }

    getUserById(id: string) {
        return this.userModel.findByPk(id);
    }

    getSuggestUsers(substr: string, limit: number, param: string) {
        return this.userModel.findAll({
            where: {
                [`${param}`]: {
                    [Op.like]: `%${substr}%`
                },
            } as WhereOptions,
            order: [
                [`${param}`, 'ASC'],
            ],
            limit,
        });
    }

    getLogin(login: string) {
        return this.userModel.findOne({
            where: {
                login: {
                    [Op.eq]: login
                },
            } as WhereOptions,
        });
    }

    createUser(data: object) {
        return this.userModel.create(data as T);
    }

    updateUser(newData: object, id: string) {
        return this.userModel.update(newData, { where: { id } as WhereOptions });
    }
}