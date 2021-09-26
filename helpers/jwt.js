const jwt = require("jsonwebtoken");

class Jwt {
	static sign = (payload) => {
		return jwt.sign(payload, process.env.JWT_SECRET);
	};

	static verify = (token) => {
		return jwt.verify(token, process.env.JWT_SECRET);
	};
}

module.exports = Jwt;
