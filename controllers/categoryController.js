const CategoryModel = require("../models/categoryModel");

class CategoryController {
	static create = async (req, res, next) => {
		try {
			const { name } = req.body;
			const category = await CategoryModel.create({ name, isActive: true });
			res.status(201).json(category);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = CategoryController;
