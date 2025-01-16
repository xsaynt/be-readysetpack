import express from 'express';
import { addTrip, getTripsByUserId } from '../Controllers/tripscontroller';

const tripsRouter = express.Router();


tripsRouter.get("/:user_id",getTripsByUserId)

tripsRouter.post("/:user_id",addTrip)

export default tripsRouter