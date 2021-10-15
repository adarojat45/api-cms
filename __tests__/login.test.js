const request = require("supertest");
const app = require("../app");
const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");
const UserModel = require("../models/userModel");
const Bcrypt = require("../helpers/bcrypt");

const User = mongoose.model("User", UserSchema);

beforeAll(async () => {
	const userPayload = {
		firstName: "Udin",
		lastName: "Sedunia",
		email: "udin@mail.com",
		password: Bcrypt.hash("rahasia"),
		isActive: true,
	};
	await UserModel.create(userPayload);
});

afterAll(async () => {
	await User.deleteMany();
	mongoose.disconnect();
});

describe("POST /login test", () => {
	test("[Success] POST /login should be return an object with property token", (done) => {
		const userPayload = {
			email: "udin@mail.com",
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
});
