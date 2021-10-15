const request = require("supertest");
const app = require("../app");
const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");
const Bcrypt = require("../helpers/bcrypt");
const UserModel = require("../models/userModel");

const User = mongoose.model("User", UserSchema);

beforeAll(async () => {
	const userPayload = {
		firstName: "Kosasih",
		lastName: "Sedunia",
		email: "kosasih@mail.com",
		password: Bcrypt.hash("rahasia"),
		isActive: true,
	};
	await UserModel.create(userPayload);
});

afterAll(async () => {
	await User.deleteMany();
	mongoose.disconnect();
});

describe("User Test Cases", () => {
	describe("POST /users", () => {
		test("[Success - 201] POST /register should be return an object with status 201", (done) => {
			const userPayload = {
				firstName: "Udin",
				lastName: "Sedunia",
				email: "udin@mail.com",
				password: Bcrypt.hash("rahasia"),
			};
			request(app)
				.post("/users")
				.send(userPayload)
				.then(({ body, status }) => {
					expect(status).toBe(201);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("POST /users/login", () => {
		test("[success - 200] POST /login should be return an object with property token", (done) => {
			const userPayload = {
				email: "kosasih@mail.com",
				password: "rahasia",
			};
			request(app)
				.post("/users/login")
				.send(userPayload)
				.then(({ body, status }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("token");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[Failed - 401] POST /login should be return an object with status code 401", (done) => {
			const userPayload = {
				email: "udin@mail.com",
				password: "rahasia2",
			};
			request(app)
				.post("/users/login")
				.send(userPayload)
				.then(({ body, status }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("message", "Email or password invalid");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
