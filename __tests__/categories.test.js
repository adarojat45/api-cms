const request = require("supertest");
const app = require("../app");
const mongoose = require("../config/mongoose");
const UserSchema = require("../schemas/userSchema");
const CategorySchema = require("../schemas/categorySchema");
const UserModel = require("../models/userModel");
const CategoryModel = require("../models/categoryModel");
const Bcrypt = require("../helpers/bcrypt");
const Jwt = require("../helpers/jwt");

const User = mongoose.model("User", UserSchema);
const Category = mongoose.model("Category", CategorySchema);

let token = "";
let categories = [];

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
	let categoriesPayload = [];
	for (let i = 0; i < 20; i++) {
		const payload = {
			name: `Category name ${i}`,
			slug: `category-name-${i}`,
		};
		categoriesPayload.push(payload);
	}
	const newCategories = await CategoryModel.create(categoriesPayload);
	categories = newCategories;
});

afterAll(async () => {
	await User.deleteMany();
	await Category.deleteMany();
	mongoose.disconnect();
});

describe("category test cases", () => {
	describe("GET /categories", () => {
		test("[success - 200] GET /categories should be return an array of object with with status code 200", (done) => {
			request(app)
				.get("/categories")
				.set("token", token)
				.then(({ body, status }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Array));
					expect(body.length).toBe(20);
					expect(body[0]).toHaveProperty("id");
					expect(body[0]).toHaveProperty("name");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 401] GET /categories without token should be return status code 401", (done) => {
			request(app)
				.get("/categories")
				.then(({ body, status }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("POST /categories", () => {
		const categoryPayload = {
			name: `Category name`,
		};
		test("[success - 201] POST /categories should be return an object and status code 201", (done) => {
			request(app)
				.post("/categories")
				.send(categoryPayload)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(201);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("name");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 401] POST /categories without token should be return status code 401", (done) => {
			request(app)
				.post("/categories")
				.then(({ body, status }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 400] POST /categories without require fields should be return error and status code 400", (done) => {
			request(app)
				.post("/categories")
				.set("token", token)
				.send({ name: "" })
				.then(({ body, status }) => {
					expect(status).toBe(400);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("GET /categories/:id", () => {
		test("[success - 200] GET /categories/:id should be return an object and status code 200", (done) => {
			request(app)
				.get(`/categories/${categories[0].id}`)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("name");
					expect(body).toHaveProperty("isActive");
					expect(body).toHaveProperty("isDeleted");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 401] GET /categories/:id without token should be return error", (done) => {
			request(app)
				.get(`/categories/${categories[0].id}`)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 404] GET /categories/:id without valid id should be return error", (done) => {
			request(app)
				.get(`/categories/6169cff54ef04d6caef22038`)
				.set("token", token)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("PUT /categories/:id", () => {
		const categoryPayload = {
			name: `Category name edited`,
		};
		test("[success - 200] PUT /categories/:id should be return an object and status code 200", (done) => {
			request(app)
				.put(`/categories/${categories[0].id}`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("name");
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
		test("[failed - 401] PUT /categories/:id without token should be return error", (done) => {
			request(app)
				.put(`/categories/${categories[0].id}`)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
		test("[failed - 404] PUT /categories/:id without valid id should be return error", (done) => {
			request(app)
				.put(`/categories/6169cff54ef04d6caef22038`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("PATCH /categories/:id/updateStatus", () => {
		const categoryPayload = {
			isActive: true,
		};
		test("[success - 200] PATCH /categories/:id/updateStatus should be return an object and status code 200", (done) => {
			request(app)
				.patch(`/categories/${categories[0].id}/updateStatus`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("isActive", true);
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 401] PATCH /categories/:id/updateStatus without token should be return error", (done) => {
			request(app)
				.patch(`/categories/${categories[0].id}/updateStatus`)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test("[failed - 404] PUT /categories/:id without valid id should be return error", (done) => {
			request(app)
				.patch(`/categories/6169cff54ef04d6caef22038/updateStatus`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe("DELETE /posts/:id", () => {
		const categoryPayload = {
			isDeleted: true,
		};
		test("[success - 200] DELETE /categories/:id should be return an object and status code 200", (done) => {
			request(app)
				.delete(`/categories/${categories[0].id}`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(200);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("id");
					expect(body).toHaveProperty("isDeleted", true);
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
		test("[failed - 401] DELETE /categories/:id without token should be return error", (done) => {
			request(app)
				.delete(`/categories/${categories[0].id}`)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(401);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "Unauthorized");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
		test("[failed - 404] DELETE /categories/:id without valid id should be return error", (done) => {
			request(app)
				.delete(`/categories/6169cff54ef04d6caef22038`)
				.set("token", token)
				.send(categoryPayload)
				.then(({ status, body }) => {
					expect(status).toBe(404);
					expect(body).toEqual(expect.any(Object));
					expect(body).toHaveProperty("name", "NotFound");
					expect(body).toHaveProperty("messages");
					expect(body.messages).toEqual(expect.any(Array));
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
