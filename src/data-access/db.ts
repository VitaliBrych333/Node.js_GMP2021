import { Sequelize, ConnectionError } from 'sequelize';
import { Pool } from 'pg';
import config from '../config/config';

export const sq = new Sequelize(config.nameDB, config.userName, config.password, {
    host: config.host,
    dialect: 'postgres'
});

export const pool = new Pool({
    user: config.userName,
    host: config.host,
    database: config.nameDB,
    password: config.password,
    port: 5432,
});

sq.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((err: ConnectionError) => console.error('Unable to connect to the database:', err));

pool.connect()
    .then(() => console.log('Client.connect() has been established successfully.'))
    .catch((err: ConnectionError) => console.error('Unable client.connect():', err));