import { Request, Response, NextFunction } from "express";
import { checkExist } from "../Models/api.utils";
import { Trips } from "../types/types";
import { createTrip, fetchTripsByUserId } from "../Models/tripsmodels";

export const getTripsByUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id: number = Number(req.params.user_id);
  const promises: Promise<Trips[] | void>[] = [fetchTripsByUserId(user_id)];

  if (user_id) {
    promises.push(checkExist("users", "user_id", user_id));
  }

  Promise.all(promises)
    .then(([trips]) => {
      res.status(200).send({ trips });
    })
    .catch((err) => {
      next(err);
    });
};

export const addTrip = (req: Request, res: Response, next: NextFunction) => {
  const user_id: number = Number(req.params.user_id);
  const postBody: Trips = req.body;
  const promises: Promise<Trips[] | void>[] = [createTrip(user_id, postBody)];

  if (user_id) {
    promises.push(checkExist("users", "user_id", user_id));
  }
  Promise.all(promises)
    .then(([trip]) => {
      res.status(201).send({ trip });
    })
    .catch((err) => {
      next(err);
    });
};
