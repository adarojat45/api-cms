const UserModel = require("../models/userModel");
const Bcrypt = require("../helpers/bcrypt");
const UserTransformer = require("../transformers/userTransformer");
const Jwt = require("../helpers/jwt");
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

	static login = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await UserModel.findOne({ email, isActive: true });
			if (!user)
				throw {
					code: 401,
					name: "Unauthorized",
					message: "Email or password invalid",
				};

			const passwordCheck = Bcrypt.compare(password, user.password);

			if (!passwordCheck)
				throw {
					code: 401,
					name: "Unauthorized",
					message: "Email or password invalid",
				};

			const token = Jwt.sign({ id: user.id, email: user.email });

			res.status(200).json({ token });
		} catch (error) {
			next(error);
		}
	};
}

module.exports = UserController;
