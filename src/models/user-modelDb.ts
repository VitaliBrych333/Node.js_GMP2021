import { Error, DataTypes } from 'sequelize';
import { sq } from '../data-access/db';

export const User = sq.define('user', {
    login: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(?=.*[a-zA-Z])(?=.*[0-9])/
        }
    },
    age: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            isMoreAndLess(value: number) {
                if (value < 4 || value > 130) {
                    throw new Error('The value must be greater than or equal to 4 and less than or equal to 130!');
                }
            }
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: false,
    schema: 'public',
    tableName: 'users'
});
