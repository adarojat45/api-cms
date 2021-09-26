const UserModel = require("../models/userModel");
const Bcrypt = require("../helpers/bcrypt");
const UserTransformer = require("../transformers/userTransformer");

class UserController {
	static create = async (req, res, next) => {
		try {
			const { firstName, lastName, email, password } = req.body;
			const hashPassword = Bcrypt.hash(password);
			const user = await UserModel.create({
				firstName,
				lastName,
				email,
				password: hashPassword,
				isActive: false,
			});
			const userTransform = UserTransformer.list(user);
			res.status(201).json(userTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = UserController;
