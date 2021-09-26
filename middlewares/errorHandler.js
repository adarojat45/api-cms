const errorHandler = (err, req, res, next) => {
	let code = 500;
	let name = "InternalServerError";
	let message = "Internal server error";

	switch (err.name) {
		case "Unauthorized":
			code = err.code;
			name = err.name;
			message = err.message;
			break;

		default:
			break;
	}
	res.status(code).json({
		code,
		name,
		message,
	});
};

module.exports = errorHandler;
