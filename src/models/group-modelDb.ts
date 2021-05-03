import { DataTypes } from 'sequelize';
import { sq } from '../data-access/db';

export const Group = sq.define('group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
}, {
    timestamps: false,
    schema: 'public',
    tableName: 'groups'
});
