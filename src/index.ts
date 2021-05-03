import express from 'express';
import path from 'path';
import config from './config/config';
import { userRouter } from './routers/user-router';
import { groupRouter } from './routers/group-router';

const app = express();

app.set('port', (config.port || 4200));

app.use(express.static(path.join(__dirname, '../src')));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    next();
});

app.use('/users', userRouter);
app.use('/groups', groupRouter);

app.use((req, res) => {
    res.status(500).send('Smth went wrong!!!');
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
