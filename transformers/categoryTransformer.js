const { morphism } = require("morphism");

class CategoryTransformer {
	static list = (source) => {
		const schema = {
			id: "id",
			name: "name",
			isActive: "isActive",
			isDeleted: "isDeleted",
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		};

		return morphism(schema, source);
	};
}

module.exports = CategoryTransformer;
