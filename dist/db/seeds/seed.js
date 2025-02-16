"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../connection"));
const pg_format_1 = __importDefault(require("pg-format"));
const seed = ({ usersData, tripsData, costsData, checklistData, }) => {
    return connection_1.default
        .query(`DROP TABLE IF EXISTS checklist`)
        .then(() => {
        return connection_1.default.query('DROP TABLE IF EXISTS trips');
    })
        .then(() => {
        return connection_1.default.query('DROP TABLE IF EXISTS users');
    })
        .then(() => {
        return connection_1.default.query('DROP TABLE IF EXISTS dailycost');
    })
        .then(() => {
        const usersTablePromise = connection_1.default.query(`
		  CREATE TABLE users (
			user_id SERIAL PRIMARY KEY,
			username VARCHAR NOT NULL,
			name VARCHAR NOT NULL
		  );
		`);
        const dailyCostTablePromise = connection_1.default.query(`
		  CREATE TABLE dailycost (
			country VARCHAR NOT NULL,
			daily_cost_in_dollars INT NOT NULL
		  );
		`);
        return Promise.all([usersTablePromise, dailyCostTablePromise]);
    })
        .then(() => {
        return connection_1.default.query(`
		  CREATE TABLE trips (
			trip_id SERIAL PRIMARY KEY,
			user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
			destination JSONB,
			start_date VARCHAR NOT NULL,
			end_date VARCHAR NOT NULL,
			passport_issued_country VARCHAR NOT NULL,
			weather JSONB,
			visa_type VARCHAR,
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
        return connection_1.default.query(`
		  CREATE TABLE checklist (
			checklist_id SERIAL PRIMARY KEY,
			trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE NOT NULL,
			user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
			items JSONB
		  );
		`);
    })
        .then(() => {
        const promises = [];
        if (usersData.length > 0) {
            const userValues = usersData.map(({ username, name }) => [
                username,
                name,
            ]);
            const insertUsersQueryStr = (0, pg_format_1.default)(`
			  INSERT INTO users(username, name)
			  VALUES %L;
			`, userValues);
            promises.push(connection_1.default.query(insertUsersQueryStr));
        }
        if (costsData.length > 0) {
            const costValues = costsData.map(({ country, daily_cost_in_dollars }) => [
                country,
                daily_cost_in_dollars,
            ]);
            const insertDailyCostQueryStr = (0, pg_format_1.default)(`
			  INSERT INTO dailycost(country, daily_cost_in_dollars)
			  VALUES %L;
			`, costValues);
            promises.push(connection_1.default.query(insertDailyCostQueryStr));
        }
        if (tripsData.length > 0) {
            const tripValues = tripsData.map(({ user_id, destination, start_date, end_date, passport_issued_country, weather, visa_type, budget, is_booked_hotel, people_count, city_information, landmarks, events, daily_expected_cost, }) => [
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
            ]);
            const insertTripsQueryStr = (0, pg_format_1.default)(`
			  INSERT INTO trips (user_id, destination, start_date, end_date, passport_issued_country, weather, visa_type, budget, is_booked_hotel, people_count, city_information, landmarks, events, daily_expected_cost)
			  VALUES %L;
			`, tripValues);
            promises.push(connection_1.default.query(insertTripsQueryStr));
        }
        if (checklistData.length > 0) {
            const checklistValues = checklistData.map(({ trip_id, user_id, items }) => [
                trip_id,
                user_id,
                JSON.stringify(items),
            ]);
            const insertChecklistQueryStr = (0, pg_format_1.default)(`
			  INSERT INTO checklist (trip_id, user_id, items)
			  VALUES %L;
			`, checklistValues);
            promises.push(connection_1.default.query(insertChecklistQueryStr));
        }
        return Promise.all(promises);
    });
};
exports.default = seed;
