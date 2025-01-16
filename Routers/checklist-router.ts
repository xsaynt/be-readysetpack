import express from 'express';
import { getSingleChecklist } from '../Controllers/checklistcontroller';

const checklistRouter = express.Router();

checklistRouter.get('/:user_id/:trip_id', getSingleChecklist);

export default checklistRouter;
