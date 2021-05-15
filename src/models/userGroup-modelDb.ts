import { DataTypes } from 'sequelize';
import { sq } from '../data-access/db';

export const UserGroup = sq.define('usergroup', {
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
}, {
    timestamps: false,
    schema: 'public',
    tableName: 'usergroup'
});

UserGroup.removeAttribute('id');
