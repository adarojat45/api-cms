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
			console.log(
				"🚀 ~ file: categoryController.js ~ line 20 ~ CategoryController ~ findAll= ~ categories",
				categories
			);
			const categoriesTransform = CategoryTransformer.list(categories);
			res.status(200).json(categoriesTransform);
		} catch (error) {
			next(error);
		}
	};

	static update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name } = req.body;
			const category = await CategoryModel.update(id, { name });
			const categoryTransform = CategoryTransformer.list(category);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = CategoryController;
