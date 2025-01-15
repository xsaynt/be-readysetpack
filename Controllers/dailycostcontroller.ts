import { Request, Response, NextFunction } from 'express';
import { fetchDailyCost } from '../Models/dailycostmodel';
import { checkExist } from '../Models/api.utils';

export const getDailyCost = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const country = req.params.country;

	fetchDailyCost(country)
		.then((countryInfo) => {
			res.status(200).send({ countryInfo });
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
};
