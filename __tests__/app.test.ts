import request from "supertest";
import Response from "supertest";
import db from "../db/connection";
import app from "../app";
import seed from "../db/seeds/seed";
import checklistData from "../db/data/test-data/checklist";
import usersData from "../db/data/test-data/users";
import tripsData from "../db/data/test-data/trips";
import costsData from "../db/data/test-data/dailycost";
import endpointsJson from "../endpoints.json";
import { Users } from "../types/types";

afterAll(() => {
  console.log("All test finished");
  return db.end();
});

beforeEach(() => {
  return seed({ usersData, tripsData, checklistData, costsData });
});

describe("GET /api", () => {
  test("200: Responds with all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
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
  test("404: Responds with an error message when the route is not correct", () => {
    return (
      request(app)
        .get("/api/usersllalalala")
        .expect(404)
        //remove 'any' type from .then
        .then((response: any) => {
          expect(response.res.statusMessage).toBe("Not Found");
        })
    );
  });
});

describe("GET /api/users/:user_id", () => {
  test("200: Responds with single user ", () => {
    return request(app)
      .get("/api/users/1")
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
  test("404: Responds with msg when the user does not exist ", () => {
    return request(app)
      .get("/api/users/10")
      .expect(404)
      .then((response: any) => {
        expect(response.res.statusMessage).toBe("Not Found");
      });
  });
  test("400: Responds with msg when the user_id is not a number", () => {
    return request(app)
      .get("/api/users/qwe")
      .expect(400)
      .then((response: any) => {
        expect(response.res.statusMessage).toBe("Bad Request");
      });
  });

  describe("DELETE /api/user/:user_id", () => {
    test("204: Should delete selected user ", () => {
      return request(app)
        .delete("/api/users/1")
        .expect(204)
        .then((response: any) => {
			expect(response.res.statusMessage).toBe("No Content");
        });
    });
	test("404: Responds with msg when the user does not exist ", () => {
		return request(app)
		  .delete("/api/users/10")
		  .expect(404)
		  .then((response: any) => {
			  expect(response.res.statusMessage).toBe("Not Found");
		  });
	  });
	  test("400: Responds with msg when the user_id is not a number ", () => {
		return request(app)
		  .delete("/api/users/asd")
		  .expect(400)
		  .then((response: any) => {
			  expect(response.res.statusMessage).toBe("Bad Request");
		  });
	  });
  });
});
