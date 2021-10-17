const CategoryModel = require("../models/categoryModel");
const CategoryTransformer = require("../transformers/categoryTransformer");
const moment = require("moment");

class CategoryController {
	static create = async (req, res, next) => {
		try {
			const { name } = req.body;
			let slug = name.toLowerCase().replace(" ", "-");
			const checkCategory = await CategoryModel.findOne({ slug });
			if (checkCategory) slug = slug + "-" + moment().format("YYYYMMDDHHss");
			const category = await CategoryModel.create({ name, slug, isActive: true });
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
			next(error);
		}
	};

	static findOne = async (req, res, next) => {
		try {
			const { id } = req.params;
			const condition = { _id: id };
			const category = await CategoryModel.findOne(condition);
			if (!category)
				throw {
					name: "NotFound",
					message: "Category not found",
					code: 404,
				};
			const categoryTransform = CategoryTransformer.detail(category);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};

	static update = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name } = req.body;
			const category = await CategoryModel.update({ _id: id }, { name });
			if (!category)
				throw {
					name: "NotFound",
					message: "Category not found",
					code: 404,
				};
			const categoryTransform = CategoryTransformer.list(category);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};

	static updateStatus = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { isActive } = req.body;
			const category = await CategoryModel.update({ _id: id }, { isActive });
			if (!category)
				throw {
					name: "NotFound",
					message: "Category not found",
					code: 404,
				};
			const categoryTransform = CategoryTransformer.list(category);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};

	static delete = async (req, res, next) => {
		try {
			const { id } = req.params;
			const category = await CategoryModel.update(
				{ _id: id },
				{ isDeleted: true }
			);
			if (!category)
				throw {
					name: "NotFound",
					message: "Category not found",
					code: 404,
				};
			const categoryTransform = CategoryTransformer.list(category);
			res.status(200).json(categoryTransform);
		} catch (error) {
			next(error);
		}
	};
}

module.exports = CategoryController;
