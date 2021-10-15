const request = require("supertest");
const app = require("../app");
const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");

const User = mongoose.model("User", UserSchema);

afterAll(async () => {
	await User.deleteMany();
	mongoose.disconnect();
});

describe("POST /register test", () => {
	test("[Success - 201] POST /register should be return an object with property id", (done) => {
		const userPayload = {
			firstName: "Udin",
			lastName: "Sedunia",
			email: "udin@mail.com",
			password: "rahasia",
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
