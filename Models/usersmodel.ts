import db from '../db/connection';
import { Users } from '../types/types';

export const fetchAllUsers = () => {
	return db.query('SELECT * FROM users;').then(({ rows }) => {
		return rows;
	});
};

export const fetchSingleUser = (user_id: number) => {
	const sqlText: string = `SELECT * FROM users WHERE user_id = $1`;
	const values: number[] = [user_id];

	return db.query(sqlText, values).then(({ rows }) => {
		return rows[0];
	});
};

export const removeUser = (user_id: number) => {
	const sqlText: string = `DELETE FROM users WHERE user_id = $1`;
	const values = [user_id];

	return db.query(sqlText, values).then(({ rowCount }) => {
		return rowCount;
	});
};

export const addUser = (postBody: Users) => {
	const { username, name } = postBody;

	const validColumns = ['username', 'name'];
	if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
		return Promise.reject({ statusCode: 400, message: 'Bad Request' });
	}

	const nameRegex = /\d/i;

	if (nameRegex.test(name)) {
		return Promise.reject({ statusCode: 400, message: 'Bad Request' });
	}

	let sqlInsertQuery: string = `INSERT INTO users (username, name)
	VALUES ($1, $2) RETURNING *;`;
	const values = [username, name];

	return db.query(sqlInsertQuery, values).then(({ rows }) => {
		return rows[0];
	});
};

export const updateUser = (user_id: number, postBody: Users) => {
	const { username, name } = postBody;
	const values = [];

	const validColumns = ['username', 'name'];
	if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
		return Promise.reject({ statusCode: 400, message: 'Bad Request' });
	}

	const nameRegex = /\d/i;

	if (nameRegex.test(name)) {
		return Promise.reject({ statusCode: 400, message: 'Bad Request' });
	}

	let updateQuery: string = 'UPDATE users SET';

	if (username && !name) {
		values.push(username);
		updateQuery += ` username = $${values.length}`;
	}

	if (name && !username) {
		values.push(name);
		updateQuery += ` name = $${values.length}`;
	}

	if (name && username) {
		values.push(username);
		values.push(name);
		updateQuery += ` username = $1 , name = $2`;
	}

	values.push(user_id);

	updateQuery += ` WHERE user_id = $${values.length} RETURNING *;`;

	return db.query(updateQuery, values).then(({ rows }) => {
		return rows[0];
	});
};
