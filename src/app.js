import 'dotenv/config';

import express from 'express';
import Youch from 'youch';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import path from 'path';
import 'express-async-errors';

import routes from './routes';

import './database';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(
    new RateLimit({
        store: new RateLimitRedis({
            client: redis.createClient({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            })
        }),
        windowMs: 1000 * 60 * 15, // 15min,
        max: 100
    })
);
app.use(routes);
app.use(async (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const errors = await new Youch(err, req).toJSON();
    return res.status(500).json(errors);
});

export default app;
