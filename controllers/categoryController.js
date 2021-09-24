const CategoryModel = require("../models/categoryModel");
const CategoryTransformer = require("../transformers/categoryTransformer");

class CategoryController {
	static create = async (req, res, next) => {
		try {
			const { name } = req.body;
			const category = await CategoryModel.create({ name, isActive: true });
			const categoryTransform = CategoryTransformer.list(category);
			res.status(201).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = CategoryController;
