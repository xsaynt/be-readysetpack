import db from "../db/connection";
import { Trips } from "../types/types";

export const fetchTripsByUserId = (user_id: number) => {
  const sqlText: string = `SELECT * FROM trips WHERE user_id = $1`;
  const values: number[] = [user_id];

  return db.query(sqlText, values).then(({ rows }) => {
    return rows;
  });
};

export const createTrip = (user_id: number, postBody: Trips) => {
  const sqlText: string = `INSERT INTO trips(user_id,destination,start_date,end_date,passport_issued_country,weather,visa_type,budget,is_booked_hotel,people_count,city_information,landmarks,events,daily_expected_cost)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING*;`;
  const {
    destination,
    start_date,
    end_date,
    passport_issued_country,
    weather,
    visa_type,
    budget,
    is_booked_hotel,
    people_count,
    city_information,
    landmarks,
    events,
    daily_expected_cost,
  } = postBody;

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





  return db.query(sqlText, values).then(({ rows }) => {
    return rows[0];
  });
};
