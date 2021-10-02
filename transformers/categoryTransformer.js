const { morphism } = require("morphism");

class CategoryTransformer {
	static list = (source) => {
		const schema = {
			id: "id",
			name: "name",
			slug: "slug",
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
			isActive: "isActive",
			isDeleted: "isDeleted",
			createdAt: "createdAt",
			updatedAt: "updatedAt",
			posts: (iteratee) => {
				const posts = iteratee._posts.map((post) => {
					const {
						_id,
						name,
						slug,
						excerpt,
						description,
						tags,
						isMarkdown,
						views,
						isActive,
						isDeleted,
						createdAt,
						updatedAt,
					} = post;
					return {
						id: _id,
						name,
						slug,
						excerpt,
						description,
						tags,
						isMarkdown,
						views,
						isActive,
						isDeleted,
						createdAt,
						updatedAt,
					};
				});

				return posts;
			},
		};

		return morphism(schema, source);
	};
}

module.exports = CategoryTransformer;
