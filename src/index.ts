import express from 'express';
import path from 'path';

import { router } from './routers/user-router';
const app = express();

app.set('port', (process.env.PORT || 4200));

app.use(express.static(path.join(__dirname, '../src')));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/', router);
app.use((req, res) => {
    res.status(500).send('Smth went wrong!!!');
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});

