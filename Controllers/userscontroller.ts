import { Request, Response, NextFunction } from 'express';
import { fetchAllUsers } from '../Models/usersmodel';

export const getAllUsers = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	fetchAllUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};
