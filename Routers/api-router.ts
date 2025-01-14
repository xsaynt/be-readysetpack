import express from 'express';
import homeController from '../Controllers/homecontroller';
import usersRouter from './users-router';

const apiRouter = express.Router();

apiRouter.get('/', homeController);
apiRouter.use('/users', usersRouter);

export default apiRouter;
