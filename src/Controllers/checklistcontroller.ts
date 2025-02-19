import { Request, Response, NextFunction } from 'express';
import { checkExist } from '../Models/api.utils';
import {
	addChecklist,
	addItemsToChecklist,
	deleteEntireChecklist,
	fetchSingleChecklist,
	removeSingleItemFromItemsArray,
} from '../Models/checklistmodel';
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
			console.log({ checklist });
			res.status(200).send({ checklist });
		})
		.catch((err) => {
			next(err);
		});
};

export const postChecklist = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const trip_id: number = Number(req.params.trip_id);
	const postBody: any = req.body;

	const promises: Promise<Checklist[] | void>[] = [
		addChecklist(user_id, trip_id),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([checklist]) => {
			res.status(201).send({ checklist });
		})
		.catch((err) => {
			next(err);
		});
};

export const updateChecklistItems = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const trip_id: number = Number(req.params.trip_id);
	const postBody: { task: string } = req.body.newItem;

	const promises: Promise<Checklist[] | void>[] = [
		addItemsToChecklist(user_id, trip_id, postBody),
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

export const deleteSingleItemFromItems = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const trip_id: number = Number(req.params.trip_id);
	const deleteBody: { task: string } = req.body;

	const promises: Promise<Checklist[] | void>[] = [
		removeSingleItemFromItemsArray(user_id, trip_id, deleteBody),
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
			console.log(err);
			next(err);
		});
};

export const removeEntireChecklist = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user_id: number = Number(req.params.user_id);
	const trip_id: number = Number(req.params.trip_id);
	const promises: Promise<number | void | null>[] = [
		deleteEntireChecklist(user_id, trip_id),
	];

	if (user_id) {
		promises.push(checkExist('users', 'user_id', user_id));
	}

	if (trip_id) {
		promises.push(checkExist('trips', 'trip_id', trip_id));
	}

	Promise.all(promises)
		.then(([removedRow]) => {
			res.status(204).send({ removedRow });
		})
		.catch((err) => {
			next(err);
		});
};
