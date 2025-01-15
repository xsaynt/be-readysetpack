import db from '../db/connection';

export const fetchAllUsers = () => {
	return db.query('SELECT * FROM users;').then(({ rows }) => {
		return rows;
	});
};

export const fetchSingleUser = (user_id:number) => {
	const sqlText:string = `SELECT * FROM users WHERE user_id = $1`
	const values:number[] =[user_id]

	return db.query(sqlText,values).then(({rows})=>{
		return rows[0]
	})
}

export const removeUser = (user_id:number) => {
	const sqlText:string = `DELETE FROM users WHERE user_id = $1`
	const values =  [user_id]

	return db.query(sqlText,values).then(({rowCount})=>{
		return rowCount
	})
}
