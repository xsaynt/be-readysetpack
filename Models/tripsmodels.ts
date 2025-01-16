import db from '../db/connection';


export const fetchTripsByUserId = (user_id:number) =>{

    const sqlText: string = `SELECT * FROM trips WHERE user_id = $1`
    const values:number[] = [user_id];

    return db.query(sqlText,values).then(({rows})=>{
        return rows
    })
}