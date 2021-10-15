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
	let postsPayload = [];
	for (let i = 0; i < 20; i++) {
		const payload = {
			name: `Post name ${i}`,
			slug: `post-name-${i}`,
			description: `Post description ${i}`,
			excerpt: `Post excerpt ${i}`,
			tags: ["tags1", "tags2"],
			categories: [],
			isMakrdown: true,
		};
		postsPayload.push(payload);
	}
	await PostModel.create(postsPayload);
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
					expect(body.length).toBe(20);
					expect(body[0]).toHaveProperty("id");
					expect(body[0]).toHaveProperty("name");
					expect(body[0]).toHaveProperty("excerpt");
					expect(body[0]).toHaveProperty("tags");
					expect(body[0].tags).toEqual(expect.any(Array));
					expect(body[0].tags[0]).toEqual(expect.any(String));
					expect(body[0]).toHaveProperty("isMarkdown");
					expect(body[0]).toHaveProperty("categories");
					expect(body[0].categories).toEqual(expect.any(Array));
					expect(body[0]).toHaveProperty("isActive");
					expect(body[0]).toHaveProperty("isDeleted");
					expect(body[0]).not.toHaveProperty("description");
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

	describe("POST /posts", () => {
		test("[success - 201] POST /posts should be return an object and status code 201", (done) => {
			const postPayload = {
				name: `Post name`,
				description: `Post description`,
				excerpt: `Post excerpt`,
				tags: ["tags1", "tags2"],
				categories: [],
				isMakrdown: true,
			};

			request(app)
				.post("/posts")
				.send(postPayload)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(201);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("name");
					expect(body).toHaveProperty("excerpt");
					expect(body).toHaveProperty("tags");
					expect(body.tags).toEqual(expect.any(Array));
					expect(body.tags[0]).toEqual(expect.any(String));
					expect(body).toHaveProperty("isMarkdown");
					expect(body).toHaveProperty("categories");
					expect(body.categories).toEqual(expect.any(Array));
					expect(body).toHaveProperty("isActive");
					expect(body).toHaveProperty("isDeleted");
					expect(body).toHaveProperty("description");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
