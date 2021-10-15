const request = require("supertest");
const app = require("../app");
const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");
const PostSchema = require("../schemas/postSchema");
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const Bcrypt = require("../helpers/bcrypt");
const Jwt = require("../helpers/jwt");

const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);

let token = "";

beforeAll(async () => {
	const userPayload = {
		firstName: "Udin",
		lastName: "Sedunia",
		email: "udin@mail.com",
		password: Bcrypt.hash("rahasia"),
		isActive: true,
	};
	const user = await UserModel.create(userPayload);
	token = Jwt.sign({ id: user.id, email: user.email });
});

afterAll(async () => {
	await User.deleteMany();
	await Post.deleteMany();
	mongoose.disconnect();
});

describe("Post test", () => {
	describe("GET /posts", () => {
		test("[success - 200] /posts should be return an array of object with some object property", (done) => {
			request(app)
				.get("/posts")
				.set("token", token)
				.then(({ body, status }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Array));
					// expect(body).toHaveProperty("id");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 401] /posts without token should be return status code 401", (done) => {
			request(app)
				.get("/posts")
				.then(({ body, status }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("message", "Invalid token");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
