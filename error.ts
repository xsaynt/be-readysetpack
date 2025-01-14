import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export const customErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.statusCode && err.message) {
		res.status(err.statusCode).send({ msg: err.message });
	} else {
		next(err);
	}
};

export const postgresErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.name === '22P02') {
		res.status(400).send({ msg: 'bad request' });
	} else if (
		err.name === '23503' ||
		err.name === '42703' ||
		err.name === '42601'
	) {
		res.status(404).send({ msg: 'not found' });
	} else {
		next(err);
	}
};

export const serverErrorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log('Error:', err);
	res.status(500).send({ msg: 'Internal Server Error' });
};
