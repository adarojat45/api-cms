const Jwt = require("../helpers/jwt");
const UserModel = require("../models/userModel");

class Auth {
	static authentication = async (req, res, next) => {
		try {
			const { token } = req.headers;
			if (!token)
				throw { code: 401, name: "Unauthorized", message: "Invalid token" };
			const userDecode = Jwt.verify(token);
			const user = await UserModel.findOne({ email: userDecode.email });

			if (!user)
				throw { code: 401, name: "Unauthorized", message: "Invalid token" };

			req.user = { id: user.id, email: user.email };
			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = Auth;
