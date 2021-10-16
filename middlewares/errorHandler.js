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

		case "ValidationError":
			let errors = [];

			Object.keys(err.errors).forEach((key) => {
				errors.push(err.errors[key].message);
			});

			code = 400;
			name = "ValidationError";
			message = errors;
			break;

		default:
			break;
	}
	res.status(code).json({
		code,
		name,
		messages,
	});
};

module.exports = errorHandler;
