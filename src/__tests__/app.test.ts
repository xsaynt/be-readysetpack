import request from 'supertest';
import db from '../db/connection';
import app from '../app';
import seed from '../db/seeds/seed';
import checklistData from '../db/data/test-data/checklist';
import usersData from '../db/data/test-data/users';
import tripsData from '../db/data/test-data/trips';
import costsData from '../db/data/test-data/dailycost';
import endpointsJson from '../../endpoints.json';
import { Trips, Users, Checklist } from '../types/types';
import { Response } from 'supertest';

afterAll(() => {
	console.log('All test finished');
	return db.end();
});

beforeEach(() => {
	return seed({ usersData, tripsData, checklistData, costsData });
});

describe('GET /api', () => {
	test('200: Responds with all endpoints', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsJson);
			});
	});
});

describe('GET /api/users', () => {
	test('200: Responds with all users', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body: { users } }) => {
				expect(users).toHaveLength(5);
				users.forEach((user: Users) => {
					expect(user).toEqual(
						expect.objectContaining({
							user_id: expect.any(Number),
							username: expect.any(String),
							name: expect.any(String),
						})
					);
				});
			});
	});
	test('404: Responds with an error message when the route is not correct', () => {
		return (
			request(app)
				.get('/api/usersllalalala')
				.expect(404)
				.then((response: any) => {
					expect(response.res.statusMessage).toBe('Not Found');
				})
		);
	});
});

describe('GET /api/users/:user_id', () => {
	test('200: Responds with single user ', () => {
		return request(app)
			.get('/api/users/1')
			.expect(200)
			.then(({ body: { user } }) => {
				expect(user).toEqual(
					expect.objectContaining({
						user_id: 1,
						username: expect.any(String),
						name: expect.any(String),
					})
				);
			});
	});

	test('404: Responds with msg when the user does not exist ', () => {
		return request(app)
			.get('/api/users/10')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Responds with msg when the user_id is not a number', () => {
		return request(app)
			.get('/api/users/qwe')
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('DELETE /api/user/:user_id', () => {
	test('204: Should delete selected user ', () => {
		return request(app).delete('/api/users/1').expect(204);
	});
	test('404: Responds with msg when the user does not exist ', () => {
		return request(app)
			.delete('/api/users/10')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Responds with msg when the user_id is not a number ', () => {
		return request(app)
			.delete('/api/users/asd')
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('POST api/users', () => {
	test('201: Should post a new user', () => {
		const userData: Users = {
			username: 'alexonur',
			name: 'Alex Onur',
		};

		return request(app)
			.post('/api/users')
			.send(userData)
			.expect(201)
			.then(({ body: { user } }) => {
				expect(user).toEqual({
					user_id: 6,
					username: 'alexonur',
					name: 'Alex Onur',
				});
			});
	});
	test('400: Responds with bad request when post body has more properties than allowed', () => {
		const userData: Users = {
			user_id: 9,
			username: 'alexonur444',
			name: 'Alex Onur',
		};

		return request(app)
			.post('/api/users')
			.send(userData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Responds with bad request when passed number in name', () => {
		const userData: Users = {
			username: 'alexonur',
			name: 'Alex Onur123',
		};

		return request(app)
			.post('/api/users')
			.send(userData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('PATCH api/users/:user_id', () => {
	test('200: Responds with an updated user object ', () => {
		const userData: Users = {
			username: 'alexonur',
			name: 'Alex Onur',
		};

		return request(app)
			.patch('/api/users/1')
			.send(userData)
			.expect(200)
			.then(({ body: { user } }) => {
				expect(user).toEqual({
					user_id: 1,
					username: 'alexonur',
					name: 'Alex Onur',
				});
			});
	});
	test('200: Responds with an updated username when passed only username ', () => {
		const userData: any = {
			username: 'alexonur',
		};

		return request(app)
			.patch('/api/users/1')
			.send(userData)
			.expect(200)
			.then(({ body: { user } }) => {
				expect(user).toEqual({
					user_id: 1,
					username: 'alexonur',
					name: 'alex',
				});
			});
	});
	test('200: Responds with an updated username when passed only name ', () => {
		const userData: any = {
			name: 'onur',
		};

		return request(app)
			.patch('/api/users/1')
			.send(userData)
			.expect(200)
			.then(({ body: { user } }) => {
				expect(user).toEqual({
					user_id: 1,
					username: 'alex123',
					name: 'onur',
				});
			});
	});
	test('400: Responds with bad request when passed number in name', () => {
		const userData: Users = {
			username: 'alexonur',
			name: 'Alex Onur123',
		};

		return request(app)
			.patch('/api/users/1')
			.send(userData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Responds with bad request when user try to change user_id', () => {
		const userData: Users = {
			user_id: 2,
			username: 'alexonur',
			name: 'Alex Onur123',
		};

		return request(app)
			.patch('/api/users/1')
			.send(userData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('404: Responds with not found request when user does not exist', () => {
		const userData: Users = {
			username: 'alexonur',
			name: 'Alex Onur',
		};

		return request(app)
			.patch('/api/users/10')
			.send(userData)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
});

describe('GET /api/dailyCost/:country', () => {
	test('200: Responds with correct daily cost based on input destination', () => {
		return request(app)
			.get('/api/dailyCost/UK')
			.expect(200)
			.then(({ body: { countryInfo } }) => {
				expect(countryInfo).toEqual({
					country: 'UK',
					daily_cost_in_dollars: 2000,
				});
			});
	});
	test('404: Responds with not found when country does not exist', () => {
		return request(app)
			.get('/api/dailyCost/unknowncountry')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
});

describe('GET /api/trips/:user_id', () => {
	test('200: Responds with all trips for user ', () => {
		return request(app)
			.get('/api/trips/1')
			.expect(200)
			.then(({ body: { trips } }: { body: { trips: Trips[] } }) => {
				expect(trips).toHaveLength(2);
				trips.forEach((trip: Trips) => {
					expect(trip).toEqual(
						expect.objectContaining({
							trip_id: expect.any(Number),
							user_id: expect.any(Number),
							destination: expect.objectContaining({
								city: expect.any(String),
								country: expect.any(String),
								currency: expect.any(String),
							}),
							start_date: expect.any(String),
							end_date: expect.any(String),
							passport_issued_country: expect.any(String),
							weather: expect.objectContaining({
								temp: expect.any(Number),
								weather_type: expect.any(String),
							}),
							visa_type: expect.any(String),
							budget: expect.objectContaining({
								amount: expect.any(Number),
								currency: expect.any(String),
							}),
							is_booked_hotel: expect.any(Boolean),
							people_count: expect.any(Number),
							city_information: expect.any(String),
							landmarks: expect.objectContaining({
								best_places_to_visit: expect.any(Object),
								img_url_of_landmarks: expect.any(Object),
							}),
							events: expect.arrayContaining([
								expect.objectContaining({
									img: expect.any(String),
									date: expect.any(String),
									name: expect.any(String),
									price: expect.any(Number),
									venue: expect.any(String),
								}),
							]),
							daily_expected_cost: expect.any(Number),
						})
					);
				});
			});
	});
	test('200: Responds with an empty array when user does not have any trip ', () => {
		return request(app)
			.get('/api/trips/3')
			.expect(200)
			.then(({ body: { trips } }: { body: { trips: Trips[] } }) => {
				expect(trips).toHaveLength(0);
			});
	});

	test('404: Should responds with an error message when user does not exist', () => {
		return request(app)
			.get('/api/trips/10')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
});

describe('POST /api/trips/:user_id', () => {
	test('201: Should post a new trip for user ', () => {
		const tripData = {
			destination: {
				city: 'Amsterdam',
				country: 'NE',
				currency: 'EUR',
			},
			start_date: '25/01/2025',
			end_date: '15/02/2025',
			passport_issued_country: 'UK',
			weather: {
				temp: 25,
				weather_type: 'Cloudly',
			},
			visa_type: 'eVisa',
			budget: {
				amount: 1000,
				currency: 'EUR',
			},
			is_booked_hotel: false,
			people_count: 1,
			city_information: 'Capital of Netherlands',
			landmarks: {
				best_places_to_visit: ['Tower', 'City Center', 'Museum'],
				img_url_of_landmarks: ['', '', ''],
			},
			events: [
				{
					name: 'eminem concert',
					venue: 'empty venue',
					date: '15/01/2025',
					img: '',
					price: 1000,
				},
			],
			daily_expected_cost: 200,
		};
		return request(app)
			.post('/api/trips/2')
			.send(tripData)
			.expect(201)
			.then(({ body: { trip } }: { body: { trip: Trips[] } }) => {
				expect(trip).toEqual(
					expect.objectContaining({
						trip_id: expect.any(Number),
						user_id: expect.any(Number),
						destination: expect.objectContaining({
							city: expect.any(String),
							country: expect.any(String),
							currency: expect.any(String),
						}),
						start_date: expect.any(String),
						end_date: expect.any(String),
						passport_issued_country: expect.any(String),
						weather: expect.objectContaining({
							temp: expect.any(Number),
							weather_type: expect.any(String),
						}),
						visa_type: expect.any(String),
						budget: expect.objectContaining({
							amount: expect.any(Number),
							currency: expect.any(String),
						}),
						is_booked_hotel: expect.any(Boolean),
						people_count: expect.any(Number),
						city_information: expect.any(String),
						landmarks: expect.objectContaining({
							best_places_to_visit: expect.any(Object),
							img_url_of_landmarks: expect.any(Object),
						}),
						events: expect.arrayContaining([
							expect.objectContaining({
								img: expect.any(String),
								date: expect.any(String),
								name: expect.any(String),
								price: expect.any(Number),
								venue: expect.any(String),
							}),
						]),
						daily_expected_cost: expect.any(Number),
					})
				);
			});
	});
	test('404: Responds with error message when user does not exist', () => {
		const tripData = {
			destination: {
				city: 'Amsterdam',
				country: 'NE',
				currency: 'EUR',
			},
			start_date: '25/01/2025',
			end_date: '15/02/2025',
			passport_issued_country: 'UK',
			weather: {
				temp: 25,
				weather_type: 'Cloudly',
			},
			visa_type: 'eVisa',
			budget: {
				amount: 1000,
				currency: 'EUR',
			},
			is_booked_hotel: false,
			people_count: 1,
			city_information: 'Capital of Netherlands',
			landmarks: {
				best_places_to_visit: ['Tower', 'City Center', 'Museum'],
				img_url_of_landmarks: ['', '', ''],
			},
			events: [
				{
					name: 'eminem concert',
					venue: 'empty venue',
					date: '15/01/2025',
					img: '',
					price: 1000,
				},
			],
			daily_expected_cost: 200,
		};
		return request(app)
			.post('/api/trips/10')
			.send(tripData)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
});

describe('PATCH /api/trips/:user_id/:trip_id', () => {
	test('200: Responds with updated trip data', () => {
		const tripData = {
			start_date: '10/02/2025',
			end_date: '05/03/2025',
			budget: {
				amount: 1500,
				currency: 'GBP',
			},
			is_booked_hotel: true,
			people_count: 3,
		};

		return request(app)
			.patch('/api/trips/1/1')
			.send(tripData)
			.expect(200)
			.then(({ body: { trip } }: { body: { trip: Trips } }) => {
				expect(trip.start_date).toBe('10/02/2025');
				expect(trip.end_date).toBe('05/03/2025');
				expect(trip.budget).toEqual({
					amount: 1500,
					currency: 'GBP',
				});
				expect(trip.is_booked_hotel).toBe(true);
				expect(trip.people_count).toBe(3);
			});
	});
	test('200: Responds with updated trip data with one value changed', () => {
		const tripData = {
			people_count: 3,
		};

		return request(app)
			.patch('/api/trips/1/1')
			.send(tripData)
			.expect(200)
			.then(({ body: { trip } }: { body: { trip: Trips } }) => {
				expect(trip.people_count).toBe(3);
			});
	});
	test('200: Responds with updated trip data with two values changed', () => {
		const tripData = {
			people_count: 3,
			budget: {
				amount: 3000,
				currency: 'TRY',
			},
		};

		return request(app)
			.patch('/api/trips/1/1')
			.send(tripData)
			.expect(200)
			.then(({ body: { trip } }: { body: { trip: Trips } }) => {
				expect(trip.people_count).toBe(3);
				expect(trip.budget).toEqual({
					amount: 3000,
					currency: 'TRY',
				});
			});
	});
	test('404: Responds with an error when given incorrect user_id', () => {
		const tripData = {
			people_count: 3,
			budget: {
				amount: 3000,
				currency: 'TRY',
			},
		};

		return request(app)
			.patch('/api/trips/10/1')
			.send(tripData)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('404: Responds with an error when given incorrect trip_id', () => {
		const tripData = {
			people_count: 3,
			budget: {
				amount: 3000,
				currency: 'TRY',
			},
		};

		return request(app)
			.patch('/api/trips/1/10')
			.send(tripData)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Responds with an error when trying to change incorrect column', () => {
		const tripData = {
			destination: {
				city: 'London',
				country: 'UK',
				currency: 'GBP',
			},
		};

		return request(app)
			.patch('/api/trips/1/1')
			.send(tripData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Responds with an error when trying to change incorrect column', () => {
		const tripData = {
			destination: {
				city: 'London',
				country: 'UK',
				currency: 'GBP',
			},
			people_count: 3,
		};

		return request(app)
			.patch('/api/trips/1/1')
			.send(tripData)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('GET /api/trips/:user_id/trip_id', () => {
	test('200: Responds with a single trip for specified user', () => {
		return request(app)
			.get('/api/trips/1/1')
			.expect(200)
			.then(({ body: { trip } }: { body: { trip: Trips } }) => {
				expect(trip).toEqual(
					expect.objectContaining({
						trip_id: expect.any(Number),
						user_id: expect.any(Number),
						destination: expect.objectContaining({
							city: expect.any(String),
							country: expect.any(String),
							currency: expect.any(String),
						}),
						start_date: expect.any(String),
						end_date: expect.any(String),
						passport_issued_country: expect.any(String),
						weather: expect.objectContaining({
							temp: expect.any(Number),
							weather_type: expect.any(String),
						}),
						visa_type: expect.any(String),
						budget: expect.objectContaining({
							amount: expect.any(Number),
							currency: expect.any(String),
						}),
						is_booked_hotel: expect.any(Boolean),
						people_count: expect.any(Number),
						city_information: expect.any(String),
						landmarks: expect.objectContaining({
							best_places_to_visit: expect.any(Object),
							img_url_of_landmarks: expect.any(Object),
						}),
						events: expect.arrayContaining([
							expect.objectContaining({
								img: expect.any(String),
								date: expect.any(String),
								name: expect.any(String),
								price: expect.any(Number),
								venue: expect.any(String),
							}),
						]),
						daily_expected_cost: expect.any(Number),
					})
				);
			});
	});
});

describe('DELETE /api/trips/:user_id/:trips_id', () => {
	test('204: Should delete selected trip ', () => {
		return request(app).delete('/api/trips/1/1').expect(204);
	});
	test('404: Responds with msg when the trip does not exist ', () => {
		return request(app)
			.delete('/api/trips/1/100')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Responds with msg when the trip_id is not a number ', () => {
		return request(app)
			.delete('/api/trips/1/abc')
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('GET /api/checklists/:user_id/:trip_id', () => {
	test('200: Returns a single checklist based on the trip_id', () => {
		return request(app)
			.get('/api/checklists/1/1')
			.expect(200)
			.then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
				expect(checklist).toEqual(
					expect.objectContaining({
						checklist_id: expect.any(Number),
						trip_id: expect.any(Number),
						user_id: expect.any(Number),
						items: expect.any(Object),
					})
				);
			});
	});
	test('404: Returns an error when passed incorrect/not exist user id', () => {
		return request(app)
			.get('/api/checklists/10/1')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('404: Returns an error when passed incorrect/not exist trip id', () => {
		return request(app)
			.get('/api/checklists/1/10')
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Returns an error when passed string as trip_id', () => {
		return request(app)
			.get('/api/checklists/1/abc')
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Returns an error when passed string as user_id', () => {
		return request(app)
			.get('/api/checklists/abc/1')
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('POST /api/checklists/:user_id/:trip_id', () => {
	test('201: Posts checklist to the checklist table ', () => {
		const inputChecklist = {
			items: ['Laptop', 'Clothes', 'Shoes'],
		};

		return request(app)
			.post('/api/checklists/1/1')
			.send(inputChecklist)
			.expect(201)
			.then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
				expect(checklist).toEqual(
					expect.objectContaining({
						checklist_id: expect.any(Number),
						trip_id: expect.any(Number),
						user_id: expect.any(Number),
						items: expect.any(Object),
					})
				);
			});
	});
	test('404: Returns an error when passed incorrect/not exist user id', () => {
		const inputChecklist = {
			items: ['Laptop', 'Clothes', 'Shoes'],
		};

		return request(app)
			.post('/api/checklists/10/1')
			.send(inputChecklist)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('404: Returns an error when passed incorrect/not exist trip id', () => {
		const inputChecklist = {
			items: ['Laptop', 'Clothes', 'Shoes'],
		};

		return request(app)
			.post('/api/checklists/1/10')
			.send(inputChecklist)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});

	test('400: Returns an error when passed user_id as a string', () => {
		const inputChecklist = {
			items: ['Laptop', 'Clothes', 'Shoes'],
		};

		return request(app)
			.post('/api/checklists/abc/1')
			.send(inputChecklist)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Returns an error when passed trip_id as a string', () => {
		const inputChecklist = {
			items: ['Laptop', 'Clothes', 'Shoes'],
		};

		return request(app)
			.post('/api/checklists/1/abc')
			.send(inputChecklist)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('PATCH /api/checklists/:user_id/:trip_id/', () => {
	test('200: Should patch checklist items ', () => {
		const inputChecklistItem = { newItem: 'new item' };
		return request(app)
			.patch('/api/checklists/1/1')
			.send(inputChecklistItem)
			.expect(200)
			.then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
				expect(checklist).toEqual({
					checklist_id: 1,
					trip_id: 1,
					user_id: 1,
					items: [
						'shirt',
						'trousers',
						'toiletries',
						'hats',
						'laptop',
						'new item',
					],
				});
			});
	});
	test('404: Should return an error msg if user id does not exist ', () => {
		const inputChecklistItem = { newItem: 'new item' };
		return request(app)
			.patch('/api/checklists/10/1')
			.send(inputChecklistItem)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('404: Should return an error msg if trip id does not exist ', () => {
		const inputChecklistItem = { newItem: 'new item' };
		return request(app)
			.patch('/api/checklists/1/10')
			.send(inputChecklistItem)
			.expect(404)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Does Not Found');
			});
	});
	test('400: Should return an error msg if user id is string ', () => {
		const inputChecklistItem = { newItem: 'new item' };
		return request(app)
			.patch('/api/checklists/abc/1')
			.send(inputChecklistItem)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
	test('400: Should return an error msg if trip id is string ', () => {
		const inputChecklistItem = { newItem: 'new item' };
		return request(app)
			.patch('/api/checklists/1/abc')
			.send(inputChecklistItem)
			.expect(400)
			.then((response: Response) => {
				expect(response.body.msg).toBe('Bad Request');
			});
	});
});

describe('PATCH /api/checklists/:user_id/:trip_id/delete-item (Deleting single item from items array)', () => {
	test('200: Should delete single item from items array ', () => {
		const deleteChecklistItem = { item: 'shirt' };
		return request(app)
			.patch('/api/checklists/1/1/delete-item')
			.send(deleteChecklistItem)
			.expect(200)
			.then(({ body: { checklist } }: { body: { checklist: Checklist } }) => {
				expect(checklist).toEqual({
					checklist_id: 1,
					trip_id: 1,
					user_id: 1,
					items: ['trousers', 'toiletries', 'hats', 'laptop'],
				});
			});
	});
});

describe('DELETE /api/checklists/:user_id/trip_id', () => {
	test('204: Should delete entire checklist  ', () => {
		return request(app).delete('/api/checklists/1/1').expect(204);
	});
});
