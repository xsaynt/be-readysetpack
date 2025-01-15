import express from 'express';
import { deleteUser, getAllUsers, getSingleUser } from '../Controllers/userscontroller';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:user_id',getSingleUser);
usersRouter.delete('/:user_id',deleteUser)

export default usersRouter;
