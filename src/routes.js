import { Router } from 'express';
import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AvailableController from './app/controllers/AvailableController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);
const routes = new Router();

const bruteStore = new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const bruteForce = new Brute(bruteStore);

routes.post('/users', UserController.store);
routes.post('/sessions', bruteForce.prevent, SessionController.store);

routes.use(authMiddleware);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
