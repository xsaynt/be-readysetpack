import { Request, Response, NextFunction } from 'express';
import { checkExist } from '../Models/api.utils';
import { fetchSingleChecklist } from '../Models/checklistmodel';
import { Checklist } from '../types/types';

export const getSingleChecklist = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const trip_id: number = Number(req.params.trip_id);
	const promises: Promise<Checklist[] | void>[] = [
		fetchSingleChecklist(user_id, trip_id),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([checklist]) => {
			res.status(200).send({ checklist });
		})
		.catch((err) => {
			next(err);
		});
};
