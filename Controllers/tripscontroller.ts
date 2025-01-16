import { Request, Response, NextFunction } from "express";
import { checkExist } from "../Models/api.utils";
import { Trips } from "../types/types";
import { fetchTripsByUserId } from "../Models/tripsmodels";

export const getTripsByUserId = (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const user_id:number = Number(req.params.user_id);
        const promises: Promise<Trips[] | void> [] = [fetchTripsByUserId(user_id)]

        if (user_id) {
            promises.push(checkExist("users", "user_id", user_id));
          }

    Promise.all(promises)
    .then(([trips])=>{
        res.status(200).send({trips})
    }).catch((err)=>{
        console.log(err)
        next(err)
    })
}