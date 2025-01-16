import db from '../db/connection';
import { Checklist } from '../types/types';

export const fetchSingleChecklist = (user_id: number, trip_id: number) => {
	const sqlText: string = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
	const values: number[] = [user_id, trip_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};
