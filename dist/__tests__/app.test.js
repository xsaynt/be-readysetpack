"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const connection_1 = __importDefault(require("../db/connection"));
const app_1 = __importDefault(require("../app"));
const seed_1 = __importDefault(require("../db/seeds/seed"));
const checklist_1 = __importDefault(require("../db/data/test-data/checklist"));
const users_1 = __importDefault(require("../db/data/test-data/users"));
const trips_1 = __importDefault(require("../db/data/test-data/trips"));
const dailycost_1 = __importDefault(require("../db/data/test-data/dailycost"));
const endpoints_json_1 = __importDefault(require("../../endpoints.json"));
afterAll(() => {
    console.log('All test finished');
    return connection_1.default.end();
});
beforeEach(() => {
    return (0, seed_1.default)({ usersData: users_1.default, tripsData: trips_1.default, checklistData: checklist_1.default, costsData: dailycost_1.default });
});
describe('GET /api', () => {
    test('200: Responds with all endpoints', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api')
            .expect(200)
            .then(({ body: { endpoints } }) => {
            expect(endpoints).toEqual(endpoints_json_1.default);
        });
    });
});
describe('GET /api/users', () => {
    test('200: Responds with all users', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users')
            .expect(200)
            .then(({ body: { users } }) => {
            expect(users).toHaveLength(5);
            users.forEach((user) => {
                expect(user).toEqual(expect.objectContaining({
                    user_id: expect.any(Number),
                    username: expect.any(String),
                    name: expect.any(String),
                }));
            });
        });
    });
    test('404: Responds with an error message when the route is not correct', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/usersllalalala')
            .expect(404)
            .then((response) => {
            expect(response.res.statusMessage).toBe('Not Found');
        });
    });
});
describe('GET /api/users/:user_id', () => {
    test('200: Responds with single user ', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/1')
            .expect(200)
            .then(({ body: { user } }) => {
            expect(user).toEqual(expect.objectContaining({
                user_id: 1,
                username: expect.any(String),
                name: expect.any(String),
            }));
        });
    });
    test('404: Responds with msg when the user does not exist ', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/10')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Responds with msg when the user_id is not a number', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/users/qwe')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('DELETE /api/user/:user_id', () => {
    test('204: Should delete selected user ', () => {
        return (0, supertest_1.default)(app_1.default).delete('/api/users/1').expect(204);
    });
    test('404: Responds with msg when the user does not exist ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/users/10')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Responds with msg when the user_id is not a number ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/users/asd')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('POST api/users', () => {
    test('201: Should post a new user', () => {
        const userData = {
            username: 'alexonur',
            name: 'Alex Onur',
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            user_id: 9,
            username: 'alexonur444',
            name: 'Alex Onur',
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Responds with bad request when passed number in name', () => {
        const userData = {
            username: 'alexonur',
            name: 'Alex Onur123',
        };
        return (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('PATCH api/users/:user_id', () => {
    test('200: Responds with an updated user object ', () => {
        const userData = {
            username: 'alexonur',
            name: 'Alex Onur',
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            username: 'alexonur',
        };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/users/1')
            .send(userData)
            .expect(200)
            .then(({ body: { user } }) => {
            expect(user).toEqual({
                user_id: 1,
                username: 'alexonur',
                name: 'Alex',
            });
        });
    });
    test('200: Responds with an updated username when passed only name ', () => {
        const userData = {
            name: 'onur',
        };
        return (0, supertest_1.default)(app_1.default)
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
        const userData = {
            username: 'alexonur',
            name: 'Alex Onur123',
        };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/users/1')
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Responds with bad request when user try to change user_id', () => {
        const userData = {
            user_id: 2,
            username: 'alexonur',
            name: 'Alex Onur123',
        };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/users/1')
            .send(userData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('404: Responds with not found request when user does not exist', () => {
        const userData = {
            username: 'alexonur',
            name: 'Alex Onur',
        };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/users/10')
            .send(userData)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
});
describe('GET /api/dailyCost/:country', () => {
    test('200: Responds with correct daily cost based on input destination', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/dailyCost/GB')
            .expect(200)
            .then(({ body: { countryInfo } }) => {
            expect(countryInfo).toEqual({
                country: 'GB',
                daily_cost_in_dollars: 200,
            });
        });
    });
    test('404: Responds with not found when country does not exist', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/dailyCost/unknowncountry')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
});
describe('GET /api/trips/:user_id', () => {
    test('200: Responds with all trips for user ', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/trips/1')
            .expect(200)
            .then(({ body: { trips } }) => {
            expect(trips).toHaveLength(2);
            trips.forEach((trip) => {
                expect(trip).toEqual(expect.objectContaining({
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
                        current_amount: expect.any(Number),
                        current_currency: expect.any(String),
                        destination_currency: expect.any(String),
                        destination_amount: expect.any(Number),
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
                }));
            });
        });
    });
    test('200: Responds with an empty array when user does not have any trip ', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/trips/3')
            .expect(200)
            .then(({ body: { trips } }) => {
            expect(trips).toHaveLength(0);
        });
    });
    test('404: Should responds with an error message when user does not exist', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/trips/10')
            .expect(404)
            .then((response) => {
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
                current_amount: 3000,
                current_currency: 'GBP',
                destination_currency: 'EUR',
            },
            is_booked_hotel: false,
            people_count: 1,
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
        return (0, supertest_1.default)(app_1.default)
            .post('/api/trips/2')
            .send(tripData)
            .expect(201)
            .then(({ body: { trip } }) => {
            expect(trip).toEqual(expect.objectContaining({
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
                    current_amount: expect.any(Number),
                    current_currency: expect.any(String),
                    destination_currency: expect.any(String),
                    destination_amount: expect.any(Number),
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
            }));
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
        return (0, supertest_1.default)(app_1.default)
            .post('/api/trips/10')
            .send(tripData)
            .expect(404)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/1')
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/1')
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/1')
            .send(tripData)
            .expect(200)
            .then(({ body: { trip } }) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/10/1')
            .send(tripData)
            .expect(404)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/10')
            .send(tripData)
            .expect(404)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/1')
            .send(tripData)
            .expect(400)
            .then((response) => {
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
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/trips/1/1')
            .send(tripData)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('GET /api/trips/:user_id/trip_id', () => {
    test('200: Responds with a single trip for specified user', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/trips/1/1')
            .expect(200)
            .then(({ body: { trip } }) => {
            expect(trip).toEqual(expect.objectContaining({
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
                    current_amount: expect.any(Number),
                    current_currency: expect.any(String),
                    destination_currency: expect.any(String),
                    destination_amount: expect.any(Number),
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
            }));
        });
    });
});
describe('DELETE /api/trips/:user_id/:trip_id', () => {
    test('204: Should delete selected trip ', () => {
        return (0, supertest_1.default)(app_1.default).delete('/api/trips/1/1').expect(204);
    });
    test('404: Responds with msg when the trip does not exist ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/trips/1/100')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Responds with msg when the trip_id is not a number ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/trips/1/abc')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('GET /api/checklists/:user_id/:trip_id', () => {
    test('200: Returns a single checklist based on the trip_id', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/checklists/1/1')
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual(expect.objectContaining({
                checklist_id: expect.any(Number),
                trip_id: expect.any(Number),
                user_id: expect.any(Number),
                items: expect.any(Object),
            }));
        });
    });
    test('404: Returns an error when passed incorrect/not exist user id', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/checklists/10/1')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('404: Returns an error when passed incorrect/not exist trip id', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/checklists/1/10')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Returns an error when passed string as trip_id', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/checklists/1/abc')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Returns an error when passed string as user_id', () => {
        return (0, supertest_1.default)(app_1.default)
            .get('/api/checklists/abc/1')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('POST /api/checklists/:user_id/:trip_id', () => {
    test('201: Posts checklist to the checklist table ', () => {
        return (0, supertest_1.default)(app_1.default)
            .post('/api/checklists/1/1')
            .expect(201)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual(expect.objectContaining({
                checklist_id: expect.any(Number),
                trip_id: expect.any(Number),
                user_id: expect.any(Number),
                items: expect.any(Object),
            }));
        });
    });
    test('404: Returns an error when passed incorrect/not exist user id', () => {
        return (0, supertest_1.default)(app_1.default)
            .post('/api/checklists/10/1')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('404: Returns an error when passed incorrect/not exist trip id', () => {
        return (0, supertest_1.default)(app_1.default)
            .post('/api/checklists/1/10')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Returns an error when passed user_id as a string', () => {
        return (0, supertest_1.default)(app_1.default)
            .post('/api/checklists/abc/1')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Returns an error when passed trip_id as a string', () => {
        return (0, supertest_1.default)(app_1.default)
            .post('/api/checklists/1/abc')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('PATCH /api/checklists/:user_id/:trip_id/', () => {
    test('200: Should patch checklist items ', () => {
        const inputChecklistItem = { newItem: 'new item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/1')
            .send(inputChecklistItem)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual({
                checklist_id: 1,
                trip_id: 1,
                user_id: 1,
                items: [
                    'Check your passport',
                    'Print or download your tickets (flight/train/bus).',
                    'Pack comfortable T-shirts/tops.',
                    'Dont forget your pants/shorts/skirts.',
                    'Pack comfortable shoes for walking.',
                    'Pack your toothbrush and toothpaste.',
                    'Bring your phone charger.',
                    'Pack a power bank for emergencies.',
                    'new item',
                ],
            });
        });
    });
    test('404: Should return an error msg if user id does not exist ', () => {
        const inputChecklistItem = { newItem: 'new item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/10/1')
            .send(inputChecklistItem)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('404: Should return an error msg if trip id does not exist ', () => {
        const inputChecklistItem = { newItem: 'new item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/10')
            .send(inputChecklistItem)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Should return an error msg if user id is string ', () => {
        const inputChecklistItem = { newItem: 'new item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/abc/1')
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Should return an error msg if trip id is string ', () => {
        const inputChecklistItem = { newItem: 'new item' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/abc')
            .send(inputChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('PATCH /api/checklists/:user_id/:trip_id/delete-item (Deleting single item from items array)', () => {
    test('200: Should delete single item from items array ', () => {
        const deleteChecklistItem = { item: 'Check your passport' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/1/delete-item')
            .send(deleteChecklistItem)
            .expect(200)
            .then(({ body: { checklist } }) => {
            expect(checklist).toEqual({
                checklist_id: 1,
                trip_id: 1,
                user_id: 1,
                items: [
                    'Print or download your tickets (flight/train/bus).',
                    'Pack comfortable T-shirts/tops.',
                    'Dont forget your pants/shorts/skirts.',
                    'Pack comfortable shoes for walking.',
                    'Pack your toothbrush and toothpaste.',
                    'Bring your phone charger.',
                    'Pack a power bank for emergencies.',
                ],
            });
        });
    });
    test('404: Should return an error msg if user id does not exist ', () => {
        const deleteChecklistItem = { item: 'Check your passport' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/10/1')
            .send(deleteChecklistItem)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('404: Should return an error msg if trip id does not exist ', () => {
        const deleteChecklistItem = { item: 'Check your passport' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/10')
            .send(deleteChecklistItem)
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Should return an error msg if user id is string ', () => {
        const deleteChecklistItem = { item: 'Check your passport' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/abc/1')
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Should return an error msg if trip id is string ', () => {
        const deleteChecklistItem = { item: 'Check your passport' };
        return (0, supertest_1.default)(app_1.default)
            .patch('/api/checklists/1/abc')
            .send(deleteChecklistItem)
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
describe('DELETE /api/checklists/:user_id/:trip_id', () => {
    test('204: Should delete entire checklist  ', () => {
        return (0, supertest_1.default)(app_1.default).delete('/api/checklists/1/1').expect(204);
    });
    test('404: Should return an error msg if user id does not exist ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/checklists/10/1')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('404: Should return an error msg if trip id does not exist ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/checklists/1/10')
            .expect(404)
            .then((response) => {
            expect(response.body.msg).toBe('Does Not Found');
        });
    });
    test('400: Should return an error msg if user id is string ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/checklists/abc/1')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('400: Should return an error msg if trip id is string ', () => {
        return (0, supertest_1.default)(app_1.default)
            .delete('/api/checklists/1/abc')
            .expect(400)
            .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        });
    });
});
