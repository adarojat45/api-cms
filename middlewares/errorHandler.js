const errorHandler = (err, req, res, next) => {
	let code = 500;
	let name = "InternalServerError";
	let messages = [];

	switch (err.name) {
		case "Unauthorized":
			code = err.code;
			name = err.name;
			messages = [err.message];
			break;

		case "NotFound":
			code = err.code;
			name = err.name;
			messages = [err.message];
			break;

		case "RetryError":
			code = 500;
			name = err.name;
			messages = [err.message];
			break;

		case "NetlifyErr":
			code = 500;
			name = err.name;
			messages = [err.message];
			break;

		case "ValidationError":
			Object.keys(err.errors).forEach((key) => {
				messages.push(err.errors[key].message);
			});

			code = 400;
			name = "ValidationError";
			break;

		case "MongoServerError":
			Object.keys(err.keyValue).forEach((key) => {
				messages.push(`${key} must be unique`);
			});
			code = 400;
			name = "MongoServerError";
			break;

		default:
			messages = ["Internal server error"];
			break;
	}
	res.status(code).json({
		code,
		name,
		messages,
	});
};

module.exports = errorHandler;
