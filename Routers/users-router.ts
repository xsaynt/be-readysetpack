import express from 'express';
import { getAllUsers } from '../Controllers/userscontroller';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);

export default usersRouter;
