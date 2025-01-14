import db from '../db/connection';

export const fetchAllUsers = () => {
	return db.query('SELECT * FROM users;').then(({ rows }) => {
		return rows;
	});
};
