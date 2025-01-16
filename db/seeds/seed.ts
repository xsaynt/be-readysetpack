import db from '../connection';
import format from 'pg-format';
import {
	Users,
	Trips,
	Checklist,
	DailyExpectedCost,
	Destination,
	Weather,
	Budget,
	Landmarks,
	Events,
} from '../../types/types';

const seed = ({
	usersData,
	tripsData,
	costsData,
	checklistData,
}: {
	usersData: Users[];
	tripsData: Trips[];
	costsData: DailyExpectedCost[];
	checklistData: Checklist[];
}) => {
	return db
		.query(`DROP TABLE IF EXISTS checklist`)
		.then(() => {
			return db.query('DROP TABLE IF EXISTS trips');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS users');
		})
		.then(() => {
			return db.query('DROP TABLE IF EXISTS dailycost');
		})
		.then(() => {
			const usersTablePromise = db.query(`
                CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    username VARCHAR NOT NULL,
                    name VARCHAR NOT NULL
                );`);
			const dailyCostTablePromise = db.query(`
                    CREATE TABLE dailycost (
                        country VARCHAR NOT NULL,
                        daily_cost_in_dollars INT NOT NULL
                    )`);
			return Promise.all([usersTablePromise, dailyCostTablePromise]);
		})
		.then(() => {
			return db.query(`
              CREATE TABLE trips (
                trip_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
                destination JSONB,
                start_date VARCHAR NOT NULL,
                end_date VARCHAR NOT NULL,
                passport_issued_country VARCHAR NOT NULL,
                weather JSONB,
                is_need_visa BOOLEAN,
                budget JSONB,
                is_booked_hotel BOOLEAN,
                people_count INT NOT NULL,
                city_information VARCHAR,
                landmarks JSONB,
                events JSONB,
                daily_expected_cost INT NOT NULL
              );  
                `);
		})
		.then(() => {
			return db.query(`
                CREATE TABLE checklist (
                    checklist_id SERIAL PRIMARY KEY,
                    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE NOT NULL,
                    user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
                    items JSONB
                );  
                `);
		})
		.then(() => {
			const userValues = usersData.map(({ username, name }) => [
				username,
				name,
			]);
			const insertUsersQueryStr = format(
				`
                INSERT INTO users(username, name)
                VALUES %L;
                `,
				userValues
			);
			const userPromise = db.query(insertUsersQueryStr);

			const costValues = costsData.map(({ country, daily_cost_in_dollars }) => [
				country,
				daily_cost_in_dollars,
			]);
			const insertDailyCostQueryStr = format(
				`
                    INSERT INTO dailycost(country, daily_cost_in_dollars)
                    Values %L;
                `,
				costValues
			);
			const costPromise = db.query(insertDailyCostQueryStr);

			return Promise.all([userPromise, costPromise]);
		})
		.then(() => {
			const tripValues = tripsData.map(
				({
					user_id,
					destination,
					start_date,
					end_date,
					passport_issued_country,
					weather,
					is_need_visa,
					budget,
					is_booked_hotel,
					people_count,
					city_information,
					landmarks,
					events,
					daily_expected_cost,
				}) => [
					user_id,
					JSON.stringify(destination),
					start_date,
					end_date,
					passport_issued_country,
					JSON.stringify(weather),
					is_need_visa,
					JSON.stringify(budget),
					is_booked_hotel,
					people_count,
					city_information,
					JSON.stringify(landmarks),
					JSON.stringify(events),
					daily_expected_cost,
				]
			);
			const insertTripsQueryStr = format(
				`
                INSERT INTO trips (user_id,
					destination,
					start_date,
					end_date,
					passport_issued_country,
					weather,
					is_need_visa,
					budget,
					is_booked_hotel,
					people_count,
					city_information,
					landmarks,
					events,
					daily_expected_cost)
                    VALUES %L;
                `,
				tripValues
			);

			return db.query(insertTripsQueryStr);
		})
		.then(() => {
			const checklistValues = checklistData.map(
				({ trip_id, user_id, items }) => [
					trip_id,
					user_id,
					JSON.stringify(items),
				]
			);
			const insertChecklistQueryStr = format(
				`
                    INSERT INTO checklist (trip_id, user_id, items)
                    VALUES %L; 
                `,
				checklistValues
			);

			return db.query(insertChecklistQueryStr);
		});
};

export default seed;
