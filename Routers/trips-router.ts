import express from 'express';
import { getTripsByUserId } from '../Controllers/tripscontroller';

const tripsRouter = express.Router();


tripsRouter.get("/:user_id",getTripsByUserId)

export default tripsRouter