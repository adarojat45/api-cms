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
let posts = [];

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
	const newPosts = await PostModel.create(postsPayload);
	posts = newPosts;
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

	describe("GET /posts/:id", () => {
		test("[success - 200] GET /posts/:id should be return an object and status code 200", (done) => {
			request(app)
				.get(`/posts/${posts[0].id}`)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(200);
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

		test("[failed - 200] GET /posts/:id without token should be return error", (done) => {
			request(app)
				.get(`/posts/${posts[0].id}`)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("message", "Invalid token");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 404] GET /posts/:id without valid id should be return error", (done) => {
			request(app)
				.get(`/posts/6169cff54ef04d6caef22038`)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("message", "Post not found");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("PUT /posts/:id", () => {
		const postPayload = {
			name: `Post name edited`,
			description: `Post description edited`,
			excerpt: `Post excerpt edited`,
			tags: ["tags1", "tags2"],
			categories: [],
			isMakrdown: true,
		};
		test("[success - 200] PUT /posts/:id should be return an object and status code 200", (done) => {
			request(app)
				.put(`/posts/${posts[0].id}`)
				.set("token", token)
				.send(postPayload)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("name", "Post name edited");
					expect(body).toHaveProperty("excerpt", "Post excerpt edited");
					expect(body).toHaveProperty("tags");
					expect(body.tags).toEqual(expect.any(Array));
					expect(body.tags[0]).toEqual(expect.any(String));
					expect(body).toHaveProperty("isMarkdown");
					expect(body).toHaveProperty("categories");
					expect(body.categories).toEqual(expect.any(Array));
					expect(body).toHaveProperty("isActive");
					expect(body).toHaveProperty("isDeleted");
					expect(body).toHaveProperty("description", "Post description edited");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 200] PUT /posts/:id without token should be return error", (done) => {
			request(app)
				.put(`/posts/${posts[0].id}`)
				.send(postPayload)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("message", "Invalid token");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 404] PUT /posts/:id without valid id should be return error", (done) => {
			request(app)
				.put(`/posts/6169cff54ef04d6caef22038`)
				.set("token", token)
				.send(postPayload)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("message", "Post not found");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
