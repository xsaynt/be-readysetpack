import express from 'express';
import homeController from '../Controllers/homecontroller';
import usersRouter from './users-router';
import dailyCostRouter from './daily-cost-router';
import tripsRouter from './trips-router';

const apiRouter = express.Router();

apiRouter.get('/', homeController);
apiRouter.use('/users', usersRouter);
apiRouter.use('/dailyCost', dailyCostRouter);
apiRouter.use('/trips',tripsRouter)

export default apiRouter;
