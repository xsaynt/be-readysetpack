"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleTrip = exports.fetchSingleTrip = exports.changeTripData = exports.createTrip = exports.fetchTripsByUserId = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetchTripsByUserId = (user_id, sort_by = 'trip_id', order = 'DESC') => {
    let sqlText = `SELECT * FROM trips WHERE user_id = $1 ORDER BY ${sort_by} ${order};`;
    const values = [user_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows;
    });
};
exports.fetchTripsByUserId = fetchTripsByUserId;
const createTrip = (user_id, postBody) => {
    const sqlText = `INSERT INTO trips(user_id,destination,start_date,end_date,passport_issued_country,weather,visa_type,budget,is_booked_hotel,people_count,city_information,landmarks,events,daily_expected_cost)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING*;`;
    const { destination, start_date, end_date, passport_issued_country, weather, visa_type, budget, is_booked_hotel, people_count, city_information, landmarks, events, daily_expected_cost, } = postBody;
    const values = [
        user_id,
        JSON.stringify(destination),
        start_date,
        end_date,
        passport_issued_country,
        JSON.stringify(weather),
        visa_type,
        JSON.stringify(budget),
        is_booked_hotel,
        people_count,
        city_information,
        JSON.stringify(landmarks),
        JSON.stringify(events),
        daily_expected_cost,
    ];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.createTrip = createTrip;
const changeTripData = (user_id, trip_id, postBody) => {
    const values = Object.values(postBody);
    const updateFields = Object.keys(postBody);
    const validColumns = [
        'start_date',
        'end_date',
        'budget',
        'is_booked_hotel',
        'people_count',
    ];
    if (!Object.keys(postBody).every((key) => validColumns.includes(key))) {
        return Promise.reject({ statusCode: 400, message: 'Bad Request' });
    }
    const setClause = updateFields
        .map((field, index) => {
        return `${field} = $${index + 1}`;
    })
        .join(', ');
    values.push(Number(trip_id), Number(user_id));
    const sqlText = `UPDATE trips SET ${setClause} 
  WHERE trip_id = $${values.length - 1} 
  AND user_id = $${values.length} 
  RETURNING *;`;
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.changeTripData = changeTripData;
const fetchSingleTrip = (user_id, trip_id) => {
    let sqlText = `SELECT * FROM trips WHERE user_id = $1 AND trip_id = $2;`;
    const values = [user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rows }) => {
        return rows[0];
    });
};
exports.fetchSingleTrip = fetchSingleTrip;
const deleteSingleTrip = (user_id, trip_id) => {
    const sqlText = `DELETE FROM trips WHERE user_id = $1 AND trip_id = $2`;
    const values = [user_id, trip_id];
    return connection_1.default.query(sqlText, values).then(({ rowCount }) => {
        return rowCount;
    });
};
exports.deleteSingleTrip = deleteSingleTrip;
