const { morphism } = require("morphism");

class PostTransformer {
	static list = (source) => {
		const schema = {
			id: "id",
			name: "name",
			slug: "slug",
			excerpt: "excerpt",
			tags: "tags",
			categories: (iteratee) => {
				return iteratee._categories.map((category) => {
					const { name, _id } = category;
					return {
						id: _id,
						name,
					};
				});
			},
			isMarkdown: "isMarkdown",
			isActiveviews: "isActiveviews",
			isActive: "isActive",
			isDeleted: "isDeleted",
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		};

		return morphism(schema, source);
	};

	static detail = (source) => {
		const schema = {
			id: "id",
			name: "name",
			slug: "slug",
			excerpt: "excerpt",
			description: "description",
			tags: "tags",
			categories: (iteratee) => {
				return iteratee._categories.map((category) => {
					const { name, _id } = category;
					return {
						id: _id,
						name,
					};
				});
			},
			isMarkdown: "isMarkdown",
			isActiveviews: "isActiveviews",
			isActive: "isActive",
			isDeleted: "isDeleted",
			createdAt: "createdAt",
			updatedAt: "updatedAt",
		};

		return morphism(schema, source);
	};
}

module.exports = PostTransformer;
