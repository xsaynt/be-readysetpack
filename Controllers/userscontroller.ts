import { Request, Response, NextFunction } from 'express';
import {
	addUser,
	fetchAllUsers,
	fetchSingleUser,
	removeUser,
	updateUser,
} from '../Models/usersmodel';
import { checkExist } from '../Models/api.utils';

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

export const getSingleUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const promises: any[] = [fetchSingleUser(user_id)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	Promise.all(promises)
		.then(([user]) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
	const user_id: number = Number(req.params.user_id);
	const promises: any[] = [removeUser(user_id)];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}
	Promise.all(promises)
		.then(([removedRow]) => {
			res.status(204).send({ removedRow });
		})
		.catch((err) => {
			next(err);
		});
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
	const postBody = req.body;

	addUser(postBody)
		.then((user) => {
			res.status(201).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};

export const changeUserInfo = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const postBody = req.body;
	const user_id: number = Number(req.params.user_id);

	updateUser(user_id, postBody)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
};
