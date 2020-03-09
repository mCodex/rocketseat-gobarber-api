import 'dotenv/config';

import express from 'express';
import Youch from 'youch';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import 'express-async-errors';

import routes from './routes';

import './database';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(routes);
app.use(async (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
});

export default app;
