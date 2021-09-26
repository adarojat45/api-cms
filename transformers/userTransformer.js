const { morphism } = require("morphism");

class UserTransformer {
	static list = (source) => {
		const schema = {
			id: "_id",
			fullName: (iteratee) => {
				return iteratee.firstName + " " + iteratee.lastName;
			},
			firstName: "firstName",
			lastName: "lastName",
			email: "email",
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		};

		return morphism(schema, source);
	};
}

module.exports = UserTransformer;
