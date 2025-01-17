import db from "../db/connection";
import { Checklist } from "../types/types";

export const fetchSingleChecklist = (user_id: number, trip_id: number) => {
  const sqlText: string = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
  const values: number[] = [user_id, trip_id];

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

export const addChecklist = (
  user_id: number,
  trip_id: number,
  postBody: any
) => {
  const sqlText: string = `INSERT INTO checklist(user_id,trip_id,items) VALUES($1,$2,$3) RETURNING*;`;

  const { items } = postBody;

  const values = [user_id, trip_id, JSON.stringify(items)];

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

export const addItemsToChecklist = (
  user_id: number,
  trip_id: number,
  postBody: string
) => {
  const values = [postBody, user_id, trip_id];

  const sqlText = `
        UPDATE checklist
        SET items = items || to_jsonb($1::text)
        WHERE user_id = $2 AND trip_id = $3
        RETURNING *;
    `;

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

export const removeSingleItemFromItemsArray = (
  user_id: number,
  trip_id: number,
  deleteBody: string
) => {
  const values = [deleteBody, user_id, trip_id];

  const sqlText: string = `
    UPDATE checklist
    SET items = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(items) AS elem
        WHERE elem <> to_jsonb($1::text)
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
  `;

  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};

export const deleteEntireChecklist = (user_id: number, trip_id: number) => {
	const values = [user_id,trip_id]
	const sqlText:string = `DELETE FROM checklist WHERE user_id = $1 AND trip_id = $2`

	return db.query(sqlText, values).then(({ rowCount }) => {
		return rowCount;
	});
};
