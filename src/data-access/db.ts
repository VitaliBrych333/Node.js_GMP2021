import { Sequelize, ConnectionError } from 'sequelize';
import config from '../config/config';

export const sq = new Sequelize(config.nameDB, config.userName, config.password, {
    host: config.host,
    dialect: 'postgres'
});

sq.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((err: ConnectionError) => console.error('Unable to connect to the database:', err));
