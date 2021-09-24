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

	static findAll = async (req, res, next) => {
		try {
			const condition = {};
			const categories = await CategoryModel.findAll(condition);
			const categoriesTransform = CategoryTransformer.list(categories);
			res.status(200).json(categoriesTransform);
		} catch (error) {
			console.log(
				"🚀 ~ file: categoryController.js ~ line 23 ~ CategoryController ~ findAll= ~ error",
				categories
			);
			next(error);
		}
	};
}

module.exports = CategoryController;
