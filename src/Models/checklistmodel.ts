import db from '../db/connection';

export const fetchSingleChecklist = async (
	user_id: number,
	trip_id: number
) => {
	const sqlText = `SELECT * FROM checklist WHERE user_id = $1 AND trip_id = $2;`;
	const values = [user_id, trip_id];

	const { rows } = await db.query(sqlText, values);

	if (rows.length === 0) {
		const insertQuery = `
		INSERT INTO checklist (user_id, trip_id, items) 
		VALUES ($1, $2, $3) 
		RETURNING *;
	  `;
		const insertValues = [user_id, trip_id, JSON.stringify([])];

		const { rows: newRows } = await db.query(insertQuery, insertValues);
		return newRows[0];
	}

	return rows[0];
};

export const addChecklist = (user_id: number, trip_id: number) => {
	const sqlText: string = `INSERT INTO checklist(user_id,trip_id,items) VALUES($1,$2,$3) RETURNING*;`;

	const items: string[] = [
		'Check your passport',
		'Print or download your tickets (flight/train/bus).',
		'Pack comfortable T-shirts/tops.',
		'Dont forget your pants/shorts/skirts.',
		'Pack comfortable shoes for walking.',
		'Pack your toothbrush and toothpaste.',
		'Bring your phone charger.',
		'Pack a power bank for emergencies.',
	];

	const values = [user_id, trip_id, JSON.stringify(items)];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const addItemsToChecklist = (
	user_id: number,
	trip_id: number,
	postBody: { task: string }
) => {
	const newItem = { task: postBody.task, completed: false };

	const updateSqlText = `
	  UPDATE checklist
	  SET items = COALESCE(items, '[]'::jsonb) || $1::jsonb
	  WHERE user_id = $2 AND trip_id = $3
	  RETURNING *;
	`;

	const insertSqlText = `
	  INSERT INTO checklist (user_id, trip_id, items)
	  VALUES ($2, $3, '[]'::jsonb || $1::jsonb)
	  RETURNING *;
	`;

	return db
		.query(updateSqlText, [JSON.stringify(newItem), user_id, trip_id])
		.then(({ rows }) => {
			if (rows.length > 0) {
				return rows[0];
			} else {
				return db
					.query(insertSqlText, [JSON.stringify(newItem), user_id, trip_id])
					.then(({ rows }) => rows[0]);
			}
		});
};

export const removeSingleItemFromItemsArray = (
	user_id: number,
	trip_id: number,
	deleteBody: { task: string }
) => {
	const values = [deleteBody.task, user_id, trip_id];

	const sqlText = `
    UPDATE checklist
    SET items = (
        SELECT jsonb_agg(elem)
        FROM jsonb_array_elements(items) AS elem
        WHERE elem->>'task' <> $1
    )
    WHERE user_id = $2 AND trip_id = $3
    RETURNING *;
  `;

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const deleteEntireChecklist = (user_id: number, trip_id: number) => {
	const values = [user_id, trip_id];
	const sqlText: string = `DELETE FROM checklist WHERE user_id = $1 AND trip_id = $2`;

	return db.query(sqlText, values).then(({ rowCount }) => {
		return rowCount;
	});
};
